/*
 *  登录
 *
 * @Author:    二胡子
 * @Date:      2022-09-03 21:59:58
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { getRequest, postRequest } from '/src/lib/axios';

export const loginApi = {
  /**
   * 登录 @author Echosong
   */
  login: (param) => {
    return postRequest('/user/login', param);
  },

  /**
   * 退出登录 @author Echosong
   */
  logout: () => {
    return getRequest('/user/logout');
  },

  /**
   * 获取验证码 @author Echosong
   */
  getCaptcha: () => {
    return getRequest('/user/captcha');
  },

  /**
   * 获取登录信息 @author Echosong
   */
  getLoginInfo: () => {
    return getRequest('/user/getLoginInfo');
  },
};
