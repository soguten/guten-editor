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
    hideWhenDetached?: boolean;
    onPositionChange?: (result: AnchoredOverlayPositionResult) => void;
}