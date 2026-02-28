import { runCommand } from "@core/command";
import { InputPopover, InputPopoverProps, SelectionController } from "@components/ui/composites";
import { useContext } from "@core/context";
import { FormattingToolbarCtx } from "@plugins/formatting-toolbar";
import { EquationPlaceholder } from "./equation-placeholder.tsx";
import { EquationInline } from "./equation-inline.tsx";


export interface EquationPopoverProps extends InputPopoverProps {
    targetEquation?: HTMLElement | null;
    initialLatex?: string;
    initialDisplayMode?: boolean;
}

/**
 * UI popover for entering an equation (LaTeX) and inserting it via KaTeX.
 *
 * Behavior:
 * - On mount, consumes {@link FormattingToolbarCtx} to wire a SelectionController
 *   that locks/unlocks the user selection while the popover is open.
 * - Tracks a local `displayMode` (inline vs. block).
 * - On insert, closes the popover, unlocks selection, and runs the
 *   `insertEquation` command with `{ latex, displayMode }`.
 */
export class EquationPopover extends InputPopover<EquationPopoverProps> {

    /** Whether to render as display (block) math. */
    private displayMode = false;

    private targetEquation: HTMLElement | null = null;

    /** Inject a selection controller from the formatting toolbar context (if available). */
    override onMount(): void {
        const formattingToolbar = useContext(this, FormattingToolbarCtx);
        if (formattingToolbar) {
            const selectionCtrl: SelectionController = {
                lock: () => formattingToolbar.lock(),
                unlock: () => formattingToolbar.unlock(),
            };
            this.props.selectionController = selectionCtrl;
        }

        this.targetEquation = this.props.targetEquation ?? null;

        if (typeof this.props.initialDisplayMode === "boolean") {
            this.displayMode = this.props.initialDisplayMode;
        }

        if (typeof this.props.initialLatex === "string") {
            this.input.value = this.props.initialLatex;
        }

        if (!this.targetEquation) {
            this.targetEquation = this.findEquationFromSelection();
        }

        if (typeof this.props.initialDisplayMode !== "boolean") {
            const inferred = this.inferDisplayMode(this.targetEquation);
            if (typeof inferred === "boolean") {
                this.displayMode = inferred;
            }
        }

        const openingOnPlaceholder =
            !!this.targetEquation && this.targetEquation.matches(EquationPlaceholder.getTagName());

        if (this.input.value.trim() === "") {
            const latexFromTarget = this.extractLatexFromTarget(this.targetEquation);
            if (latexFromTarget) {
                this.input.value = latexFromTarget;
            } else if (!openingOnPlaceholder) {
                const text = this.getSelectionTextExcludingPlaceholder();
                if (text) this.input.value = text;
            }
        }

        requestAnimationFrame(() => {
            this.input.focus();
            this.input.setSelectionRange(this.input.value.length, this.input.value.length);
        });

    }

    override setPosition(rect: DOMRect): void {
        this.positionToAnchor(this.props.targetEquation!);
    }

    /** Checkbox handler: toggles display mode. */
    private handleToggle = (ev: Event) => {
        this.displayMode = (ev.target as HTMLInputElement)?.checked ?? false;
    };

    /**
    * Reads LaTeX from the input, unlocks selection, closes the popover,
    * and dispatches the `insertEquation` command with current options.
    */
    override handleInsert(): void {
        const latex = this.input.value.trim() ?? '';

        // Ensure selection is restored before inserting content.
        useContext(this, FormattingToolbarCtx)?.unlock?.();

        this.remove();

        requestAnimationFrame(() => {
            if (latex) {
                runCommand("insertEquation", {
                    content: {
                        latex: latex,
                        displayMode: this.displayMode,
                        targetEquation: this.targetEquation ?? undefined,
                    }
                });
            } else if (this.targetEquation) {
                this.targetEquation.remove();
            } else {
                const sel = globalThis.getSelection();
                if (sel && sel.rangeCount > 0) sel.getRangeAt(0).deleteContents();
            }
        });
    }

