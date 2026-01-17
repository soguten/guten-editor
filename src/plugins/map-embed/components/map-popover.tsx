/** @jsx h */

import { DefaultProps, OverlayComponent, h, runCommand, t } from "../../index.ts";

export interface MapPopoverProps extends DefaultProps {
    target?: HTMLElement | null;
    anchorRect?: DOMRectInit;
    initialLat?: number;
    initialLng?: number;
    initialZoom?: number;
    initialLabel?: string;
}

export class MapPopover extends OverlayComponent<MapPopoverProps> {

    private target: HTMLElement | null = null;
    private anchorRect: DOMRect | null = null;
    private latInput: HTMLInputElement | null = null;
    private lngInput: HTMLInputElement | null = null;
    private zoomInput: HTMLInputElement | null = null;
    private labelInput: HTMLInputElement | null = null;
    private mapContainer: HTMLDivElement | null = null;
    private mapInstance: any | null = null;
    private marker: any | null = null;

    static override styles = this.extendStyles(/*css*/`
        .map-popover {
            width: 360px;
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
            padding: var(--space-md);
            background: var(--color-surface);
            border-radius: var(--radius-md);
        }

        .map-popover__field {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs);
        }

        .map-popover__label {
            font-size: var(--font-size-xs);
            color: var(--color-muted);
        }

        .map-popover__input {
            width: 100%;
            box-sizing: border-box;
            border-radius: var(--radius-sm);
            padding: var(--space-sm);
            border: 1px solid var(--color-border);
            background-color: var(--color-surface-muted);
            color: var(--color-text);
        }

        .map-popover__map {
            width: 100%;
            height: 220px;
            border-radius: var(--radius-sm);
            overflow: hidden;
            border: 1px solid var(--color-border);
        }

        .map-popover__actions {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
        }

        .map-popover__primary-button {
            background: var(--button-primary-bg);
            border-radius: var(--button-radius);
            border: var(--button-primary-border);
            color: var(--button-primary-color);
            padding: var(--space-sm);
            font-family: var(--button-font-family);
            font-weight: var(--button-font-weight);
            font-size: var(--button-font-size);
            box-shadow: var(--button-primary-shadow);
            cursor: pointer;
        }

        .map-popover__primary-button:hover {
            background-color: var(--button-primary-bg-hover);
        }

        .map-popover__primary-button:active {
            background-color: var(--button-primary-bg-active, var(--button-primary-bg-hover));
        }

        .map-popover__hint {
            font-size: var(--font-size-xxs);
            color: var(--color-muted);
            margin: 0;
        }
    `);

    override connectedCallback(): void {
        super.connectedCallback();
        this.classList.add("map-popover", "card", "guten-modal--sheet-mobile");
    }

    override onMount(): void {
        this.target = this.props.target ?? null;

        const rect = this.props.anchorRect
            ? this.toDOMRect(this.props.anchorRect)
            : this.target?.getBoundingClientRect?.() ?? null;

        if (rect) {
            this.anchorRect = rect;
            this.positionToAnchor(rect);
            this.ensureWithinViewport(rect);
        }

        this.ensureCenteredIfOverflowing();

        const { lat, lng, zoom, label } = this.readInitialValues();

        if (this.latInput) this.latInput.value = `${lat}`;
        if (this.lngInput) this.lngInput.value = `${lng}`;
        if (this.zoomInput) this.zoomInput.value = `${zoom}`;
        if (this.labelInput && label) this.labelInput.value = label;

        requestAnimationFrame(() => {
            if (this.latInput) this.latInput.focus();
            this.initializeLeafletMap(lat, lng, zoom);
        });
    }

    override afterRender(): void {
        super.afterRender();
        if (this.anchorRect) {
            this.positionToAnchor(this.anchorRect);
            this.ensureWithinViewport(this.anchorRect);
        }
    }

