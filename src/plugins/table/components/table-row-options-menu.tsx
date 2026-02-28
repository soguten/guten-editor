import { DefaultProps } from "@core/components";
import { OverlayCtor } from "@components/editor/overlay";
import { runCommand } from "@core/command";
import { MenuItemUI } from "@components/ui/composites/menu";
import { RowInsertBottomIcon, ArrowUpIcon, DeleteRow, ArrowDownIcon, RowInsertTopIcon } from "@components/ui/icons";
import { BlockOptionsMenu, BlockOptionsOverlayMenu } from "../../block-controls/index.ts";

interface TableRowOptionsItemProps extends DefaultProps {
    table: HTMLTableElement;
    rowIndex: number;
    targetRow?: HTMLTableRowElement | null;
    icon: Element;
    label: string;
    command: string;
}

class TableRowOptionsItem extends MenuItemUI<TableRowOptionsItemProps> {
    override connectedCallback(): void {
        this.icon = this.props.icon;
        this.label = this.props.label;
        super.connectedCallback();
    }

    override onSelect(): void {
        runCommand(this.props.command, {
            content: {
                table: this.props.table,
                rowIndex: this.props.rowIndex,
                targetRow: this.props.targetRow,
            },
        });
    }
}

interface TableRowOptionsMenuProps extends DefaultProps {
    table: HTMLTableElement;
    anchor: HTMLElement;
    rowIndex: number;
    targetRow?: HTMLTableRowElement | null;
}

export class TableRowOptionsMenu extends BlockOptionsOverlayMenu<TableRowOptionsMenuProps> {
    override canOverlayClasses: ReadonlySet<OverlayCtor> = new Set<OverlayCtor>([BlockOptionsMenu]);
    protected override positionMode: "none" | "relative" | "anchor" = "relative";

    override render() {
        return (
            <div class="guten-menu">
                <ul>
                    <li>
                        <TableRowOptionsItem table={this.props.table} rowIndex={this.props.rowIndex} targetRow={this.props.targetRow} icon={<RowInsertTopIcon />} label="Add row above" command="table.addRowAbove" />
                    </li>
                    <li>
                        <TableRowOptionsItem table={this.props.table} rowIndex={this.props.rowIndex} targetRow={this.props.targetRow} icon={<RowInsertBottomIcon />} label="Add row below" command="table.addRowBelow" />
                    </li>
                    <li>
                        <TableRowOptionsItem table={this.props.table} rowIndex={this.props.rowIndex} targetRow={this.props.targetRow} icon={<DeleteRow />} label="Delete row" command="table.deleteRow" />
                    </li>
                    <li>
                        <TableRowOptionsItem table={this.props.table} rowIndex={this.props.rowIndex} targetRow={this.props.targetRow} icon={<ArrowUpIcon />} label="Move row up" command="table.moveRowUp" />
                    </li>
                    <li>
                        <TableRowOptionsItem table={this.props.table} rowIndex={this.props.rowIndex} targetRow={this.props.targetRow} icon={<ArrowDownIcon />} label="Move row down" command="table.moveRowDown" />
                    </li>
                </ul>
            </div>
        );
    }
}