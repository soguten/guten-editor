import type { DefaultState } from "@core/components";
import { OverlayCtor } from "@components/editor/overlay";
import { BlockOptionsMenu, BlockOptionsOverlayMenu, type BlockOptionsProps } from "../../block-controls/index.ts";import { ColorVariant } from "./types.ts";
import { CalloutColorMenuItem } from "./callout-color-menu-item.tsx";

interface CalloutColorMenuProps extends BlockOptionsProps {
    block: HTMLElement;
    anchor: HTMLElement;
}

interface CalloutColorMenuState extends DefaultState {
    selectedIndex: number;
    background: string;
}

const BACKGROUND_VARIANTS: ColorVariant[] = [
    { id: "info", labelKey: "callout_color_info", color: "var(--color-callout-info)", rounded: true },
    { id: "neutral", labelKey: "callout_color_neutral", color: "var(--color-callout-neutral)", rounded: true },
    { id: "success", labelKey: "callout_color_success", color: "var(--color-callout-success)", rounded: true },
    { id: "warning", labelKey: "callout_color_warning", color: "var(--color-callout-warning)", rounded: true },
    { id: "danger", labelKey: "callout_color_danger", color: "var(--color-callout-danger)", rounded: true },
];

export class CalloutColorMenu extends BlockOptionsOverlayMenu<CalloutColorMenuProps, CalloutColorMenuState> {

    override canOverlayClasses: ReadonlySet<OverlayCtor> = new Set<OverlayCtor>([BlockOptionsMenu]);

    override props: CalloutColorMenuProps = {} as CalloutColorMenuProps;

    override state: CalloutColorMenuState = {
        selectedIndex: 0,
        background: "",
    };

    override onMount(): void {

        super.onMount?.();
        this.syncStateFromBlock();

        const backgroundItems = BACKGROUND_VARIANTS.map((variant) =>
            this.renderVariant(variant, "callout-background-")
        );

        this.props.children = backgroundItems;
    }

    private syncStateFromBlock(): void {
        const { block } = this.props;
        const background = block.getAttribute("data-callout-variant") ?? "";
        this.setState({ background });
    }

    private renderVariant(variant: ColorVariant, dataIdPrefix: string): HTMLElement {
        return (
            <CalloutColorMenuItem
                variant={variant}
                block={this.props.block}
                isActiveVariant={this.isActiveVariant.bind(this)}
                handleBackgroundChange={this.handleBackgroundChange.bind(this)}
                data-block-options-id={`${dataIdPrefix}${variant.id || "default"}`}
            />
        ) as HTMLElement;
    }

    private isActiveVariant(variant: ColorVariant): boolean {
        return this.state.background === variant.id;
    }

    private handleBackgroundChange = (variantId: string) => {
        const { block } = this.props;
        if (variantId) block.setAttribute("data-callout-variant", variantId);
        else block.removeAttribute("data-callout-variant");
        this.setState({ background: variantId });
    };
}