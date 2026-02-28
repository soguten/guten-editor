
import { t } from "@core/i18n";
import { runCommand  } from "@core/command";
import { InputPopover, InputPopoverProps } from "@components/ui/composites";
import { parseYouTubeUrl } from "../utils/parse-youtube-url.ts";

export interface YouTubePopoverProps extends InputPopoverProps {
    target?: HTMLElement | null;
    initialValue?: string;
}

export class YouTubePopover extends InputPopover<YouTubePopoverProps> {

    private target: HTMLElement | null = null;

    override onMount(): void {
        this.target = this.props.target ?? null;

        const initialValue = this.props.initialValue ?? this.target?.dataset?.youtubeSource ?? "";
        if (initialValue) {
            this.input.value = initialValue;
        }

        requestAnimationFrame(() => {
            this.input.focus();
            const length = this.input.value.length;
            this.input.setSelectionRange(length, length);
        });
    }

    override handleInsert(): void {
        const value = this.input.value.trim();
        const parsed = parseYouTubeUrl(value);

        if (!parsed) {
            this.input.setCustomValidity(t("invalid_youtube_url"));
            this.input.reportValidity();
            return;
        }

        this.input.setCustomValidity("");

        const target = this.target;
        this.remove();

        requestAnimationFrame(() => {
            runCommand("insertYouTubeEmbed", {
                content: {
                    target,
                    sourceUrl: value,
                    embedUrl: parsed.embedUrl,
                    kind: parsed.kind,
                },
            });
        });
    }
}