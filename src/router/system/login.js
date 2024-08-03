/*
 * 登录页面
 *
 * @Author:    二胡子
 * @Date:      2022-09-06 20:51:50
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */

export const loginRouters = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('/src/views/system/login/login.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
    },
  },
];
