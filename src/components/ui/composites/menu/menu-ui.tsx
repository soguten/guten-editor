import type { DefaultProps, DefaultState } from "@core/components";
import { KeyboardKeys } from "@utils/keyboard";
import { EventTypes } from "@utils/dom";
import type { AnchoredOverlayProps } from "@components/ui/composites/anchored-overlay";
import { AnchoredOverlay } from "@components/ui/composites/anchored-overlay/anchored-overlay.ts";

export interface MenuUIProps extends DefaultProps, AnchoredOverlayProps {
    anchor?: HTMLElement;
}

export interface MenuUIState extends DefaultState {
    selectedIndex: number
}

export class MenuUI<P extends MenuUIProps = MenuUIProps, S extends MenuUIState = MenuUIState> extends AnchoredOverlay<P, S> {

    override state = { selectedIndex: 0 } as S;

    private _childrenMenus = new Set<HTMLElement>();
    private _lastSelectedAnchor: HTMLElement | null = null;
    private _hoverByMouseEnabled = true;
    private _shouldRestoreFocusOnUnmount = true;

    /** Whether the menu should start with the first item selected (index 0). */
    protected autoFocusFirst = true;

    /**
    * Initial positioning strategy for the overlay:
    * - "none": do not auto-position
    * - "relative": position relative to the parent menu/trigger
    * - "anchor": position to the provided anchor element
    */
    protected positionMode: "none" | "relative" | "anchor" = "none";

    /** Locks the current menu width (via minWidth) on open to reduce layout shift during animation. */
    protected lockWidthOnOpen = false;

    /** If true, removes the menu when its anchor is missing or disconnected from the DOM. */
    protected closeOnAnchorLoss = true;

    static override styles = this.extendStyles(/*css*/`
        .guten-menu ul{
            margin:0;
            padding:var(--space-sm);
            display:inline-flex;
            flex-direction:column;
            gap:4px;
            width:max-content;
        }

        .guten-menu ul li{ list-style:none; width:100%; box-sizing:border-box; }

        .guten-menu ul li:has(> hr.guten-menu-separator) {
            text-align: center;
        }

        .guten-menu-label{
            padding: var(--space-xs) var(--space-md);
            font-size: var(--font-size-xxs);
            text-transform: uppercase;
            letter-spacing: .08em;
            color: var(--color-muted);
        }

        .guten-menu-separator{
            display: inline-block;
            width: 90%;
            height: 1px;
            border: 0;
            margin: 8px 0;
            background: linear-gradient(
              to right,
              transparent,
              var(--sep-color) 12%,
              var(--sep-color) 88%,
              transparent
            );
        }

        .block-controls{
            visibility: hidden ;
            transition: opacity 120ms ease-out, visibility 0s linear;
        }
    `);

    override connectedCallback(): void {

        super.connectedCallback();
        this.classList.add("card", "animate-overlay");

        this.registerEvent(this, EventTypes.KeyDown, this.onKeyDown as EventListener);
        this.registerEvent(this, EventTypes.FocusIn, this.onFocusIn as EventListener);
        this.registerEvent(this, EventTypes.Mouseover, this.onMouseOver as EventListener);
        this.registerEvent(this, EventTypes.MouseMove, this.onMouseMove as EventListener);
        this.registerEvent(document, EventTypes.GutenOverlayGroupClose, this.onOverlayGroupClose as EventListener, true);

        if (this.autoFocusFirst !== false) {
            this.setState({ selectedIndex: 0 } as Partial<S>);
        }
    }

    override afterRender(): void {

        if ((!this.props.anchor || !this.props.anchor.isConnected) && this.closeOnAnchorLoss) {
            this.remove();
            return;
        }

        super.afterRender();
        this.applySelection();
    }

    override onUnmount(): void {
        super.onUnmount?.();
        this.removeChildren();
        if (this._shouldRestoreFocusOnUnmount) {
            this.restoreFocusToAnchor();
        }
    }

    override onMount(): void {

        if ((!this.props.anchor || !this.props.anchor.isConnected) && this.closeOnAnchorLoss) {
            this.remove();

            return;
        }

        super.onMount?.();

        const parent = MenuUI.findParentByTrigger(this.props.anchor || null);
        parent?.appendChildMenu(this);

        if ((!this.props.anchor || !this.props.anchor.isConnected) && this.closeOnAnchorLoss) {
            this.remove();
        }
    }

    private readonly onOverlayGroupClose = () => {
        this._shouldRestoreFocusOnUnmount = false;
    };

    private onMouseMove = (_e: MouseEvent) => {
        this._hoverByMouseEnabled = true;
    };

    private onMouseOver = (e: MouseEvent) => {
        if (!this._hoverByMouseEnabled) return;

        const btn = (e.target as HTMLElement | null)
            ?.closest?.(".guten-menu .guten-menu-item > button") as HTMLButtonElement | null;

        if (!btn || !this.contains(btn)) return;

        const buttons = this.getMenuItemButtons();
        const idx = buttons.indexOf(btn);
        if (idx < 0 || idx === (this.state as MenuUIState).selectedIndex) return;

        this.setState({ selectedIndex: idx } as Partial<S>);
    };

    public appendChildMenu(menu: HTMLElement) {

        if (!menu) return;
        this._childrenMenus.add(menu);

        const parent = menu.parentElement;
        if (parent) {
            const mo = new MutationObserver(() => {
                if (!parent.contains(menu)) {
                    mo.disconnect();
                    this._childrenMenus.delete(menu);
                }
            });
            mo.observe(parent, { childList: true });
        }
    }

