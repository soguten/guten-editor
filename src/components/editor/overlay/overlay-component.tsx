import { t } from "@core/i18n";
import { ArrowLeftIcon, CloseIcon } from "@components/ui/icons";
import { isMobileSheetViewport } from "@utils/platform";
import { Component } from "@core/components";
import { DefaultProps, DefaultState } from "@core/components";
import { pushOverlay, removeOverlay } from "./index.ts";
import { CloseableOverlay } from "./types.ts";

/**
 * Constructor type for overlay components.
 * 
 * Used to reference or instantiate overlay classes (e.g. in registries or overlay rules).
 * Commonly used in `canOverlayClasses` to define which overlays can stack above others.
 */
export type OverlayCtor = new (...args: any[]) => OverlayComponent<any, any>;

/**
 * Base class for UI overlays (e.g. modals, dropdowns, popovers).
 * 
 * Handles overlay registration, stacking (z-index), entry/exit animations,
 * and optional auto-removal when clicking outside.
 *
 * Extend this class to implement custom overlay components.
 *
 * @template P Props type
 * @template S State type
 */
export abstract class OverlayComponent<P = DefaultProps, S = DefaultState> extends Component<P, S> implements CloseableOverlay {

    /** Default z-index for overlays */
    zIndex: number = 1000;

    /** @deprecated Prefer configuring anchored positioning in `AnchoredOverlay`. */
    positionToAnchorVerticalGap: number = 2;
    /** @deprecated Prefer configuring anchored positioning in `AnchoredOverlay`. */
    positionToAnchorHorizontalGap: number = 2;

    /** Controls whether a mobile back action should be rendered. */
    protected mobileBackActionEnabled: boolean = true;

    /** Controls whether a mobile close action should be rendered. */
    protected mobileCloseActionEnabled: boolean = true;

    private mobileChrome: HTMLDivElement | null = null;
    private mobileBackButton: HTMLButtonElement | null = null;
    private mobileCloseButton: HTMLButtonElement | null = null;

    /**
    * Defines which overlay classes are allowed to appear above this one.
    * Used to control overlay stacking behavior.
    */
    public canOverlayClasses: ReadonlySet<OverlayCtor> = new Set();

    /** If true, removes the overlay when clicking outside (default: true) */
    closeOnClickOutside: boolean = true;

    // Internal flag to ignore the first outside click after rendering
    private listenClickOutside: boolean = false;

    private cleanupKeyboardInset?: () => void;

    /** Called when the element is added to the DOM */
    override connectedCallback(): void {
        this.classList.add("guten-modal", "guten-modal--sheet-mobile");

        super.connectedCallback();

        this.style.position = "absolute";
        this.style.zIndex = this.zIndex.toString();
        pushOverlay(this);

        //Set a timeout to 
        setTimeout(() => {
            this.listenClickOutside = true;
        }, 300);

        this.classList.add("animate-overlay");
    }

    /** Called when the element is removed from the DOM */
    override disconnectedCallback(): void {
        super.disconnectedCallback();
        removeOverlay(this);
    }

    get canCloseOnClickOutside(): boolean {
        return this.closeOnClickOutside === true && this.listenClickOutside === true;
    }

    /** Removes the overlay with an exit animation */
    override remove(): void {
        const finishRemoval = () => requestAnimationFrame(() => super.remove());
        const hadShowOverlay = this.classList.contains("show-overlay");

        this.classList.remove("show-overlay");

        if (!hadShowOverlay) {
            this.classList.remove("animate-overlay");
            super.remove();
            return;
        }

        let completed = false;
        const onComplete = () => {
            if (completed) return;
            completed = true;
            finishRemoval();
        };

        const fallback = globalThis.setTimeout(onComplete, 200);
        this.addEventListener("transitionend", () => {
            globalThis.clearTimeout(fallback);
            onComplete();
        }, { once: true });
    }

    /** Adds entry animation after rendering */
    override afterRender(): void {
        this.ensureMobileChrome();

        requestAnimationFrame(() => {
            this.classList.add("show-overlay");
        });
    }

