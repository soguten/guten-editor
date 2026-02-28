import { t } from "@core/i18n";
import { runCommand } from "@core/command";
import { DefaultProps, DefaultState } from "@core/components";
import { ImagePlugin, type ImageUploadResult } from "../extensions/image-plugin.ts";
import { saveLocalImage } from "@utils/media";
import { AnchoredOverlayProps } from "@components/ui/composites/index.ts";
import { AnchoredOverlay } from "@components/ui/composites/anchored-overlay/anchored-overlay.ts";

export interface ImageMenuProps extends DefaultProps, AnchoredOverlayProps {
    target?: HTMLElement | null;
    anchorRect?: DOMRectInit;
    initialUrl?: string;
    initialTab?: "upload" | "embed";
}


interface ImageMenuState extends DefaultState {
    activeTab: "upload" | "embed";
    isUploading: boolean;
    error: string | null;
    embedUrl: string;
}

export class ImageMenu extends AnchoredOverlay<ImageMenuProps, ImageMenuState> {

    override state: ImageMenuState = {
        activeTab: "upload",
        isUploading: false,
        error: null,
        embedUrl: "",
    };

    private target: HTMLElement | null = null;
    private urlInput: HTMLInputElement | null = null;
    private fileInput: HTMLInputElement | null = null;
    private uploadButton: HTMLButtonElement | null = null;

    private readonly reservedDatasetKeys = new Set(["imageSource", "imageAlt", "imagePlaceholder", "imageEmbed"]);

    static override styles = this.extendStyles(/*css*/`
        .image-menu {
            width: 340px;
            display: flex;
            flex-direction: column;
            background: var(--color-surface);
            border-radius: var(--radius-md);
            overflow: hidden;
        }

        .image-menu__tabs {
            display: flex;
            border-bottom: 1px solid var(--color-border);
        }

        .image-menu__tab {
            flex: 1;
            border: none;
            background: transparent;
            padding: var(--space-sm) var(--space-md);
            font-weight: 600;
            font-size: var(--font-size-xs);
            cursor: pointer;
            color: var(--color-muted);
            border-bottom: 2px solid transparent;
        }

        .image-menu__tab--active {
            color: var(--color-primary);
            border-color: var(--color-primary);
        }

        .image-menu__content {
            padding: var(--space-md);
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
        }

        .image-menu__upload-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-sm);
            border-radius: var(--radius-sm);
            border: 1px solid var(--color-primary);
            background: var(--color-primary);
            cursor: pointer;
            transition: background 0.2s ease;
            font-weight: 500;
            color: var(--color-light);
        }

        .image-menu__upload-button[disabled] {
            opacity: 0.6;
            cursor: default;
        }

        .image-menu__file-input {
            display: none;
        }

        .image-menu__help {
            font-size: var(--font-size-xxs);
            color: var(--color-muted);
            margin: 0;
        }

        .image-menu__input {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            padding: var(--space-sm);
            font-size: var(--font-size-sm);
            background-color: var(--color-surface-muted);
            color: var(--color-text);
        }

        .image-menu__actions {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
        }

        .image-menu__primary-button {
            background: var(--color-primary);
            color: var(--color-light);
            border: none;
            border-radius: var(--radius-sm);
            padding: var(--space-sm);
            cursor: pointer;
            width: 100%;
            margin: 0 auto;
        }

        .image-menu__primary-button[disabled] {
            opacity: 0.6;
            cursor: default;
        }

        .image-menu__error {
            font-size: var(--font-size-xxs);
            color: var(--color-danger, #c92a2a);
            margin: 0;
        }
    `);

    override connectedCallback(): void {
        const initialTab = this.props.initialTab ?? (this.props.initialUrl ? "embed" : "upload");
        const initialUrl = this.props.initialUrl ?? "";
        this.state = { ...this.state, activeTab: initialTab, embedUrl: initialUrl };
        super.connectedCallback();
        this.classList.add("card", "image-menu");
        this.closeOnClickOutside = true;
    }

    override onMount(): void {
        this.target = this.props.target ?? null;

        if (this.state.activeTab === "embed" && this.urlInput) {
            requestAnimationFrame(() => {
                this.urlInput?.focus();
                const length = this.urlInput?.value.length ?? 0;
                this.urlInput?.setSelectionRange(length, length);
            });
        }
    }

    override afterRender(): void {
        super.afterRender();
        if (this.state.activeTab === "embed" && this.urlInput) {
            const input = this.urlInput;
            if (document.activeElement !== input) {
                input.focus();
                const length = input.value.length;
                input.setSelectionRange(length, length);
            }
        }

        if (this.uploadButton) {
            this.uploadButton.focus();
        }
    }

