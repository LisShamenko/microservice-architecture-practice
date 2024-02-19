import { connect } from 'react-redux';
// 
import { selectError } from '../../../redux/reducers/login-page.reducer';
import { ErrorPage } from './ErrorPage';
import { ErrorAPI } from '../../../api/types/ErrorAPI';



// 
interface IProps {
    error: ErrorAPI | Error | string | null,
}

const ErrorPageContainerAPI = ({ error }: IProps) => {
    return (
        <ErrorPage err={error} />
    );
}

// 
const ErrorPageContainer = connect(
    (state) => ({
        error: selectError(state)
    }),
    {}
)(ErrorPageContainerAPI);

// 
export default ErrorPageContainer;
