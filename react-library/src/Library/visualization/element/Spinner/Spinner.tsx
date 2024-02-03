//
import s from './spinner.module.sass';
import { SpinnerSize } from './types';



// 
interface IPropsSpinner {
    cs?: string,
    size: SpinnerSize,
    isAbsolute?: boolean,
}

export const Spinner = (
    {
        cs = '',
        size = SpinnerSize.medium,
        isAbsolute = false,
    }: IPropsSpinner
): JSX.Element => {

    const getStyle = () => {
        const customClass: string[] = [cs, s['spinner']];
        if (size) customClass.push(s[`size-${size}`]);
        if (isAbsolute) customClass.push(s['position-absolute'], s[`margin-top-${size}`]);
        return customClass.join(' ');
    }

    return (
        <div className={getStyle()}>
            <div className={s['spinner-container']}>
                <div className={s['dot-a']}></div>
                <div className={s['dot-b']}></div>
            </div>
        </div>
    );
}
