import { t } from "@core/i18n";
import { runCommand } from "@core/command";
import { PaletteIcon } from "@components/ui/icons";
import { BlockOptionsExtensionPlugin, BlockOptionsItem } from "../../block-controls/index.ts";

export class BlockOptionsCalloutExtension extends BlockOptionsExtensionPlugin {

    override supportsRightClickToOpenBlockOptions(block: HTMLElement): boolean {
        return block.classList.contains("callout");
    }

    override items(block: HTMLElement): BlockOptionsItem[] {
        if (!block.classList.contains("callout")) return [];

        return [
            {
                id: "callout-colors",
                icon: <PaletteIcon />,
                label: t("callout_colors"),
                sort: 60,
                rightIndicator: "chevron",
                onSelect: (ctx) => {
                    runCommand("openCalloutColorOptions", { content: { block: ctx.block, anchor: ctx.trigger } });
                }
            },
        ];
    }
}