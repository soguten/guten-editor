import { t } from "@core/i18n";
import { runCommand } from "@core/command";
import { Plugin, ExtensiblePlugin, PluginExtension } from "@core/plugin-engine";
import { provideContext } from "@core/context";
import { appendElementOnOverlayArea } from "@components/editor";
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikeThroughIcon } from "@components/ui/icons";
import { hasSelection } from "@utils/selection/selection-utils.ts";
import { debounce } from "@utils/timing/index.ts";
import { FormattingToolbarItem } from "./component/formatting-toolbar-item.tsx";
import { FormattingToolbar } from "./component/formatting-toolbar.tsx";
import { FormattingToolbarCtx } from "./context/formatting-toolbar-context.ts";
import { EventTypes } from "@utils/dom/events.ts";
import { KeyboardKeys } from "@utils/keyboard";
import { isMobileSheetViewport } from "@utils/platform";

export class FormattingToolbarPlugin extends ExtensiblePlugin<FormattingToolbarExtensionPlugin> {

    private static toolbarInstance: FormattingToolbar | null = null;
    private extensionPlugins: FormattingToolbarExtensionPlugin[] = [];

    override setup(_root: HTMLElement, _plugins: Plugin[]): void {

        provideContext(_root, FormattingToolbarCtx, {

            lock: () => FormattingToolbarPlugin.toolbarInstance?.lockSelection(),
            unlock: () => FormattingToolbarPlugin.toolbarInstance?.unlockSelection(),
            refreshSelection: () => FormattingToolbarPlugin.toolbarInstance?.refreshSelection(),
            getSelectionRect: () => FormattingToolbarPlugin.toolbarInstance?.getSelectionRect() ?? null,


        }, { scopeRoot: _root });
    }

    override attachExtensions(extensions: FormattingToolbarExtensionPlugin[]): void {

        this.extensionPlugins = extensions ?? [];

        document.addEventListener(EventTypes.MouseUp, debounce(() => this.handleSelection(), 100) as EventListener);

        if (isMobileSheetViewport()) {
            document.addEventListener(EventTypes.SelectionChange, debounce(() => this.handleSelection(), 100) as EventListener);
        }

        document.addEventListener(EventTypes.KeyUp, debounce((event: KeyboardEvent) => {
            if (event.key === KeyboardKeys.Shift) {
                this.handleSelection();
            }
        }, 100) as EventListener);

        document.addEventListener(EventTypes.KeyUp, debounce(() => {
            const toolbar = FormattingToolbarPlugin.toolbarInstance;
            if (!toolbar || toolbar.isSelectionLocked()) return;
            toolbar.refreshSelection();
            toolbar.refreshActiveStates();
        }, 25) as EventListener);

        document.addEventListener(EventTypes.KeyUp, debounce((event: KeyboardEvent) => {
            if (event.key === KeyboardKeys.ArrowUp || event.key === KeyboardKeys.ArrowDown || event.key === KeyboardKeys.ArrowLeft || event.key === KeyboardKeys.ArrowRight) {

                const toolbar = FormattingToolbarPlugin.toolbarInstance;
                if (!toolbar || toolbar.isSelectionLocked()) return;
                toolbar.remove();
            }
        }, 100) as EventListener);
    }

    removeInstance(): void {
        FormattingToolbarPlugin.toolbarInstance = null;
    }

    private handleSelection(): void {

        const hasTextSelection = hasSelection();
        const existingToolbar = FormattingToolbarPlugin.toolbarInstance;

        if (existingToolbar && !existingToolbar.isSelectionLocked() && !hasTextSelection) {
            existingToolbar.remove();
            FormattingToolbarPlugin.toolbarInstance = null;
            return;
        }

        let ft: FormattingToolbar | null = null;

        if (!FormattingToolbarPlugin.toolbarInstance && hasTextSelection) {

            const formattingToolbar =
                <FormattingToolbar removeInstance={this.removeInstance} ref={(el: FormattingToolbar) => ft = el}>
                    {this.buildToolbarItems().map(item => (
                        <li>
                            <FormattingToolbarItem
                                icon={item.icon}
                                label={item.label}
                                shortcut={item.shortcut}
                                onSelect={item.onSelect}
                                isActive={item.isActive}
                                refreshSelection={() => ft?.refreshSelection()}
                                showMenuIndicator={item.showMenuIndicator}
                            />
                        </li>
                    ))}
                </FormattingToolbar>;

            appendElementOnOverlayArea(formattingToolbar);
            FormattingToolbarPlugin.toolbarInstance = formattingToolbar;
        }
    }

    private readonly defaultItems: ToolbarEntry[] = [
        {
            icon: <BoldIcon />,
            label: t("bold"),
            shortcut: "Mod+B",
            onSelect: () => runCommand("toggleBold"),
            isActive: () => runCommand("stateBold"),
            sort: 10,
        },
        {
            icon: <ItalicIcon />,
            label: t("italic"),
            shortcut: "Mod+I",
            onSelect: () => runCommand("toggleItalic"),
            isActive: () => runCommand("stateItalic"),
            sort: 20,
        },
        // {
        //     icon: <UnderlineIcon />,
        //     label: t("underline"),
        //     shortcut: "Mod+U",
        //     onSelect: () => runCommand("toggleUnderline"),
        //     isActive: () => runCommand("stateUnderline"),
        //     sort: 30,
        // },
        {
            icon: <StrikeThroughIcon />,
            label: t("strikethrough"),
            shortcut: "Mod+Shift+X",
            onSelect: () => runCommand("toggleStrike"),
            isActive: () => runCommand("stateStrike"),
            sort: 40,
        }
    ];

    private buildToolbarItems(): ToolbarEntry[] {
        const itemsFromExtensions: ToolbarEntry[] = this.extensionPlugins.map(
            (ext) => ({
                icon: ext.icon,
                label: ext.label,
                shortcut: ext.shortcut,
                onSelect: (event?: Event, button?: HTMLButtonElement | null) =>
                    ext.onSelect(event, button),
                isActive: ext.isActive,
                sort: ext.sort,
                showMenuIndicator: ext.showMenuIndicator,
            }),
        );

        return [...this.defaultItems, ...itemsFromExtensions].sort(
            (a, b) => a.sort - b.sort,
        );
    }
}

export abstract class FormattingToolbarExtensionPlugin extends PluginExtension<FormattingToolbarPlugin> {

    override readonly target = FormattingToolbarPlugin;

    abstract readonly icon: SVGElement;
    abstract readonly label: string;
    abstract readonly shortcut: string;
    abstract readonly sort: number;
    abstract onSelect(event?: Event, button?: HTMLButtonElement | null): void;
    isActive: () => boolean = () => { return false; };
    showMenuIndicator: boolean = false;
}

type ToolbarEntry = {
    icon: SVGElement;
    label: string;
    shortcut: string;
    sort: number;
    onSelect: (event?: Event, button?: HTMLButtonElement | null) => void;
    isActive: () => boolean;
    showMenuIndicator?: boolean;
};