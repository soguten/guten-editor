import { t } from "@core/i18n";
import { Component, DefaultState, DefaultProps } from "@core/components";
import { Heading1Block, ParagraphBlock } from "@components/blocks";
import { focusOnElementAtStart } from "@utils/dom";
import { OffcanvasUI } from "@components/ui/composites/offcanvas";
import { LocalNoteRecord, listLocalNotes, saveLocalNote } from "@utils/storage/local-notes-storage.ts";
import { SavedPostsList } from "./saved-posts-list.tsx";
import { NewArticleButton } from "./new-article-button.tsx";
import style from "./style.css?inline.css";

interface DevSidebarPanelState extends DefaultState {
    posts: LocalNoteRecord[];
    selectedPostId: string | null;
}

export class DevSidebarPanel extends Component<DefaultProps, DevSidebarPanelState> {
    static override styles = style;

    override state: DevSidebarPanelState = {
        posts: [],
        selectedPostId: null,
    };

    override onMount(): void {
        this.loadPosts();
        this.registerEvent(document, "keydown", this.handleDocumentKeyDown as EventListener);
    }

    private async loadPosts(selectedPostId?: string | null): Promise<void> {
        const posts = await listLocalNotes();
        const shouldKeepSelection = selectedPostId ?? this.state.selectedPostId;
        const hasSelection = shouldKeepSelection ? posts.some((post) => post.id === shouldKeepSelection) : false;

        this.setState({
            posts,
            selectedPostId: hasSelection ? shouldKeepSelection ?? null : null,
        });
    }

    private getTitleArea(): HTMLElement | null {
        return document.getElementById("titleArea");
    }

    private getContentArea(): HTMLElement | null {
        return document.getElementById("contentArea");
    }

    private buildDefaultTitleBlock(): HTMLElement {
        return <Heading1Block data-placeholder={t("untitled")} data-placeholder-key="untitled" />;
    }

    private buildDefaultContentBlock(): HTMLElement {
        return <ParagraphBlock />;
    }

    private extractEditorPayload(): { title: string; titleHtml: string; contentHtml: string } {
        const titleArea = this.getTitleArea();
        const contentArea = this.getContentArea();

        if (!titleArea || !contentArea) {
            return {
                title: t("dev_sidebar_untitled"),
                titleHtml: "",
                contentHtml: "",
            };
        }

        const titleHtml = titleArea.innerHTML;
        const contentHtml = contentArea.innerHTML;
        const titleText = titleArea.textContent?.trim() || t("dev_sidebar_untitled");

        return {
            title: titleText,
            titleHtml,
            contentHtml,
        };
    }

    private loadNoteIntoEditor(note: LocalNoteRecord): void {
        const titleArea = this.getTitleArea();
        const contentArea = this.getContentArea();

        if (!titleArea || !contentArea) return;

        titleArea.innerHTML = note.titleHtml || "";
        contentArea.innerHTML = note.contentHtml || "";

        if (!titleArea.firstElementChild) {
            titleArea.appendChild(this.buildDefaultTitleBlock());
        }

        if (!contentArea.firstElementChild) {
            contentArea.appendChild(this.buildDefaultContentBlock());
        }

        focusOnElementAtStart(titleArea.firstElementChild as HTMLElement);
    }

    private resetEditorForNewEntry(): void {
        const titleArea = this.getTitleArea();
        const contentArea = this.getContentArea();

        if (!titleArea || !contentArea) return;

        titleArea.innerHTML = "";
        contentArea.innerHTML = "";

        const titleBlock = this.buildDefaultTitleBlock();
        const contentBlock = this.buildDefaultContentBlock();

        titleArea.appendChild(titleBlock);
        contentArea.appendChild(contentBlock);

        focusOnElementAtStart(titleBlock);
    }

    private readonly persistCurrentEditor = async (): Promise<void> => {
        const payload = this.extractEditorPayload();

        const saved = await saveLocalNote({
            id: this.state.selectedPostId ?? undefined,
            title: payload.title,
            titleHtml: payload.titleHtml,
            contentHtml: payload.contentHtml,
        });

        await this.loadPosts(saved.id);
    };

    private readonly handleCreateArticle = async () => {
        await this.persistCurrentEditor();
        this.resetEditorForNewEntry();
        this.setState({ selectedPostId: null });
    };

    private readonly handleSelectPost = (postId: string) => {
        const note = this.state.posts.find((post) => post.id === postId);
        if (!note) return;

        this.setState({ selectedPostId: postId });
        this.loadNoteIntoEditor(note);
    };

    private readonly handleDocumentKeyDown = async (event: Event) => {
        const e = event as KeyboardEvent;
        const isSaveShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
        if (!isSaveShortcut) return;

        event.preventDefault();
        await this.persistCurrentEditor();
    };

    override render(): HTMLElement {
        return (
            <div class="dev-sidebar-shell">
                <OffcanvasUI side="left" align="top" className="dev-sidebar-offcanvas" title={t("dev_sidebar_saved_posts_title")}>
                    <SavedPostsList
                        posts={this.state.posts}
                        selectedPostId={this.state.selectedPostId}
                        onSelectPost={this.handleSelectPost}
                    />
                    <NewArticleButton onCreate={this.handleCreateArticle} />
                </OffcanvasUI>
            </div>
        );
    }
}