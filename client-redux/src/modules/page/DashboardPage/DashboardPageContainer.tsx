import { connect } from 'react-redux';
// 
import {
    RequestStatus, getUser, logoutUser, selectUserId, selectUsername,
    selectAccessToken, selectRefreshToken, selectLogoutStatus,
} from '../../../redux/reducers/login-page.reducer';
import { DashboardPage, ISubmitDashboardPage } from './DashboardPage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



// 
interface IProps {
    id: string,
    username: string,
    accessToken: string,
    refreshToken: string,
    logoutStatus: RequestStatus,
    getUser: Function,
    logoutUser: Function,
}

const DashboardPageContainerAPI = ({
    id, username, accessToken, refreshToken,
    logoutStatus, getUser, logoutUser,
}: IProps) => {

    const navigate = useNavigate();

    useEffect(() => {
        getUser({ username, accessToken });
    }, []);

    useEffect(() => {
        if (logoutStatus === 'ready') navigate('../login');
    }, [logoutStatus]);

    const onClickLogoutUser = (values: ISubmitDashboardPage) => {
        logoutUser(values);
    }

    return (
        <DashboardPage id={id} username={username}
            accessToken={accessToken} refreshToken={refreshToken}
            isBlocked={logoutStatus === 'loading'}
            onLogout={onClickLogoutUser}
        />
    );
}

// 
const DashboardPageContainer = connect(
    (state) => ({
        id: selectUserId(state),
        username: selectUsername(state),
        accessToken: selectAccessToken(state),
        refreshToken: selectRefreshToken(state),
        logoutStatus: selectLogoutStatus(state),
    }),
    { getUser, logoutUser }
)(DashboardPageContainerAPI);

// 
export default DashboardPageContainer;
