import { EventTypes } from "@utils/dom";
import { KeyboardKeys } from "@utils/keyboard";
import { EmojiClapIcon, EmojiHeartIcon, EmojiSmileyIcon } from "@components/ui/icons";
import { AnchoredOverlay } from "@components/ui/composites/anchored-overlay/anchored-overlay.ts";
import { AnchoredOverlayProps } from "@components/ui/composites";

interface EmojiPickerOverlayProps extends AnchoredOverlayProps {
    range: Range;
    placeholder?: HTMLElement;
}

type Category = {
    id: string;
    icon: SVGElement;
    emojis: string[];
};

interface EmojiPickerOverlayState {
    selectedIndex: number;
    selectedCategory: string;
    columns: number;
    categories: Category[];
}

export class EmojiPicker extends AnchoredOverlay<EmojiPickerOverlayProps, EmojiPickerOverlayState> {
    static override get tagName() {
        return "guten-emoji-picker";
    }

    static override styles = this.extendStyles(/*css*/`
        guten-emoji-picker {
            opacity: 0;
        }
        .emoji-wrap {
            min-width: 220px;
            width: 260px;
            padding: 8px;
        }
       
        .emoji-picker {
            display: grid;
            grid-template-columns: repeat(var(--columns, 6), 1fr);
            gap: 4px;
            padding: 0;
            margin: 0;
            list-style: none;
        }

        .emoji-picker li { display: block; }
        .emoji-picker button {
            all: unset;
            font-size: 1.2rem;
            padding: 6px 8px;
            text-align: center;
            line-height: 1;
            border-radius: var(--radius-sm);
            cursor: pointer;
        }

        .emoji-picker button:hover {
            background: var(--color-surface-muted);
        }

        .emoji-picker button.selected {
            background: var(--color-surface-muted);
            color: var(--color-selection-text);
        }

        .emoji-categories {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            padding-top: 8px;
            margin-top: 8px;
            border-top: 1px solid var(--color-border);
        }
        .emoji-categories button {
            all: unset;
            padding: 6px 10px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--color-ui-text);
        }

        .emoji-categories button.active {
            background: var(--color-surface-muted);
            color: var(--color-selection-text);
            font-weight: 600;
            color: var(--color-ui-text);
        }

        .emoji-categories button:hover {
            background: var(--color-surface-muted);            
        }

        .emoji-categories button svg {
            width: var(--font-size-xl);
            height: var(--font-size-xl);
            color: currentColor;
            display: block;
        }
    `);

    override zIndex: number = 1100;

    constructor() {
        super();

        const categories: Category[] = [
            { id: "Smiley faces", icon: <EmojiSmileyIcon />, emojis: ["😀", "😅", "😂", "😍", "🤔", "🥳", "😭", "😡", "😎", "😇"] },
            { id: "Gestures", icon: <EmojiClapIcon />, emojis: ["👍", "👎", "🖖", "🙏", "👌", "🤞", "✌️", "🫶", "🤏", "🫰"] },
            { id: "Symbols", icon: <EmojiHeartIcon />, emojis: ["🔥", "❤️", "🎉", "🚀", "💯", "☢️", "🕧", "🆗", "✅", "⛔"] },
        ];

        this.state = {
            selectedIndex: 0,
            selectedCategory: categories[0].id,
            columns: 5,
            categories,
        };
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.classList.add("card");
    }

    override onMount(): void {
        this.registerEvent(document, EventTypes.KeyDown, this.handleKey as EventListener);
        this.style.setProperty("--columns", String(this.state.columns));
    }

    protected override applyAnchoringDefaults(): void {
        if (!this.props.placement) this.props.placement = "bottom-start";
        if (this.props.offset === undefined) this.props.offset = 8;
    }

    protected override captureAnchor(): void {
        if (this.props.placeholder?.isConnected) {
            this.props.anchor = this.props.placeholder;
            this.props.anchorRect = null;
        } else {
            this.props.anchor = null;
            this.props.anchorRect = this.props.range.getBoundingClientRect();
        }

        super.captureAnchor();
    }

    private get visibleEmojis(): string[] {
        const cat = this.state.categories.find(c => c.id === this.state.selectedCategory);
        return cat ? cat.emojis : [];
    }

