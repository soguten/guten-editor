/** @jsx h */

import { icons, h, t, focusOnElement, Plugin, registerTranslation } from "../../index.ts";
import { SlashMenuExtensionPlugin } from "../../slash-menu/index.ts";
import { MapPlaceholder } from "../components/map-placeholder.tsx";
import { en } from "../i18n/en.ts";
import { pt } from "../i18n/pt.ts";

export class SlashMenuMapExtensionPlugin extends SlashMenuExtensionPlugin {

    icon: SVGElement;
    label: string;
    sort: number;
    override synonyms?: string[];

    constructor() {
        super();
        this.icon = <icons.MapPinIcon />;
        this.label = t("map");
        this.sort = 115;
        this.synonyms = ["map", "mapa", "location", "pin", "leaflet"];

        registerTranslation("en", en);
        registerTranslation("pt", pt);
    }

    // override setup(_root: HTMLElement, _plugins: Plugin[]): void {
    //     registerTranslation("en", en);
    //     registerTranslation("pt", pt);
    // }

    override onSelect(focusedBlock: HTMLElement): void {
        const placeholder = <MapPlaceholder />;
        focusedBlock.after(placeholder);
        focusOnElement(placeholder);
    }
}