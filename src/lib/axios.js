/*
 *  ajax请求
 *
 * @Author:    二胡子
 * @Date:      2022-09-06 20:46:03
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { message, Modal } from 'ant-design-vue';
import axios from 'axios';
import { localClear, localRead } from '/@/utils/local-util';
import { DATA_TYPE_ENUM } from '../constants/common-const';
import _ from 'lodash';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';

// token的消息头
const TOKEN_HEADER = 'Authorization';

// 创建axios对象
const smartAxios = axios.create({
  baseURL: "/admin",
  timeout: 100000,
  withCredentials: true,
});

// 退出系统
function logout() {
  localClear();
  location.href = '/';
}

// ================================= 请求拦截器 =================================

smartAxios.interceptors.request.use(
  (config) => {
    // 在发送请求之前消息头加入token token
    const token = localRead(LocalStorageKeyConst.USER_TOKEN);
    if (token) {
      config.headers[TOKEN_HEADER] = token;
    } else {
      delete config.headers[TOKEN_HEADER];
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// ================================= 响应拦截器 =================================

// 添加响应拦截器
smartAxios.interceptors.response.use(
  (response) => {
    // 如果是json数据
    if (response.data && response.data instanceof Blob) {
      return response;
    }

    // 根据content-type ，判断是否为 json 数据
    let contentType = response.headers['content-type'] ? response.headers['content-type'] : response.headers['Content-Type'];
    if (contentType.indexOf('application/json') === -1) {
      return Promise.resolve(response);
    }
    // 如果是加密数据
    if (response.data.dataType === DATA_TYPE_ENUM.ENCRYPT.value) {
      response.data.encryptData = response.data.data;
      let decryptStr = decryptData(response.data.data);
      if (decryptStr) {
        response.data.data = JSON.parse(decryptStr);
      }
    }

    const res = response.data;
    if (res.code && res.code !== 200) {
      // `token` 过期或者账号已在别处登录
      if (res.code === 401 ) {
        message.destroy();
        message.error('您没有登录，请重新登录');
        setTimeout(logout, 300);
        return Promise.reject(response);
      }else{
        message.destroy();
        message.error(res.message);
        return Promise.reject(res);
      }
    } else {
      return Promise.resolve(res);
    }
  },
  (error) => {
    // 对响应错误做点什么
    if (error.message.indexOf('timeout') !== -1) {
      message.destroy();
      message.error('网络超时');
    } else if (error.message === 'Network Error') {
      message.destroy();
      message.error('网络连接错误');
    } else if (error.message.indexOf('Request') !== -1) {
      message.destroy();
      message.error('网络发生错误');
    }
    return Promise.reject(error);
  }
);

// ================================= 对外提供请求方法：通用请求，get， post, 下载download等 =================================

/**
 * get请求
 */
export const getRequest = (url, params) => {
  return request({ url, method: 'get', params });
};
export const deleteRequest = (url, params) => {
  return request({ url, method: 'delete', params });
};


/**
 * 通用请求封装
 * @param config
 */
export const request = (config) => {
  return smartAxios.request(config);
};

/**
 * post请求
 */
export const postRequest = (url, data) => {
  return request({
    data,
    url,
    method: 'post',
  });
};


/**
 * put 请求
 */
export const putRequest = (url, data) => {
  return request({
    data,
    url,
    method: 'put',
  });
};

// ================================= 加密 =================================

/**
 * 加密请求参数的post请求
 */
export const postEncryptRequest = (url, data) => {
  return request({
    data: { encryptData: encryptData(data) },
    url,
    method: 'post',
  });
};

// ================================= 下载 =================================

export const putDownload = function (url, data) {
  request({
    method: 'put',
    url,
    data,
    responseType: 'blob',
  })
    .then((data) => {
      handleDownloadData(data);
    })
    .catch((error) => {
      console.log("下载错误信息", error)
      handleDownloadError(error);
    });
};

/**
 * 文件下载
 */
export const getDownload = function (url, params) {
  request({
    url: url,
    method: 'get',
    params,
    responseType: 'blob'
  }).then((data) => {
      message.info("导出走到了")
      handleDownloadData(data);
    }).catch((error) => {
      handleDownloadError(error);
    });
};

function handleDownloadError(error) {
  if (error instanceof Blob) {
    const fileReader = new FileReader();
    fileReader.readAsText(error);
    fileReader.onload = () => {
      const msg = fileReader.result;
      message.destroy();
      message.error(msg);
    };
  } else {
    message.destroy();
    message.error('网络发生错误', error);
  }
}

function handleDownloadData(response) {
  if (!response) {
    return;
  }

  // 获取返回类型
  let contentType = _.isUndefined(response.headers['content-type']) ? response.headers['Content-Type'] : response.headers['content-type'];

  // 构建下载数据
  let url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;

  // 从消息头获取文件名
  let str = _.isUndefined(response.headers['content-disposition'])
    ? response.headers['Content-Disposition'].split(';')[1]
    : response.headers['content-disposition'].split(';')[1];

  let filename = _.isUndefined(str.split('fileName=')[1]) ? str.split('filename=')[1] : str.split('fileName=')[1];
  link.setAttribute('download', decodeURIComponent(filename));

  // 触发点击下载
  document.body.appendChild(link);
  link.click();

  // 下载完释放
  document.body.removeChild(link); // 下载完成移除元素
  window.URL.revokeObjectURL(url); // 释放掉blob对象
}
