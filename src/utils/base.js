import {getRequest, postRequest, request, putRequest, deleteRequest, putDownload} from '/src/lib/axios';
import {Modal, message} from "ant-design-vue";

export const base = {

    get: (url) => {
        return getRequest(url);
    },

    post: (url, params) => {
        return postRequest(url, params);
    },

    put: (url, params) => {
        return putRequest(url, params);
    },

    delete: (url, params) => {
        return deleteRequest(url, params);
    },

    upload: (url, params) =>{
        return request({
            url: url,
            method: 'post',
            data: params,
            headers: {'Content-Type': 'multipart/form-data;charset=utf-8'},
        })
    },

    download: (url, params)=> {
        putDownload(url, params)
    },

    confirm: (msg, callback)=> {
        Modal.confirm({
            title: '提示',
            content: msg,
            okText: '删除',
            okType: 'danger',
            onOk() {
               callback();
            },
            cancelText: '取消',
            onCancel() {
            },
        })
    },

    success: (msg)=> {
        message.success(msg);
    },
    error: (msg)=> {
        message.error(msg);
    },
    warning: (msg)=> {
        message.warning(msg);
    },
    info: (msg)=> {
        message.info(msg);
    }
};
