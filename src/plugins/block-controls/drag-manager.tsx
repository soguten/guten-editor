import { runCommand } from "@core/command";
import { EventTypes } from "@utils/dom/events.ts";
import { ParagraphBlock } from "@components/blocks/paragraph.tsx";
import { focusOnElementAtStart } from "@utils/dom";
import { BlockControls } from "./components/block-controls.tsx";
import { BlockOptionsMenu } from "./components/block-options-menu.tsx";
import { BlockOptionsPlugin } from "./extensible/block-options-plugin.tsx";

import { DragSessionController } from "./controllers/drag-session-controller.ts";
import { BlockControlsPositioner } from "./controllers/block-controls-positioner.ts";

export class DragManager {

    private mutationObserver: MutationObserver | null = null;
    private overlayObserver: MutationObserver | null = null;
    private blockOptionsMenuObserver: MutationObserver | null = null;
    private currentTarget: HTMLElement | null = null;
    private controlsHost: HTMLElement | null = null;
    private controlsWrap: HTMLElement | null = null;
    private dragControl: HTMLButtonElement | null = null;
    private addControl: HTMLButtonElement | null = null;
    private editorContainer: HTMLElement | null = null;
    private titleArea: HTMLElement | null = null;
    private hideTimer: number | null = null;
    private layer: HTMLElement | null = null;
    private contextMenuAnchor: HTMLElement | null = null;

    private lockHandleTargetWhileBlockOptionsOpen = false;

    private dragSession: DragSessionController;
    private positioner = new BlockControlsPositioner();

    constructor(private content: HTMLElement, private overlay: HTMLElement) {
        this.editorContainer = this.content.closest('.editor-container') as HTMLElement | null;
        this.titleArea = this.editorContainer?.querySelector('#titleArea') as HTMLElement | null;
        this.dragSession = new DragSessionController(this.content, {
            onDragStart: () => {
                this.hideHandle();
            },
            onDragEnd: (draggedBlock) => {
                this.updateTargets();
                this.currentTarget = draggedBlock;
                focusOnElementAtStart(draggedBlock);
                this.showHandle();
            },
        });
    }

    start() {
        this.setupOverlayArea();
        this.createHandle();
        this.bindHandleEvents();
        this.observeOverlay();
        this.updateTargets();

        this.mutationObserver = new MutationObserver(() => this.updateTargets());
        this.mutationObserver.observe(this.content, { childList: true, subtree: true });

        globalThis.addEventListener(EventTypes.Scroll, this.onViewportChange);
        globalThis.addEventListener(EventTypes.Resize, this.onViewportChange);

        this.editorContainer = this.content.closest('.editor-container') as HTMLElement | null;
        this.titleArea = this.editorContainer?.querySelector('#titleArea') as HTMLElement | null;
        this.editorContainer?.addEventListener(EventTypes.MouseLeave, this.onEditorContainerLeave);
        this.titleArea?.addEventListener(EventTypes.MouseEnter, this.onTitleAreaEnter);

        document.addEventListener(EventTypes.KeyDown, this.onEditorKeyDown, true);
        document.addEventListener(EventTypes.Input, this.onEditorInput, true);
        document.addEventListener(EventTypes.GutenOverlayGroupClose, this.onOverlayGroupClose, true);
    }

