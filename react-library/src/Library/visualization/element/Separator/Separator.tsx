//
import s from './separator.module.sass';



// 
export interface IPropsSeparator {
    cs?: string,
    progress: number,
}

export const Separator = (
    {
        cs = '', progress,
    }: IPropsSeparator
): JSX.Element => {

    // 
    const getStyle = () => {
        return cs + ' ' + s['separator-line'];
    }
    const getProgressStyle = () => {
        return {
            width: `${(progress >= 0 && progress <= 100) ? progress : 0}%`
        };
    }

    return (
        <div className={getStyle()}>
            <span className={s['separator-progress']} style={getProgressStyle()}>
                <span className={s['']}></span>
            </span>
        </div>
    );
}
