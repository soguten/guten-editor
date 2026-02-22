import { Component, DefaultProps } from "@core/components";
import style from "./style.css?inline.css";

export type OffcanvasSide = "left" | "right";
export type OffcanvasVerticalAlign = "top" | "bottom";

export interface OffcanvasUIProps extends DefaultProps {
    side?: OffcanvasSide;
    align?: OffcanvasVerticalAlign;
    title?: string;
    className?: string;
}

export class OffcanvasUI extends Component<OffcanvasUIProps> {
    static override styles = style;

    override render(): HTMLElement {
        const side = this.props.side ?? "left";
        const align = this.props.align ?? "top";
        const customClassName = this.props.className ? ` ${this.props.className}` : "";

        return (
            <aside class={`offcanvas offcanvas--${side} offcanvas--${align}${customClassName}`}>
                {this.props.title && <h2 class="offcanvas__title">{this.props.title}</h2>}
                <div class="offcanvas__content">{this.props.children}</div>
            </aside>
        );
    }
}