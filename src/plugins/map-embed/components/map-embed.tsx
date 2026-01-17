/** @jsx h */

import { Component, h, t } from "../../index.ts";

export interface MapEmbedProps {
    lat: number;
    lng: number;
    zoom: number;
    label?: string;
}

export class MapEmbed extends Component<MapEmbedProps> {

    static override styles = this.extendStyles(/*css */`
        .map-embed {
            margin: var(--space-sm) 0;
        }

        .map-embed__container {
            width: 100%;
            height: 400px;
            border-radius: var(--radius-md);
            overflow: hidden;
            border: 1px solid var(--color-border);
            background: var(--color-surface-muted);
        }

        .map-embed__fallback {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: var(--font-size-xs);
            color: var(--color-muted);
        }
    ` );

    private mapContainer: HTMLDivElement | null = null;
    private mapInstance: any | null = null;
    private marker: any | null = null;

    override connectedCallback(): void {
        super.connectedCallback();
        this.classList.add("block", "map-embed");
        this.setAttribute("contenteditable", "false");
        this.dataset.mapEmbed = "true";
    }

    override onMount(): void {
        this.dataset.mapLat = `${this.props.lat}`;
        this.dataset.mapLng = `${this.props.lng}`;
        this.dataset.mapZoom = `${this.props.zoom}`;
        if (this.props.label) {
            this.dataset.mapLabel = this.props.label;
        } else {
            delete this.dataset.mapLabel;
        }

        requestAnimationFrame(() => this.initializeLeaflet());
    }

    override render(): HTMLElement {
        return (
            <div
                class="map-embed__container"
                aria-label={t("map")}
                ref={(el: HTMLDivElement | null) => {
                    this.mapContainer = el;
                }}
            >
                <div class="map-embed__fallback">{t("map_loading")}</div>
            </div>
        );
    }

    private initializeLeaflet(): void {
        if (!this.mapContainer || this.mapInstance) return;

        const L = (globalThis as any).L;
        if (!L) return;

        this.mapContainer.innerHTML = "";

        const { lat, lng, zoom, label } = this.props;
        this.mapInstance = L.map(this.mapContainer, {
            zoomControl: true,
            attributionControl: true,
        }).setView([lat, lng], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(this.mapInstance);

        this.marker = L.marker([lat, lng]).addTo(this.mapInstance);

        if (label) {
            this.marker.bindPopup(label).openPopup();
        }
    }
}