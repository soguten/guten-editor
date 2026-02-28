type NativeInputProps = JSX.IntrinsicElements["input"];

export interface InputProps extends NativeInputProps {
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    onEl?: (el: HTMLInputElement) => void;
}

export function Input(props: InputProps): HTMLInputElement {
    const {
        size = "md",
        onEl,
        class: userClass,
        ...rest
    } = props;

    const classes = [
        "guten-input",
        `guten-input--${size}`,
        userClass,
    ].filter(Boolean).join(" ");

    return (
        <input
            {...rest}
            class={classes}
            ref={(el: HTMLInputElement | null) => { if (el) onEl?.(el); }}
        />
    );
}
