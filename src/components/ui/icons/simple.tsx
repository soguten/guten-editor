import { IconProps } from "./types.ts";

export const RowInsertBottomIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-row-insert-bottom" {...props}>
        {/* Tabler v3.36.1 https://tabler.io/icons | License  https://tabler.io/license */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1" /><path d="M12 15l0 4" /><path d="M14 17l-4 0" />
    </svg>
);

export const RowInsertTopIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-row-insert-top" {...props}>
        {/* Tabler v3.36.1 https://tabler.io/icons | License  https://tabler.io/license */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 18v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1" /><path d="M12 9v-4" /><path d="M10 7l4 0" />
    </svg>
);

export const ColumnInsertRightIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-column-insert-right" {...props}>
        {/* Tabler v3.36.1 https://tabler.io/icons | License  https://tabler.io/license */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1" /><path d="M15 12l4 0" /><path d="M17 10l0 4" />
    </svg>
);

export const ColumnInsertLeftIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-column-insert-left" {...props}>
        {/* Tabler v3.36.1 https://tabler.io/icons | License  https://tabler.io/license */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1" /><path d="M5 12l4 0" /><path d="M7 10l0 4" />
    </svg>
);

export const DeleteColumn = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" >
        <path d="M5.5 3C6.90446 3 7.60669 3 8.11114 3.37919C8.32952 3.54335 8.51702 3.75429 8.66294 3.99997C9 4.56747 9 5.35748 9 6.9375L9 17.0625C9 18.6425 9 19.4325 8.66294 20C8.51702 20.2457 8.32952 20.4566 8.11114 20.6208C7.60669 21 6.90446 21 5.5 21C4.09554 21 3.39331 21 2.88886 20.6208C2.67048 20.4566 2.48298 20.2457 2.33706 20C2 19.4325 2 18.6425 2 17.0625L2 6.9375C2 5.35748 2 4.56747 2.33706 3.99997C2.48298 3.75429 2.67048 3.54335 2.88886 3.37919C3.39331 3 4.09554 3 5.5 3Z" />
        <path d="M20 11.9375L20 17.0625C20 18.6425 20 19.4325 19.6629 20C19.517 20.2457 19.3295 20.4566 19.1111 20.6208C18.6067 21 17.9045 21 16.5 21C15.0955 21 14.3933 21 13.8889 20.6208C13.6705 20.4566 13.483 20.2457 13.3371 20C13 19.4325 13 18.6425 13 17.0625L13 6.9375C13 5.35748 13 4.56747 13.3371 3.99997" />
        <path d="M22 8.99936L16 3M22 3.00064L16 9" />
    </svg >
);

export const DeleteRow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 18.5C21 19.9045 21 20.6067 20.6208 21.1111C20.4567 21.3295 20.2457 21.517 20 21.6629C19.4325 22 18.6425 22 17.0625 22L6.9375 22C5.35748 22 4.56747 22 3.99997 21.6629C3.75429 21.517 3.54335 21.3295 3.37919 21.1111C3 20.6067 3 19.9045 3 18.5C3 17.0955 3 16.3933 3.37919 15.8889C3.54335 15.6705 3.75429 15.483 3.99997 15.3371C4.56747 15 5.35748 15 6.9375 15L17.0625 15C18.6425 15 19.4325 15 20 15.3371C20.2457 15.483 20.4567 15.6705 20.6208 15.8889C21 16.3933 21 17.0955 21 18.5Z" />
        <path d="M12.0625 4L6.9375 4C5.35748 4 4.56747 4 3.99997 4.33706C3.75429 4.48298 3.54335 4.67048 3.37919 4.88886C3 5.39331 3 6.09554 3 7.5C3 8.90446 3 9.60669 3.37919 10.1111C3.54335 10.3295 3.75429 10.517 3.99997 10.6629C4.56747 11 5.35748 11 6.9375 11L17.0625 11C18.6425 11 19.4325 11 20 10.6629" />
        <path d="M21 7.99936L15 2M21 2.00064L15 8" />
    </svg>
);

