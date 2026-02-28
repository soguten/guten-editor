export interface SelectionController {
    lock(): void;
    unlock(): void;
}

export type AnchoredOverlayPlacement =
    | "top" | "top-start" | "top-end"
    | "right" | "right-start" | "right-end"
    | "bottom" | "bottom-start" | "bottom-end"
    | "left" | "left-start" | "left-end";

export type AnchoredOverlayStrategy = "absolute" | "fixed";

export type AnchoredOverlayOffset = number | {
    mainAxis?: number;
    crossAxis?: number;
};

export interface AnchoredOverlayCollision {
    flip?: boolean;
    shift?: boolean;
    padding?: number;
    boundary?: "viewport" | HTMLElement;
}

export interface AnchoredOverlayUpdateOn {
    scroll?: boolean;
    resize?: boolean;
    layoutShift?: boolean;
    animationFrame?: boolean;
}

export type AnchoredOverlayDetachedBehavior = "remove" | "pin" | "track";

export interface AnchoredOverlayPositionResult {
    left: number;
    top: number;
    placement: AnchoredOverlayPlacement;
}

export interface AnchoredOverlayProps {
    selectionController?: SelectionController;
    anchorRect?: DOMRectInit | null;
    anchor?: Node | null;
    anchorRectResolver?: (anchor: Node) => DOMRect | null;
    shouldPosition?: () => boolean;
    placement?: AnchoredOverlayPlacement;
    strategy?: AnchoredOverlayStrategy;
    offset?: AnchoredOverlayOffset;
    align?: "start" | "center" | "end";
    matchAnchorWidth?: boolean;
    collision?: AnchoredOverlayCollision;
    updateOn?: AnchoredOverlayUpdateOn;
    /**
     * Controls what happens when the anchor leaves the active boundary:
     * - "remove" (default): closes overlay when anchor leaves boundary
     * - "pin": keeps overlay clamped to boundary edge
     * - "track": keeps following anchor even outside boundary
     */
    detachedAnchorBehavior?: AnchoredOverlayDetachedBehavior;
    onPositionChange?: (result: AnchoredOverlayPositionResult) => void;
}