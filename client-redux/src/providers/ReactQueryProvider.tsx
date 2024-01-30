
import React, { useCallback, PropsWithChildren } from 'react';
import { QueryClientProvider, QueryClient, QueryCache } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Alert } from "@mui/material";



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

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const queryClient = createQueryClient(
        useCallback((error: any) => {
            enqueueSnackbar('', {
                content: (
                    <Alert severity="error" onClose={() => closeSnackbar()}>
                        {error}
                    </Alert>
                ),
            })
        }, [])
    );

    return (
        // contextSharing={true}
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