    private findEquationFromSelection(): HTMLElement | null {
        const nodes = this.collectCandidateNodes();

        for (const node of nodes) {
            const placeholder = this.closestFromNode(node, EquationPlaceholder.getTagName());
            if (placeholder) return placeholder;
        }

        for (const node of nodes) {
            const inline = this.closestFromNode(node, EquationInline.getTagName());
            if (inline) return inline;
        }

        const mathSelector = '[data-latex], .math-inline, .math-block, .katex, .katex-display';

        for (const node of nodes) {
            const mathLike = this.closestFromNode(node, mathSelector);
            if (mathLike) {
                const eqWrapper = mathLike.closest('[data-latex], .math-inline, .math-block') as HTMLElement | null;
                return eqWrapper ?? mathLike;
            }
        }

        const sel = globalThis.getSelection();
        const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
        if (range && range.startContainer instanceof Element) {
            const candidate = range.startContainer.childNodes.item(range.startOffset);
            if (candidate instanceof HTMLElement && candidate.matches(mathSelector)) {
                const eqWrapper = candidate.closest('[data-latex], .math-inline, .math-block') as HTMLElement | null;
                return eqWrapper ?? candidate;
            }
        }

        return null;
    }

    private collectCandidateNodes(): Node[] {
        const sel = globalThis.getSelection();
        if (!sel) return [];

        const nodes: Node[] = [];
        const push = (node: Node | null | undefined) => {
            if (node && !nodes.includes(node)) nodes.push(node);
        };

        push(sel.anchorNode);
        push(sel.focusNode);

        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            push(range.startContainer);
            push(range.endContainer);
        }

        return nodes;
    }

    private closestFromNode(node: Node, selector: string): HTMLElement | null {
        const el = node instanceof Element ? node : node.parentElement;
        return el?.closest(selector) as HTMLElement | null;
    }

    private extractLatexFromTarget(target: HTMLElement | null): string {
        if (!target) return '';

        if (target.matches(EquationPlaceholder.getTagName())) {
            return '';
        }

        if (target.matches(EquationInline.getTagName())) {
            return target.getAttribute('data-latex')?.trim() ?? '';
        }

        const latexAttr = target.getAttribute('data-latex')?.trim();
        if (latexAttr) return latexAttr;

        const ann = target.querySelector('annotation[encoding="application/x-tex"]') as HTMLElement | null;
        return ann?.textContent?.trim() ?? '';
    }

    private inferDisplayMode(target: HTMLElement | null): boolean | undefined {
        if (!target) return undefined;

        if (target.matches(EquationPlaceholder.getTagName())) {
            const placeholderMode = target.getAttribute('data-display-mode') ?? target.dataset.displayMode;
            if (placeholderMode === 'block') return true;
            if (placeholderMode === 'inline') return false;
            return false;
        }

        if (target.matches(EquationInline.getTagName())) {
            const inlineMode = target.getAttribute('data-display-mode') ?? target.dataset.displayMode;
            if (inlineMode === 'block') return true;
            if (inlineMode === 'inline') return false;
        }

        if (target.classList.contains('math-block') || target.classList.contains('katex-display')) {
            return true;
        }

        if (target.classList.contains('math-inline')) {
            return false;
        }

        return undefined;
    }

    private getSelectionTextExcludingPlaceholder(): string {
        const sel = globalThis.getSelection();
        if (!sel || sel.rangeCount === 0) return '';

        if (this.findPlaceholderFromSelection()) {
            return '';
        }

        return sel.toString();
    }

    private findPlaceholderFromSelection(): HTMLElement | null {
        const nodes = this.collectCandidateNodes();
        for (const node of nodes) {
            const placeholder = this.closestFromNode(node, EquationPlaceholder.getTagName());
            if (placeholder) return placeholder;
        }
        return null;
    }
}