/*
 * 部门
 *
 * @Author:    二胡子
 * @Date:      2022-09-03 21:58:50
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { getRequest, postRequest } from '/src/lib/axios';

export const departmentApi = {
  /**
   * 查询部门列表 @author Echosong
   */
  queryAllDepartment: () => {
    return getRequest('/department/listAll');
  },

  /**
   * 查询部门树形列表 @author Echosong
   */
  queryDepartmentTree: () => {
    return getRequest('/department/treeList');
  },

  /**
   * 添加部门 @author Echosong
   */
  addDepartment: (param) => {
    return postRequest('/department/add', param);
  },
  /**
   * 更新部门信息 @author Echosong
   */
  updateDepartment: (param) => {
    return postRequest('/department/update', param);
  },
  /**
   * 删除
   */
  deleteDepartment: (departmentId) => {
    return getRequest(`/department/delete/${departmentId}`);
  },
};
