export interface SelectionController {
    lock(): void;
    unlock(): void;
}

export interface AnchoredOverlayProps {
    selectionController?: SelectionController;
    anchorRect?: DOMRectInit | null;
}