    stop() {
        this.mutationObserver?.disconnect();
        this.mutationObserver = null;
        this.overlayObserver?.disconnect();
        this.overlayObserver = null;

        this.blockOptionsMenuObserver?.disconnect();
        this.blockOptionsMenuObserver = null;

        this.dragSession.dispose();

        globalThis.removeEventListener(EventTypes.Scroll, this.onViewportChange);
        globalThis.removeEventListener(EventTypes.Resize, this.onViewportChange);

        this.editorContainer?.removeEventListener(EventTypes.MouseLeave, this.onEditorContainerLeave);
        this.titleArea?.removeEventListener(EventTypes.MouseEnter, this.onTitleAreaEnter);

        document.removeEventListener(EventTypes.KeyDown, this.onEditorKeyDown, true);
        document.removeEventListener(EventTypes.Input, this.onEditorInput, true);
        document.removeEventListener(EventTypes.GutenOverlayGroupClose, this.onOverlayGroupClose, true);

        this.unbindHandleEvents();
        this.controlsHost?.remove();
        this.controlsHost = null;
        this.controlsWrap?.remove();
        this.controlsWrap = null;
        this.dragControl = null;
        this.addControl = null;
        this.layer?.remove();
        this.layer = null;
        this.removeContextMenuAnchor();
    }

    private setupOverlayArea() {

        const overlayRoot = this.resolveOverlayRoot();
        if (!overlayRoot) return;

        this.layer = document.createElement('div');
        const layer = this.layer;
        layer.style.position = 'fixed';
        layer.style.top = '0';
        layer.style.left = '0';
        layer.style.pointerEvents = 'none';
        layer.style.overflow = 'visible';
        overlayRoot.appendChild(layer);
    }

    private createHandle() {

        if (!this.layer || !this.layer.isConnected) return;

        const controlsHost = <BlockControls />;

        this.layer?.appendChild(controlsHost);
        this.controlsHost = controlsHost;
        const controlsWrap = controlsHost.querySelector('.block-controls') as HTMLElement | null;
        if (!controlsWrap) return;

        this.layer?.appendChild(controlsWrap);
        this.controlsWrap = controlsWrap;
        this.addControl = controlsWrap.querySelector('button[data-control-type="add"]');
        this.dragControl = controlsWrap.querySelector('button[data-control-type="drag"]');
    }

    private bindHandleEvents() {
        this.dragControl?.addEventListener(EventTypes.PointerDown, this.onPointerDown);
        this.controlsWrap?.addEventListener(EventTypes.MouseEnter, this.onHandleEnter);
        this.dragControl?.addEventListener(EventTypes.ContextMenu, this.onHandleContextMenu);
        this.addControl?.addEventListener(EventTypes.Click, this.onAddClick);
    }

    private unbindHandleEvents() {
        this.dragControl?.removeEventListener(EventTypes.PointerDown, this.onPointerDown);
        this.controlsWrap?.removeEventListener(EventTypes.MouseEnter, this.onHandleEnter);
        this.dragControl?.removeEventListener(EventTypes.ContextMenu, this.onHandleContextMenu);
        this.addControl?.removeEventListener(EventTypes.Click, this.onAddClick);
    }

    private observeOverlay() {
        this.overlayObserver?.disconnect();
        const overlayRoot = this.resolveOverlayRoot();
        if (!overlayRoot) return;

        this.overlayObserver = new MutationObserver(() => this.ensureOverlayIntegrity());
        this.overlayObserver.observe(overlayRoot, { childList: true, subtree: false });
    }

    private resolveOverlayRoot(): HTMLElement | null {
        if (this.overlay?.isConnected) return this.overlay;

        if (this.overlay?.id) {
            const next = document.getElementById(this.overlay.id);
            if (next) {
                this.overlay = next;
                return next;
            }
        }

        const fallback = document.getElementById('overlayArea');
        if (fallback) {
            this.overlay = fallback;
            return fallback;
        }

        return null;
    }

    private ensureOverlayIntegrity() {
        const overlayRoot = this.resolveOverlayRoot();
        if (!overlayRoot) return;

        const layerMissing = !this.layer || !this.layer.isConnected || !overlayRoot.contains(this.layer);
        const handleMissing = !this.controlsWrap || !this.controlsWrap.isConnected || !this.dragControl || !this.dragControl.isConnected || !this.addControl || !this.addControl.isConnected;
        this.observeOverlay();

        if (layerMissing) {
            this.controlsHost?.remove();
            this.controlsHost = null;
            this.controlsWrap?.remove();
            this.dragControl = null;
            this.controlsWrap = null;
            this.addControl = null;
            this.setupOverlayArea();
            this.createHandle();
            this.bindHandleEvents();
            return;
        }

        if (handleMissing) {
            this.controlsHost?.remove();
            this.controlsHost = null;
            this.controlsWrap?.remove();
            this.dragControl = null;
            this.controlsWrap = null;
            this.addControl = null;
            this.createHandle();
            this.bindHandleEvents();
        }
    }

