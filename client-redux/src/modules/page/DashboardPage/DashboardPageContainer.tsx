import { connect } from 'react-redux';
// 
import {
    RequestStatus, getUser, logoutUser, selectUserId, selectUsername,
    selectAccessToken, selectLogoutStatus, selectUpdate,
} from '../../../redux/reducers/login-page.reducer';
import { DashboardPage, ISubmitDashboardPage } from './DashboardPage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



// 
export interface IGetUser {
    username: string,
    accessToken: string,
}

interface IProps {
    id: string,
    username: string,
    update: string,
    accessToken: string,
    logoutStatus: RequestStatus,
    getUser: (values: IGetUser) => void,
    logoutUser: (values: ISubmitDashboardPage) => void,
}

const DashboardPageContainerAPI = ({
    id, username, update, accessToken,
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
        <DashboardPage id={id}
            username={username}
            update={update}
            accessToken={accessToken}
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
        update: selectUpdate(state),
        accessToken: selectAccessToken(state),
        logoutStatus: selectLogoutStatus(state),
    }),
    { getUser, logoutUser }
)(DashboardPageContainerAPI);

// 
export default DashboardPageContainer;