    override render(): HTMLElement {
        return (
            <div class="map-popover__content guten-modal--sheet-mobile-w100 outline-none">
                <div class="map-popover__field">
                    <label class="map-popover__label" for="map-lat-input">{t("map_latitude")}</label>
                    <input
                        id="map-lat-input"
                        class="map-popover__input"
                        type="number"
                        step="0.000001"
                        min="-90"
                        max="90"
                        ref={(el: HTMLInputElement | null) => { this.latInput = el; }}
                        onInput={() => this.updateMapFromInputs()}
                    />
                </div>
                <div class="map-popover__field">
                    <label class="map-popover__label" for="map-lng-input">{t("map_longitude")}</label>
                    <input
                        id="map-lng-input"
                        class="map-popover__input"
                        type="number"
                        step="0.000001"
                        min="-180"
                        max="180"
                        ref={(el: HTMLInputElement | null) => { this.lngInput = el; }}
                        onInput={() => this.updateMapFromInputs()}
                    />
                </div>
                <div class="map-popover__field">
                    <label class="map-popover__label" for="map-zoom-input">{t("map_zoom")}</label>
                    <input
                        id="map-zoom-input"
                        class="map-popover__input"
                        type="number"
                        step="1"
                        min="1"
                        max="20"
                        ref={(el: HTMLInputElement | null) => { this.zoomInput = el; }}
                        onInput={() => this.updateMapFromInputs()}
                    />
                </div>
                <div class="map-popover__field">
                    <label class="map-popover__label" for="map-label-input">{t("map_label")}</label>
                    <input
                        id="map-label-input"
                        class="map-popover__input"
                        type="text"
                        ref={(el: HTMLInputElement | null) => { this.labelInput = el; }}
                    />
                </div>
                <div
                    class="map-popover__map"
                    ref={(el: HTMLDivElement | null) => { this.mapContainer = el; }}
                ></div>
                <p class="map-popover__hint">{t("map_click_hint")}</p>
                <div class="map-popover__actions">
                    <button type="button" class="map-popover__primary-button" onClick={() => this.handleInsert()}>
                        {t("insert")}
                    </button>
                </div>
            </div>
        );
    }

    private readInitialValues(): { lat: number; lng: number; zoom: number; label: string; } {
        const fallback = { lat: -23.55052, lng: -46.633308, zoom: 12, label: "" };

        const fromTarget = {
            lat: this.target?.dataset?.mapLat,
            lng: this.target?.dataset?.mapLng,
            zoom: this.target?.dataset?.mapZoom,
            label: this.target?.dataset?.mapLabel,
        };

        const lat = this.parseNumber(this.props.initialLat ?? fromTarget.lat, fallback.lat);
        const lng = this.parseNumber(this.props.initialLng ?? fromTarget.lng, fallback.lng);
        const zoom = this.parseNumber(this.props.initialZoom ?? fromTarget.zoom, fallback.zoom);
        const label = (this.props.initialLabel ?? fromTarget.label ?? fallback.label).toString();

        return { lat, lng, zoom, label };
    }

