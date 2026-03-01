import { Component } from "@core/components";

export interface SlashMenuItemProps {
    icon: SVGAElement;
    label: string;
    shortcut?: string;
    selected: boolean;
    onSelect: () => void;
}

export class SlashMenuItem extends Component<SlashMenuItemProps> {

    static override getTagName(): string {
        return "x-slash-menu-item";
    }

    static override styles = this.extendStyles(/*css */`
        
        .guten-menu-item-x{
            cursor: pointer;
        }

        .guten-menu-item-x button {
            display: flex;
            align-items: center;
            color: var(--color-ui-text);
            gap: var(--space-custom-10);
        }

        .guten-menu-item-x button .slash-menu-item-label {
            flex: 1;
            white-space: nowrap;
            box-sizing: border-box;
            vertical-align: middle;
        }

        .guten-menu-item-x button .slash-menu-item-shortcut {
            margin-left: auto;
            padding-left: 3rem;
            white-space: nowrap;
            opacity: 0.45;
        }

        .guten-menu-item-x button svg {
            display: block;
            width: var(--icon-size-md);
            height: var(--icon-size-md);
        }

    ` );

    render() {
        const className = this.props.selected ? "selected" : "";
        return (
            <div class="guten-menu-item-x">
                <button
                    type="button"
                    class={className}
                    onClick={this.props.onSelect}
                    onMouseDown={(event: MouseEvent) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                >
                    {this.props.icon}
                    <span class="slash-menu-item-label">{this.props.label}</span>
                    {this.props.shortcut && (
                        <span class="slash-menu-item-shortcut">{this.props.shortcut}</span>
                    )}
                </button>
            </div>);
    }
}