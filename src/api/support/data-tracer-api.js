/*
 * 数据变动
 *
 * @Author:    Echosong
 * @Date:      2022-09-03 21:51:54
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { postRequest } from '/src/lib/axios';

export const dataTracerApi = {
  // 分页查询业务操作日志 - @author Echosong
  queryList: (param) => {
    return postRequest('/support/dataTracer/query', param);
  },
  
};
