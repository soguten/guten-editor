import { runCommand } from "@core/command";
import { useContext } from "@core/context";
import { InputPopover, SelectionController } from "@components/ui/composites";
import { OverlayCtor } from "@components/editor/overlay";
import { FormattingToolbar, FormattingToolbarCtx } from "@plugins/formatting-toolbar";

/**
 * UI popover for inserting hyperlinks.
 *
 * Behavior:
 * - On mount, wires a SelectionController from {@link FormattingToolbarCtx}
 *   to lock/unlock the selection while the popover is open.
 * - On insert, restores the selection, closes itself, and runs `createLink`
 *   with the provided `href` via the command content payload.
 */
export class LinkPopover extends InputPopover {

    override canOverlayClasses: ReadonlySet<OverlayCtor> = new Set<OverlayCtor>([FormattingToolbar]);

    private existingAnchor: HTMLAnchorElement | null = null;

    /** Inject selection lock/unlock from the formatting toolbar (if available). */
    override onMount(): void {

        const formattingToolbar = useContext(this, FormattingToolbarCtx);

        if (formattingToolbar) {

            const selectionCtrl: SelectionController = {
                lock: () => formattingToolbar.lock(),
                unlock: () => formattingToolbar.unlock(),
            };

            this.props.selectionController = selectionCtrl;

            const rect = formattingToolbar.getSelectionRect?.();
            if (rect) {
                this.setPosition(rect);
            }
        }

        const selection = globalThis.getSelection();
        if (selection?.anchorNode) {
            const anchor = (selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode.parentElement)?.closest("a") as HTMLAnchorElement | null;
            if (anchor) {
                this.existingAnchor = anchor;
                this.input.value = anchor.getAttribute("href") ?? "";
            }
        }

        requestAnimationFrame(() => {
            this.input.focus();
            // move caret to the end
            this.input.setSelectionRange(this.input.value.length, this.input.value.length);
        });
    }

    /** Reads the `href` and issues the `createLink` command with `content: { href }`. */
    handleInsert(): void {
        const href = this.input.value.trim() ?? '';

        // Restore selection before applying the link.
        useContext(this, FormattingToolbarCtx)?.unlock?.();

        this.remove();

        requestAnimationFrame(() => {
            if (href) {
                runCommand('createLink', { content: { href } });
            } else if (this.existingAnchor) {
                runCommand('removeLink');
            }
        });
    }
}