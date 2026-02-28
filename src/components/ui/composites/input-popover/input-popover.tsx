import { t } from "@core/i18n";
import { DefaultState } from "@core/components";
import { KeyboardKeys } from "@utils/keyboard";
import { EventTypes } from "@/utils/dom/index.ts";
import { Button, Input } from "@components/ui/primitives";
import { AnchoredOverlay } from "../anchored-overlay/anchored-overlay.ts";
import type { InputPopoverProps } from "./types.ts";

export abstract class InputPopover<P extends InputPopoverProps = InputPopoverProps, S = DefaultState> extends AnchoredOverlay<P, S> {

    private _input: HTMLInputElement | null = null;
    private _button: HTMLButtonElement | null = null;

    static override styles = this.extendStyles(/*css*/`
        .guten-input-popover {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
            padding: var(--space-md);
            width: 330px;
        }
    `);

    public get input(): HTMLInputElement {
        if (!this._input) throw new Error("InputPopover: input is not mounted yet.");
        return this._input;
    }

    public get button(): HTMLButtonElement {
        if (!this._button) throw new Error("InputPopover: button is not mounted yet.");
        return this._button;
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.setAttribute(
            "class",
            "guten-input-popover guten-modal--sheet-mobile card outline-none animate-overlay"
        );

        this.registerEvent(
            this.input,
            EventTypes.KeyDown,
            ((event: KeyboardEvent) => this.handleKeydown(event)) as EventListener
        );
    }

    override render(): HTMLElement {
        return (
            <>
                <Input
                    type={this.props.inputType}
                    placeholder={this.props.inputPlaceholder}
                    name={this.props.inputName}
                    size="md"
                    {...(this.props.inputProps)}
                    onEl={(el) => (this._input = el)}
                />

                {this.renderExtra?.()}

                <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => this.handleInsert()}
                    onEl={(el) => (this._button = el)}
                >
                    {this.props.buttonText ?? t("insert")}
                </Button>
            </>
        );
    }

    protected renderExtra?(): HTMLElement | null;

    abstract handleInsert(): void;

    private handleKeydown(event: KeyboardEvent) {
        if (event.key === KeyboardKeys.Enter) {
            event.preventDefault();
            this.handleInsert();
        }
    }
}
