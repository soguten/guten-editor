import { Component } from "@core/components";
import { DefaultProps, DefaultState } from "@core/components";
import { Tooltip } from "@components/ui/primitives/tooltip";

interface ToolbarItemUIProps extends DefaultProps {
    icon?: HTMLElement;
    label?: string;
    shortcut?: string;
}

export class ToolbarItemUI<P extends ToolbarItemUIProps = DefaultProps, S = DefaultState> extends Component<P, S> {

    static override styles = this.extendStyles(/*css*/`
        
        .guten-toolbar-item {
            position: relative;
            display: inline-flex;
        }

        .guten-toolbar-item button {
            all: unset;
            padding: var(--toolbar-button-padding);
            font-size: var(--button-font-size);
            font-family: var(--button-font-family);
            font-weight: var(--button-font-weight);
            color: var(--toolbar-button-color);
            background: var(--toolbar-button-bg);
            border: var(--toolbar-button-border);
            border-radius: var(--toolbar-button-radius);
            box-shadow: var(--toolbar-button-shadow);
        }

        .guten-toolbar-item button svg {
            display: block;
            width: var(--icon-size-md);
            height: var(--icon-size-md);
        }

        .guten-toolbar-item button:hover {
            background-color: var(--toolbar-button-bg-hover);
            border: var(--toolbar-button-border-hover);
            box-shadow: var(--toolbar-button-shadow-hover);
            cursor: pointer;
        }

        .guten-toolbar-item button:active {
            background-color: var(--toolbar-button-bg-active);
            border: var(--toolbar-button-border-active);
            box-shadow: var(--toolbar-button-shadow-active);
        }

        .active button svg{
            color: var(--color-primary);
        }

        .guten-toolbar-item:hover .tooltip {
            opacity: 1;
            transition-delay: 0.5s;
            display: flex;
        }
    `);

    override connectedCallback(): void {
        super.connectedCallback();
        this.setAttribute("class", "guten-toolbar-item");
    }

    override render(): HTMLElement {
        const { icon, label, shortcut, children } = this.props as ToolbarItemUIProps;

        return (
            <div>
                <Tooltip
                    text={label}
                    shortcut={shortcut}
                    placement="top"
                    textAlign="center"
                    offset={8} >
                    <button type="button">
                        {icon ?? children}
                    </button>
                </Tooltip>
            </div>
        );
    }
}
