import { ToolbarUI } from "@components/ui/composites/toolbar";
import { hasSelection, clearSelection } from "@utils/selection";
import { EventTypes } from "@utils/dom";
import { FormattingToolbarItem } from "./formatting-toolbar-item.tsx";

import style from "./style.css?inline"
import { AnchoredOverlayProps } from "@components/ui/composites";
import { isMobileSheetViewport } from "@utils/platform";

interface FormattingToolbarProps extends AnchoredOverlayProps {
    removeInstance: () => void;
}

export class FormattingToolbar extends ToolbarUI<FormattingToolbarProps> {

    override closeOnClickOutside: boolean = false;
    private selectionRange: Range | null = null;
    private lockDepth: number = 0;
    private isBackwardSelection: boolean = false;

    private selectionRect: DOMRect | null = null;

    static override styles = this.extendStyles(style);

    static override getTagName() {
        return "guten-formatting-toolbar";
    }

    protected override applyAnchoringDefaults(): void {
        this.props.placement ??= "top";
        this.props.align ??= "center";
        this.props.detachedAnchorBehavior ??= "track";
        this.props.offset ??= 10;
        this.props.shouldPosition ??= () => !isMobileSheetViewport();
        this.props.anchorRectResolver ??= () => this.resolveSelectionAnchorRect();

        this.props.collision = {
            flip: this.props.collision?.flip ?? true,
            shift: this.props.collision?.shift ?? true,
            padding: this.props.collision?.padding ?? 20,
            boundary: this.props.collision?.boundary,
        };
    }

    protected override captureAnchor(): void {
        const selection = globalThis.getSelection();
        if (selection && selection.rangeCount > 0) {
            this.isBackwardSelection = this.isSelectionBackward(selection);
            this.selectionRange = selection.getRangeAt(0).cloneRange();
        } else {
            this.selectionRange = null;
        }
        const anchorNode = this.selectionRange?.endContainer ?? this.selectionRange?.startContainer ?? null;

        if (anchorNode) {
            this.props.anchor = anchorNode;
        }

        this.captureSelectionRect(this.selectionRange);
        super.captureAnchor();
    }

    override onMount(): void {
        requestAnimationFrame(() => {
            const selection = globalThis.getSelection();
            if (selection && selection.rangeCount > 0) {
                this.isBackwardSelection = this.isSelectionBackward(selection);
                this.selectionRange = selection.getRangeAt(0).cloneRange();
            } else {
                this.selectionRange = null;
            }
            this.captureSelectionRect(this.selectionRange);

        });

        this.registerEvent(globalThis, EventTypes.SelectionChange, () => this.handleSelectionChange());
        this.registerEvent(globalThis, EventTypes.GutenOverlayGroupClose, () => this.releaseSelectionLockWithoutRestore(), true);
    }

    override onUnmount(): void {
        this.releaseSelectionLockWithoutRestore();
        this.props.removeInstance();
    }

    handleSelectionChange = () => {
        if (this.isSelectionLocked() || hasSelection()) return;

        this.remove();
    }


    private isSelectionBackward(selection: Selection): boolean {
        const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;

        if (!anchorNode || !focusNode) return false;

        if (anchorNode === focusNode) {
            return focusOffset < anchorOffset;
        }

        const position = anchorNode.compareDocumentPosition(focusNode);
        return !!(position & Node.DOCUMENT_POSITION_PRECEDING);
    }

    public lockSelectionRange(): void {
        this.lockDepth += 1;
        if (this.lockDepth > 1) return;

        if (!this.selectionRange) {
            return;
        }

        const hl = new Highlight(this.selectionRange);
        CSS.highlights.set('persist', hl);

        clearSelection();
    }

    public unlockSelectionRange(): void {
        if (this.lockDepth === 0) return;

        this.lockDepth = Math.max(0, this.lockDepth - 1);
        if (this.lockDepth > 0) return;

        CSS.highlights.delete('persist');

        const root = (this.getRootNode() as Document | ShadowRoot);
        const sel: Selection | null =
            typeof (root as any).getSelection === 'function'
                ? (root as any).getSelection()
                : globalThis.getSelection();

        if (!sel || !this.selectionRange) return;

        if (!this.selectionRange.startContainer.isConnected || !this.selectionRange.endContainer.isConnected) {
            this.refreshSelection();
            return;
        }

        (this.closest('[contenteditable]') as HTMLElement | null)?.focus({ preventScroll: true });

        sel.removeAllRanges();
        sel.addRange(this.selectionRange);
    }

    private resolveSelectionAnchorRect(): DOMRect | null {
        if (!this.selectionRange || !this.selectionRange.startContainer?.isConnected || !this.selectionRange.endContainer?.isConnected) {
            return null;
        }

        const rects = this.selectionRange.getClientRects();
        if (rects.length > 0) {
            return this.cloneDOMRect(this.isBackwardSelection ? rects[0] : rects[rects.length - 1]);
        }

        const bounding = this.selectionRange.getBoundingClientRect?.();
        if (bounding && (bounding.width || bounding.height)) {
            return this.cloneDOMRect(bounding);
        }

        return null;
    }

    public releaseSelectionLockWithoutRestore(): void {
        if (this.lockDepth === 0) return;
        CSS.highlights.delete("persist");
        this.lockDepth = 0;
    }

    public refreshSelection(): void {
        const sel = globalThis.getSelection();
        if (!sel?.rangeCount) return;
        this.selectionRange = sel.getRangeAt(sel.rangeCount - 1).cloneRange();
        this.isBackwardSelection = this.isSelectionBackward(sel);
        this.captureSelectionRect(this.selectionRange);
    }

    public refreshActiveStates(): void {
        const items = this.querySelectorAll<FormattingToolbarItem>(FormattingToolbarItem.getTagName());
        items.forEach((item) => item.refreshActiveState());
    }

    public isSelectionLocked(): boolean {
        return this.lockDepth > 0;
    }

    public getSelectionRect(): DOMRect | null {
        if (!this.selectionRect) return null;
        return this.cloneDOMRect(this.selectionRect);
    }

    private captureSelectionRect(range: Range | null): void {
        if (!range) {
            this.selectionRect = null;
            return;
        }

        const rects = range.getClientRects();
        if (rects.length === 0) {
            const bounding = range.getBoundingClientRect?.();
            if (bounding && (bounding.width || bounding.height)) {
                this.selectionRect = this.cloneDOMRect(bounding);
                return;
            }

            const container = range.startContainer instanceof Element
                ? range.startContainer
                : range.startContainer?.parentElement ?? null;

            if (container) {
                const fallback = container.getBoundingClientRect();
                if (fallback && (fallback.width || fallback.height)) {
                    this.selectionRect = this.cloneDOMRect(fallback);
                    return;
                }
            }

            this.selectionRect = null;
            return;
        }

        const rect = this.isBackwardSelection
            ? rects[0]
            : rects[rects.length - 1];

        this.selectionRect = this.cloneDOMRect(rect);
    }

    private cloneDOMRect(rect: DOMRect | DOMRectReadOnly): DOMRect {
        if (typeof DOMRect.fromRect === 'function') {
            return DOMRect.fromRect(rect);
        }
        return new DOMRect(rect.x, rect.y, rect.width, rect.height);
    }
}