    private setSelectedIndex(next: number) {
        const last = this.visibleEmojis.length - 1;
        const clamped = Math.max(0, Math.min(last, next));
        this.setState({ selectedIndex: clamped });
        queueMicrotask(() => this.scrollSelectedIntoView());
    }

    private scrollSelectedIntoView() {
        const list = this.shadowRoot?.querySelector<HTMLUListElement>("ul.emoji-picker");
        if (!list) return;
        const btns = list.querySelectorAll<HTMLButtonElement>("button");
        const btn = btns[this.state.selectedIndex];
        btn?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    private readonly handleKey = (event: KeyboardEvent) => {
        const stop = () => { event.preventDefault(); event.stopPropagation(); };
        switch (event.key) {
            case KeyboardKeys.ArrowRight: stop(); this.setSelectedIndex(this.state.selectedIndex + 1); break;
            case KeyboardKeys.ArrowLeft: stop(); this.setSelectedIndex(this.state.selectedIndex - 1); break;
            case KeyboardKeys.ArrowDown: stop(); this.setSelectedIndex(this.state.selectedIndex + this.state.columns); break;
            case KeyboardKeys.ArrowUp: stop(); this.setSelectedIndex(this.state.selectedIndex - this.state.columns); break;
            case KeyboardKeys.Enter: {
                stop();
                const emoji = this.visibleEmojis[this.state.selectedIndex];
                if (emoji) this.selectEmoji(emoji);
                break;
            }
            case KeyboardKeys.Escape: stop(); this.remove(); break;
        }
    };

    private selectCategory = (event: MouseEvent, catId: string) => {
        event.stopPropagation();
        if (catId === this.state.selectedCategory) return;
        this.setState({ selectedCategory: catId, selectedIndex: 0 });
        queueMicrotask(() => this.scrollSelectedIntoView());
    };

    selectEmoji(emoji: string) {
        const { placeholder, range } = this.props;

        if (placeholder && placeholder.parentNode) {
            const parent = placeholder.parentNode;
            const emojiNode = document.createTextNode(emoji);

            parent.replaceChild(emojiNode, placeholder);

            const maybeZwsp = emojiNode.nextSibling;
            if (maybeZwsp && maybeZwsp.nodeType === Node.TEXT_NODE) {
                const t = maybeZwsp as Text;
                if (t.data.startsWith("\u200B")) {
                    if (t.data.length === 1) parent.removeChild(t);
                    else t.deleteData(0, 1);
                }
            }

            const sel = globalThis.getSelection();
            if (sel) {
                const after = document.createRange();
                after.setStart(emojiNode, emojiNode.data.length);
                after.collapse(true);
                sel.removeAllRanges();
                sel.addRange(after);
            }

            this.remove();
            return;
        }

        if (range) {
            insertIntoRangeAtCaret(emoji, range);
        }

        this.remove();
    }

    render() {
        const emojis = this.visibleEmojis;
        const cats = this.state.categories;

        return (
            <>
                <div class="emoji-wrap">
                    <ul part="emoji-menu" class="emoji-picker" role="listbox" aria-activedescendant={`emoji-${this.state.selectedIndex}`}>
                        {emojis.map((emoji, index) => (
                            <li part="emoji-item" key={`${emoji}-${index}`}>
                                <button
                                    id={`emoji-${index}`}
                                    type="button"
                                    class={index === this.state.selectedIndex ? "selected" : ""}
                                    onClick={() => this.selectEmoji(emoji)}
                                    tabindex={-1}
                                    aria-selected={index === this.state.selectedIndex}
                                    title={emoji}
                                >
                                    {emoji}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div class="emoji-categories" part="emoji-categories">
                        {cats.map(cat => (
                            <button
                                type="button"
                                class={cat.id === this.state.selectedCategory ? "active" : ""}
                                onClick={(event: MouseEvent) => this.selectCategory(event, cat.id)}
                                title={cat.id}
                                aria-label={cat.id}
                            >
                                {cat.icon}
                            </button>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

function insertIntoRangeAtCaret(content: string, r: Range) {
    const node = document.createTextNode(content);

    r.deleteContents();
    r.insertNode(node);

    const sel = globalThis.getSelection();
    if (sel) {
        const after = document.createRange();
        after.setStartAfter(node);
        after.collapse(true);
        sel.removeAllRanges();
        sel.addRange(after);
    }
}