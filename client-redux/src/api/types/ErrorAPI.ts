
export interface ErrorAPI {
    message: string;
    code: string;
    status: number | null;
    statusText: string | null;
    data: any,
}

export const fromAxiosError = (error: any) => {

    if (error.response) return {
        message: error.message,
        code: error.code,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
    } as ErrorAPI;

    return {
        message: error.message,
        code: error.code,
        status: null,
        statusText: null,
    } as ErrorAPI;
}

export const isErrorAPI = (obj: any): obj is ErrorAPI => {
    if (!obj) return false;
    return (
        'message' in obj && 'code' in obj &&
        'status' in obj && 'statusText' in obj
    );
}