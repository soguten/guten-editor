import { registerTranslation } from "@core/i18n";
import { Plugin } from "@core/plugin-engine";
import { en } from "./i18n/en.ts";
import { pt } from "./i18n/pt.ts";
import { DevSidebarPanel } from "./components/dev-sidebar-panel.tsx";

const ROOT_WITH_SIDEBAR_CLASS = "guten-dev-sidebar-enabled";

function isTruthyFlag(value?: string): boolean {
    if (!value) return false;
    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function isFalsyFlag(value?: string): boolean {
    if (!value) return false;
    return ["0", "false", "no", "off"].includes(value.toLowerCase());
}

function isLocalhost(): boolean {
    if (typeof window === "undefined") return false;
    const { hostname } = window.location;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export class DevSidebarPlugin extends Plugin {
    override setup(root: HTMLElement): void {
        if (!import.meta.env.DEV) {
            return;
        }

        registerTranslation("en", en);
        registerTranslation("pt", pt);

        const envFlag = import.meta.env.VITE_ENABLE_DEV_SIDEBAR;
        const enabledByEnv = isTruthyFlag(envFlag);
        const disabledByEnv = isFalsyFlag(envFlag);
        const enabledInLocalDev = !disabledByEnv && (enabledByEnv || isLocalhost());

        if (!enabledInLocalDev) {
            return;
        }

        if (root.querySelector("x-dev-sidebar-panel")) {
            return;
        }

        root.classList.add(ROOT_WITH_SIDEBAR_CLASS);
        root.appendChild(<DevSidebarPanel />);
    }
}