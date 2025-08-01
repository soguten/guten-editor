export class PlaceholderObserver {
    private observer: MutationObserver | null = null;

    constructor(private target: HTMLElement) { }

    public start() {
        this.stop();

        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList" || mutation.type === "characterData") {
                    this.updateEmptyClass();
                }
            });
        });

        this.observer.observe(this.target, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    public stop() {
        this.observer?.disconnect();
        this.observer = null;
    }

    private updateEmptyClass() {
        document.querySelectorAll<HTMLElement>('.placeholder').forEach((element) => {
            if (element.innerHTML.trim() === "<br>" || element.innerHTML.trim() === "") {
                element.classList.add('empty');
            } else {
                element.classList.remove('empty');
            }
        });
    }
}