    private updateTargets() {
        const blocks = Array.from(this.content.querySelectorAll('.block')) as HTMLElement[];
        for (const block of blocks) {
            this.attachListeners(block);
        }
    }

    private attachListeners(el: HTMLElement) {
        el.addEventListener(EventTypes.MouseEnter, this.onMouseEnter);
        el.addEventListener(EventTypes.MouseMove, this.onMouseMove);
        el.addEventListener(EventTypes.ContextMenu, this.onBlockContextMenu);
    }

    private onMouseEnter = (e: MouseEvent) => {
        if (this.lockHandleTargetWhileBlockOptionsOpen) return;
        this.clearHideTimer();
        this.currentTarget = e.currentTarget as HTMLElement;
        this.showHandle();
    };

    private onMouseMove = (e: MouseEvent) => {
        if (this.lockHandleTargetWhileBlockOptionsOpen) return;
        if (this.dragSession.isDragging() || !this.controlsWrap || this.controlsWrap.style.display !== 'none') return;

        this.currentTarget = e.currentTarget as HTMLElement;
        this.showHandle();
    };

    private onMouseLeave = () => {
        if (this.dragSession.isDragging()) return;
        this.clearHideTimer();
        this.hideTimer = globalThis.setTimeout(() => this.hideHandle(), 200);
    }

    private onHandleEnter = () => {
        this.clearHideTimer();
    };

