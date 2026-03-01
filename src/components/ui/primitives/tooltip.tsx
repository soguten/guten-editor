
import { Component } from "@core/components";
import { DefaultProps, DefaultState } from "@core/components";
import { ChordModifiers, normalizeChord } from "@utils/keyboard";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";
export type TooltipTextAlign = "left" | "center" | "right";

interface TooltipProps extends DefaultProps {
    text?: string;
    shortcut?: string;
    placement?: TooltipPlacement;
    textAlign?: TooltipTextAlign;
    offset?: number;
    open?: boolean;
}

export class Tooltip<P extends TooltipProps = TooltipProps, S = DefaultState>
    extends Component<P, S> {

    static override styles = this.extendStyles(/*css*/`
        .guten-tooltip-wrap{
          position: relative;
          display: inline-block;
        }

        .guten-tooltip{
            font-weight: var(--font-weight-medium);
            font-family: var(--font-family);
            font-size: var(--font-size-xs);
            background-color: var(--tooltip-bg);
            color: var(--tooltip-text);
            display: flex;
            flex-direction: column;
            padding: var(--space-xs) var(--space-sm);
            position: absolute;
            border-radius: var(--radius-sm);
            box-shadow: var(--shadow-md);
            white-space: pre;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease-in-out;
            z-index: 99999;
        }

        .guten-tooltip-wrap:hover > .guten-tooltip,
        .guten-tooltip-wrap:focus-within > .guten-tooltip,
        .guten-tooltip[data-open="true"]{
          opacity: 1;
          transition-delay: .5s;
          display: flex;
        }

        .guten-tooltip[data-placement="top"]{
          bottom: calc(100% + var(--tooltip-offset));
          left: 50%;
          transform: translateX(-50%);
        }
        .guten-tooltip[data-placement="bottom"]{
          top: calc(100% + var(--tooltip-offset));
          left: 50%;
          transform: translateX(-50%);
        }
        .guten-tooltip[data-placement="left"]{
          right: calc(100% + var(--tooltip-offset));
          top: 50%;
          transform: translateY(-50%);
        }
        .guten-tooltip[data-placement="right"]{
          left: calc(100% + var(--tooltip-offset));
          top: 50%;
          transform: translateY(-50%);
        }

        .guten-tooltip[data-text-align="left"]{
            text-align: left;
        }

        .guten-tooltip[data-text-align="center"]{
            text-align: center;
        }

        .guten-tooltip[data-text-align="right"]{
            text-align: right;
        }

        .guten-tooltip .shortcut {
            color: grey;
            font-size: var(--font-size-xs);
            align-items: center;
            line-height: 1;
        }

        .guten-tooltip .keycap{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            vertical-align: middle;
            font-size: var(--font-size-xs);
            font-family: var(--font-family);
        }

        .guten-tooltip .keycap[data-symbol="true"]{
            transform: scale(var(--keycap-symbol-scale, 1));
            transform-origin: center;
        }
    `);

    private tooltipId = `tt-${Math.random().toString(36).slice(2, 9)}`;

    private wrapEl: HTMLElement | null = null;
    private tooltipEl: HTMLElement | null = null;
    private preferredPlacement: TooltipPlacement = "top";

    override afterRender(): void {
        this.wrapEl = this.querySelector(".guten-tooltip-wrap");
        this.tooltipEl = this.querySelector(".guten-tooltip");
        this.preferredPlacement = (this.props as TooltipProps).placement ?? "top";

        if (this.wrapEl && this.tooltipEl) {
            this.registerEvent(this.wrapEl, "mouseenter", () => this.updatePlacementForViewport());
            this.registerEvent(this.wrapEl, "focusin", () => this.updatePlacementForViewport());
        }
    }

    override render(): HTMLElement {
        const {
            children,
            text,
            shortcut,
            placement = "top",
            textAlign = "left",
            offset = 4,
            open = false
        } = this.props as TooltipProps;

        const tooltipText = text?.replace(/\\n/g, "\n");

        const shortcutEl = shortcut
            ? (
                <span class="shortcut">
                    {
                        normalizeChord(shortcut)
                            .split("+")
                            .map((raw, i, arr) => (
                                <>
                                    {this.renderKeycap(raw.trim())}
                                    {i < arr.length - 1 && <span class="plus">+</span>}
                                </>
                            ))
                    }
                </span>
            )
            : null;

        return (
            <span class="guten-tooltip-wrap" style={`--tooltip-offset: ${offset}px;`}>
                {children}
                {(text || shortcutEl) && (
                    <span
                        id={this.tooltipId}
                        role="tooltip"
                        class="guten-tooltip"
                        data-placement={placement}
                        data-text-align={textAlign}
                        data-open={open ? "true" : "false"}
                    >
                        {tooltipText}
                        {shortcutEl}
                    </span>
                )}
            </span>
        );
    }

    private renderKeycap(part: string) {
        switch (part) {
            case ChordModifiers.Shift:
                return <kbd class="keycap" data-symbol="true" aria-label="Shift">⇧</kbd>;
            case ChordModifiers.Meta:
                return <kbd class="keycap" data-symbol="true" aria-label="Command">⌘</kbd>;
            case ChordModifiers.Ctrl:
                return <kbd class="keycap" aria-label="Control">Ctrl</kbd>;
            case ChordModifiers.Alt:
                return <kbd class="keycap" aria-label="Alt">Alt</kbd>;
            default: {
                const label = /^[a-z]$/i.test(part) ? part.toUpperCase() : part;
                return <kbd class="keycap">{label}</kbd>;
            }
        }
    }

    private updatePlacementForViewport() {
        const tooltip = this.tooltipEl;
        if (!tooltip) return;

        const preferred = this.preferredPlacement;
        tooltip.setAttribute("data-placement", preferred);

        if (preferred !== "top") {
            return;
        }

        requestAnimationFrame(() => {
            const rect = tooltip.getBoundingClientRect();
            if (rect.top < 0) {
                tooltip.setAttribute("data-placement", "bottom");
            }
        });
    }
}