<template>
    <Collapse v-model="value2" class="ivu-layout-content" accordion>
        <Panel name="1">
            系统配置
            <p slot="content" v-for="(value,i) in links1"><router-link v-if="!value.child" :to="value.to">{{value.name}}</router-link></p>
        </Panel>
        <Panel name="2">
            网络配置
            <p slot="content" v-for="(value,i) in links2"><router-link v-if="!value.child" :to="value.to">{{value.name}}</router-link></p>
        </Panel>
        <Panel name="3">
            高可用性
            <p slot="content" v-for="(value,i) in links3"><router-link v-if="!value.child" :to="value.to">{{value.name}}</router-link></p>
        </Panel>
        <Panel name="4">
            本地服务
            <p slot="content" v-for="(value,i) in links4"><router-link v-if="!value.child" :to="value.to">{{value.name}}</router-link></p>
        </Panel>
        <Panel name="5">
            数据同步
            <p slot="content" v-for="(value,i) in links5"><router-link v-if="!value.child" :to="value.to">{{value.name}}</router-link></p>
        </Panel>
        <Panel name="6">
            病毒库管理
            <p slot="content" v-for="(value,i) in links6"><router-link v-if="!value.child" :to="value.to">{{value.name}}</router-link></p>
        </Panel>
        <Panel name="7">
            test管理
            <p slot="content" v-for="(value,i) in links7"><router-link v-if="!value.child" :to="value.to">{{value.name}}</router-link></p>
        </Panel>
    </Collapse>
</template>

<script>
    import Utils from './test.js';
    export default {
        name: "Nav3",
        data () {
            return {
                value2: '1',
                links1: [
                    {name: "系统状态", to: "/sys/info"},
                    {name: "系统时间", to: "/sys/time"},
                    {name: "系统维护", to: "/sys/maintain"},
                    {name: "登录设置", to: "/sys/loggingSettings"},
                    {name: "备份/恢复", to: "/sys/backupRecovery"},
                    {name: "系统升级", to: "/sys/update"},
                    {name: "设备信息", to: "/sys/equipmentInfo"}
                ],
                links2: [
                    {name: "接口配置", to: "/network/interface"},
                    {name: "网关设置", to: "/network/gateway"},
                    {name: "静态路由", to: "/network/route"},
                    {name: "通道设置", to: "/network/channel"},
                    {name: "IP/MAC绑定", to: "/network/ipormac"}
                ],
                links3: [
                    {name: "双机热备", to: "/availability/carpSetting"},
                    {name: "虚拟IP", to: "/availability/virtual"},
                    {name: "双机热备状态", to: "/availability/carpStatus"}
                ],
                links4: [
                    {name: "通信访问控制", to: "/local/acl"},
                    {name: "FTP服务", to: "/local/ftp"},
                    {name: "SMB服务", to: "/local/smb"},
                    {name: "NFS服务", to: "/local/nfs"},
                    {name: "SFTP服务", to: "/local/sftp"},
                    {name: "可信接入认证", to: "/local/trust"},
                    {name: "邮件服务", to: "/local/mail"}
                ],
                links5: [
                    {name: "数据资源", to: "/data/resources"},
                    {name: "数据库系统配置", to: "/data/comm"},
                    {name: "业务注册", to: "/data/businessRegister"},
                    {name: "业务与服务管理", to: "/data/fileSync1"}
                ],
                links6: [
                    {name: "引擎信息", to: "/virus/engineInfo"},
                    {name: "隔离区管理", to: "/virus/isolation"}
                ],
                links7: [
                    {name: "FTP 代理配置", to: "/test/ftpProxy"},
                ]
            }
        },
        mounted: function() {
            this.test();
            var that = this;
            Utils.$on('demo', function (e) {
                console.log("aaaaaaaa:"+e);
                that.test2(e);
            })
        },
        methods: {
            test() {
                console.log(this.$route.path);
                // console.log("url--info",this.$route.path);
                if(this.$route.path.indexOf("sys") > -1){
                    this.value2 = '1';
                }else if(this.$route.path.indexOf("network") > -1){
                    this.value2 = '2';
                }else if(this.$route.path.indexOf("availability") > -1){
                    this.value2 = '3';
                }else if(this.$route.path.indexOf("local") > -1){
                    this.value2 = '4';
                }else if(this.$route.path.indexOf("data") > -1){
                    this.value2 = '5';
                }else if(this.$route.path.indexOf("virus") > -1){
                    this.value2 = '6';
                }
            },
            test2(e) {
                if(e.indexOf("sys") > -1){
                    this.value2 = '1';
                }else if(e.indexOf("network") > -1){
                    this.value2 = '2';
                }else if(e.indexOf("availability") > -1){
                    this.value2 = '3';
                }else if(e.indexOf("local") > -1){
                    this.value2 = '4';
                }else if(e.indexOf("data") > -1){
                    this.value2 = '5';
                }else if(e.indexOf("virus") > -1){
                    this.value2 = '6';
                }
            }
            // functionB() {
            //     console.log("aaa");
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
        width: 11.4%;
        height: 900px;
        min-width: 130px;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    a {
        text-decoration: none;
    }
    .router-link-active {
        text-decoration: none;
    }
</style>