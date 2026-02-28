import { cleanupCaretAnchor } from "@utils/selection";
import { MenuUI, MenuUIProps } from "@components/ui/composites/menu";
import { DefaultProps } from "@core/components";
import { EventTypes } from "@utils/dom";

export interface BlockOptionsProps extends DefaultProps, MenuUIProps {

}

export class BlockOptionsMenu extends MenuUI<BlockOptionsProps> {

    override closeOnAnchorLoss: boolean = false;

    override props: BlockOptionsProps = {} as BlockOptionsProps;

    protected override applyAnchoringDefaults(): void {
        super.applyAnchoringDefaults();
        this.props.placement ??= "bottom-start";
        this.props.offset ??= { mainAxis: 8 };
    }
    
    private shouldRestoreAnchorSelection = true;

    override onUnmount(): void {
        cleanupCaretAnchor(this.props.anchor ?? null, {
            restoreSelection: this.shouldRestoreAnchorSelection,
        });

        super.onUnmount();
    }

    override connectedCallback(): void {
        this.registerEvent(document, EventTypes.GutenOverlayGroupClose, () => {
            this.shouldRestoreAnchorSelection = false;
        });
        super.connectedCallback();
    }
}