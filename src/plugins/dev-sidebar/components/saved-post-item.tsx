import { Component, DefaultProps } from "@core/components";
import { DocumentIcon } from "./document-icon.tsx";

interface SavedPostItemProps extends DefaultProps {
    title: string;
}

export class SavedPostItem extends Component<SavedPostItemProps> {
    override render(): HTMLElement {
        return (
            <li class="dev-sidebar__item">
                <span class="dev-sidebar__item-icon"><DocumentIcon /></span>
                <span class="dev-sidebar__item-title">{this.props.title}</span>
            </li>
        );
    }
}