    /** Allows subclasses to toggle mobile-only action visibility. */
    protected setMobileActions(actions: { back?: boolean; close?: boolean; }) {
        if (typeof actions.back === "boolean") this.mobileBackActionEnabled = actions.back;
        if (typeof actions.close === "boolean") this.mobileCloseActionEnabled = actions.close;
        this.updateMobileActionsVisibility();
    }

    private ensureMobileChrome() {
        if (!this.mobileChrome) {
            const chrome = (
                <div className="guten-modal__chrome">
                    <div className="guten-modal__actions guten-modal__actions--left">
                        <button
                            type="button"
                            className="guten-modal__action guten-modal__action--back"
                            aria-label={t("modal_back")}
                            onClick={this.handleMobileBackClick}
                            ref={(el: HTMLButtonElement) => { this.mobileBackButton = el; }}
                        >
                            <ArrowLeftIcon />
                        </button>
                    </div>
                    <div className="guten-modal__actions guten-modal__actions--right">
                        <button
                            type="button"
                            className="guten-modal__action guten-modal__action--close"
                            aria-label={t("modal_close")}
                            onClick={this.handleMobileCloseClick}
                            ref={(el: HTMLButtonElement) => { this.mobileCloseButton = el; }}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>
            ) as HTMLDivElement;

            this.mobileChrome = chrome;
        }

        if (!this.contains(this.mobileChrome)) {
            this.prepend(this.mobileChrome!);
        }

        this.updateMobileActionsVisibility();
    }

    private updateMobileActionsVisibility() {
        if (!this.mobileChrome) return;

        const showBack = Boolean(this.mobileBackActionEnabled);
        const showClose = Boolean(this.mobileCloseActionEnabled);

        this.mobileChrome.hidden = !(showBack || showClose);
        if (this.mobileBackButton) this.mobileBackButton.hidden = !showBack;
        if (this.mobileCloseButton) this.mobileCloseButton.hidden = !showClose;
    }

    private readonly handleMobileBackClick = (event: MouseEvent) => {
        event.stopPropagation();
        const customEvent = new CustomEvent("overlay:back", { bubbles: true, cancelable: true });
        this.dispatchEvent(customEvent);
        if (!customEvent.defaultPrevented) {
            this.onMobileBack();
        }
    };

    private readonly handleMobileCloseClick = (event: MouseEvent) => {
        event.stopPropagation();
        this.onMobileClose();
    };

    /** Default back action: remove the overlay. Subclasses may override. */
    protected onMobileBack(): void {
        this.remove();
    }

    /** Default close action: remove the overlay. Subclasses may override. */
    protected onMobileClose(): void {
        this.remove();
    }

