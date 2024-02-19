import { ChangeEvent, FormEvent, useState } from 'react';
//
import s from './base-form.module.sass';
import { JustButton } from '../../../library/interaction/button/JustButton/JustButton';
import { Checkbox } from '../../../library/interaction/input/Checkbox/Checkbox';
import { TextInput } from '../../../library/interaction/input/TextInput/TextInput';
import { InputType } from '../../../library/interaction/input/BaseInput/types';



// 
export interface ISubmitLoginForm {
    username: string;
    password: string;
    isRemember: boolean;
}

interface IPropsLoginForm {
    cs?: string,
    action?: string,
    isBlocked?: boolean,
    initRemember?: boolean,
    onSubmit?: (values: ISubmitLoginForm) => void,
    onChange?: (username: string, password: string) => void,
    onRemember?: (isRemember: boolean) => void,
}

export const LoginForm = (
    {
        cs = '', action = '', isBlocked = false, initRemember = false,
        onSubmit, onChange, onRemember,
    }: IPropsLoginForm
): JSX.Element => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRemember, setRemember] = useState(initRemember);

    //
    const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit) onSubmit({ username, password, isRemember });
        return false;
    }
    const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        if (onChange) onChange(e.target.value, password);
    }
    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (onChange) onChange(password, e.target.value);
    }
    const onChangeRemember = (isClick: boolean, value: string | boolean) => {
        setRemember(isClick);
        if (onRemember) onRemember(isClick);
    }

    // 
    const getStyle = () => {
        return cs + ' ' + s['base-form'];
    }

    return (
        <div className={getStyle()}>
            <div className={s['form-container']}>
                <form className={s['form']}
                    name="login" method="post" action={action}
                    target="_top" autoComplete="off" noValidate={false}
                    onSubmit={onSubmitForm}
                >
                    <TextInput inputType={InputType.text}>
                        {{
                            cs: { input: s['text-input'] },
                            name: "username", label: 'Логин',
                            value: username, onChange: onChangeUsername,
                        }}
                    </TextInput>
                    <TextInput inputType={InputType.password}>
                        {{
                            cs: { input: s['text-input'] },
                            name: "password", label: 'Пароль',
                            value: password, onChange: onChangePassword,
                        }}
                    </TextInput>
                    <Checkbox cs={s['remember-input']} name="remember" label="Запомнить"
                        isChecked={isRemember} onChange={onChangeRemember}
                    />
                    <JustButton cs={s['submit-input']} title="Войти"
                        disabled={isBlocked}
                    />
                </form>
            </div>
        </div >
    );
}
