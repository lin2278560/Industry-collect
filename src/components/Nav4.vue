<template>
    <div class="layout">
<!--        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">-->
<!--        <Sider>-->
            <Menu :active-name="value3" theme="dark" width="auto" accordion :open-names="value2" ref="side_menu">
                <Submenu name="sys" style="background-color: #293949;font-size: 12px;" v-bind:class="{adminShow:adminStatus}">
                        <template slot="title">
                        <Icon type="ios-settings" />
                        系统管理
                    </template>
                    <MenuItem v-for="(value,i) in links1" :key="i" :name="value.no" @click.native="quick(value.to)" style="padding-left: 35px; background: #23313f !important;font-size: 12px;"><Icon type="ios-radio-button-on" />{{value.name}}</MenuItem>
                </Submenu>
                <Submenu name="engineering" style="background-color: #293949;font-size: 12px;" v-bind:class="{adminShow:adminStatus}">
                    <template slot="title">
                        <Icon type="ios-keypad" />
                        工程管理
                    </template>
                    <MenuItem v-for="(value,i) in links2" :key="i"  :name="value.no" @click.native="quick(value.to)" style="padding-left: 35px; background: #23313f !important;font-size: 12px;"><Icon type="ios-radio-button-on" />{{value.name}}</MenuItem>
                </Submenu>
                <Submenu v-if="!this.loginType" name="strategy" style="background-color: #293949;font-size: 12px;" v-bind:class="{adminShow:adminStatus}">
                    <template slot="title">
                        <Icon type="ios-thermometer" />
                        策略管理
                    </template>
                    <MenuItem v-for="(value,i) in links8" :key="i"  :name="value.no" @click.native="quick(value.to)" style="padding-left: 35px; background: #23313f !important;font-size: 12px;"><Icon type="ios-radio-button-on" />{{value.name}}</MenuItem>
                </Submenu>
                <Submenu name="logs" style="background-color: #293949;font-size: 12px;" v-bind:class="{logShow:logStatus}">
                    <template slot="title">
                        <Icon type="ios-analytics"></Icon>
                        日志与审计
                    </template>
                    <MenuItem v-for="(value,i) in links6" :key="i"  :name="value.no" @click.native="quick(value.to)" style="padding-left: 35px; background: #23313f !important;font-size: 12px;"><Icon type="ios-radio-button-on" />{{value.name}}</MenuItem>
                </Submenu>
                <Submenu name="user" style="background-color: #293949;font-size: 12px;" v-bind:class="{userShow:userStatus}">
                    <template slot="title">
                        <Icon type="ios-analytics"></Icon>
                        系统管理
                    </template>
                    <MenuItem v-for="(value,i) in links7" :key="i"  :name="value.no" @click.native="quick(value.to)" style="padding-left: 35px; background: #23313f !important;font-size: 12px;"><Icon type="ios-radio-button-on" />{{value.name}}</MenuItem>
                </Submenu>
            </Menu>
<!--        </Sider>-->
<!--        <Layout :style="{marginLeft: '200px'}">-->
<!--            <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"></Header>-->
<!--            <Content :style="{padding: '0 16px 16px'}">-->
<!--                <Breadcrumb :style="{margin: '16px 0'}">-->
<!--                    <BreadcrumbItem>Home</BreadcrumbItem>-->
<!--                    <BreadcrumbItem>Components</BreadcrumbItem>-->
<!--                    <BreadcrumbItem>Layout</BreadcrumbItem>-->
<!--                </Breadcrumb>-->
<!--                <Card>-->
<!--                    <div style="height: 600px">Content</div>-->
<!--                </Card>-->
<!--            </Content>-->
<!--        </Layout>-->
    </div>
</template>