export const BoldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
        <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
    </svg>
);

export const ParagraphIcon = () => (

    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path></svg>
);

export const SeparatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hr" viewBox="0 0 16 16">
        <path d="M12 3H4a1 1 0 0 0-1 1v2.5H2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2.5h-1V4a1 1 0 0 0-1-1M2 9.5h1V12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.5h1V12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm-1.5-2a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1z" />
    </svg>
);

export const ItalicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-italic" viewBox="0 0 16 16">
        <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
    </svg>
);

export const StrikeThroughIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-strikethrough" viewBox="0 0 16 16">
        <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.8 2.8 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967" />
    </svg>
);

export const CodeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M93.31,70,28,128l65.27,58a8,8,0,1,1-10.62,12l-72-64a8,8,0,0,1,0-12l72-64A8,8,0,1,1,93.31,70Zm152,52-72-64a8,8,0,0,0-10.62,12L228,128l-65.27,58a8,8,0,1,0,10.62,12l72-64a8,8,0,0,0,0-12Z"></path></svg>
);

export const CodeBlockIcon = () => (

    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M43.18,128a29.78,29.78,0,0,1,8,10.26c4.8,9.9,4.8,22,4.8,33.74,0,24.31,1,36,24,36a8,8,0,0,1,0,16c-17.48,0-29.32-6.14-35.2-18.26-4.8-9.9-4.8-22-4.8-33.74,0-24.31-1-36-24-36a8,8,0,0,1,0-16c23,0,24-11.69,24-36,0-11.72,0-23.84,4.8-33.74C50.68,38.14,62.52,32,80,32a8,8,0,0,1,0,16C57,48,56,59.69,56,84c0,11.72,0,23.84-4.8,33.74A29.78,29.78,0,0,1,43.18,128ZM240,120c-23,0-24-11.69-24-36,0-11.72,0-23.84-4.8-33.74C205.32,38.14,193.48,32,176,32a8,8,0,0,0,0,16c23,0,24,11.69,24,36,0,11.72,0,23.84,4.8,33.74a29.78,29.78,0,0,0,8,10.26,29.78,29.78,0,0,0-8,10.26c-4.8,9.9-4.8,22-4.8,33.74,0,24.31-1,36-24,36a8,8,0,0,0,0,16c17.48,0,29.32-6.14,35.2-18.26,4.8-9.9,4.8-22,4.8-33.74,0-24.31,1-36,24-36a8,8,0,0,0,0-16Z"></path></svg>
);

export const UnderlineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M200,224a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H192A8,8,0,0,1,200,224Zm-72-24a64.07,64.07,0,0,0,64-64V56a8,8,0,0,0-16,0v80a48,48,0,0,1-96,0V56a8,8,0,0,0-16,0v80A64.07,64.07,0,0,0,128,200Z"></path></svg>
);

export const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path></svg>
);

export const LinkMaterialIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
);

export const EquationIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-math-integral-x" {...props}>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 19a2 2 0 0 0 2 2c2 0 2 -4 3 -9s1 -9 3 -9a2 2 0 0 1 2 2" />
        <path d="M14 12l6 6" /><path d="M14 18l6 -6" />
    </svg>
);

export const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
    </svg>
);

export const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
    </svg>
);

export const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
    </svg>
);

export const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
    </svg>
);

export const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
    </svg>
);

export const UndoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
    </svg>
);

export const RedoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
    </svg>
);

export const Heading1Icon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" {...props}>
        {/* Bootstrap v1.11.0 https://icons.getbootstrap.com | License  https://github.com/twbs/icons/blob/main/LICENSE */}
        <path d="M152,56V176a8,8,0,0,1-16,0V124H48v52a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v52h88V56a8,8,0,0,1,16,0Zm75.77,49a8,8,0,0,0-8.21.39l-24,16a8,8,0,1,0,8.88,13.32L216,127V208a8,8,0,0,0,16,0V112A8,8,0,0,0,227.77,105Z"></path>
    </svg>
);

