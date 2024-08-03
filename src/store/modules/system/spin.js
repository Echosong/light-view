/*
 * loading
 *
 * @Author:    二胡子
 * @Date:      2022-09-06 20:54:50
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import { defineStore } from 'pinia';

export const useSpinStore = defineStore({
  id: 'spin',
  state: () => ({
    loading: false,
  }),

  actions: {
    hide() {
      this.loading = false;
      let spins = document.querySelector('.ant-spin-nested-loading');
      spins.style.zIndex = 999;
    },
    show() {
      this.loading = true;
      let spins = document.querySelector('.ant-spin-nested-loading');
      spins.style.zIndex = 1001;
    },
  },
});
