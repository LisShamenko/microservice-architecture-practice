import { useParams } from "react-router-dom";
// 
import { ErrorAPI, isErrorAPI } from "../../../api/types/ErrorAPI";



// 
interface IPropsErrorPage {
    err: ErrorAPI | Error | string | null,
}

export const ErrorPage = (
    { err }: IPropsErrorPage
): JSX.Element => {

    let params = useParams();

    return (
        <main>
            {params['code'] && (<>error: {params['code']}</>)}
            {(typeof err === 'string') && (<>error: {err}</>)}
            {(err instanceof Error) && (<>error: {err.message}</>)}
            {isErrorAPI(err) && (<>
                <p>message: {err.message}</p>
                <p>code: {err.code}</p>
                {err.status && (<p>status: {err.status}</p>)}
                {err.statusText && (<p>statusText: {err.statusText}</p>)}
                {err.data && (<p>data: {JSON.stringify(err.data)}</p>)}
            </>)}
        </main>
    );
}
