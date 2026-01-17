import { Command } from "../../../core/command/command.ts";
import { CommandExtensionPlugin } from "../../commands/command-plugin.ts";
import { InsertMapEmbed } from "../commands/insert-map-embed.tsx";
import { OpenMapPopover } from "../commands/open-map-popover.tsx";

export class CommandMapExtensionPlugin extends CommandExtensionPlugin {
    override commands(): Command | Command[] {
        return [OpenMapPopover, InsertMapEmbed];
    }
}