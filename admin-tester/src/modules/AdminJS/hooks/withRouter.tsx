import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

/**
 * @see https://reactrouter.com/en/main/start/faq
 */
export function withRouter<ComponentProps>(
    Component: React.FunctionComponent<ComponentProps>
) {

    function ComponentWithRouterProp(props: ComponentProps) {
        const location = useLocation();
        const navigate = useNavigate();
        const params = useParams();
        return <Component {...props} router={{ location, navigate, params }} />;
    }

    return ComponentWithRouterProp;
}

export type WithRouterProps = {
    router: {
        location: any,
        navigate: any,
        params: any,
    }
}
