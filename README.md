#light-view

### 部署
根目录下执行，安装依赖包 node 版本 v18+

```shell
npm install
```
开发环境运行 配置接口
```ts
NODE_ENV=development
VITE_APP_TITLE='LightAdmin'
VITE_APP_API_URL='http://localhost:2034/'
```
开发环境运行
```shell
npm run dev
```
生产环境打包
```shell
npm run build:prod
```



### 配合 Light Admin 生成代码


### 第一阶段目标

1. 完成自动生成 list（列表页面） list.vue

> 列表页面包括两个部分  筛选表单 表格数据

2. 完全自动生成自定义的（添加修改） add.vue
3. 完成自动生成（查看页面） info.vue
4. info.vue 利用公共生成查看信息，不再单独生产，如果单独那肯定表示有特殊业务需要，这个时候可以业务处理

### 第二阶段目标

1. 表格通过后端 tableColumns 配置生成
2. add.vue 也通过后端的formConfig 配置生成

> 这些配置 再代码生成的时候 自动保存入 tableColumn 表里面

| 表名 | 列表配置 | 筛选配置 | 表单配置 |
|------|----------|----------|----------|
| table_name | tableColumns | formConfig | formConfig |

3、 设计一个公共的 列表目标 + 表达模板

> 生成代码时候不需要生成对应的 add.vue  和 list.vue 利用公共的模板


### 后端项目

此项目为 轻巧之光（lightAdmin） 前端项目，其后端项目地址为 [light-admin](https://github.com/Echosong/light)



