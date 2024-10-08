/*
 * 登录用户
 *
 * @Author:    二胡子
 * @Date:      2022-09-06 20:55:09
 * @Wechat:    zhuda1024
 * @Email:     zq_songfeigang@163.com
 * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
 */
import _ from 'lodash';
import { defineStore } from 'pinia';
import localKey from '/@/constants/local-storage-key-const';
import { HOME_PAGE_NAME } from '/@/constants/system/home-const';
import { MENU_TYPE_ENUM } from '/@/constants/system/menu-const';
import { localClear, localRead, localSave } from '/@/utils/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const';
import { messageApi } from '/@/api/support/message-api.js';
import { smartSentry } from '/@/lib/smart-sentry.js';

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    token: '',
    //员工id
    userid: '',
    // 头像
    avatar: '',
    //登录名
    username: '',
    //姓名
    name: '',
    actualName:'',
    //手机号
    phone: '',
    //部门id
    roleId: '',
    //部门名词
    roleName: '',
    //是否为超级管理员
    administratorFlag: true,
    //上次登录ip
    lastLoginIp: '',
    //上次登录ip地区
    lastLoginIpRegion: '',
    //上次登录 设备
    lastLoginUserAgent: '',
    //上次登录时间
    lastLoginTime: '',
    //左侧菜单树形结构
    menuTree: [],
    //存在页面路由的菜单集合
    menuRouterList: [],
    //是否完成menuRouter初始化
    menuRouterInitFlag: false,
    //父类菜单集合
    menuParentIdListMap: new Map(),
    // 功能点集合
    pointsList: [],
    // 标签页
    tagNav: null,
    // 缓存
    keepAliveIncludes: [],
    // 未读消息数量
    unreadMessageCount: 0,
  }),
  getters: {
    getToken(state) {
      if (state.token) {
        return state.token;
      }
      return localRead(LocalStorageKeyConst.USER_TOKEN);
    },
    //是否初始化了 路由
    getMenuRouterInitFlag(state) {
      return state.menuRouterInitFlag;
    },
    //菜单树
    getMenuTree(state) {
      return state.menuTree;
    },
    //菜单的路由
    getMenuRouterList(state) {
      return state.menuRouterList;
    },
    //菜单的父级id
    getMenuParentIdListMap(state) {
      return state.menuParentIdListMap;
    },
    //功能点
    getPointList(state) {
      if (_.isEmpty(state.pointsList)) {
        let localUserPoints = localRead(localKey.USER_POINTS) || '';
        state.pointsList = localUserPoints ? JSON.parse(localUserPoints) : [];
      }
      return state.pointsList;
    },
    //标签页
    getTagNav(state) {
      if (_.isNull(state.tagNav)) {
        let localTagNav = localRead(localKey.USER_TAG_NAV) || '';
        state.tagNav = localTagNav ? JSON.parse(localTagNav) : [];
      }
      let tagNavList = _.cloneDeep(state.tagNav) || [];
      tagNavList.unshift({
        menuName: HOME_PAGE_NAME,
        menuTitle: '首页',
      });
      return tagNavList;
    },
  },

  actions: {
    logout() {
      this.token = '';
      this.menuList = [];
      this.tagNav = [];
      this.userInfo = {};
      this.unreadMessageCount = 0;
      localClear();
    },
    // 查询未读消息数量
    async queryUnreadMessageCount() {
      try {
        let result = await messageApi.queryUnreadCount();
        this.unreadMessageCount = result.data;
      } catch (e) {
        smartSentry.captureError(e);
      }
    },
    //设置登录信息
    setUserLoginInfo(data) {
      // 用户基本信息
      this.token = data.token;
      this.userId = data.id;
      this.avatar = data.avatar;
      this.username = data.username;
      this.name = data.name;
      this.phone = data.username;
      this.roleId = data.roleId;
      this.roleName = data.roleName;
      this.loginIp = data.loginIp;
      this.actualName = data.name;
      //菜单权限
      this.menuTree = buildMenuTree(data.menuList);

      //拥有路由的菜单
      this.menuRouterList = data.menuList.filter((e) => e.perms || e.url);

      //父级菜单集合
      this.menuParentIdListMap = buildMenuParentIdListMap(this.menuTree);

      //功能点
      this.pointsList = data.menuList.filter((menu) => menu.menuType === MENU_TYPE_ENUM.POINTS.value && menu.visibleFlag && !menu.disabledFlag);

      // 获取用户未读消息
      this.queryUnreadMessageCount();

      console.log("设置.......", this.menuTree, this.menuRouterList, this.menuParentIdListMap, this.pointsList)

    },
    setToken(token) {
      this.token = token;
    },
    //设置标签页
    setTagNav(route, from) {
      if (_.isNull(this.tagNav)) {
        let localTagNav = localRead(localKey.USER_TAG_NAV) || '';
        this.tagNav = localTagNav ? JSON.parse(localTagNav) : [];
      }
      // name唯一标识
      let name = route.name;
      if (!name || name === HOME_PAGE_NAME || name === '403' || name === '404') {
        return;
      }
      let findTag = (this.tagNav || []).find((e) => e.menuName === name);
      if (findTag) {
        // @ts-ignore
        findTag.fromMenuName = from.name;
        findTag.fromMenuQuery = from.query;
      } else {
        // @ts-ignore
        this.tagNav.push({
          // @ts-ignore
          menuName: name,
          // @ts-ignore
          menuTitle: route.meta.title,
          menuQuery: route.query,
          // @ts-ignore
          fromMenuName: from.name,
          fromMenuQuery: from.query,
        });
      }
      localSave(localKey.USER_TAG_NAV, JSON.stringify(this.tagNav));
    },
    //关闭标签页
    closeTagNav(menuName, closeAll) {
      if (_.isEmpty(this.getTagNav)) return;
      if (closeAll && !menuName) {
        this.tagNav = [];
        this.clearKeepAliveIncludes();
      } else {
        let findIndex = (this.tagNav || []).findIndex((e) => e.menuName === menuName);
        if (closeAll) {
          if (findIndex === -1) {
            this.tagNav = [];
            this.clearKeepAliveIncludes();
          } else {
            let tagNavElement = (this.tagNav || [])[findIndex];
            this.tagNav = [tagNavElement];
            this.clearKeepAliveIncludes(tagNavElement.menuName);
          }
        } else {
          (this.tagNav || []).splice(findIndex, 1);
          this.deleteKeepAliveIncludes(menuName);
        }
      }
      localSave(localKey.USER_TAG_NAV, JSON.stringify(this.tagNav));
    },
    //关闭页面
    closePage(route, router, path) {
      if (!this.getTagNav || _.isEmpty(this.getTagNav)) return;
      if (path) {
        router.push({ path });
      } else {
        // 寻找tagNav
        let index = this.getTagNav.findIndex((e) => e.menuName === route.name);
        if (index === -1) {
          router.push({ name: HOME_PAGE_NAME });
        } else {
          let tagNav = this.getTagNav[index];
          if (tagNav.fromMenuName && this.getTagNav.some((e) => e.menuName === tagNav.fromMenuName)) {
            router.push({ name: tagNav.fromMenuName, query: tagNav.fromMenuQuery });
          } else {
            // 查询左侧tag
            let leftTagNav = this.getTagNav[index - 1];
            router.push({ name: leftTagNav.menuName, query: leftTagNav.menuQuery });
          }
        }
      }
      this.closeTagNav(route.name, false);
    },
    // 加入缓存
    pushKeepAliveIncludes(val) {
      if (!val) {
        return;
      }
      if (!this.keepAliveIncludes) {
        this.keepAliveIncludes = [];
      }
      if (this.keepAliveIncludes.length < 30) {
        let number = this.keepAliveIncludes.findIndex((e) => e === val);
        if (number === -1) {
          this.keepAliveIncludes.push(val);
        }
      }
    },
    // 删除缓存
    deleteKeepAliveIncludes(val) {
      if (!this.keepAliveIncludes || !val) {
        return;
      }
      let number = this.keepAliveIncludes.findIndex((e) => e === val);
      if (number !== -1) {
        this.keepAliveIncludes.splice(number, 1);
      }
    },
    // 清空缓存
    clearKeepAliveIncludes(val) {
      if (!val || !this.keepAliveIncludes.includes(val)) {
        this.keepAliveIncludes = [];
        return;
      }
      this.keepAliveIncludes = [val];
    },
  },
});