    protected override applyAnchoringDefaults(): void {
        const targetAnchor = this.props.target ?? null;
        if (targetAnchor) {
            this.props.anchor = targetAnchor;
            this.props.anchorRect = undefined;
        } else if (this.props.anchorRect) {
            const rect = this.props.anchorRect;
            this.props.anchorRect = {
                x: rect.x ?? 0,
                y: rect.y ?? 0,
                width: rect.width ?? 0,
                height: rect.height ?? 0,
            };
        }

        this.props.placement ??= "bottom";
        this.props.align ??= "center";
        this.props.offset ??= 10;
        this.props.detachedAnchorBehavior ??= "track";
        this.props.collision = {
            flip: this.props.collision?.flip ?? false,
            shift: this.props.collision?.shift ?? true,
            padding: this.props.collision?.padding ?? 12,
            boundary: this.props.collision?.boundary,
        };
    }

    override render(): HTMLElement {
        return (
            <div class="image-menu guten-modal--sheet-mobile-w100 outline-none">
                <div class="image-menu__tabs " role="tablist">
                    {this.renderTabButton("upload", t("image_tab_upload"))}
                    {this.renderTabButton("embed", t("image_tab_embed"))}
                </div>
                <div class="image-menu__content">
                    {this.state.activeTab === "upload" ? this.renderUploadTab() : this.renderEmbedTab()}
                    {this.state.error ? <p class="image-menu__error">{this.state.error}</p> : null}
                </div>
            </div>
        );
    }

    private renderTabButton(tab: "upload" | "embed", label: string): HTMLElement {
        const isActive = this.state.activeTab === tab;
        return (
            <button
                type="button"
                class={`image-menu__tab ${isActive ? "image-menu__tab--active" : ""}`}
                role="tab"
                aria-selected={isActive ? "true" : "false"}
                onClick={(event: MouseEvent) => this.switchTab(tab, event)}
            >
                {label}
            </button>
        );
    }

    private renderUploadTab(): HTMLElement {
        const isDisabled = this.state.isUploading;

        return (
            <div class="image-menu__actions">
                <input
                    ref={(el: HTMLInputElement | null) => { this.fileInput = el; }}
                    class="image-menu__file-input"
                    type="file"
                    accept="image/*"
                    onChange={(event: Event) => this.handleFileChange(event)}
                />
                <button
                    ref={(el: HTMLButtonElement | null) => { this.uploadButton = el; }}
                    type="button"
                    class="image-menu__upload-button"
                    onClick={() => this.openFilePicker()}
                    {...(isDisabled ? { disabled: "" } : {})}
                >
                    {this.state.isUploading ? t("image_uploading") : t("image_upload_button")}
                </button>
                <p class="image-menu__help">{t("image_upload_description")}</p>
            </div>
        );
    }

    private renderEmbedTab(): HTMLElement {
        const isDisabled = !this.canSubmitEmbed();

        return (
            <div class="image-menu__actions">
                <input
                    ref={(el: HTMLInputElement | null) => { this.urlInput = el; }}
                    class="image-menu__input"
                    type="url"
                    placeholder={t("image_url_placeholder")}
                    value={this.state.embedUrl}
                    onInput={(event: Event) => this.handleEmbedInput(event)}
                    required
                />
                <button
                    type="button"
                    class="image-menu__primary-button"
                    onClick={() => this.handleEmbedInsert()}
                    {...(isDisabled ? { disabled: "" } : {})}
                >
                    {t("insert")}
                </button>
            </div>
        );
    }

    private switchTab(tab: "upload" | "embed", event?: MouseEvent): void {
        event?.preventDefault();
        event?.stopPropagation();
        if (this.state.activeTab === tab) return;
        this.setState({ activeTab: tab, error: null } as Partial<ImageMenuState>);
    }

    private openFilePicker(): void {
        const input = this.fileInput;
        if (!input) return;

        try {
            const withPicker = input as HTMLInputElement & { showPicker?: () => void };
            if (typeof withPicker.showPicker === "function") {
                withPicker.showPicker();
                return;
            }
        } catch {
            // Fallback to classic click() below.
        }

        input.click();
    }

    private handleFileChange(event: Event): void {
        const input = event.target as HTMLInputElement | null;
        const file = input?.files?.[0] ?? null;
        if (!file) return;

        void this.uploadFile(file);
        if (input) input.value = "";
    }