export const Heading2Icon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" {...props}>
        {/* Bootstrap v1.11.0 https://icons.getbootstrap.com | License  https://github.com/twbs/icons/blob/main/LICENSE */}
        <path d="M152,56V176a8,8,0,0,1-16,0V124H48v52a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v52h88V56a8,8,0,0,1,16,0Zm88,144H208l33.55-44.74a32,32,0,1,0-55.73-29.93,8,8,0,1,0,15.08,5.34,16.28,16.28,0,0,1,2.32-4.3,16,16,0,1,1,25.54,19.27L185.6,203.2A8,8,0,0,0,192,216h48a8,8,0,0,0,0-16Z"></path>
    </svg>
);

export const Heading3Icon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" {...props}>
        {/* Bootstrap v1.11.0 https://icons.getbootstrap.com | License  https://github.com/twbs/icons/blob/main/LICENSE */}
        <path d="M152,56V176a8,8,0,0,1-16,0V124H48v52a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v52h88V56a8,8,0,0,1,16,0Zm73.52,90.63,21-30A8,8,0,0,0,240,104H192a8,8,0,0,0,0,16h32.63l-19.18,27.41A8,8,0,0,0,212,160a20,20,0,1,1-14.29,34,8,8,0,1,0-11.42,11.19A36,36,0,0,0,248,180,36.07,36.07,0,0,0,225.52,146.63Z"></path>
    </svg>
);

export const Heading4Icon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256">
        {/* Bootstrap v1.11.0 https://icons.getbootstrap.com | License  https://github.com/twbs/icons/blob/main/LICENSE */}
        <path d="M152,56V176a8,8,0,0,1-16,0V124H48v52a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v52h88V56a8,8,0,0,1,16,0ZM256,184a8,8,0,0,1-8,8h-8v16a8,8,0,0,1-16,0V192H176a8,8,0,0,1-6.31-12.91l56-72A8,8,0,0,1,240,112v64h8A8,8,0,0,1,256,184Zm-32-48.68L192.36,176H224Z"></path>
    </svg>
);

export const Heading5Icon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 256 256" {...props}>
        {/* Bootstrap v1.11.0 https://icons.getbootstrap.com | License  https://github.com/twbs/icons/blob/main/LICENSE */}
        <path d="M152,56V176a8,8,0,0,1-16,0V124H48v52a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v52h88V56a8,8,0,0,1,16,0Zm60,88a38.8,38.8,0,0,0-9.41,1.14L206.78,120H240a8,8,0,0,0,0-16H200a8,8,0,0,0-7.89,6.68l-8,48a8,8,0,0,0,13.6,6.92A19.73,19.73,0,0,1,212,160a20,20,0,0,1,0,40,19.73,19.73,0,0,1-14.29-5.6,8,8,0,1,0-11.42,11.2A35.54,35.54,0,0,0,212,216a36,36,0,0,0,0-72Z"></path>
    </svg>
);

export const QuotationIcon = () => (

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.58341 17.3211C3.55316 16.2274 3 15 3 13.0103C3 9.51086 5.45651 6.37366 9.03059 4.82318L9.92328 6.20079C6.58804 8.00539 5.93618 10.346 5.67564 11.822C6.21263 11.5443 6.91558 11.4466 7.60471 11.5105C9.40908 11.6778 10.8312 13.159 10.8312 15C10.8312 16.933 9.26416 18.5 7.33116 18.5C6.2581 18.5 5.23196 18.0095 4.58341 17.3211ZM14.5834 17.3211C13.5532 16.2274 13 15 13 13.0103C13 9.51086 15.4565 6.37366 19.0306 4.82318L19.9233 6.20079C16.588 8.00539 15.9362 10.346 15.6756 11.822C16.2126 11.5443 16.9156 11.4466 17.6047 11.5105C19.4091 11.6778 20.8312 13.159 20.8312 15C20.8312 16.933 19.2642 18.5 17.3312 18.5C16.2581 18.5 15.232 18.0095 14.5834 17.3211Z"></path></svg>
);

