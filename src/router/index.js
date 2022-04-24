import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'

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
    meta: { title: 'admin', icon: 'table' },
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
        meta: { title: 'adminadd' }
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
        meta: { title: 'useradd', icon: 'tree' }
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
      }
    ]
  },

  {
    path: '/plate',
    component: Layout,
    redirect: '/plate/plate-list',
    name: 'Plate',
    meta: { title: 'plate', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'plate-list',
        component: () => import('@/views/plate/plate-list'),
        name: 'PlateList',
        meta: { title: 'platelist', icon: 'tree' }
      }
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
    path: '/modular',
    component: Layout,
    redirect: '/modular/modular-list',
    name: 'Modular',
    meta: { title: 'modular', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'modular-list',
        component: () => import('@/views/modular/modular-list'),
        name: 'ModularList',
        meta: { title: 'modularlist', icon: 'tree' }
      }
    ]
  },

  {
    path: '/course',
    component: Layout,
    redirect: '/course/course-list',
    name: 'Course',
    meta: { title: 'course', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'course-list',
        component: () => import('@/views/course/course-list'),
        name: 'CourseList',
        meta: { title: 'courselist', icon: 'tree' }
      },
      {
        path: 'course-add',
        component: () => import('@/views/course/course-add'),
        name: 'CourseAdd',
        meta: { title: 'courseadd', icon: 'tree' },
      },
      {
        path: 'course-edit/:id',
        component: () => import('@/views/course/course-add'),
        name: 'CourseEdit',
        meta: { title: 'courseedit' },
        hidden: true
      }
    ]
  },

  {
    path: '/video',
    component: Layout,
    redirect: '/video/video-list',
    name: 'video',
    meta: { title: 'video', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'video-list',
        component: () => import('@/views/video/video-list'),
        name: 'VideoList',
        meta: { title: 'videolist', icon: 'tree' }
      }
    ]
  },

  {
    path: '/learning',
    component: Layout,
    redirect: '/learning/learning-list',
    name: 'Learning',
    meta: { title: 'learning', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'learning-list',
        component: () => import('@/views/learning/learning-list'),
        name: 'LearningList',
        meta: { title: 'learninglist', icon: 'tree' }
      }
    ]
  },

  {
    path: '/discuss',
    component: Layout,
    redirect: '/discuss/discuss-list',
    name: 'Discuss',
    meta: { title: 'discuss', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'discuss-list',
        component: () => import('@/views/discuss/discuss-list'),
        name: 'DiscussList',
        meta: { title: 'discusslist', icon: 'tree' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/order-list',
    name: 'Order',
    meta: { title: 'order', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'order-list',
        component: () => import('@/views/order/order-list'),
        name: 'OrderList',
        meta: { title: 'orderlist', icon: 'tree' }
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
    path: '/usermedal',
    component: Layout,
    redirect: '/usermedal/usermedal-list',
    name: 'UserMedal',
    meta: { title: 'usermedal', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'usermedal-list',
        component: () => import('@/views/usermedal/usermedal-list'),
        name: 'UserMedalList',
        meta: { title: 'usermedallist', icon: 'tree' }
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
    path: '/report',
    component: Layout,
    redirect: '/report/report-list',
    name: 'Report',
    meta: { title: 'report', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'report-list',
        component: () => import('@/views/report/report-list'),
        name: 'ReportList',
        meta: { title: 'reportlist', icon: 'tree' }
      }
    ]
  },

  {
    path: '/sign',
    component: Layout,
    redirect: '/sign/sign-list',
    name: 'Sign',
    meta: { title: 'sign', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'sign-list',
        component: () => import('@/views/sign/sign-list'),
        name: 'SignList',
        meta: { title: 'signlist', icon: 'tree' }
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
      },
      {
        path: 'school-rotation',
        component: () => import('@/views/system/school-rotation'),
        name: 'SchoolRotation',
        meta: { title: 'schoolrotation', icon: 'tree' }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'http://localhost:8088/',
        meta: { title: 'cvnm', icon: 'link' }
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
