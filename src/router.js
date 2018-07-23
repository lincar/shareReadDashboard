// noinspection JSAnnotator
import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => {
    require(['./views/login.vue'], resolve);
  }

};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/article/list',
  component: Main,
  children: [
    {
      path: 'article/edit',
      title: '添加文章',
      name: 'article-edit',
      component: resolve => {
        require(['./shareRead/article/edit.vue'], resolve);
      }
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
//如果想保持组件keep-alive，组件名和name字段保持一致
export const appRouter = [
  {
    path: '/classify',
    icon: 'android-folder',
    name: 'classify',
    title: '分类管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '分类列表',
        name: 'classify-list',
        component: resolve => {
          require(['./shareRead/classify/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/article',
    icon: 'android-folder',
    name: 'article',
    title: '文章管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '文章列表',
        name: 'article-list',
        component: resolve => {
          require(['./shareRead/article/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/product',
    icon: 'android-folder',
    name: 'product',
    title: '套餐管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '套餐列表',
        name: 'product-list',
        component: resolve => {
          require(['./shareRead/product/list.vue'], resolve);
        }
      }
    ]
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter,
];
