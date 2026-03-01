import { DefaultProps } from "@core/components";
import type { OverlayCtor } from "@components/editor/overlay";
import { MenuItemUI } from "@components/ui/composites/menu";
import { MenuUIState } from "@components/ui/composites/menu";
import { NavigationMenu } from "@components/ui/composites/navigation-menu";
import { EditorSettingsMenu } from "./editor-settings-menu.tsx";
import { resolveSubmenuAnchorRectFromParentMenu } from "@components/ui/composites/index.ts";

interface ThemeSelectItemProps extends DefaultProps {
    label: string;
    value: string;
    activeTheme: string;
    onSelectTheme: (theme: string) => void;
}

class ThemeSelectItem extends MenuItemUI<ThemeSelectItemProps> {
    override connectedCallback(): void {
        this.label = this.props.label;
        super.connectedCallback();
    }

    override isActive(): boolean {
        return this.props.activeTheme === this.props.value;
    }

    override onSelect(): void {
        this.props.onSelectTheme(this.props.value);
    }
}

export interface ThemeSelectMenuProps extends DefaultProps {
    anchor: HTMLElement;
    themes: string[];
    activeTheme: string;
    onThemeSelect: (theme: string) => void;
}

export interface ThemeSelectMenuState extends MenuUIState {
    activeTheme: string;
}

export class ThemeSelectMenu extends NavigationMenu<ThemeSelectMenuProps, ThemeSelectMenuState> {

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
            this.props.offset = { mainAxis: 8, crossAxis: -6 };
        } else if (typeof this.props.offset !== "number") {
            this.props.offset = {
                mainAxis: this.props.offset.mainAxis ?? 8,
                crossAxis: this.props.offset.crossAxis ?? -6,
            };
        }

        this.props.anchorRectResolver ??= (anchor: Node): DOMRect | null =>
            resolveSubmenuAnchorRectFromParentMenu(anchor, this.props.placement ?? "right-start");
    }

    override onMount(): void {
        if(!this.state.activeTheme) {
            this.setState({ activeTheme: this.props.activeTheme });
        }
        super.onMount();
    }

    private formatThemeLabel(theme: string): string {
        if (theme === "auto") return "Auto";
        return theme
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    }

    private handleThemeSelect = (theme: string) => {
        this.setState({ activeTheme: theme });
        this.props.onThemeSelect(theme);
    };

    override render() {
        return (
            <div class="guten-menu">
                <ul>
                    {/* <li>
                        <div class="guten-menu-label">{t('theme')}</div>
                    </li> */}
                    {this.props.themes.map((theme) => (
                        <li>
                            <ThemeSelectItem
                                label={this.formatThemeLabel(theme)}
                                value={theme}
                                activeTheme={this.state.activeTheme}
                                onSelectTheme={this.handleThemeSelect}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}