    private async uploadFile(file: File): Promise<void> {
        this.setState({ isUploading: true, error: null } as Partial<ImageMenuState>);
        try {
            const handler = ImagePlugin.getOptions().upload;
            const result = await (handler ? handler(file) : this.saveFileAsLocalReference(file));
            const payload = this.normalizeUploadResult(result, file);

            if (!payload.url) {
                throw new Error(t("image_upload_error"));
            }

            this.insertImage(payload);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.setState({ error: message || t("image_upload_error") } as Partial<ImageMenuState>);
        } finally {
            this.setState({ isUploading: false } as Partial<ImageMenuState>);
        }
    }

    private async saveFileAsLocalReference(file: File): Promise<ImageUploadResult> {
        const url = await saveLocalImage(file);
        return {
            url,
            alt: file.name,
        };
    }

    private normalizeUploadResult(result: ImageUploadResult | string, file: File): ImageUploadResult {
        if (typeof result === "string") {
            return { url: result, alt: file.name };
        }

        return {
            url: result.url,
            alt: result.alt ?? file.name,
            dataset: result.dataset,
        };
    }

    private handleEmbedInsert(): void {
        const value = this.getEmbedUrl();

        if (!value) {
            this.urlInput?.setCustomValidity(t("image_url_required"));
            this.urlInput?.reportValidity();
            return;
        }

        if (!this.isValidUrl(value)) {
            this.urlInput?.setCustomValidity(t("invalid_image_url"));
            this.urlInput?.reportValidity();
            return;
        }

        this.clearError();
        this.insertImage({ url: value, alt: this.getTargetAlt() });
    }

    private isValidUrl(value: string): boolean {
        if (value.startsWith("data:") || value.startsWith("guten-image://")) return true;
        try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "data:";
        } catch {
            return false;
        }
    }

    private insertImage(result: ImageUploadResult): void {
        const target = this.target;
        const dataset = this.mergeDataset(result.dataset);
        const alt = result.alt ?? this.getTargetAlt();
        this.remove();

        requestAnimationFrame(() => {
            runCommand("insertImage", {
                content: {
                    target: target ?? undefined,
                    sourceUrl: result.url,
                    alt,
                    dataset,
                },
            });
        });
    }

    private clearError(): void {
        this.urlInput?.setCustomValidity("");
        if (!this.state.error) return;
        this.setState({ error: null } as Partial<ImageMenuState>);
    }

    private handleEmbedInput(event: Event): void {
        const input = event.target as HTMLInputElement | null;
        const value = input?.value ?? "";
        if (value === this.state.embedUrl) {
            this.clearError();
            return;
        }

        this.clearError();
        this.setState({ embedUrl: value } as Partial<ImageMenuState>);
    }

    private getEmbedUrl(): string {
        return this.state.embedUrl.trim();
    }

    private canSubmitEmbed(): boolean {
        if (this.state.isUploading) return false;
        const value = this.getEmbedUrl();
        if (!value) return false;
        return this.isValidUrl(value);
    }

    private getTargetAlt(): string | undefined {
        const alt = this.target?.dataset?.imageAlt;
        return alt && alt.length > 0 ? alt : undefined;
    }

    private mergeDataset(resultDataset?: Record<string, string>): Record<string, string> | undefined {
        const merged: Record<string, string> = {};

        const baseDataset = this.getTargetDataset();
        if (baseDataset) {
            Object.assign(merged, baseDataset);
        }

        if (resultDataset) {
            for (const [key, value] of Object.entries(resultDataset)) {
                if (value == null) continue;
                merged[key] = value;
            }
        }

        return this.sanitizeDataset(merged);
    }

    private getTargetDataset(): Record<string, string> | undefined {
        if (!this.target) return undefined;
        const entries = Object.entries(this.target.dataset)
            .filter(([key]) => !this.reservedDatasetKeys.has(key));

        if (!entries.length) return undefined;

        const dataset: Record<string, string> = {};
        for (const [key, value] of entries) {
            if (value != null) dataset[key] = value;
        }

        return Object.keys(dataset).length ? dataset : undefined;
    }

    private sanitizeDataset(dataset?: Record<string, string>): Record<string, string> | undefined {
        if (!dataset) return undefined;
        const sanitized: Record<string, string> = {};
        for (const [key, value] of Object.entries(dataset)) {
            if (this.reservedDatasetKeys.has(key)) continue;
            if (!value) continue;
            sanitized[key] = value;
        }
        return Object.keys(sanitized).length ? sanitized : undefined;
    }
}