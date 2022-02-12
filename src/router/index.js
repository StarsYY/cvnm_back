import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/admin-list',
    name: 'Admin',
    meta: { title: 'adminlist', icon: 'table' },
    children: [
      {
        path: 'admin-list',
        component: () => import('@/views/admin/admin-list'),
        name: 'AdminList',
        meta: { title: 'adminlist' }
      },
      {
        path: 'admin-add',
        component: () => import('@/views/admin/admin-add'),
        name: 'AdminAdd',
        meta: { title: 'adminadd' },
        hidden: true
      },
      {
        path: 'admin-edit/:id',
        component: () => import('@/views/admin/admin-add'),
        name: 'AdminEdit',
        meta: { title: 'adminedit' },
        hidden: true
      }
    ]
  },

  {
    path: '/label',
    component: Layout,
    redirect: '/label/label-list',
    name: 'Label',
    meta: { title: 'label', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'label-list',
        component: () => import('@/views/label/label-list'),
        name: 'LabelList',
        meta: { title: 'labellist', icon: 'tree' }
      },
      {
        path: 'category-list',
        component: () => import('@/views/label/category-list'),
        name: 'CategoryList',
        meta: { title: 'categorylist', icon: 'tree' }
      },
      {
        path: 'root-list',
        component: () => import('@/views/label/root-list'),
        name: 'RootList',
        meta: { title: 'rootlist', icon: 'tree' }
      },
      {
        path: 'plate-list',
        component: () => import('@/views/label/plate-list'),
        name: 'PlateList',
        meta: { title: 'platelist', icon: 'tree' }
      },
    ]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/article-list',
    name: 'Article',
    meta: { title: 'article', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'article-list',
        component: () => import('@/views/article/article-list'),
        name: 'ArticleList',
        meta: { title: 'articlelist', icon: 'tree' }
      },
      {
        path: 'article-add',
        component: () => import('@/views/article/article-add'),
        name: 'ArticleAdd',
        meta: { title: 'articleadd', icon: 'tree' },
        hidden: true
      },
      {
        path: 'article-edit/:id',
        component: () => import('@/views/article/article-add'),
        name: 'ArticleEdit',
        meta: { title: 'articleedit' },
        hidden: true
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/user-list',
    name: 'User',
    meta: { title: 'user', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'user-list',
        component: () => import('@/views/user/user-list'),
        name: 'UserList',
        meta: { title: 'userlist', icon: 'tree' }
      },
      {
        path: 'user-add',
        component: () => import('@/views/user/user-add'),
        name: 'UserAdd',
        meta: { title: 'useradd', icon: 'tree' },
        hidden: true
      },
      {
        path: 'user-edit/:id',
        component: () => import('@/views/user/user-add'),
        name: 'UserEdit',
        meta: { title: 'useredit' },
        hidden: true
      }
    ]
  },

  {
    path: '/verify',
    component: Layout,
    redirect: '/verify/verify-list',
    name: 'Verify',
    meta: { title: 'verify', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'verify-list',
        component: () => import('@/views/verify/verify-list'),
        name: 'VerifyList',
        meta: { title: 'verify', icon: 'tree' }
      }
    ]
  },

  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/comment-list',
    name: 'Comment',
    meta: { title: 'comment', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'comment-list',
        component: () => import('@/views/comment/comment-list'),
        name: 'CommentList',
        meta: { title: 'commentlist', icon: 'tree' }
      }
    ]
  },

  {
    path: '/integral',
    component: Layout,
    redirect: '/integral/integral-list',
    name: 'Integral',
    meta: { title: 'integral', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'integral-list',
        component: () => import('@/views/integral/integral-list'),
        name: 'IntegralList',
        meta: { title: 'integrallist', icon: 'tree' }
      }
    ]
  },

  {
    path: '/medal',
    component: Layout,
    redirect: '/medal/medal-list',
    name: 'Medal',
    meta: { title: 'medal', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'medal-list',
        component: () => import('@/views/medal/medal-list'),
        name: 'MedalList',
        meta: { title: 'medallist', icon: 'tree' }
      }
    ]
  },

  {
    path: '/message',
    component: Layout,
    redirect: '/message/message-list',
    name: 'Message',
    meta: { title: 'message', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'message-list',
        component: () => import('@/views/message/message-list'),
        name: 'MessageList',
        meta: { title: 'messagelist', icon: 'tree' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/home-rotation',
    name: 'System',
    meta: { title: 'system', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'home-rotation',
        component: () => import('@/views/system/home-rotation'),
        name: 'HomeRotation',
        meta: { title: 'homerotation', icon: 'tree' }
      },
      {
        path: 'top-avigation',
        component: () => import('@/views/system/top-avigation'),
        name: 'TopAvigation',
        meta: { title: 'topavigation', icon: 'tree' }
      }
    ]
  },

  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  // tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://www.baidu.com',
        meta: { title: 'ymall', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