export const HappyAltIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
        fill="currentColor" viewBox="0 0 24 24" {...props}>
        {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/license/free */}
        <path d="M8.5 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3m6.99 2.99c.82 0 1.49-.67 1.49-1.49s-.67-1.49-1.49-1.49S14 8.68 14 9.5s.67 1.49 1.49 1.49M12 18c5 0 6-5 6-5H6s1 5 6 5"></path><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"></path>
    </svg>
);

export const CardTextIcon = () => (

    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z"></path></svg>
);

export const TableIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-table" {...props}>
        {/* Tabler v3.36.1 https://tabler.io/icons | License  https://tabler.io/license */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" /><path d="M3 10h18" /><path d="M10 3v18" />
    </svg>
);

export const FontIcon = () => (

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 6V21H11V6H5V4H19V6H13Z"></path></svg>
);

export const AwesomeListOlIcon = () => (

    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM104,72H216a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16ZM216,184H104a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM43.58,55.16,48,52.94V104a8,8,0,0,0,16,0V40a8,8,0,0,0-11.58-7.16l-16,8a8,8,0,0,0,7.16,14.32ZM79.77,156.72a23.73,23.73,0,0,0-9.6-15.95,24.86,24.86,0,0,0-34.11,4.7,23.63,23.63,0,0,0-3.57,6.46,8,8,0,1,0,15,5.47,7.84,7.84,0,0,1,1.18-2.13,8.76,8.76,0,0,1,12-1.59A7.91,7.91,0,0,1,63.93,159a7.64,7.64,0,0,1-1.57,5.78,1,1,0,0,0-.08.11L33.59,203.21A8,8,0,0,0,40,216H72a8,8,0,0,0,0-16H56l19.08-25.53A23.47,23.47,0,0,0,79.77,156.72Z"></path></svg>
);

export const AwesomeListUlIcon = () => (

    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path></svg>
);

export const ListDetailsIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-list-details" {...props}>
        {/* Tabler v3.36.1 https://tabler.io/icons | License  https://tabler.io/license */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13 5h8" /><path d="M13 9h5" /><path d="M13 15h8" /><path d="M13 19h5" /><path d="M3 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" /><path d="M3 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" />
    </svg>
);

export const BiFiles = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16">
        <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    </svg>
);

export const CardImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
    </svg>
);

export const ImageFillIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" class="bi bi-image-fill" viewBox="0 0 16 16" {...props}>
        <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
    </svg>
);

export const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
    </svg>
);

export const EmojiSmileyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M178.39,158c-11,19.06-29.39,30-50.39,30s-39.36-10.93-50.39-30a12,12,0,0,1,20.78-12c3.89,6.73,12.91,18,29.61,18s25.72-11.28,29.61-18a12,12,0,1,1,20.78,12ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128ZM92,124a16,16,0,1,0-16-16A16,16,0,0,0,92,124Zm72-32a16,16,0,1,0,16,16A16,16,0,0,0,164,92Z"></path></svg>
);

export const EmojiHeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M178,36c-20.09,0-37.92,7.93-50,21.56C115.92,43.93,98.09,36,78,36a66.08,66.08,0,0,0-66,66c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,232.14,244,174.34,244,102A66.08,66.08,0,0,0,178,36Zm-5.49,142.36A328.69,328.69,0,0,1,128,210.16a328.69,328.69,0,0,1-44.51-31.8C61.82,159.77,36,131.42,36,102A42,42,0,0,1,78,60c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,69.4,160.2,60,178,60a42,42,0,0,1,42,42C220,131.42,194.18,159.77,172.51,178.36Z"></path></svg>
);

