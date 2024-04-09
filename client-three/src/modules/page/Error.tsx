import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
// 
import { useStore } from "../../providers/RootStoreProvider";



// 
const Error = (): JSX.Element => {

    const navigate = useNavigate();
    const { authStore: { username, accessToken, setError } } = useStore();

    useEffect(() => {
        if (!username || !accessToken) {
            setError('Missing username or accessToken!');
            navigate('error');
        }
    }, []);

    return (<Outlet />);
}
export default Error;
