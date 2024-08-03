/*
 * 角色
 *
 * @Author:    二胡子
 * @Date:      2022-09-03 22:00:41
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { getRequest, deleteRequest, postRequest, putRequest } from '/src/lib/axios';

export const userApi = {
    listPage: (params) => {
        return putRequest('/user/listPage', params);
    },
}