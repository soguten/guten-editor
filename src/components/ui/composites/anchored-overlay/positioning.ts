import type { AnchoredOverlayCollision, AnchoredOverlayOffset, AnchoredOverlayPlacement } from "./types.ts";

export interface RectLike {
    left: number;
    top: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
}

export interface PositioningBoundary {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface ComputeOverlayPositionInput {
    anchorRect: RectLike;
    overlaySize: { width: number; height: number };
    placement: AnchoredOverlayPlacement;
    offset: AnchoredOverlayOffset;
    collision: AnchoredOverlayCollision;
    boundary: PositioningBoundary;
}

export interface ComputeOverlayPositionResult {
    left: number;
    top: number;
    placement: AnchoredOverlayPlacement;
}

const DEFAULT_PADDING = 20;

function normalizeOffset(offset: AnchoredOverlayOffset): { mainAxis: number; crossAxis: number } {
    if (typeof offset === "number") {
        return { mainAxis: offset, crossAxis: 0 };
    }

    return {
        mainAxis: offset.mainAxis ?? 10,
        crossAxis: offset.crossAxis ?? 0,
    };
}

function parsePlacement(placement: AnchoredOverlayPlacement): { side: "top" | "right" | "bottom" | "left"; align: "start" | "center" | "end" } {
    const [sideRaw, alignRaw] = placement.split("-") as ["top" | "right" | "bottom" | "left", "start" | "end" | undefined];
    return { side: sideRaw, align: alignRaw ?? "center" };
}

function buildPlacement(side: "top" | "right" | "bottom" | "left", align: "start" | "center" | "end"): AnchoredOverlayPlacement {
    if (align === "center") return side;
    return `${side}-${align}` as AnchoredOverlayPlacement;
}

function computeBasePosition(
    anchorRect: RectLike,
    overlaySize: { width: number; height: number },
    side: "top" | "right" | "bottom" | "left",
    align: "start" | "center" | "end",
    offset: { mainAxis: number; crossAxis: number }
): { left: number; top: number } {
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    const anchorCenterY = anchorRect.top + anchorRect.height / 2;

    let left = 0;
    let top = 0;

    if (side === "bottom") {
        top = anchorRect.bottom + offset.mainAxis;
    } else if (side === "top") {
        top = anchorRect.top - overlaySize.height - offset.mainAxis;
    } else if (side === "right") {
        left = anchorRect.right + offset.mainAxis;
    } else {
        left = anchorRect.left - overlaySize.width - offset.mainAxis;
    }

    if (side === "top" || side === "bottom") {
        if (align === "start") left = anchorRect.left + offset.crossAxis;
        else if (align === "end") left = anchorRect.right - overlaySize.width + offset.crossAxis;
        else left = anchorCenterX - overlaySize.width / 2 + offset.crossAxis;
    } else {
        if (align === "start") top = anchorRect.top + offset.crossAxis;
        else if (align === "end") top = anchorRect.bottom - overlaySize.height + offset.crossAxis;
        else top = anchorCenterY - overlaySize.height / 2 + offset.crossAxis;
    }

    return { left, top };
}

function overflows({ left, top }: { left: number; top: number }, overlaySize: { width: number; height: number }, boundary: PositioningBoundary, padding: number) {
    return {
        left: left < boundary.left + padding,
        right: left + overlaySize.width > boundary.right - padding,
        top: top < boundary.top + padding,
        bottom: top + overlaySize.height > boundary.bottom - padding,
    };
}

function oppositeSide(side: "top" | "right" | "bottom" | "left"): "top" | "right" | "bottom" | "left" {
    if (side === "top") return "bottom";
    if (side === "bottom") return "top";
    if (side === "left") return "right";
    return "left";
}

export function computeOverlayPosition(input: ComputeOverlayPositionInput): ComputeOverlayPositionResult {
    const { anchorRect, overlaySize, boundary } = input;
    const { side, align } = parsePlacement(input.placement);
    const offset = normalizeOffset(input.offset);
    const padding = input.collision.padding ?? DEFAULT_PADDING;

    let nextSide = side;
    let position = computeBasePosition(anchorRect, overlaySize, nextSide, align, offset);

    if (input.collision.flip) {
        const ov = overflows(position, overlaySize, boundary, padding);
        const shouldFlip =
            (nextSide === "bottom" && ov.bottom) ||
            (nextSide === "top" && ov.top) ||
            (nextSide === "right" && ov.right) ||
            (nextSide === "left" && ov.left);

        if (shouldFlip) {
            nextSide = oppositeSide(nextSide);
            position = computeBasePosition(anchorRect, overlaySize, nextSide, align, offset);
        }
    }

    if (input.collision.shift) {
        const minLeft = boundary.left + padding;
        const maxLeft = boundary.right - padding - overlaySize.width;
        const minTop = boundary.top + padding;
        const maxTop = boundary.bottom - padding - overlaySize.height;

        position.left = Math.max(minLeft, Math.min(position.left, maxLeft));
        position.top = Math.max(minTop, Math.min(position.top, maxTop));
    }

    return {
        left: Math.round(position.left),
        top: Math.round(position.top),
        placement: buildPlacement(nextSide, align),
    };
}