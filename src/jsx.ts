import { Component } from "./components/component.ts";

function applyAttributes(el: HTMLElement, props: Record<string, any>) {
    for (const [key, value] of Object.entries(props)) {
        if (key === 'className') {
            el.setAttribute('class', value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key !== "children" && value != null) {
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                el.setAttribute(key, String(value));
            }
        }
    }
}

export function h(tag: any, props: Record<string, any> | null, ...children: any[]) {
    if (typeof tag === 'function') {
        if (tag.prototype instanceof Component) {
            const tagName = tag.getTagName();

            if (!customElements.get(tagName)) {
                customElements.define(tagName, tag);
            }

            const el = document.createElement(tagName) as HTMLElement;

            if (props) {
                applyAttributes(el, props);
                (el as any).props = props;
            }

            appendChildren(el, children);
            return el;
        }

        let normalizedChildren;
        if (children.length === 0) {
            normalizedChildren = undefined;
        } else if (children.length === 1) {
            normalizedChildren = children[0];
        } else {
            normalizedChildren = children;
        }

        return tag({ ...(props || {}), children: normalizedChildren });
    }

    const el = document.createElement(tag);

    if (props) {
        applyAttributes(el, props);
    }

    appendChildren(el, children);
    return el;
}

function appendChildren(parent: HTMLElement | DocumentFragment, children: any[]) {
    for (const child of children.flat()) {
        if (child == null || typeof child === "boolean") continue;
        parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
}

export function Fragment(props: { children?: any[] }) {
    const frag = document.createDocumentFragment();
    appendChildren(frag, props.children || []);
    return frag;
}