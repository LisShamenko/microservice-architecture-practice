import { MouseEvent } from 'react';
// 
import s from './dashboard-page.module.sass';
import { JustButton } from '../../../library/interaction/button/JustButton/JustButton';
import { InputType } from '../../../library/interaction/input/BaseInput/types';
import { TextInput } from '../../../library/interaction/input/TextInput/TextInput';
import { IButtonMode } from '../../../library/interaction/button/JustButton/types';



// 
export interface ISubmitDashboardPage {
    accessToken: string,
    refreshToken: string,
}

export interface IPropsDashboardPage {
    id: string,
    username: string,
    accessToken: string,
    refreshToken: string,
    isBlocked?: boolean,
    onLogout?: (values: ISubmitDashboardPage) => void,
}

export const DashboardPage = (
    {
        id, username, accessToken, refreshToken,
        isBlocked = false, onLogout,
    }: IPropsDashboardPage
): JSX.Element => {

    const onClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (onLogout) {
            onLogout({ accessToken, refreshToken });
        }
        return false;
    }

    return (
        <main className={s['dashboard-page']}>
            <div className={s['panel-container']}>
                <div className={s['panel']}>
                    <TextInput inputType={InputType.text}>
                        {{
                            cs: { root: s['text-root'], input: s['text-input'] },
                            readonly: true, name: "id", label: 'id', value: id,

                        }}
                    </TextInput>
                    <TextInput inputType={InputType.text}>
                        {{
                            cs: { root: s['text-root'], input: s['text-input'] },
                            readonly: true, name: "username", label: 'username',
                            value: username,
                        }}
                    </TextInput>
                    <JustButton cs={s['submit-input']} title="Выйти"
                        onClick={onClick} disabled={isBlocked}
                        mode={IButtonMode.listItem}
                    />
                </div>
            </div>
        </main>
    );
}
