/*
 * 字典
 *
 * @Author:    二胡子
 * @Date:      2022-09-03 21:55:25
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const dictApi = {
  // 分页查询数据字典KEY - @author Echosong
  keyQuery: (param) => {
    return postRequest('/support/dict/key/query', param);
  },
  // 查询全部字典key - @author Echosong
  queryAllKey: () => {
    return getRequest('/support/dict/key/queryAll');
  },
  /**
   * 分页查询数据字典value - @author Echosong  
   */ 
  valueQuery: (param) => {
    return postRequest('/support/dict/value/query', param);
  },
  // 数据字典KEY-添加- @author Echosong
  keyAdd: (param) => {
    return postRequest('/support/dict/key/add', param);
  },
  // 分页查询数据字典value - @author Echosong
  valueAdd: (param) => {
    return postRequest('/support/dict/value/add', param);
  },
  // 数据字典key-更新- @author Echosong
  keyEdit: (param) => {
    return postRequest('/support/dict/key/edit', param);
  },
  // 数据字典Value-更新- @author Echosong
  valueEdit: (param) => {
    return postRequest('/support/dict/value/edit', param);
  },
  // 数据字典key-删除- @author Echosong
  keyDelete: (keyIdList) => {
    return postRequest('/support/dict/key/delete', keyIdList);
  },
  // 数据字典Value-删除- @author Echosong
  valueDelete: (valueIdList) => {
    return postRequest('/support/dict/value/delete', valueIdList);
  },
  // 缓存刷新- @author Echosong
  cacheRefresh: () => {
    return getRequest('/support/dict/cache/refresh');
  },
  // 数据字典-值列表- @author Echosong
  valueList: (keyCode) => {
    return getRequest(`/support/dict/value/list/${keyCode}`);
  },
};
