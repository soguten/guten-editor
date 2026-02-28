type NativeButtonProps = JSX.IntrinsicElements["button"];

export interface ButtonProps extends NativeButtonProps {
    variant?: "default" | "primary" | "danger";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    onEl?: (el: HTMLButtonElement) => void;
}

export function Button(props: ButtonProps): HTMLButtonElement {
    const {
        variant = "default",
        size = "md",
        fullWidth = false,
        onEl,
        class: userClass,
        children,
        ...rest
    } = props;

    const classes = [
        "guten-btn",
        `guten-btn--${variant}`,
        `guten-btn--${size}`,
        fullWidth && "guten-btn--block",
        userClass
    ].filter(Boolean).join(" ");

    return (
        <button
            {...rest}
            class={classes}
            type={rest.type ?? "button"}
            ref={(el: HTMLButtonElement | null) => { if (el) onEl?.(el); }}
        >
            {children}
        </button>
    );
}