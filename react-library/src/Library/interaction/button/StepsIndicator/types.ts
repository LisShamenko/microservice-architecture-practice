
/** Тип элемента индикатора. */
export enum StepType {
    success = 'success',
    error = 'error',
    choice = 'choice',
}

/** Описание шага индикатора. */
export interface IStep {
    buttonType: StepType,
    onClick?: () => void,
}