    private onHandleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        if (!this.currentTarget || !this.dragControl) return;
        const block = this.currentTarget;
        const opened = runCommand('openBlockOptions', { content: { block, anchor: this.dragControl } });
        if (opened) {
            this.lockHandleTargetWhileBlockOptionsOpen = true;
            this.observeBlockOptionsMenuLifecycle();
        }
    };

    private onBlockContextMenu = (e: MouseEvent) => {
        const block = e.currentTarget as HTMLElement | null;
        if (!block) return;

        const contextMenuConfig = BlockOptionsPlugin.contextMenuConfigForBlock(block);
        if (!contextMenuConfig.enabled) return;

        e.preventDefault();
        e.stopPropagation();

        this.currentTarget = block;

        const anchor = this.createContextMenuAnchor(e.pageX, e.pageY);
        const opened = runCommand('openBlockOptions', { content: { block, anchor } });

        if (opened) {
            this.lockHandleTargetWhileBlockOptionsOpen = true;
            this.observeBlockOptionsMenuLifecycle();
            return;
        }

        this.removeContextMenuAnchor();
    };

    private onOverlayGroupClose = () => {
        this.lockHandleTargetWhileBlockOptionsOpen = false;
        this.removeContextMenuAnchor();
    };

    private observeBlockOptionsMenuLifecycle() {
        this.blockOptionsMenuObserver?.disconnect();

        const overlayRoot = this.resolveOverlayRoot();
        if (!overlayRoot) return;

        const isOpen = () => Boolean(overlayRoot.querySelector(BlockOptionsMenu.getTagName()));

        if (!isOpen()) {
            this.lockHandleTargetWhileBlockOptionsOpen = false;
            this.removeContextMenuAnchor();
            return;
        }

        this.blockOptionsMenuObserver = new MutationObserver(() => {
            if (isOpen()) return;
            this.lockHandleTargetWhileBlockOptionsOpen = false;
            this.removeContextMenuAnchor();
            this.blockOptionsMenuObserver?.disconnect();
            this.blockOptionsMenuObserver = null;
        });

        this.blockOptionsMenuObserver.observe(overlayRoot, { childList: true, subtree: true });
    }

    private createContextMenuAnchor(pageX: number, pageY: number): HTMLElement {
        this.removeContextMenuAnchor();

        const anchor = document.createElement('span');
        anchor.style.position = 'absolute';
        anchor.style.left = `${Math.round(pageX)}px`;
        anchor.style.top = `${Math.round(pageY)}px`;
        anchor.style.width = '0';
        anchor.style.height = '0';
        anchor.style.pointerEvents = 'none';
        anchor.style.zIndex = '-1';
        anchor.dataset.blockOptionsContextAnchor = 'true';

        document.body.appendChild(anchor);
        this.contextMenuAnchor = anchor;

        return anchor;
    }

    private removeContextMenuAnchor() {
        this.contextMenuAnchor?.remove();
        this.contextMenuAnchor = null;
    }

    private onAddClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!this.currentTarget) return;

        const anchorBlock = this.currentTarget;
        const paragraph = <ParagraphBlock />;
        const parent = anchorBlock.parentElement;
        if (!parent) return;

        if (e.altKey) {
            parent.insertBefore(paragraph, anchorBlock);
        } else {
            parent.insertBefore(paragraph, anchorBlock.nextSibling);
        }

        focusOnElementAtStart(paragraph);
        paragraph.dispatchEvent(new Event(EventTypes.Input, { bubbles: true }));
        this.currentTarget = paragraph;
        this.updateTargets();
        this.showHandle();
    };

    private startHideTimer() {
        this.clearHideTimer();
        this.hideTimer = globalThis.setTimeout(() => this.hideHandle(), 200);
    }

    private clearHideTimer() {
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }
    }

    private showHandle() {
        this.ensureOverlayIntegrity();
        if (!this.currentTarget || !this.controlsWrap) return;
        this.controlsWrap.style.display = 'flex';
        this.updateHandlePosition();
    }

    private hideHandle() {
        if (!this.controlsWrap) return;
        this.controlsWrap.style.display = 'none';
        this.currentTarget = null;
    }

    private updateHandlePosition() {
        this.positioner.updatePosition(this.currentTarget, this.dragControl, this.controlsWrap);
    }

    private onViewportChange = () => {
        this.updateHandlePosition();
    };

    private onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0 || !this.currentTarget) return;

        e.preventDefault();
        this.dragSession.startDrag(this.currentTarget, this.dragControl);
    };

    private onTitleAreaEnter = () => {
        if (this.dragSession.isDragging()) return;
        this.hideHandle();
    };

    private onEditorContainerLeave = () => {
        if (this.dragSession.isDragging()) return;
        this.hideHandle();
    };

    private onEditorInput = (_event: Event) => {
        if (this.dragSession.isDragging() || !this.isHandleVisible()) return;
        this.hideHandle();
    };

    private onEditorKeyDown = (event: KeyboardEvent) => {
        if (this.dragSession.isDragging() || !this.isHandleVisible()) return;
        if (!this.shouldHideHandleOnKeyDown(event)) return;
        this.hideHandle();
    };

    private isHandleVisible() {
        return Boolean(this.controlsWrap && this.controlsWrap.style.display !== 'none');
    }

    private shouldHideHandleOnKeyDown(event: KeyboardEvent) {
        if (this.isDirectionalKey(event.key)) return true;

        if (event.metaKey || event.ctrlKey || event.altKey) return false;

        return event.key.length === 1
            || event.key === 'Backspace'
            || event.key === 'Delete'
            || event.key === 'Enter'
            || event.key === 'Tab';
    }

    private isDirectionalKey(key: string) {
        return key === 'ArrowUp' ||
            key === 'ArrowDown' ||
            key === 'ArrowLeft' ||
            key === 'ArrowRight' ||
            key === 'Home' ||
            key === 'End' ||
            key === 'PageUp' ||
            key === 'PageDown';
    }
}