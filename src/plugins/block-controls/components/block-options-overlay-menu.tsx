import type { DefaultState } from "@core/components";
import type { OverlayCtor } from "@components/editor/overlay";
import { BlockOptionsMenu, type BlockOptionsProps } from "./block-options-menu.tsx";
import { resolveSubmenuAnchorRectFromParentMenu } from "@components/ui/composites/anchored-overlay";

export interface BlockOptionsOverlayMenuProps extends BlockOptionsProps {
    anchor?: HTMLElement;
    submenuGap?: number;
}

export abstract class BlockOptionsOverlayMenu<Props extends BlockOptionsOverlayMenuProps = BlockOptionsOverlayMenuProps, State extends DefaultState = DefaultState> extends BlockOptionsMenu {

    override props: Props = {} as Props;

    override canOverlayClasses: ReadonlySet<OverlayCtor> = new Set<OverlayCtor>([BlockOptionsMenu]);

    protected override applyAnchoringDefaults(): void {
        const hasExplicitPlacement = this.props.placement !== undefined;
        const hasExplicitOffset = this.props.offset !== undefined;
        const hasExplicitRectResolver = this.props.anchorRectResolver !== undefined;

        super.applyAnchoringDefaults();

        if (!hasExplicitPlacement) {
            this.props.placement = "right-start";
        }

        if (!hasExplicitOffset) {
            this.props.offset = {
                mainAxis: this.props.submenuGap ?? 8,
                crossAxis: -6,
            };
        } else {
            const offset = this.props.offset;
            if (typeof offset !== "number") {
                const offsetObj = offset ?? {};

                this.props.offset = {
                    mainAxis: offsetObj.mainAxis ?? this.props.submenuGap ?? 8,
                    crossAxis: offsetObj.crossAxis ?? -6,
                };
            }
        }

        if (!hasExplicitRectResolver) {
            this.props.anchorRectResolver = (anchor: Node): DOMRect | null =>
                resolveSubmenuAnchorRectFromParentMenu(anchor, this.props.placement ?? "right-start");
        }
    }
}