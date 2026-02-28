import { DefaultState } from "@core/components";
import { OverlayComponent } from "@components/editor/overlay";
import { EventTypes } from "@utils/dom";
import type { AnchoredOverlayProps } from "./types.ts";

/**
 * Anchored overlay engine:
 * - resolves the anchor via anchorRect or the current selection (Range)
 * - positions and repositions on scroll/resize
 * - selection lock/unlock via SelectionController
 */
export abstract class AnchoredOverlay<P extends AnchoredOverlayProps, S = DefaultState> extends OverlayComponent<P, S> {
    
    private anchorRect: DOMRect | null = null;
    private anchorRange: Range | null = null;

    private selectionLocked = false;
    private closing = false;

    private repositionFrame: number | null = null;

    override connectedCallback(): void {
        this.closing = false;
        super.connectedCallback();

        if (this.closing) return;

        this.captureAnchor();

        const initialRect = this.resolveAnchorRect();
        if (initialRect) this.setPosition(initialRect);

        // second pass (layout/fonts/etc)
        requestAnimationFrame(() => {
            const nextRect = this.resolveAnchorRect();
            if (nextRect) this.setPosition(nextRect);
        });

        this.lockSelectionIfNeeded();

        this.registerEvent(globalThis, EventTypes.Scroll, this.handleViewportChange as EventListener, true);
        this.registerEvent(globalThis, EventTypes.Resize, this.handleViewportChange as EventListener);
    }

    override disconnectedCallback(): void {
        this.unlockSelection();
        super.disconnectedCallback();
    }

    override remove(): void {
        this.closing = true;
        this.unlockSelection();
        super.remove();
    }

    /** Allows subclasses to force a different anchor strategy */
    protected captureAnchor(): void {
        if (this.props.anchorRect) {
            this.anchorRect = this.toDOMRect(this.props.anchorRect);
            this.anchorRange = null;
        } else {
            this.anchorRange = this.getCurrentSelectionRange();
            this.anchorRect = null;
        }
    }

    /** Subclasses may override for custom positioning (e.g., EquationPopover) */
    protected setPosition(rect: DOMRect): void {
        const elementWidth = this.offsetWidth;
        const elementHeight = this.offsetHeight;

        let left = rect.left + rect.width / 2 - elementWidth / 2;
        let top = rect.bottom + 10;

        if (left + elementWidth > globalThis.innerWidth) left = globalThis.innerWidth - elementWidth - 20;
        if (left < 20) left = 20;

        if (top + elementHeight > globalThis.innerHeight) {
            top = rect.top - elementHeight - 10;
        }

        this.style.left = `${left}px`;
        this.style.top = `${top}px`;
    }

    protected resolveAnchorRect(): DOMRect | null {
        if (this.anchorRect) return this.anchorRect;
        if (this.anchorRange) return this.getDOMRectFromRange(this.anchorRange);
        return this.getDOMRectFromCurrentSelection();
    }

    private lockSelectionIfNeeded(): void {
        if (this.props.selectionController) {
            this.props.selectionController.lock();
            this.selectionLocked = true;
        }
    }

    private unlockSelection(): void {
        if (!this.selectionLocked) return;
        this.selectionLocked = false;
        this.props.selectionController?.unlock();
    }

    private handleViewportChange = () => {
        if (!this.isConnected || this.closing) return;

        if (this.repositionFrame !== null) cancelAnimationFrame(this.repositionFrame);

        this.repositionFrame = requestAnimationFrame(() => {
            this.repositionFrame = null;

            const rect = this.resolveAnchorRect();
            if (!rect) return;

            this.setPosition(rect);
        });
    };

    private getDOMRectFromCurrentSelection(): DOMRect | null {
        const sel = globalThis.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        return this.getDOMRectFromRange(sel.getRangeAt(0));
    }

    private getDOMRectFromRange(range: Range): DOMRect | null {
        if (!range.startContainer?.isConnected || !range.endContainer?.isConnected) return null;

        const br = range.getBoundingClientRect?.();
        if (br && (br.width || br.height)) return br as DOMRect;

        const startEl = range.startContainer instanceof Element
            ? range.startContainer
            : range.startContainer?.parentElement;

        if (startEl) {
            const r = startEl.getBoundingClientRect();
            if (r && (r.width || r.height)) return r as DOMRect;
        }

        return null;
    }

    private getCurrentSelectionRange(): Range | null {
        const sel = globalThis.getSelection();
        if (!sel || sel.rangeCount === 0) return null;

        try {
            return sel.getRangeAt(0).cloneRange();
        } catch {
            return null;
        }
    }

    private toDOMRect(rectInit: DOMRectInit): DOMRect {
        const x = rectInit.x ?? 0;
        const y = rectInit.y ?? 0;
        const width = rectInit.width ?? 0;
        const height = rectInit.height ?? 0;

        return typeof DOMRect.fromRect === "function"
            ? DOMRect.fromRect({ x, y, width, height })
            : new DOMRect(x, y, width, height);
    }
}