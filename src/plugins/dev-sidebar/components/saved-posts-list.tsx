import { Component, DefaultProps } from "@core/components";
import { SavedPostItem } from "./saved-post-item.tsx";

interface SavedPostsListProps extends DefaultProps {
    posts: string[];
}

export class SavedPostsList extends Component<SavedPostsListProps> {
    override render(): HTMLElement {
        return (
            <ul class="dev-sidebar__list">
                {this.props.posts.map((title) => <SavedPostItem title={title} />)}
            </ul>
        );
    }
}