    protected override applyAnchoringDefaults(): void {
        if (this.positionMode === "none") {
            this.props.shouldPosition ??= () => false;
            return;
        }

        if (this.positionMode === "relative") {
            this.props.placement ??= "right-start";
            this.props.offset ??= { mainAxis: 6, crossAxis: -6 };
        } else {
            this.props.placement ??= "bottom-start";
            this.props.offset ??= { mainAxis: 8 };
        }

        this.props.detachedAnchorBehavior ??= "remove";
        this.props.collision = {
            flip: this.props.collision?.flip ?? true,
            shift: this.props.collision?.shift ?? true,
            padding: this.props.collision?.padding ?? 8,
            boundary: this.props.collision?.boundary,
        };
    }

    protected override shouldApplyPosition(): boolean {
        return this.positionMode !== "none";
    }

    protected restoreFocusToAnchor() {
        const target = this.props.anchor;
        if (!target || !document.contains(target)) return;
        if ((target as HTMLElement).dataset?.gutenCaretAnchor) return;
        try { (target as any).focus({ preventScroll: true }); }
        catch { target.focus(); }
    }

    removeChildren() {
        this._childrenMenus.forEach((m) => m.isConnected && m.remove());
        this._childrenMenus.clear();
    }

    /**
    * Syncs selection when a descendant button receives focus.
    * @param e Focus event from the menu container.
    */
    private onFocusIn = (e: FocusEvent) => {

        const btn = (e.target as HTMLElement | null)
            ?.closest?.(".guten-menu .guten-menu-item > button") as HTMLButtonElement | null;

        if (!btn) return;
        const buttons = this.getMenuItemButtons();
        const idx = buttons.indexOf(btn);
        if (idx >= 0 && idx !== (this.state as MenuUIState).selectedIndex) {
            this.setState({ selectedIndex: idx } as Partial<S>);
        }
    };

    /**
    * Handles keyboard navigation when focus is within the menu.
    * - ArrowDown/ArrowUp: cycle selection
    * - Enter: let the native <button> click fire
    */

    protected onKeyDown(e: KeyboardEvent) {
        const count = this.getItemCount();
        if (!count || !this.contains(document.activeElement)) return;

        const sel = (this.state as MenuUIState).selectedIndex ?? 0;

        const lockHover = () => { this._hoverByMouseEnabled = false; };

        switch (e.key) {
            case KeyboardKeys.ArrowDown:
                e.preventDefault();
                lockHover();
                this.setState({ selectedIndex: (sel + 1) % count } as Partial<S>);
                break;

            case KeyboardKeys.ArrowUp:
                e.preventDefault();
                lockHover();
                this.setState({ selectedIndex: (sel - 1 + count) % count } as Partial<S>);
                break;

            case KeyboardKeys.Enter:
                lockHover();
                break;
        }
    }

    /**
    * Applies selection styles and roving tabIndex to all descendant buttons.
    * Optionally focuses the selected button.
    * @param forceFocus When true, always focus the selected button.
    */
    private applySelection(forceFocus = false) {
        const buttons = this.getMenuItemButtons();
        const count = buttons.length; if (!count) return;
        const raw = (this.state as MenuUIState).selectedIndex ?? 0;
        const idx = Math.min(Math.max(raw, 0), count - 1);

        buttons.forEach((b, i) => {
            b.classList.toggle("selected", i === idx);
            b.tabIndex = i === idx ? 0 : -1;
        });

        const selectedBtn = buttons[idx];

        if (selectedBtn !== this._lastSelectedAnchor) {
            this._lastSelectedAnchor = selectedBtn;
            this._childrenMenus.forEach((child) => {
                const childAny = child as any;
                const childAnchor: HTMLElement | null | undefined = childAny?.props?.anchor;
                if (!childAnchor || childAnchor !== selectedBtn) {
                    child.remove();
                    this._childrenMenus.delete(child);
                }
            });
        }

        const focusedInside = this.contains(document.activeElement);
        if (selectedBtn && (forceFocus || !focusedInside || document.activeElement === this)) {
            requestAnimationFrame(() => {
                try { (selectedBtn as any).focus({ preventScroll: true }); }
                catch { selectedBtn.focus(); }
            });
        }
    }

    /**
    * @returns Number of descendant <button> elements considered as menu items.
    */
    protected getItemCount(): number {
        return this.getMenuItemButtons().length;
    }

    /**
    * @param Zero-based index within the list of descendant buttons.
    * @returns The button at the given index, or null.
    */
    protected getButtonAtIndex(index: number): HTMLButtonElement | null {
        return this.getMenuItemButtons()[index] ?? null;
    }

    /** Returns only menu item buttons (excludes overlay chrome). */
    protected getMenuItemButtons(): HTMLButtonElement[] {
        return Array.from(
            this.querySelectorAll<HTMLButtonElement>(".guten-menu .guten-menu-item > button")
        );
    }

    render() {
        return (
            <div class="guten-menu">
                <ul>
                    {Array.isArray(this.props.children)
                        ? this.props.children.map((child, i) => <li key={i}>{child}</li>)
                        : <li>{this.props.children}</li>}
                </ul>
            </div>
        );
    }



    static findParentByTrigger(trigger: HTMLElement | null): MenuUI | null {
        if (!trigger) return null;
        const wrapper = trigger.closest(".guten-menu") as HTMLElement | null;
        const host = wrapper?.parentElement as any;
        return host && typeof host.appendChildMenu === "function" ? host as MenuUI : null;
    }
}