    private parseNumber(value: unknown, fallback: number): number {
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string" && value.trim()) {
            const parsed = Number(value);
            if (Number.isFinite(parsed)) return parsed;
        }
        return fallback;
    }

    private initializeLeafletMap(lat: number, lng: number, zoom: number): void {
        if (!this.mapContainer || this.mapInstance) return;
        const L = (globalThis as any).L;
        if (!L) return;

        this.mapInstance = L.map(this.mapContainer, { zoomControl: true, attributionControl: false })
            .setView([lat, lng], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(this.mapInstance);

        this.marker = L.marker([lat, lng]).addTo(this.mapInstance);

        this.mapInstance.on("click", (event: any) => {
            const { lat: clickLat, lng: clickLng } = event.latlng || {};
            if (typeof clickLat !== "number" || typeof clickLng !== "number") return;
            if (this.latInput) this.latInput.value = clickLat.toFixed(6);
            if (this.lngInput) this.lngInput.value = clickLng.toFixed(6);
            this.updateMarker(clickLat, clickLng);
        });
    }

    private updateMapFromInputs(): void {
        if (!this.mapInstance || !this.latInput || !this.lngInput) return;
        const lat = Number(this.latInput.value);
        const lng = Number(this.lngInput.value);
        const zoom = this.zoomInput ? Number(this.zoomInput.value) : NaN;

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            this.updateMarker(lat, lng);
        }

        if (Number.isFinite(zoom)) {
            this.mapInstance.setZoom(zoom);
        }
    }

    private updateMarker(lat: number, lng: number): void {
        if (!this.mapInstance) return;
        if (this.marker) {
            this.marker.setLatLng([lat, lng]);
        } else {
            const L = (globalThis as any).L;
            if (!L) return;
            this.marker = L.marker([lat, lng]).addTo(this.mapInstance);
        }
        this.mapInstance.setView([lat, lng], this.mapInstance.getZoom());
    }

    private handleInsert(): void {
        const latInput = this.latInput;
        const lngInput = this.lngInput;
        const zoomInput = this.zoomInput;
        if (!latInput || !lngInput || !zoomInput) return;

        const lat = Number(latInput.value);
        const lng = Number(lngInput.value);
        const zoom = Number(zoomInput.value);
        const label = this.labelInput?.value.trim() ?? "";

        if (!Number.isFinite(lat)) {
            latInput.setCustomValidity(t("map_invalid_lat"));
            latInput.reportValidity();
            return;
        }

        if (!Number.isFinite(lng)) {
            lngInput.setCustomValidity(t("map_invalid_lng"));
            lngInput.reportValidity();
            return;
        }

        if (!Number.isFinite(zoom)) {
            zoomInput.setCustomValidity(t("map_invalid_zoom"));
            zoomInput.reportValidity();
            return;
        }

        latInput.setCustomValidity("");
        lngInput.setCustomValidity("");
        zoomInput.setCustomValidity("");

        const target = this.target;
        this.remove();

        requestAnimationFrame(() => {
            runCommand("insertMapEmbed", {
                content: {
                    target,
                    lat,
                    lng,
                    zoom,
                    label,
                },
            });
        });
    }

    private ensureWithinViewport(anchorRect: DOMRect): void {
        const viewportWidth = globalThis.innerWidth || document.documentElement?.clientWidth || 0;
        if (!viewportWidth) return;

        const overlayRect = this.getBoundingClientRect();
        if (!overlayRect.width) return;

        const horizontalGap = this.positionToAnchorHorizontalGap;
        const anchorWidth = anchorRect.width ?? 0;
        const anchorCenter = anchorRect.left + anchorWidth / 2;
        const desiredLeft = anchorCenter - overlayRect.width / 2;
        const minLeft = horizontalGap;
        const maxLeft = Math.max(viewportWidth - overlayRect.width - horizontalGap, minLeft);
        const clampedLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);

        this.style.left = `${clampedLeft}px`;
        this.style.right = "";
    }

    private ensureCenteredIfOverflowing(): void {
        const viewportWidth = globalThis.innerWidth || document.documentElement?.clientWidth || 0;
        const viewportHeight = globalThis.innerHeight || document.documentElement?.clientHeight || 0;
        if (!viewportWidth || !viewportHeight) return;

        const overlayRect = this.getBoundingClientRect();
        if (!overlayRect.height || !overlayRect.width) return;

        const margin = 16;
        const wouldOverflowHeight = overlayRect.height + margin * 2 > viewportHeight;
        const wouldOverflowBottom = overlayRect.bottom > viewportHeight - margin;

        if (wouldOverflowHeight || wouldOverflowBottom) {
            const left = Math.max((viewportWidth - overlayRect.width) / 2, margin);
            const top = Math.max((viewportHeight - overlayRect.height) / 2, margin);
            this.style.left = `${left}px`;
            this.style.top = `${top}px`;
            this.style.right = "";
            this.style.bottom = "";
        }
    }

    private toDOMRect(rectInit: DOMRectInit): DOMRect {
        const x = rectInit.x ?? 0;
        const y = rectInit.y ?? 0;
        const width = rectInit.width ?? 0;
        const height = rectInit.height ?? 0;

        return typeof DOMRect.fromRect === "function"
            ? DOMRect.fromRect({ x, y, width, height })
            : new DOMRect(x, y, width, height);
    }
}