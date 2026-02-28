import { DefaultProps } from "@core/components";
import { LocaleMeta } from "@core/i18n";
import { MenuItemUI,  } from "@components/ui/composites/menu";
import type { OverlayCtor } from "@components/editor/overlay";
import { NavigationMenu } from "@components/ui/composites/navigation-menu";
import { MenuUIState } from "@components/ui/composites/menu";
import { EditorSettingsMenu } from "./editor-settings-menu.tsx";

interface LangSelectItemProps extends DefaultProps {
    label: string;
    value: string;
    activeLocale: string;
    onSelectLocale: (locale: string) => void;
}

class LangSelectItem extends MenuItemUI<LangSelectItemProps> {
    override connectedCallback(): void {
        this.label = this.props.label;
        super.connectedCallback();
    }

    override isActive(): boolean {
        return this.props.activeLocale === this.props.value;
    }

    override onSelect(): void {
        this.props.onSelectLocale(this.props.value);
    }
}

export interface LangSelectMenuProps extends DefaultProps {
    anchor: HTMLElement;
    locales: LocaleMeta[];
    activeLocale: string;
    onLocaleSelect: (locale: string) => void;
}

export interface LangSelectMenuState extends MenuUIState {
    activeLocale: string;
}

export class LangSelectMenu extends NavigationMenu<LangSelectMenuProps, LangSelectMenuState> {
    override canOverlayClasses: ReadonlySet<OverlayCtor> = new Set<OverlayCtor>([EditorSettingsMenu]);
    protected override lockWidthOnOpen = true;

    protected override applyAnchoringDefaults(): void {
        const hasExplicitPlacement = this.props.placement !== undefined;
        const hasExplicitOffset = this.props.offset !== undefined;

        super.applyAnchoringDefaults();

        if (!hasExplicitPlacement) {
            this.props.placement = "right-start";
        }

        if (!hasExplicitOffset) {
            this.props.offset = { mainAxis: 20, crossAxis: -6 };
            return;
        }

        if (typeof this.props.offset === "number") return;

        this.props.offset = {
            mainAxis: this.props.offset.mainAxis ?? 20,
            crossAxis: this.props.offset.crossAxis ?? -6,
        };
    }

    override onMount(): void {
        if(!this.state.activeLocale) {
            this.setState({ activeLocale: this.props.activeLocale });
        }
        super.onMount();
    }

    private formatLocaleLabel(locale: LocaleMeta): string {
        if (!locale.name || locale.name === locale.nativeName) {
            return locale.nativeName || locale.code;
        }
        return `${locale.nativeName} (${locale.name})`;
    }

    private handleLocaleSelect = (locale: string) => {
        this.setState({ activeLocale: locale });
        this.props.onLocaleSelect(locale);
    };

    override render() {
        return (
            <div class="guten-menu">
                <ul>
                    {/* <li>
                        <div class="guten-menu-label">{t('language')}</div>
                    </li> */}
                    {this.props.locales.map((locale) => (
                        <li>
                            <LangSelectItem
                                label={this.formatLocaleLabel(locale)}
                                value={locale.code}
                                activeLocale={this.state.activeLocale}
                                onSelectLocale={this.handleLocaleSelect}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}