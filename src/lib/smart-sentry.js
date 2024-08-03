/*
 * 错误上报sentry
 *
 * @Author:    二胡子
 * @Date:      2022-09-06 20:49:28
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */

export const smartSentry = {
    /**
     * sentry 主动上报
     */
    captureError: (error) => {
        if (error.config && error.data && error && error.headers && error.request && error.status) {
            return;
        }
        //Sentry.captureException(error);
        console.error(error);
    },
};
