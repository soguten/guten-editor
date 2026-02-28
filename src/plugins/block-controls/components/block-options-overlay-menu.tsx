import type { DefaultState } from "@core/components";
import type { OverlayCtor } from "@components/editor/overlay";
import { BlockOptionsMenu, type BlockOptionsProps } from "./block-options-menu.tsx";

export interface BlockOptionsOverlayMenuProps extends BlockOptionsProps {
    anchor?: HTMLElement;
    submenuGap?: number;
}

export abstract class BlockOptionsOverlayMenu<Props extends BlockOptionsOverlayMenuProps = BlockOptionsOverlayMenuProps, State extends DefaultState = DefaultState> extends BlockOptionsMenu {

    override props: Props = {} as Props;

    override canOverlayClasses: ReadonlySet<OverlayCtor> = new Set<OverlayCtor>([BlockOptionsMenu]);

    protected override positionMode: "none" | "relative" | "anchor" = "relative";

    protected override applyAnchoringDefaults(): void {
        const hasExplicitPlacement = this.props.placement !== undefined;
        const hasExplicitOffset = this.props.offset !== undefined;

        super.applyAnchoringDefaults();

        if (!hasExplicitPlacement) {
            this.props.placement = "right-start";
        }

        if (!hasExplicitOffset) {
            this.props.offset = {
                mainAxis: this.props.submenuGap ?? 20,
                crossAxis: -6,
            };
            return;
        }

        const offset = this.props.offset;
        if (typeof offset === "number") {
            return;
        }

        const offsetObj = offset ?? {};

        this.props.offset = {
            mainAxis: offsetObj.mainAxis ?? this.props.submenuGap ?? 10,
            crossAxis: offsetObj.crossAxis ?? -6,
        };
    }
}