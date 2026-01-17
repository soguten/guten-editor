/** @jsx h */

import { Command } from "../../../core/command/command.ts";
import { h } from "../../index.ts";
import { MapEmbed } from "../components/map-embed.tsx";
import { MapPlaceholder } from "../components/map-placeholder.tsx";

export type InsertMapEmbedPayload = {
    target?: HTMLElement | null;
    lat: number;
    lng: number;
    zoom: number;
    label?: string;
};

export const InsertMapEmbed: Command<InsertMapEmbedPayload> = {
    id: "insertMapEmbed",
    execute(context): boolean {
        const payload = context?.content;
        if (!payload) return false;

        const element = (
            <MapEmbed
                lat={payload.lat}
                lng={payload.lng}
                zoom={payload.zoom}
                label={payload.label}
            />
        );
        const target = payload.target ?? null;

        if (target && target.isConnected) {
            if (target.matches(MapPlaceholder.getTagName()) || target.matches(MapEmbed.getTagName())) {
                target.replaceWith(element);
            } else {
                target.after(element);
                target.remove();
            }
        } else {
            const selection = globalThis.getSelection();
            if (selection?.rangeCount) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(element);
            }
        }

        return true;
    },
};