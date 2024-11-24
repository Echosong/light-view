/*
 * 文件上传
 *
 * @Author:    二胡子
 * @Date:      2022-09-03 21:55:25
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { postRequest, getRequest, getDownload } from '/src/lib/axios';

export const fileApi = {
  // 文件上传 @author Echosong
  uploadUrl: '/support/file/upload',
  uploadFile: (param, folder) => {
    return postRequest(`/support/file/upload?folder=${folder}`, param);
  },

  /**
   * 分页查询  @author Echosong
   */
  queryPage: (param) => {
    return postRequest('/support/file/queryPage', param);
  },
  /**
   * 获取文件URL：根据fileKey @author 胡克
   */
  getUrl: (fileKey) => {
    return getRequest(`/support/file/getFileUrl?fileKey=${fileKey}`);
  },

  /**
   * 下载文件流（根据fileKey） @author 胡克
   */
  downLoadFile: (fileKey) => {
    return getDownload('/support/file/downLoad', { fileKey });
  },
};
