
/** Вариант отображения. Указывает на состояние этапа. */
export enum PathType {
    complete = 'complete',
    current = 'current',
    incomplete = 'incomplete',
}

/** Описание этапа индикатора. */
export interface IStep {
    title: string,
    pathType: PathType,
    onClick?: () => void,
}
