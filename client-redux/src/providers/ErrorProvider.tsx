import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';
// 
import { selectError, setError, updateToken } from '../redux/reducers/login-page.reducer';
import loginModuleAPI from '../api/loginModuleAPI';
import { fromAxiosError } from '../api/types/ErrorAPI';



// 
export interface IUpdateToken {
    update: string,
    username: string,
    accessToken: string,
}

interface IProps {
    error: any,
    updateToken?: (values: IUpdateToken) => void,
}

const ErrorProviderContainer = (
    { children, error, updateToken }: PropsWithChildren<IProps>
): JSX.Element => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const timer = 60 * 60 * 1000;

    const refresh = () => {

        const isRemember = localStorage.getItem('is-remember');
        if (!isRemember) return;

        const update = localStorage.getItem('update');
        const username = localStorage.getItem('username');
        const accessToken = localStorage.getItem('access-token');
        if (updateToken && update && username && accessToken) {
            updateToken({ update, username, accessToken });
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
                error?.data?.error === 'invalid_grant'
                // { error: 'invalid_grant', error_description: 'Stale token' }
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
    { updateToken }
)(ErrorProviderContainer);

export default ErrorProvider;
