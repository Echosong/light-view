/*
 * 角色
 *
 * @Author:    1024创新实验室-主任：卓大
 * @Date:      2022-09-03 22:00:41
 * @Wechat:    zhuda1024
 * @Email:     lab1024@163.com
 * @Copyright  1024创新实验室 （ https://1024lab.net ），Since 2012
 */
import { getRequest, deleteRequest, postRequest, putRequest } from '/src/lib/axios';

export const userApi = {
    listPage: (params) => {
        return putRequest('/user/listPage', params);
    },
}