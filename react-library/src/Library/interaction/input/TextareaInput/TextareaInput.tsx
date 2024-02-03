//
import s from './textarea-input.module.sass';



// 
interface IPropsTextareaInput {
    cs?: string,
    //
    name: string,
    label?: string,
    value?: string | number,
    placeholder?: string,
    //
    readonly?: boolean,
    disabled?: boolean,
}

export const TextareaInput = (
    {
        cs = '',
        name, label = '', value = '', placeholder,
        readonly = false, disabled = false,
    }: IPropsTextareaInput
): JSX.Element => {

    // 
    const getErrorNode = () => {
        return <></>
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['textarea-input'];
    }
    const getLabelStyle = () => {
        return s['text-label'] + ' ' + s['no-flex'];
    }
    const getContainerStyle = () => {
        return s['text-container'] + ' ' + s['grow'];
    }

    return (
        <div className={getStyle()}>
            {label && (
                <label className={getLabelStyle()} htmlFor={`id_${name}`}>
                    {getErrorNode()}
                    {label}
                </label>
            )}
            <div className={getContainerStyle()}>
                <textarea className={s['text-input']} id={`id_${name}`}
                    name={name} value={value} placeholder={placeholder}
                    readOnly={readonly} disabled={disabled}
                />
            </div>
        </div>
    );
}