    /**
    * Determines whether this overlay can appear above another.
    * Uses `canOverlayClasses` to decide compatibility between overlays.
    */
    public canOverlay(other: HTMLElement): boolean {
        if (!(other instanceof OverlayComponent)) return true;
        if (this.canOverlayClasses.size > 0) {
            for (const ctor of this.canOverlayClasses) {
                if (other instanceof ctor) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    private getAnchorRect(anchor: Node): DOMRect | null {
        if (!anchor || !anchor.parentNode) return null;

        const r = document.createRange();

        if (anchor instanceof Text) {
            r.setStart(anchor, 0);
            r.setEnd(anchor, Math.min(1, anchor.length));
        } else {
            r.selectNode(anchor);
        }

        const rects = r.getClientRects();
        if (rects.length > 0) return rects[0];
        return r.getBoundingClientRect();
    }

    protected roundCoordinate(value: number): number {
        return Math.round(value);
    }

    /** @deprecated Prefer `AnchoredOverlay` + placement/collision props. */
    positionToAnchor(anchorOrRect: Node | DOMRect): void {

        if (isMobileSheetViewport()) {
            return;
        }

        const rect =
            anchorOrRect instanceof Node
                ? (this as any).getAnchorRect(anchorOrRect)
                : new DOMRect(anchorOrRect.x, anchorOrRect.y, anchorOrRect.width, anchorOrRect.height);

        if (!rect) return;

        const parent = (this as unknown as HTMLElement).offsetParent as HTMLElement | null;
        const pad = parent
            ? (() => {
                const pr = parent.getBoundingClientRect();
                const left = pr.left + parent.clientLeft;
                const top = pr.top + parent.clientTop;
                const right = left + parent.clientWidth;
                const bottom = top + parent.clientHeight;
                return { left, top, right, bottom };
            })()
            : {
                left: 0,
                top: 0,
                right: globalThis.innerWidth,
                bottom: globalThis.innerHeight,
            };

        this.style.position = "absolute";

        const { width: menuWidth, height: menuHeight } = this.getBoundingClientRect();

        const spaceBelow = globalThis.innerHeight - rect.bottom;
        const showAbove = spaceBelow < menuHeight && rect.top > menuHeight;

        if (showAbove) {
            this.style.bottom = `${this.roundCoordinate(pad.bottom - (rect.top - this.positionToAnchorVerticalGap))}px`;
            this.style.top = "";
        } else {
            this.style.top = `${this.roundCoordinate(rect.bottom + this.positionToAnchorVerticalGap - pad.top)}px`;
            this.style.bottom = "";
        }

        const spaceRight = globalThis.innerWidth - rect.right;
        const spaceLeft = rect.left;
        const showRight = spaceRight >= menuWidth || spaceRight >= spaceLeft;


        if (showRight) {
            this.style.left = `${this.roundCoordinate(rect.right + this.positionToAnchorHorizontalGap - pad.left)}px`;
            this.style.right = "";
        } else {
            this.style.right = `${this.roundCoordinate(pad.right - (rect.left - this.positionToAnchorHorizontalGap))}px`;
            this.style.left = "";
        }
    }

     /** @deprecated Prefer `AnchoredOverlay` presets for menu-like overlays. */
    public positionRelativeToMenu(anchorOrRect: HTMLElement | DOMRect, gap: number = 8): void {

        if (isMobileSheetViewport()) {
            return;
        }
        
        const anchorRect = anchorOrRect instanceof HTMLElement
            ? anchorOrRect.getBoundingClientRect()
            : anchorOrRect;

        const anchor = anchorOrRect instanceof HTMLElement ? anchorOrRect : null;
        const menuContainer = anchor?.closest?.(".guten-menu");

        if (!menuContainer) {
            if (anchor) this.positionToAnchor(anchor);
            return;
        }

        const bounds = this.getOverlayBounds();
        const menuRect = menuContainer.getBoundingClientRect();
        const overlayRect = this.getBoundingClientRect();

        const anchorCenter = anchorRect.top + (anchorRect.height / 2);
        const desiredTop = anchorCenter - (overlayRect.height / 2) - bounds.top;
        let left = menuRect.right + gap - bounds.left;

        if (left + overlayRect.width > bounds.width) {
            left = menuRect.left - gap - overlayRect.width - bounds.left;
            if (left < 0) {
                left = Math.max(bounds.width - overlayRect.width, 0);
            }
        }

        const top = desiredTop;

        if (left < 0) left = 0;

        this.style.top = `${top}px`;
        this.style.left = `${left}px`;
        this.style.bottom = "";
        this.style.right = "";
    }

    /**
     * Computes the bounding box available for overlay positioning.
     * Uses the overlay's offset parent when available, otherwise falls back to the viewport bounds.
     */
    protected getOverlayBounds() {
        const parent = this.offsetParent as HTMLElement | null;
        if (parent) {
            const rect = parent.getBoundingClientRect();
            const width = parent.clientWidth;
            const height = parent.clientHeight;

            if (width > 0 && height > 0) {
                const left = rect.left + parent.clientLeft;
                const top = rect.top + parent.clientTop;
                return {
                    left,
                    top,
                    right: left + width,
                    bottom: top + height,
                    width,
                    height,
                };
            }
        }

        const viewportWidth = globalThis.innerWidth;
        const viewportHeight = globalThis.innerHeight;

        return {
            left: 0,
            top: 0,
            right: viewportWidth,
            bottom: viewportHeight,
            width: viewportWidth,
            height: viewportHeight,
        };
    }
}