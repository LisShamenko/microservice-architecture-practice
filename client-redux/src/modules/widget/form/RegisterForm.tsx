import { FormEvent } from 'react';
//
import s from './base-form.module.sass';
import useInputState from '../../../library/hooks/useInputState';
import { JustButton } from '../../../library/interaction/button/JustButton/JustButton';
import { InputType } from '../../../library/interaction/input/BaseInput/types';
import { TextInput } from '../../../library/interaction/input/TextInput/TextInput';



// 
export interface ISubmitRegisterForm {
    username: string;
    password: string;
}

interface IPropsRegisterForm {
    cs?: string,
    action?: string,
    isBlocked?: boolean,
    onSubmit?: (values: ISubmitRegisterForm) => void,
}

export const RegisterForm = (
    {
        cs = '', action = '', isBlocked = false,
        onSubmit,
    }: IPropsRegisterForm
): JSX.Element => {

    const [username, onChangeUsername] = useInputState('');
    const [password, onChangePassword] = useInputState('');

    const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({ username: username, password: password });
        }
        return false;
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
                    <JustButton cs={s['submit-input']} title="Создать"
                        disabled={isBlocked}
                    />
                </form>
            </div>
        </div >
    );
}
