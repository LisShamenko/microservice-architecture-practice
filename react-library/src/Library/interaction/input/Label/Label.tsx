//
import s from './label.module.sass';



// 
export interface IPropsLabel {
    cs?: string,
    name: string,
    label: string,
}

export const Label = (
    {
        cs = '', label, name,
    }: IPropsLabel
): JSX.Element => {

    const getStyle = () => {
        return cs + ' ' + s['text-label'] + ' ' + s['no-flex'];
    }

    return (
        <label className={getStyle()} htmlFor={`id_${name}`}>
            {label}
        </label>
    );
}
