


/** Собирает стили в одну строку. */
export const a = (
    s: { readonly [key: string]: string },
    ...styles: string[]
) => {
    return styles.map(item => s[item]).join(' ');
}

/** Число в пикселях. */
export const px = (value: number) => {
    return value + 'px';
}