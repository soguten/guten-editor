/** @jsx h */

import { Command } from "../../../core/command/command.ts";
import { appendElementOnOverlayArea, h } from "../../index.ts";
import { MapPopover } from "../components/map-popover.tsx";

export type OpenMapPopoverPayload = {
    target?: HTMLElement | null;
    anchorRect?: DOMRectInit;
    initialLat?: number;
    initialLng?: number;
    initialZoom?: number;
    initialLabel?: string;
};

export const OpenMapPopover: Command<OpenMapPopoverPayload> = {
    id: "openMapPopover",
    execute(context): boolean {
        const { target, anchorRect, initialLat, initialLng, initialZoom, initialLabel } = context?.content ?? {};

        const rect = anchorRect ?? target?.getBoundingClientRect?.();
        const anchor = rect
            ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
            : undefined;

        appendElementOnOverlayArea(
            <MapPopover
                target={target ?? null}
                anchorRect={anchor}
                initialLat={initialLat}
                initialLng={initialLng}
                initialZoom={initialZoom}
                initialLabel={initialLabel}
            />
        );

        return true;
    },
};