<script>
    import Utils from './test.js';
    export default {
        name: "Nav4",
        data () {
            return {
                adminStatus: true,
                logStatus: true,
                userStatus: true,
                value2: ['sys'],
                value3: 'info',
                links1: [
                    {name: "系统状态", to: "/sys/info/collect", no: "info"},
                    // {name: "系统时间", to: "/sys/time", no: "time"},
                    {name: "系统升级", to: "/sys/update", no: "update"},
                    {name: "系统设置", to: "/sys/drive", no: "drive"},
                    {name: "业务统计", to: "/sys/count/collect", no: "count"},
                    // {name: "安全接口", to: "/sys/count/collect", no: "count"},
                    {name: "license授权", to: "/sys/license", no: "license"},
                    // {name: "接口管理", to: "/sys/interface", no: "interface"}
                    
                ],
                links2: [
                    {name: "采集服务", to: "/engineering/collectionService", no: "collectionService"},
                    {name: "转发服务", to: "/engineering/reportingService", no: "reportingService"},
                    {name: "工程配置", to: "/engineering/engineered", no: "engineered"}
                ],
                links8: [
                    {name: "策略管理", to: "/strategy/strategylist", no: "strategylist"},
                    //可删除
                    // {name: "监控统计", to: "/strategy/monitoring", no: "monitoring"},
                    {name: "阈值告警", to: "/strategy/thresholdAlarm", no: "thresholdAlarm"},
                    {name: "邮箱设置", to: "/strategy/mail", no: "mail"},
                ],
                // links3: [
                //     {name: "index", to: "/engineering/collectionService", no: "collectionService"},
                //
                // ],
                // links4: [
                //     {name: "index2", to: "/sys/update", no: "1"},
                // ],
                // links5: [
                //     {name: "index3", to: "/sys/update", no: "1"},
                // ],
                links6: [
                    {name: "管理操作日志", to: "/logs/logCommond", no: "logCommond"},
                    {name: "系统升级日志", to: "/logs/logUpgrade", no: "logUpgrade"},
                    {name: "license注册日志", to: "/logs/logLicenseRegister", no: "logLicenseRegister"},
                    {name: "工程导出日志", to: "/logs/logEngineeredExport", no: "logEngineeredExport"},
                    {name: "采集通讯日志", to: "/logs/logCollectComm", no: "logCollectComm"},
                    {name: "采集系统运行日志", to: "/logs/logCollectSys", no: "logCollectSys"},
                    {name: "上报通讯日志", to: "/logs/logUploadComm", no: "logUploadComm"},
                    {name: "上报系统运行日志", to: "/logs/logUploadSys", no: "logUploadSys"},
                    {name: "上报策略告警日志", to: "/logs/logStrategyWarning", no: "logStrategyWarning"},
                    {name: "上报邮箱告警日志", to: "/logs/logMailWarning", no: "logMailWarning"},
                ],
                links7: [
                    {name: "用户配置", to: "/user/userConfig", no: "userConfig"}
                ],
                loginType: null,//系统类型
            }
        },
        watch: {
            openNames() {
                this.$nextTick(() => {
                    this.$refs.side_menu.updateOpened();
                    this.$refs.side_menu.updateActiveName();
                })
            }
        },
        mounted: function() {
            this.$storage.getStorage("loginType") == "true" ? this.loginType = true : this.loginType = false;
            // if(this.loginType == false){
            //     let obj = [
            //         {name: "策略管理", to: "/sys/strategy", no: "strategy"},
            //         {name: "监控统计", to: "/sys/monitoring", no: "monitoring"},
            //         {name: "阈值告警", to: "/sys/thresholdAlarm", no: "thresholdAlarm"},
            //         {name: "邮箱通知", to: "/sys/mail", no: "mail"},
            //     ]
            //     for(let i in obj){
            //         this.links1.push(obj[i])
            //     }
            // }
            if(this.loginType == false){
                this.links1[0].to = "/sys/info/upload"
            }
            this.test(null);
            var that = this;
            Utils.$on('demo1', function (e) {
                that.test(e);
            });
            if(this.$storage.getStorage("loginType") == "true") {
                this.links6.splice(4, 4);
            }else {
                this.links1.splice(2, 1);
            }
        },
        methods:{
            test(e) {
                if(this.$route.path.indexOf("logs") > -1) {
                    this.logStatus = false;
                }else if(this.$route.path.indexOf("user") > -1) {
                    this.userStatus = false;
                }else {
                    this.adminStatus = false;
                }

                if(e == null) {
                    let test1 = this.$route.path.split("/");
                    this.value2 = [test1[1]];
                    this.value3 = test1[2];
                    this.openNames();
                }else {
                    let test1 = e.split("/");
                    this.value2 = [test1[1]];
                    this.value3 = test1[2];
                    this.openNames();
                }
            },
            openNames() {
                this.$nextTick(() => {
                    this.$refs.side_menu.updateOpened();
                    // this.$refs.side_menu.updateActiveName();
                })
            },
            quick (e) {
                this.$router.push({ path: e });
            }
            // test2(e) {
            //     if(e.indexOf("sys") > -1){
            //         this.value2 = '1';
            //     }else if(e.indexOf("network") > -1){
            //         this.value2 = '2';
            //     }else if(e.indexOf("availability") > -1){
            //         this.value2 = '3';
            //     }else if(e.indexOf("local") > -1){
            //         this.value2 = '4';
            //     }else if(e.indexOf("data") > -1){
            //         this.value2 = '5';
            //     }else if(e.indexOf("virus") > -1){
            //         this.value2 = '6';
            //     }
            // }
        }

    }
</script>

<style scoped>
    .ivu-layout-content{
        /*background: #293949;*/
        position: relative;
        top:-30px;
        /*margin-right: 40px;*/
        margin-left: 3%;

        float: left;
        width: 200px;
        height: 800px;
        min-width: 130px;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .layout{
        margin-left: 2.5%;
        top:-30px;
        float: left;
        /* width: 12.5%; */
        min-width: 200px;
        height: 800px;

        /*border: 1px solid #d7dde4;*/
        /*background: #f5f7f9;*/
        /*background-color: #515a6e;*/
        background-color: #293949;
        position: relative;
        /*border-radius: 4px;*/
        /*overflow: hidden;*/
        overflow:auto;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover{
        border-right: none;
        color: #E86429;
        background: #23313f !important;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }

    .adminShow{
        display: none;
    }
    .logShow{
        display: none;
    }
    .userShow{
        display: none;
    }
</style>