export const EmojiClapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M220.77,83.57,199.59,47a30.14,30.14,0,0,0-41.11-11,30.49,30.49,0,0,0-4.92,3.52L144,23a30.16,30.16,0,0,0-49.55-3.78,30.18,30.18,0,0,0-28.59.8A29.95,29.95,0,0,0,53.08,57.47,29.68,29.68,0,0,0,47.32,60a30,30,0,0,0-11,41l.3.52A30.77,30.77,0,0,0,31,104a30,30,0,0,0-11,41l35.33,61a84.48,84.48,0,0,0,115.12,30.75,83.51,83.51,0,0,0,39.27-51c.39-1.45.73-2.89,1-4.35A84.13,84.13,0,0,0,220.77,83.57ZM167.71,60.45a6,6,0,0,1,11-1.45l21.18,36.57a59.85,59.85,0,0,1,7.34,39A85.15,85.15,0,0,0,201.33,122l-33-57A5.94,5.94,0,0,1,167.71,60.45Zm-55.61-24a6,6,0,0,1,7.38-4.25,6,6,0,0,1,3.65,2.8l22.33,38.55A30.7,30.7,0,0,0,140,76a30.22,30.22,0,0,0-4.9,3.52L112.7,41A6,6,0,0,1,112.1,36.45Zm-37,8a6,6,0,0,1,7.37-4.25A6.05,6.05,0,0,1,86.09,43l3.77,6.58A29.92,29.92,0,0,0,84.34,52a30.39,30.39,0,0,0-4.88,3.5L75.68,49A5.93,5.93,0,0,1,75.08,44.45ZM158.44,216a60.37,60.37,0,0,1-82.23-22L40.88,133a6,6,0,0,1,2.2-8.2A6,6,0,0,1,51.3,127l20.29,35a12,12,0,0,0,20.85-12L57.15,89a6,6,0,0,1,10.41-6L99.42,138a12,12,0,0,0,20.85-12L94.2,81.05h0l0-.05a6,6,0,0,1,10.44-6l36.57,63A12,12,0,0,0,162,126l-12.55-21.61A6,6,0,0,1,160.21,99l20.27,35A60,60,0,0,1,158.44,216Z"></path></svg>
);

export const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
    </svg>
);

export const PaletteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette" viewBox="0 0 16 16">
        <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
        <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7" />
    </svg>
);

export const AlignLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48a8,8,0,0,1-8,8H40A8,8,0,0,1,40,40H208A8,8,0,0,1,216,48Zm-48,40H40a8,8,0,0,0,0,16H168a8,8,0,0,0,0-16Zm0,56H40a8,8,0,0,0,0,16H168a8,8,0,0,0,0-16Zm0,56H40a8,8,0,0,0,0,16H168a8,8,0,0,0,0-16Z"></path></svg>
);

export const AlignCenterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,48Zm-24,40H64a8,8,0,0,0,0,16h128a8,8,0,0,0,0-16Zm16,72a8,8,0,0,0-8-8H56a8,8,0,0,0,0,16H200A8,8,0,0,0,208,160Zm-32,40H80a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Z"></path></svg>
);

export const AlignRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H48a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM168,88H88a8,8,0,0,0,0,16h80a8,8,0,0,0,0-16Zm48,56H88a8,8,0,0,0,0,16h128a8,8,0,0,0,0-16Zm0,56H88a8,8,0,0,0,0,16h128a8,8,0,0,0,0-16Z"></path></svg>
);

export const AlignJustifyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,48Zm0,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,104Zm0,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,160Zm0,56a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,216Z"></path></svg>
);

export const TableHeaderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm-4,48H152V56h60ZM136,56v32H44V56ZM44,120H120v32H44Zm0,48H120v32H44Zm76,32V168h96v32Zm96-48H136V120h80Z"></path></svg>
);


