import { Component, DefaultProps } from "@core/components";
import { OffcanvasUI } from "@components/ui/composites/offcanvas";
import { SavedPostsList } from "./saved-posts-list.tsx";
import { NewArticleButton } from "./new-article-button.tsx";
import style from "./style.css?inline.css";

const MOCK_POSTS = [
    "Interesting ideas",
    "Passwords",
    "New client intake form",
    "Joke ideas",
    "Untitled",
];

export class DevSidebarPanel extends Component<DefaultProps> {
    static override styles = style;

    private readonly handleCreateArticle = () => {
        console.log("[DevSidebar] Criar novo artigo");
    };

    override render(): HTMLElement {
        return (
            <div class="dev-sidebar-shell">
                <OffcanvasUI side="left" align="top" className="dev-sidebar-offcanvas" title="Postagens salvas">
                    <SavedPostsList posts={MOCK_POSTS} />
                    <NewArticleButton onCreate={this.handleCreateArticle} />
                </OffcanvasUI>
            </div>
        );
    }
}