import { ComponentType } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";



const withRouter = (Component: ComponentType) => (props: any) => {

    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    return (
        <Component {...props} router={{ location, navigate, params }} />
    );
}
export default withRouter;
