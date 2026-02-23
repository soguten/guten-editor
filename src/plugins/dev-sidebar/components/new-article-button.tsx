import { t } from "@core/i18n";
import { Component, DefaultProps } from "@core/components";

interface NewArticleButtonProps extends DefaultProps {
    onCreate?: () => void;
}

export class NewArticleButton extends Component<NewArticleButtonProps> {
    override render(): HTMLElement {
        return (
            <button class="dev-sidebar__new-article" type="button" onClick={this.props.onCreate}>
                {t("dev_sidebar_new_article")}
            </button>
        );
    }
}