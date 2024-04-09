import { connect } from 'react-redux';
// 
import { RequestStatus, registerUser, selectRegisterStatus } from '../../../redux/reducers/login-page.reducer';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ISubmitRegisterForm, RegisterForm } from './RegisterForm';



// 
interface IProps {
    registerUser: (values: ISubmitRegisterForm) => void,
    registerStatus: RequestStatus,
}

const RegisterFormContainerAPI = ({
    registerUser, registerStatus,
}: IProps) => {

    const navigate = useNavigate();
    useEffect(() => {
        if (registerStatus === 'ready') navigate('../dashboard');
    }, [registerStatus]);

    const onClickUserLogin = (values: ISubmitRegisterForm) => {
        registerUser(values);
    }

    return (
        <RegisterForm isBlocked={registerStatus === 'loading'}
            onSubmit={onClickUserLogin}
        />
    );
}



// 
const RegisterFormContainer = connect(
    (state) => ({
        registerStatus: selectRegisterStatus(state),
    }),
    { registerUser }
)(RegisterFormContainerAPI);

export default RegisterFormContainer;
