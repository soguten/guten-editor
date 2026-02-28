import { DefaultState } from "@core/components";
import { OverlayComponent } from "@components/editor/overlay";
import { EventTypes } from "@utils/dom";
import { computeOverlayPosition } from "./positioning.ts";
import type { AnchoredOverlayPlacement, AnchoredOverlayProps } from "./types.ts";

const DEFAULT_PLACEMENT: AnchoredOverlayPlacement = "bottom";

/**
 * Anchored overlay engine:
 * - resolves the anchor via anchor, anchorRect or current selection (Range)
 * - positions and repositions on scroll/resize
 * - supports placement/collision/update behavior via props
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
        this.applyPosition();

        // second pass (layout/fonts/etc)
        requestAnimationFrame(() => this.applyPosition());

        this.lockSelectionIfNeeded();

        const updateOn = this.props.updateOn;

        if (updateOn?.scroll ?? true) {
            this.registerEvent(globalThis, EventTypes.Scroll, this.handleViewportChange as EventListener, true);
        }

        if (updateOn?.resize ?? true) {
            this.registerEvent(globalThis, EventTypes.Resize, this.handleViewportChange as EventListener);
        }
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
            return;
        }

        if (this.props.anchor) {
            this.anchorRect = this.resolveNodeRect(this.props.anchor);
            this.anchorRange = null;
            return;
        }

        this.anchorRect = null;
        this.anchorRange = this.getCurrentSelectionRange();
    }

    /** Subclasses may override for custom positioning (e.g., EquationPopover) */
    protected setPosition(rect: DOMRect): void {
        const anchorRect = (this.props.anchor ? this.resolveNodeRect(this.props.anchor) : null) ?? rect;
        const boundaryRect = this.resolveBoundaryRect();

        const placement = this.resolvePlacement();
        const result = computeOverlayPosition({
            anchorRect,
            overlaySize: { width: this.offsetWidth, height: this.offsetHeight },
            placement,
            offset: this.props.offset ?? 10,
            collision: {
                flip: this.props.collision?.flip ?? true,
                shift: this.props.collision?.shift ?? true,
                padding: this.props.collision?.padding,
                boundary: this.props.collision?.boundary,
            },
            boundary: boundaryRect,
        });

        this.style.position = this.props.strategy ?? "absolute";
        this.style.left = `${result.left}px`;
        this.style.top = `${result.top}px`;

        if (this.props.matchAnchorWidth) {
            this.style.minWidth = `${Math.round(anchorRect.width)}px`;
        }

        this.props.onPositionChange?.(result);
    }

    protected resolveAnchorRect(): DOMRect | null {
        if (this.props.anchor?.isConnected) {
            const nodeRect = this.resolveNodeRect(this.props.anchor);
            if (nodeRect) return nodeRect;
        }

        if (this.anchorRect) return this.anchorRect;
        if (this.anchorRange) return this.getDOMRectFromRange(this.anchorRange);

        return this.getDOMRectFromCurrentSelection();
    }

    private resolvePlacement(): AnchoredOverlayPlacement {
        if (!this.props.align) return this.props.placement ?? DEFAULT_PLACEMENT;

        const [side] = (this.props.placement ?? DEFAULT_PLACEMENT).split("-") as ["top" | "right" | "bottom" | "left"];
        if (this.props.align === "center") return side;
        return `${side}-${this.props.align}` as AnchoredOverlayPlacement;
    }

    private resolveBoundaryRect(): { left: number; top: number; right: number; bottom: number } {
        const boundary = this.props.collision?.boundary;

        if (boundary && boundary !== "viewport") {
            const rect = boundary.getBoundingClientRect();
            return {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
            };
        }

        return {
            left: 0,
            top: 0,
            right: globalThis.innerWidth,
            bottom: globalThis.innerHeight,
        };
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

    private applyPosition(): void {
        if (!this.isConnected || this.closing) return;

        if (this.props.shouldPosition && !this.props.shouldPosition()) return;

        const rect = this.resolveAnchorRect();

        if (!rect) {
            if (this.props.hideWhenDetached) this.remove();
            return;
        }

        this.setPosition(rect);
    }

    private handleViewportChange = () => {
        if (!this.isConnected || this.closing) return;

        if (this.repositionFrame !== null) cancelAnimationFrame(this.repositionFrame);

        this.repositionFrame = requestAnimationFrame(() => {
            this.repositionFrame = null;
            this.applyPosition();
        });
    };

    private resolveNodeRect(anchor: Node): DOMRect | null {
        const resolvedByProp = this.props.anchorRectResolver?.(anchor);
        if (resolvedByProp) return resolvedByProp;

        return this.getDOMRectFromNode(anchor);
    }

    private getDOMRectFromNode(node: Node): DOMRect | null {
        if (!node.isConnected) return null;

        const range = document.createRange();

        if (node instanceof Text) {
            const end = Math.min(1, node.length);
            range.setStart(node, 0);
            range.setEnd(node, end);
        } else {
            range.selectNode(node);
        }

        const rects = range.getClientRects();
        if (rects.length > 0) return rects[0] as DOMRect;

        const rect = range.getBoundingClientRect();
        if (rect && (rect.width || rect.height)) return rect as DOMRect;

        return null;
    }

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