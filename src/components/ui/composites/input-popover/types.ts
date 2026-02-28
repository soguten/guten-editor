import type { DefaultProps } from "@core/components";
import type { AnchoredOverlayProps } from "../anchored-overlay/types.ts";

export interface InputPopoverProps extends DefaultProps, AnchoredOverlayProps {
    inputType: string;
    inputPlaceholder: string;
    inputName?: string;
    buttonText?: string;
    inputProps?: Record<string, any>;
}