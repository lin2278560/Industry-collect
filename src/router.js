import Vue from "vue";
import Router from "vue-router";
import storage from './util/web-storage';
import iView from 'iview'
import axios from 'axios';
import api from './util/api.js';
import https from './util/https.js'

Vue.use(Router);
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
    mode: "history",
    // mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        { path: "/", redirect: '/login' },
        {
            path: "/index",
            name: 'index',
            component: () =>
                import ('./views/Index.vue'),
            meta: { roles: ['admins', "usermanager", "logauditor"] },
            redirect: '/sys',
            children: [{
                    path: '/sys',
                    name: 'sys',
                    component: () =>
                        import ('./views/sys/Sys.vue'),
                    // meta: {roles: ['admin']},
                    redirect: '/sys/info/collect',
                    children: [{
                            path: 'info/collect',
                            name: 'info/collect',
                            component: () =>
                                import ('./views/sys/SysInfo.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'info/upload',
                            name: 'info/upload',
                            component: () =>
                                import ('./views/sys/SysUploadInfo.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'time',
                            name: 'time',
                            component: () =>
                                import ('./views/sys/SysTime.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'update',
                            name: 'update',
                            component: () =>
                                import ('./views/sys/SysUpdate.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'license',
                            name: 'license',
                            component: () =>
                                import ('./views/sys/SysLicense.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'interface',
                            name: 'interface',
                            component: () =>
                                import ('./views/sys/SysInterface.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'route',
                            name: 'route',
                            component: () =>
                                import ('./views/sys/SysRoute.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'inf',
                            name: 'inf',
                            component: () =>
                                import ('./views/sys/SysInf.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'drive',
                            name: 'drive',
                            component: () =>
                                import ('./views/sys/SysDrive.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'count/collect',
                            name: 'count/collect',
                            component: () =>
                                import ('./views/sys/SysCollectCount.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'count/upload',
                            name: 'count/upload',
                            component: () =>
                                import ('./views/sys/SysUploadCount.vue'),
                            meta: { roles: ['admins'] }
                        },
                        // {path: 'strategy', name: 'strategy', component: () => import('./views/sys/Strategy.vue'), meta: {roles: ['admins']}},
                        // {path: 'monitoring', name: 'monitoring', component: () => import('./views/sys/SysMonitoring.vue'), meta: {roles: ['admins']}},
                        // {path: 'thresholdAlarm', name: 'thresholdAlarm', component: () => import('./views/sys/SysThresholdAlarm.vue'), meta: {roles: ['admins']}},
                        {
                            path: 'mail',
                            name: 'mail',
                            component: () =>
                                import ('./views/sys/SysMail.vue'),
                            meta: { roles: ['admins'] }
                        },
                    ]
                },
                {
                    path: '/engineering',
                    name: 'engineering',
                    component: () =>
                        import ('./views/engineering/Engineering.vue'),
                    // meta: {roles: ['admin']},
                    redirect: '/engineering/collectionService',
                    children: [{
                            path: 'collectionService',
                            name: 'collectionService',
                            component: () =>
                                import ('./views/engineering/CollectionService.vue'),
                            redirect: '/engineering/collectionService/info',
                            children: [{
                                    path: 'info',
                                    name: 'info',
                                    component: () =>
                                        import ('./views/engineering/CollectionServiceInfo.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                {
                                    path: 'channelConfig',
                                    name: 'channelConfig',
                                    component: () =>
                                        import ('./views/engineering/ChannelConfig.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                {
                                    path: 'driveConfig',
                                    name: 'driveConfig',
                                    component: () =>
                                        import ('./views/engineering/DriveConfig.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                {
                                    path: 'test',
                                    name: 'test',
                                    component: () =>
                                        import ('./views/engineering/ContentTabs.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                {
                                    path: 'nodeConfig',
                                    name: 'nodeConfig',
                                    component: () =>
                                        import ('./views/engineering/NodeConfig.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                {
                                    path: 'upload',
                                    name: 'upload',
                                    component: () =>
                                        import ('./views/engineering/upload.vue'),
                                    meta: { roles: ['admins'] }
                                },
                            ]
                        },
                        {
                            path: 'reportingService',
                            name: 'reportingService',
                            component: () =>
                                import ('./views/engineering/ReportingService.vue'),
                            redirect: '/engineering/reportingService/info',
                            children: [{
                                    path: 'info',
                                    name: 'info',
                                    component: () =>
                                        import ('./views/engineering/ReportingServiceInfo.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                {
                                    path: 'channelConfig',
                                    name: 'channelConfig',
                                    component: () =>
                                        import ('./views/engineering/ReportChannelConfig.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                {
                                    path: 'driveConfig',
                                    name: 'driveConfig',
                                    component: () =>
                                        import ('./views/engineering/ReportDriveConfig.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                // {path: 'equipmentConfig', name: 'equipmentConfig', component: () => import('./views/engineering/EquipmentConfig.vue')},
                                // {path: 'test', name: 'test', component: () => import('./views/engineering/ContentTabs.vue')},
                                {
                                    path: 'nodeConfig',
                                    name: 'nodeConfig',
                                    component: () =>
                                        import ('./views/engineering/ReportNodeConfig.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                {
                                    path: 'busData',
                                    name: 'busData',
                                    component: () =>
                                        import ('./views/engineering/ReportBusData.vue'),
                                    meta: { roles: ['admins'] }
                                },
                                // {path: 'upload', name: 'upload', component: () => import('./views/engineering/upload.vue')},
                            ]
                        },
                        {
                            path: 'test',
                            name: 'test',
                            component: () =>
                                import ('./views/engineering/test.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'index',
                            name: 'index',
                            component: () =>
                                import ('./views/engineering/index.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'info',
                            name: 'info',
                            component: () =>
                                import ('./views/engineering/SysInfo.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'engineered',
                            name: 'engineered',
                            component: () =>
                                import ('./views/engineering/Engineered.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'engineeredSynch',
                            name: 'engineeredSynch',
                            component: () =>
                                import ('./views/engineering/EngineeredSynch.vue'),
                            meta: { roles: ['admins'] }
                        },
                    ]
                },
                {
                    path: '/strategy',
                    name: 'strategy',
                    component: () =>
                        import ('./views/strategy/Strategy.vue'),
                    // meta: {roles: ['admin']},
                    redirect: '/strategy/strategylist',
                    children: [{
                            path: 'strategylist',
                            name: 'strategylist',
                            component: () =>
                                import ('./views/strategy/strategyManger/StrategyList.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'monitoring',
                            name: 'monitoring',
                            component: () =>
                                import ('./views/strategy/strategyManger/StrategyMonitoring.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'thresholdAlarm',
                            name: 'thresholdAlarm',
                            component: () =>
                                import ('./views/strategy/StrategyThresholdAlarm.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'collectThresholdAlarm',
                            name: 'collectThresholdAlarm',
                            component: () =>
                                import ('./views/strategy/StrategycollectThresholdAlarm.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'uploadThresholdAlarm',
                            name: 'uploadThresholdAlarm',
                            component: () =>
                                import ('./views/strategy/StrategyuploadThresholdAlarm.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'datasource',
                            name: 'datasource',
                            component: () =>
                                import ('./views/strategy/strategyManger/StrategyDataSource.vue'),
                            meta: { roles: ['admins'] }
                        },
                        {
                            path: 'mail',
                            name: 'mail',
                            component: () =>
                                import ('./views/strategy/StrategyMail.vue'),
                            meta: { roles: ['admins'] }
                        },
                    ]
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () =>
                        import ('./views/user/User.vue'),
                    // meta: {roles: ['user']},
                    redirect: '/user/userConfig',
                    children: [{
                            path: 'userConfig',
                            name: 'userConfig',
                            component: () =>
                                import ('./views/user/UserConfig.vue'),
                            meta: { roles: ['usermanager'] }
                        },
                        {
                            path: 'table-expand.vue',
                            name: 'table-expand.vue',
                            component: () =>
                                import ('./views/user/test.vue'),
                            meta: { roles: ['usermanager'] }
                        },
                        {
                            path: 'userRole',
                            name: 'userRole',
                            component: () =>
                                import ('./views/user/UserRole.vue'),
                            meta: { roles: ['usermanager'] }
                        },
                        {
                            path: 'userManage',
                            name: 'userManage',
                            component: () =>
                                import ('./views/user/UserManage.vue'),
                            meta: { roles: ['usermanager'] }
                        },
                    ]
                },
                {
                    path: '/logs',
                    name: 'logs',
                    component: () =>
                        import ('./views/logs/Log.vue'),
                    // meta: {roles: ['log']},
                    redirect: '/logs/logCommond',
                    children: [{
                            path: 'logCommond',
                            name: 'logCommond',
                            component: () =>
                                import ('./views/logs/LogCommond.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                        {
                            path: 'logEngineeredExport',
                            name: 'logEngineeredExport',
                            component: () =>
                                import ('./views/logs/LogEngineeredExport.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                        {
                            path: 'logLicenseRegister',
                            name: 'logLicenseRegister',
                            component: () =>
                                import ('./views/logs/LogLicenseRegister.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                        {
                            path: 'logUpgrade',
                            name: 'logUpgrade',
                            component: () =>
                                import ('./views/logs/LogUpgrade.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                        {
                            path: 'logCollectComm',
                            name: 'logCollectComm',
                            component: () =>
                                import ('./views/logs/LogCollectComm.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                        {
                            path: 'logCollectSys',
                            name: 'logCollectSys',
                            component: () =>
                                import ('./views/logs/LogCollectSys.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                        {
                            path: 'logUploadComm',
                            name: 'logUploadComm',
                            component: () =>
                                import ('./views/logs/LogUploadComm.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                        {
                            path: 'logUploadSys',
                            name: 'logUploadSys',
                            component: () =>
                                import ('./views/logs/LogUploadSys.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                        {
                            path: 'logStrategyWarning',
                            name: 'logStrategyWarning',
                            component: () =>
                                import ('./views/logs/LogStrategyWarning.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                        {
                            path: 'logMailWarning',
                            name: 'logMailWarning',
                            component: () =>
                                import ('./views/logs/LogMailWarning.vue'),
                            meta: { roles: ['logauditor'] }
                        },
                    ]
                }
            ]
        },
        {
            path: "/login",
            name: 'login',
            component: () =>
                import ('./views/Login.vue'),
            meta: { roles: ['admins', "usermanager", "logauditor"] }
        },
        {
            path: "/licenseTimeOut",
            name: 'licenseTimeOut',
            component: () =>
                import ('./views/LicenseTimeOut.vue'),
            meta: { roles: ['admins', "usermanager", "logauditor"] }
        },
        // {path: "/test2", name: 'test2', component: () => import('./components/chart/contrastLine2.vue')},
        {
            path: "/403",
            name: '403',
            component: () =>
                import ('./views/403.vue'),
            meta: { roles: ['admins', "usermanager", "logauditor"] }
        },
        {
            path: "/500",
            name: '500',
            component: () =>
                import ('./views/500.vue'),
            meta: { roles: ['admins', "usermanager", "logauditor"] }
        },
        // {path: "/test", name: 'test', component: () => import('./views/test.vue'), meta: {roles: ['admins',"usermanager","logauditor"]}},
        { path: "*", redirect: '/403' },
    ]
});
// router.beforeEach((to, from, next) => {
//     //console.log(to, from);
//     next();
// })
// const role = 'user'


// async function systemType() {
//     let res =  await https.fetchGet(api.global.url);
//     return res;
// }
// async function currentuser() {
//     let res =  await https.fetchGet(api.user.currentuser.url);
//     return res;
// }


router.beforeEach((to, from, next) => {
    // if (to.path == "/login") {
    //     next();
    // }else {
    if (to.path == "/login" || to.path == "/licenseTimeOut") {
        next();
    } else {
        if (storage.getStorage("loginType") == null) {
            // systemType().then((resp) => {
            https.fetchGet(api.global.url).then((resp) => {
                storage.setStorage("loginType", resp.data.data);
            });
        }
        if (storage.getStorage("users") == null) {
            // currentuser().then((resp) => {
            https.fetchGet(api.user.currentuser.url).then((resp) => {
                if (resp.data.code == 200) {
                    // storage.setStorage("user", "a");
                    if (resp.data.data.authorities[0].authority == "系统管理员") {
                        storage.setStorage("users", 'admins');
                    } else if (resp.data.data.authorities[0].authority == "审计管理员") {
                        storage.setStorage("users", 'logauditor');
                    } else if (resp.data.data.authorities[0].authority == "安全管理员") {
                        storage.setStorage("users", 'usermanager');
                    }
                }
                let users = storage.getStorage("users").replace("\"", "").replace("\"", "");
                if (!to.meta.roles.includes(users)) {
                    next({ path: '/403' })
                } else {
                    next();
                }
            });
        } else {
            let users = storage.getStorage("users");
            if (users != null) { users = users.replace("\"", "").replace("\"", ""); }
            // if (to.path != "/login" && user == null) {
            //     iView.Notice.error({title: "未登录", desc: "请登录后,在访问。"});
            //     next({path: "/login"});
            // }
            if (!to.meta.roles.includes(users)) {
                next({ path: '/403' })
            } else {
                next();
            }
        }
    }

})
export default router;