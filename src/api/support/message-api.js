import { getRequest, putRequest } from '/src/lib/axios';

export const messageApi = {
  // 通知消息-分页查询
  queryMessage: (param) => {
    return putRequest('/message/listPage', param);
  },
  // 通知消息-查询未读消息数
  queryUnreadCount: () => {
    return getRequest('/message/unreadCount');
  },
  // 通知消息-标记已读
  updateReadFlag: (messageId) => {
    return getRequest(`/message/read/${messageId}`);
  },
};
