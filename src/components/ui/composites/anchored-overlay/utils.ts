import { AnchoredOverlayPlacement } from "./types.ts";

function resolvePlacementSide(placement: AnchoredOverlayPlacement): "top" | "right" | "bottom" | "left" {
    const [side] = placement.split("-") as ["top" | "right" | "bottom" | "left"];
    return side;
}

export function resolveSubmenuAnchorRectFromParentMenu(anchor: Node, placement: AnchoredOverlayPlacement): DOMRect | null {
    if (!(anchor instanceof HTMLElement)) return null;

    const anchorRect = anchor.getBoundingClientRect();
    const parentMenu = anchor.closest(".guten-menu") as HTMLElement | null;
    if (!parentMenu) return anchorRect;

    const side = resolvePlacementSide(placement);
    if (side !== "right" && side !== "left") {
        return anchorRect;
    }

    const parentRect = parentMenu.getBoundingClientRect();
    const x = side === "right" ? parentRect.right : parentRect.left;

    return new DOMRect(x, anchorRect.top, 0, anchorRect.height);
}