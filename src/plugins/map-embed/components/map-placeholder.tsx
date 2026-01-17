/** @jsx h */

import { MapPinIcon } from "../../../design-system/components/icons.tsx";
import { BlockObjectPlaceholderUI } from "../../../design-system/components/block-object-placeholder-ui.tsx";
import { h, runCommand, t } from "../../index.ts";

export class MapPlaceholder extends BlockObjectPlaceholderUI {

    private autoOpenScheduled = false;

    constructor() {
        super(<MapPinIcon />, t("insert_map"));
    }

    override onMount(): void {
        this.dataset.mapPlaceholder = "true";
        if (this.autoOpenScheduled) return;
        this.autoOpenScheduled = true;
        requestAnimationFrame(() => this.openPopover());
    }

    override onClick(): void {
        this.openPopover();
    }

    private openPopover(): void {
        const rect = this.getBoundingClientRect();
        runCommand("openMapPopover", {
            content: {
                target: this,
                anchorRect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : undefined,
            },
        });
    }
}