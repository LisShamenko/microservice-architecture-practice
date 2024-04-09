import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
// 
import { useStore } from "../../../providers/RootStoreProvider";



// 
const App = (): JSX.Element => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { authStore: { setAuth, setError } } = useStore();

    useEffect(() => {

        const update = searchParams.get('update');
        const username = searchParams.get('username');
        const accessToken = searchParams.get('access_token');

        if (username && update && accessToken) {
            setAuth(username, update, accessToken);
            navigate('wrapper');
        }
        else {
            setError('Missing username or accessToken!');
            navigate('error');
        }
    }, []);

    return (<></>);
}
export default App;
