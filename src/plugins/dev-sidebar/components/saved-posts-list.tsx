import { t } from "@core/i18n";
import { Component, DefaultProps } from "@core/components";
import { LocalNoteRecord } from "@utils/storage/local-notes-storage.ts";
import { SavedPostItem } from "./saved-post-item.tsx";

interface SavedPostsListProps extends DefaultProps {
    posts: LocalNoteRecord[];
    selectedPostId: string | null;
    onSelectPost: (postId: string) => void;
}

export class SavedPostsList extends Component<SavedPostsListProps> {
    override render(): HTMLElement {
        if (!this.props.posts.length) {
            return <p class="dev-sidebar__empty">{t("dev_sidebar_empty")}</p>;
        }

        return (
            <ul class="dev-sidebar__list">
                {this.props.posts.map((post) => (
                    <SavedPostItem
                        title={post.title || t("dev_sidebar_untitled")}
                        isActive={post.id === this.props.selectedPostId}
                        onSelect={() => this.props.onSelectPost(post.id)}
                    />
                ))}
            </ul>
        );
    }
}