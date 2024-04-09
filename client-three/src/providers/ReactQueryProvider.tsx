
import { useCallback, PropsWithChildren } from 'react';
import { QueryClientProvider, QueryClient, QueryCache } from "@tanstack/react-query";



//      `./query/query.cache`
const createQueryCache = (onErrorFn: (err: unknown) => void) => new QueryCache({
    onError: err => onErrorFn(err)
})

//      `./query/query.client`
const createQueryClient = (onErrorFn: (err: unknown) => void) => new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            // keepPreviousData: true,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            onError: err => onErrorFn(err)
        }
    },
    queryCache: createQueryCache(onErrorFn)
})

//      `/`
interface IProps { }

export default function ReactQueryProvider(
    { children }: PropsWithChildren<IProps>
): JSX.Element {

    const queryClient = createQueryClient(
        useCallback((error: any) => {
            console.log('--- error = ', error);
        }, [])
    );

    return (
        // contextSharing={true}
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
