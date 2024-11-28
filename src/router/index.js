import { createRouter, createWebHashHistory } from "vue-router";
import ConsolePage from "@/components/ConsolePage.vue";


// 路由懒加载
const HomePage = () =>
    import ('../components/HomePage.vue')
const AccountManagePage = () =>
    import ('../components/AccountManagePage.vue')
const PersonPage = () =>
    import ('../components/PersonPage.vue')
const LoginPage = () =>
    import ('@/components/LoginPage.vue')
const LoginBox = () =>
    import ('@/components/components/login/LoginBox.vue')
const FindPwd = () =>
    import ('@/components/components/login/FindPwd.vue')
const ActivityDetailPage = () =>
    import('@/components/ActivityDetailPage.vue')
const ApplicationAudit=()=>
    import('@/components/components/console/ApplicationAudit.vue')
const ActivityManage=()=>
    import('@/components/components/console/ActivityManage.vue')
const FeedbackAudit=()=>
    import('@/components/components/console/FeedbackAudit.vue')
const PublishPage=()=>
    import('@/components/PublishPage.vue')
const Publish=()=>
    import('@/components/components/console/Publish.vue')
const Draft=()=>
    import('@/components/components/console/Draft.vue')
const ApplicationAuditDetail=()=>
    import('@/components/components/console/ApplicationAuditDetail.vue')

const routes = [{
        path: '/',
        name: 'home',
        component: HomePage,
        meta: {
            title: '首页',
            requiresAuth: false
        }
    },
    {
        path: '/activity-detail/:id',
        name: 'activityDetail',
        component: ActivityDetailPage,
    },
    {
        path: '/my-activities',
        name: 'myActivities',
        component: PersonPage,
        meta: {
            title: '我的活动',
            requiresAuth: true
        }
    },
    {
        path: '/account',
        name: 'accountManage',
        component: AccountManagePage,
        meta: {
            title: '账户管理',
            requiresAuth: true
        }
    },
    {
        path: '/console',
        name: 'console',
        redirect: '/console/application-audit',
        component:ConsolePage,
        meta:{
            title: '后台管理',
            requiresAuth: false
        },
        children: [{
            path: 'application-audit',
            name: 'applicationAudit',
            component: ApplicationAudit,
            meta: {title: '报名审核'}

        }, {
            path: 'application-audit-detail',
            name: 'applicationAuditDetail',
            component: ApplicationAuditDetail,

        },{
            path:'activity-manage',
            name: 'activityManage',
            component:ActivityManage,
            meta: {title: '活动管理'}

        },{
            path: 'feedback-audit',
            name: 'feedbackAudit',
            component:FeedbackAudit,
            meta: {title: '审核反馈'}

        }]
    },
    {
        path:'/publish',
        name: 'publish',
        redirect: '/publish/publish',
        component:PublishPage,
        children: [{
            path: 'publish',
            name: 'publish',
            component: Publish
        },{
            path: 'draft',
            name: 'draft',
            component:Draft
        }]
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        redirect: '/login/login-box',
        meta: {
            title: '登录',
            requiresAuth: false
        },
        children: [{
                path: 'login-box',
                name: 'loginBox',
                component: LoginBox,
                meta: { title: '登录' }
            },
            {
                path: 'find-pwd',
                name: 'findPwd',
                component: FindPwd,
                meta: { title: '找回密码' }
            }
        ]
    },
    // 404 路由
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: () =>
            import ('@/components/NotFoundPage.vue'),
        meta: { title: '页面未找到' }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// // 全局路由守卫
// router.beforeEach((to, from, next) => {
//     // 设置页面标题
//     document.title = to.meta.title || '默认标题'

//     // 检查是否需要登录验证
//     if (to.meta.requiresAuth) {
//         // 这里添加您的登录验证逻辑
//         const isAuthenticated = localStorage.getItem('token')
//         if (!isAuthenticated) {
//             next({ name: 'login' })
//             return
//         }
//     }
//     next()
// })

export default router