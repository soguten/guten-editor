import { EventTypes } from "../../constants/event-types.ts";
import { KeyboardKeys } from "../../constants/keyboard-keys.ts";
import { CloseableOverlay } from "./types.ts";

/**
 * Manages a stack of overlays (e.g. modals, dialogs) and provides functionality
 * to close and remove them, including handling key events (e.g. Escape) and
 * mouse clicks outside the overlay to close it.
 */
export class OverlayStack {

    private stack: HTMLElement[] = [];

    /**
     * Registers event listeners for keydown (to close with Escape key) and click
     * (to close on outside click) events.
     */
    constructor() {
        document.addEventListener(EventTypes.KeyDown, (event) => this.handleKey(event));
        document.addEventListener(EventTypes.Click, (event) => this.handleClick(event), true);
    }

    /**
     * Pushes a new overlay element onto the stack.
     * @param element The overlay element to add to the stack.
     */
    public push(element: HTMLElement) {
        this.stack.push(element);
    }

    /**
     * Returns the topmost overlay element in the stack without removing it.
     * @returns The topmost overlay element or undefined if the stack is empty.
     */
    public peek(): HTMLElement | undefined {
        return this.stack[this.stack.length - 1];
    }

    /**
     * Pops and removes the topmost overlay element from the stack.
     */
    public pop() {
        const element = this.stack.pop();

        if (element) {
            element.remove();
        }
    }

    /**
     * Removes a specific overlay element from the stack and removes it from the DOM.
     * @param element The overlay element to remove.
     */
    public remove(element: HTMLElement) {
        const idx = this.stack.lastIndexOf(element);
        if (idx !== -1) {
            this.stack.splice(idx, 1);
            element.remove();
        }
    }

    /**
    * Handles keydown events to close the overlay when the Escape key is pressed.
    * @param event The keydown event.
    */
    private readonly handleKey = (event: KeyboardEvent) => {
        if (event.key === KeyboardKeys.Escape) {
            this.pop();
        }
    };

    /**
     * Handles click events to remove the overlay if the click occurred outside of it.
     * @param event The mouse click event.
     */
    private readonly handleClick = (event: MouseEvent) => {
        const top = this.peek();
        if (!top) return;

        const clickedInside = top.contains(event.target as Node);
        if (!clickedInside && this.canCloseOnClickOutside(top)) {
            this.remove(top);
        }
    };

    /**
     * Determines if an overlay can be closed by clicking outside.
     * @param element The overlay element to check.
     * @returns True if the overlay can be closed on outside click, false otherwise.
     */
    private canCloseOnClickOutside(element: HTMLElement): boolean {
        return (element as CloseableOverlay).closeOnClickOutside === true;
    }
}