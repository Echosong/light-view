/*
 * reload (内存热加载、钩子等)
 *
 * @Author:    二胡子
 * @Date:      2022-09-03 21:57:19
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const reloadApi = {
  // 查询reload列表 @author 卓大
  queryList: () => {
    return getRequest('/support/reload/query');
  },
  // 获取reload result @author 卓大
  queryReloadResult: (tag) => {
    return getRequest(`/support/reload/result/${tag}`);
  },
  // 执行reload @author 卓大
  reload: (reloadForm) => {
    return postRequest('/support/reload/update', reloadForm);
  },
};
