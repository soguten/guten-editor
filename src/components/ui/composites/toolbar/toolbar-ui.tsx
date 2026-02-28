import { DefaultState, DefaultProps } from "@core/components";
import { AnchoredOverlayProps } from "../anchored-overlay";
import { AnchoredOverlay } from "../anchored-overlay/anchored-overlay.ts";

export class ToolbarUI<P extends AnchoredOverlayProps & DefaultProps = AnchoredOverlayProps & DefaultProps, S = DefaultState> extends AnchoredOverlay<P, S> {

    static override styles = this.extendStyles(/*css*/`
        .guten-toolbar{
            border-radius: var(--toolbar-radius);
        }
        
        .guten-toolbar ul{
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: row;
            gap: 10px;
        }

        .guten-toolbar li{
            list-style: none;
        }

        .block-controls{
            visibility: hidden ;
            transition: opacity 120ms ease-out, visibility 0s linear;
        }
    `);

    override connectedCallback(): void {
        super.connectedCallback();
        this.setAttribute("class", "guten-toolbar card animate-overlay");
    }

    override render(): HTMLElement {
        return (
            <div>
                <ul>
                    {this.props.children}
                </ul>
            </div>
        );
    }
}
