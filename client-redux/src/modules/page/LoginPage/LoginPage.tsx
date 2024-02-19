import s from './login-page.module.sass';
import LoginFormContainer from "../../widget/form/LoginFormContainer";
import RegisterFormContainer from "../../widget/form/RegisterFormContainer";



// 
export const LoginPage = (): JSX.Element => {
    return (
        <main className={s['login-page']}>
            <div className={s['panel-container'] + ' ' + s['left-panel']}>
                <div className={s['panel']}>
                    <LoginFormContainer />
                </div>
            </div>
            <div className={s['panel-container'] + ' ' + s['right-panel']}>
                <div className={s['panel']}>
                    <RegisterFormContainer />
                </div>
            </div>
        </main>
    );
}
