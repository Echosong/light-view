/*
 * 角色菜单
 *
 * @Author:    1024创新实验室-主任：卓大
 * @Date:      2022-09-03 22:00:49
 * @Wechat:    zhuda1024
 * @Email:     lab1024@163.com
 * @Copyright  1024创新实验室 （ https://1024lab.net ），Since 2012
 */
import { getRequest, putRequest } from '/src/lib/axios';
export const roleMenuApi = {
  /**
   * @description: 获取角色关联菜单权限
   */
  getRoleSelectedMenu: (roleId) => {
    return getRequest(`permission/getRoleSelectedMenu/${roleId}`);
  },
  /**
   * @description: 更新角色权限
   */
  updateRoleMenu: (data) => {
    return putRequest(`permission/updateRolePermissions/${data.roleId}`, data.menuIdList);
  },
};
