import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';
// 
import { selectError, setError, updateAccessToken } from '../redux/reducers/login-page.reducer';
import loginModuleAPI from '../api/loginModuleAPI';
import { fromAxiosError } from '../api/types/ErrorAPI';



// 
interface IProps {
    error: any,
    updateAccessToken: Function,
}

const ErrorProviderContainer = (
    { children, error, updateAccessToken }: PropsWithChildren<IProps>
): JSX.Element => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const timer = 60 * 60 * 1000;

    const refresh = () => {

        const isRemember = localStorage.getItem('is-remember');
        if (!isRemember) return;

        const refreshToken = localStorage.getItem('refresh-token');
        if (refreshToken) {
            updateAccessToken(refreshToken);
        }
        else {
            navigate('login');
        }
    }

    useEffect(() => {

        const interval = setInterval(async () => refresh(), timer);

        const interceptor = loginModuleAPI.setInterceptor(
            (error) => {
                dispatch(setError(fromAxiosError(error)));
                return Promise.reject(error);
            }
        );

        refresh();
        const isRemember = localStorage.getItem('is-remember');
        if (!isRemember) {
            navigate('login');
        }

        return () => {
            loginModuleAPI.removeInterceptor(interceptor);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (error) {
            if (error?.status === 401 || error?.statusText === 'Unauthorized' ||
                error?.data?.error === 'invalid_grant' // error_description: 'Stale token'
            ) {
                navigate('login');
            }
            else {
                navigate(`error`);
            }
        }
    }, [error]);

    return (<>{children}</>);
}



// 
const ErrorProvider = connect(
    (state) => ({ error: selectError(state) }),
    { updateAccessToken }
)(ErrorProviderContainer);

export default ErrorProvider;
