import { runCommand } from "@core/command";
import { TableRowIcon, TableColumnIcon } from "@components/ui/icons";
import { BlockOptionsExtensionPlugin, BlockOptionsItem } from "../../block-controls/index.ts";
import { findColumnIndexFromSelection, findRowIndexFromSelection } from "../commands/table-command-utils.ts";

export class BlockOptionsTableExtension extends BlockOptionsExtensionPlugin {

    override items(block: HTMLElement): BlockOptionsItem[] {
        if (!block.classList.contains("table-block")) return [];

        const table = block.querySelector("table");
        if (!table) return [];

        return [
            {
                id: "table-row-options",
                icon: <TableRowIcon />,
                label: "Row",
                sort: 60,
                rightIndicator: "chevron",
                onSelect: (ctx) => {
                    const rowIndex = findRowIndexFromSelection(table) ?? 0;
                    runCommand("openTableRowOptions", { content: { table, anchor: ctx.trigger, rowIndex } });
                }
            },
            {
                id: "table-column-options",
                icon: <TableColumnIcon />,
                label: "Column",
                sort: 61,
                rightIndicator: "chevron",
                onSelect: (ctx) => {
                    const columnIndex = findColumnIndexFromSelection(table) ?? 0;
                    runCommand("openTableColumnOptions", { content: { table, anchor: ctx.trigger, columnIndex } });
                }
            },
        ];
    }
}