export const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
    </svg>
);

export const AlphabetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type" viewBox="0 0 16 16">
        <path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081zm2.7-7.923L6.34 9.314H3.51l1.4-4.156zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525" />
    </svg>
);

export const TextColorIcon = () => (

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.2459 14H8.75407L7.15407 18H5L11 3H13L19 18H16.8459L15.2459 14ZM14.4459 12L12 5.88516L9.55407 12H14.4459ZM3 20H21V22H3V20Z"></path></svg>

);

export const HighlightColorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);

export const SlashCommandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-slash-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708" />
    </svg>
);

export const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
    </svg>
);

export const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
    </svg>
);

export const TranslationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-translate" viewBox="0 0 16 16">
        <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z" />
        <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31" />
    </svg>
);

export const PlusIcon = ({ size = 16, fill = "currentColor", ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={fill} class="bi bi-plus" viewBox="0 0 16 16" {...props}>
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
    </svg>
);

export const GripVerticalIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-grip-vertical" {...props}><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M8 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M8 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M14 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M14 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M14 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
);

export const TableRowIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-table-row" {...props}>
        {/* Tabler v3.36.1 https://tabler.io/icons | License  https://tabler.io/license */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" /><path d="M9 3l-6 6" /><path d="M14 3l-7 7" /><path d="M19 3l-7 7" /><path d="M21 6l-4 4" /><path d="M3 10h18" /><path d="M10 10v11" />
    </svg>
);

export const TableColumnIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-table-column" {...props}>
        {/* Tabler v3.36.1 https://tabler.io/icons | License  https://tabler.io/license */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" /><path d="M10 10h11" /><path d="M10 3v18" /><path d="M9 3l-6 6" /><path d="M10 7l-7 7" /><path d="M10 12l-7 7" /><path d="M10 17l-4 4" />
    </svg>
);

export const GridColumnLeftFilledIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
        fill="currentColor" viewBox="0 0 24 24" {...props}>
        {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/license/free */}
        <rect width="8" height="18" x="3" y="3" rx="1.5" ry="1.5"></rect><rect width="8" height="8" x="13" y="3" rx="1.5" ry="1.5"></rect><rect width="8" height="8" x="13" y="13" rx="1.5" ry="1.5"></rect>
    </svg>
);

export const ArrowUpIcon2 = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16" {...props}>
        <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5" />
    </svg>
);

export const LayoutPlusIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
        fill="currentColor" viewBox="0 0 24 24" {...props}>
        {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/license/free */}
        <rect width="8" height="8" x="13" y="3" rx="1.5" ry="1.5"></rect><rect width="8" height="18" x="3" y="3" rx="1.5" ry="1.5"></rect><path d="M16 21h2v-3h3v-2h-3v-3h-2v3h-3v2h3z"></path>
    </svg>
);

export const PhotoUpIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-photo-up" {...props}>
        {/* Tabler v3.36.1 https://tabler.io/icons | License  https://tabler.io/license */}
        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01" /><path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5" /><path d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" />
    </svg>
);

export const ImageAltIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" class="bi bi-image-alt" viewBox="0 0 16 16" {...props}>
        {/* Bootstrap v1.11.0 https://icons.getbootstrap.com | License  https://github.com/twbs/icons/blob/main/LICENSE */}
        <path d="M7 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m4.225 4.053a.5.5 0 0 0-.577.093l-3.71 4.71-2.66-2.772a.5.5 0 0 0-.63.062L.002 13v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.5z" />
    </svg>
);

export const DocumentIcon = ({ size = 16, ...props }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16" {...props}>
        {/* Bootstrap v1.11.0 https://icons.getbootstrap.com | License  https://github.com/twbs/icons/blob/main/LICENSE */}
        <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
        <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
    </svg>
);