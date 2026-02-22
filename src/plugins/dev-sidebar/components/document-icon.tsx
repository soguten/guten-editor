import { Component, DefaultProps } from "@core/components";

export class DocumentIcon extends Component<DefaultProps> {
    override render(): HTMLElement {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path d="M14 3v5a1 1 0 0 0 1 1h5" />
                <path d="M5 7a2 2 0 0 1 2 -2h7l6 6v8a2 2 0 0 1 -2 2h-11a2 2 0 0 1 -2 -2z" />
                <path d="M9 13h6" />
                <path d="M9 17h6" />
            </svg>
        );
    }
}