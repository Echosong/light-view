/*
 * 类目api
 *
 * @Author:    Echosong
 * @Date:      2022-09-03 21:35:00
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { getRequest, postRequest } from '/@/lib/axios';

export const categoryApi = {
  // 添加类目 @author Echosong
  addCategory: (param) => {
    return postRequest('/category/add', param);
  },
  // GET
  // 删除类目 @author Echosong
  deleteCategoryById: (categoryId) => {
    return getRequest(`/category/delete/${categoryId}`);
  },
  // 查询类目层级树 @author Echosong
  queryCategoryTree: (param) => {
    return postRequest('/category/tree', param);
  },
  // 更新类目 @author Echosong
  updateCategory: (param) => {
    return postRequest('/category/update', param);
  },
};
