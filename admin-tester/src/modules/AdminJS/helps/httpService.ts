import axios, { AxiosInstance } from 'axios';
// 
import { adminJSConfig } from '../../../../configs/adminJSConfig';



// 
export type UploadProgressFunction =
    (progressEvent: axios.AxiosProgressEvent) => void;

export type UploadOptions = {
    file: any,
    user_id: number,
    title: string,
};

export class HttpService {
    baseUrl: string;
    http: AxiosInstance;

    constructor(url) {
        this.baseUrl = url;
        this.http = axios.create({
            baseURL: this.baseUrl,
            headers: {
                // "Content-type": "application/json",
            }
        });
    }

    getUrl(url: string) {
        return `${this.baseUrl}/${url}`;
    }

    async upload(options: UploadOptions, onUploadProgress: UploadProgressFunction) {

        // const json = JSON.stringify({ json: "json" });
        // const blob = new Blob([json], { type: 'application/json' });
        // const data = new FormData();
        // data.append("document", blob);

        let formData = new FormData();
        formData.append("file", options.file);
        formData.append("document", JSON.stringify({
            directory: 'photo',
            user_id: options.user_id,
            title: options.title,
        }));

        return await httpService.http.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
    }

    async getFiles(userId: number) {
        return await httpService.http.get("/upload", {
            params: {
                user_id: userId,
            },
        });
    }
}



// 
const config = adminJSConfig();
const httpService = new HttpService(config.url);

export default httpService;
