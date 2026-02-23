import { Component, DefaultProps } from "@core/components";
import { DocumentIcon } from "@components/ui/icons";

interface SavedPostItemProps extends DefaultProps {
    title: string;
    isActive?: boolean;
    onSelect?: () => void;
}

export class SavedPostItem extends Component<SavedPostItemProps> {
    override render(): HTMLElement {
        return (
            <li class={`dev-sidebar__item ${this.props.isActive ? "is-active" : ""}`}>
                <button class="dev-sidebar__item-button" type="button" onClick={this.props.onSelect}>
                    <span class="dev-sidebar__item-icon"><DocumentIcon /></span>
                    <span class="dev-sidebar__item-title">{this.props.title}</span>
                </button>
            </li>
        );
    }
}