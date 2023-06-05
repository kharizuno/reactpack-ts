import axios from 'axios';
import http from 'http';
import https from 'https';
import serialize from 'serialize-javascript';

import { localStore } from '../helpers';

class HttpApi {

    static requestHeaders(multipart?: any) {
        let token = localStore('_access_token');
        token = (token) ? token : process.env.REACT_APP_APP_AUTH;
        
        axios.defaults.headers['Authorization'] = (token) ? `jwt ${token}` : '';

        if (!multipart) axios.defaults.headers['Content-Type'] = 'application/json';
        axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
    }

    static requestConfig(cancelToken?: any) {
        let config = {
            httpAgent: new http.Agent({keepAlive: true}),
            httpsAgent: new https.Agent({keepAlive: true}),
            onDownloadProgress: (progressEvent: any) => {
                // let downloadCount = DownloadCount(progressEvent.timeStamp, progressEvent.total, progressEvent.loaded)
                // let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // console.log(percentCompleted, progressEvent, 'DOWNLOAD')
            },
            onUploadProgress: (progressEvent: any) => {
                // let downloadCount = DownloadCount(progressEvent.timeStamp, progressEvent.total, progressEvent.loaded)
                // let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // console.log(percentCompleted, progressEvent, 'UPLOAD')
            }
        }

        if (cancelToken) Object.assign(config, {cancelToken: cancelToken})
        return config;
    }

    static requestUrl(access?: string) {
        switch(access) {
            default:
                return process.env.REACT_APP_URL_API;
        }
    }

    static callGet(uri: string, data: any, access: string, cancelToken: any) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders();
        // let config: any = this.requestConfig();

        return axios.get(`${this.requestUrl(access)}/${uri}`, {params: data, cancelToken: cancelToken})
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            let msg = {error: true, message: error.message};
            if (error.response) Object.assign(msg, error.response.data);

            if (axios.isCancel(error)) {
                Object.assign(msg, {unmount: true});
                console.log("Request cancelled", error.message);
            }

            return msg;
        });
    }

    static callPost(uri: string, data: any, access: string, multipart: any, cancelToken: any) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders(multipart);
        return axios.post(`${this.requestUrl(access)}/${uri}`, serialize(data, {isJSON: true}), this.requestConfig(cancelToken))
        .then(function (response) {
            if (multipart && multipart.progress === 100) {
                // multipart.actprogress.loadProgress(false); 
            }

            return response.data;
        })
        .catch(function (error) {
            let msg = {error: true, message: error.message};
            if (error.response) Object.assign(msg, error.response.data);

            if (axios.isCancel(error)) {
                Object.assign(msg, {unmount: true});
                console.log("Request cancelled", error.message);
            }

            return msg;
        });
    }

    static callPut(uri: string, data: any, access: string, multipart: any, cancelToken: any) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders(multipart);
        return axios.put(`${this.requestUrl(access)}/${uri}`, serialize(data, {isJSON: true}), this.requestConfig(cancelToken))
        .then(function (response) {
            if (multipart && multipart.progress === 100) {
                // multipart.actprogress.loadProgress(false); 
            }

            return response.data;
        })
        .catch(function (error) {
            let msg = {error: true, message: error.message};
            if (error.response) Object.assign(msg, error.response.data);

            if (axios.isCancel(error)) {
                Object.assign(msg, {unmount: true});
                console.log("Request cancelled", error.message);
            }

            return msg;
        });
    }

    static callDelete(uri: string, data?: any, access?: string, cancelToken?: any) {
        cancelToken = (cancelToken) ? cancelToken.token : '';

        this.requestHeaders();
        return axios.delete(`${this.requestUrl(access)}/${uri}`, this.requestConfig(cancelToken))
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            let msg = {error: true, message: error.message};
            if (error.response) Object.assign(msg, error.response.data);

            if (axios.isCancel(error)) {
                Object.assign(msg, {unmount: true});
                console.log("Request cancelled", error.message);
            }

            return msg;
        });
    }
}

export default HttpApi;
