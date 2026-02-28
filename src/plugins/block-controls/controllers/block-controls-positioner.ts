export class BlockControlsPositioner {

    updatePosition(currentTarget: HTMLElement | null, dragControl: HTMLButtonElement | null, controlsWrap: HTMLElement | null): void {
        if (!currentTarget || !dragControl || !controlsWrap) return;

        const textRect = this.getFirstLineRect(currentTarget);
        const blockRect = currentTarget.getBoundingClientRect();
        const rect = textRect ?? blockRect;
        const top = rect.top + rect.height / 2 - dragControl.offsetHeight / 2;
        const controlsWidth = controlsWrap.offsetWidth;
        
        const gutter = 8;
        const left = Math.max(gutter, blockRect.left - controlsWidth - gutter);

        controlsWrap.style.top = `${top}px`;
        controlsWrap.style.left = `${left}px`;
    }

    private getFirstLineRect(el: HTMLElement): DOMRect | null {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const node = walker.nextNode();
        if (!node || !node.textContent) return null;

        const range = document.createRange();
        range.setStart(node, 0);
        range.setEnd(node, Math.min(1, node.textContent.length));
        const rect = range.getBoundingClientRect();
        range.detach?.();

        return rect.height ? rect : null;
    }
}