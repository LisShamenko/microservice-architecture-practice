import { compose } from 'redux';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// 
import withRouter from '../../../hocs/withRouter';
import { RequestStatus, loginUser, selectLoginStatus } from '../../../redux/reducers/login-page.reducer';
import { ISubmitLoginForm, LoginForm } from './LoginForm';



// 
interface IProps {
    loginUser: Function,
    loginStatus: RequestStatus,
}

const LoginFormContainerAPI = ({
    loginUser, loginStatus,
}: IProps) => {

    const initRemember = localStorage.getItem('is-remember');
    const navigate = useNavigate();

    useEffect(() => {
        if (loginStatus === 'ready') navigate('../dashboard');
    }, [loginStatus]);

    const onClickUserLogin = (values: ISubmitLoginForm) => {
        loginUser(values);
    }

    return (
        <LoginForm isBlocked={loginStatus === 'loading'}
            initRemember={!!initRemember}
            onSubmit={onClickUserLogin}
        />
    );
}

// 
export const LoginFormContainer = compose<Function>(
    connect(
        (state) => ({
            loginStatus: selectLoginStatus(state),
        }),
        { loginUser }
    ),
    withRouter,
)(LoginFormContainerAPI);

// 
const TSIgnore = (): JSX.Element => {
    // @ts-ignore
    return (<LoginFormContainer />);
}
export default TSIgnore;
