import { PropsWithChildren } from "react";
//
import s from './form-layout.module.sass';



// 
interface IPropsFormLayout {
    cs?: string,
    name: string,
    action: string,
    autoComplete?: 'on' | 'off',
    target?: '_blank' | '_self' | '_parent' | '_top',
    onSubmit?: () => boolean,
}

export const FormLayout = (
    {
        children, cs = '',
        name, action, autoComplete = 'on', target = '_self',
        onSubmit,
    }: PropsWithChildren<IPropsFormLayout>
): JSX.Element => {

    // 
    const onSubmitForm = () => {
        if (onSubmit) return onSubmit();
        return false;
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['form-layout'];
    }

    return (
        <form className={getStyle()} name={name} action={action}
            autoComplete={autoComplete} target={target}
            onSubmit={onSubmitForm}>
            {children}
        </form>
    );
}