/**
 * 构建菜单父级集合
 */
function buildMenuParentIdListMap(menuTree) {
  let menuParentIdListMap = new Map();
  recursiveBuildMenuParentIdListMap(menuTree, [], menuParentIdListMap);
  return menuParentIdListMap;
}

function recursiveBuildMenuParentIdListMap(menuList, parentMenuList, menuParentIdListMap) {
  for (const e of menuList) {
    // 顶级parentMenuList清空
    if (e.parentId === 0) {
      parentMenuList = [];
    }
    let menuIdStr = e.id.toString();
    let cloneParentMenuList = _.cloneDeep(parentMenuList);
    if (!_.isEmpty(e.children) ) {
      // 递归
      cloneParentMenuList.push({ name: menuIdStr, title: e.name });
      recursiveBuildMenuParentIdListMap(e.children, cloneParentMenuList, menuParentIdListMap);
    } else {
      menuParentIdListMap.set(menuIdStr, cloneParentMenuList);
    }
  }
}

/**
 * 构建菜单树
 *
 * @param  menuList
 * @returns
 */
function buildMenuTree(menuList) {
  //1 获取所有 有效的 目录和菜单
  let catalogAndMenuList = menuList.filter((menu) => menu.type !== MENU_TYPE_ENUM.POINTS.value && menu.show);

  //2 获取顶级目录
  let topCatalogList = catalogAndMenuList.filter((menu) => menu.parentId === 0);
  for (const topCatalog of topCatalogList) {
    buildMenuChildren(topCatalog, catalogAndMenuList);
  }
  return topCatalogList;
}

function buildMenuChildren(menu, allMenuList) {
  let children = allMenuList.filter((e) => e.parentId === menu.id);
  if (children.length === 0) {
    return;
  }
  menu.children = children;
  for (const item of children) {
    buildMenuChildren(item, allMenuList);
  }
}
