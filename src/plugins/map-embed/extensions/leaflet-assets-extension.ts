import { AssetBundle } from "../../../core/asset-loader/types.ts";
import { ExternalAssetsExtensionPlugin } from "../../external-assets/external-assets-plugin.ts";

/**
 * Loads Leaflet CSS/JS at editor startup.
 */
export class LeafletAssetsExtension extends ExternalAssetsExtensionPlugin {

    bundles(): AssetBundle {
        return {
            feature: "leaflet",
            when: "startup",
            dependsOn: [],
            assets: [
                {
                    type: "style",
                    href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
                    insertAt: "headEnd",
                },
                {
                    type: "script",
                    src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
                    insertAt: "headEnd",
                    defer: true,
                    waitForGlobal: "L",
                },
            ],
        };
    }
}