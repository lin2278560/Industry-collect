<template>
    <div class="container-fluid">
        <div v-if="!loginType" class="modal-header " style="border-bottom: 1px solid #a9a9a9;width: 96%;">
            <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                <JkTabs :links="links" style="float: left;font-size: 14px;"></JkTabs>
            </blockquote>
        </div>
        <div class="row box margin-x clear-margin padding-x" style="width: 48%;float: left;height: 248px;">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;font-size: 14px;">
                    资源监控
                </blockquote>
            </div>
            <div class="modal-body">
                <vue-justgage ref="g1" id="g1" class="gauge"></vue-justgage>
                <vue-justgage ref="g2" id="g2" class="gauge"></vue-justgage>
                <vue-justgage ref="g3" id="g3" class="gauge"></vue-justgage>
            </div>
        </div>

        <div v-if="loginType" class="row box margin-x clear-margin padding-x" style="width: 45.5%;height: 248px;float: left;margin-left: 30px;">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;font-size: 14px;">
                    设备信息
                </blockquote>
            </div>
            <div class="modal-body" style="margin-top: 0px;width:95%">
                <div v-for="(item,i) in randomMovieList" :key="i" style="margin-bottom: 20px;">
                    <div style="width: 130px;float: left;margin-right: 5px;font-size: 12px;text-align:right;"><span>{{item.title}}</span></div>
                    <div style="font-size: 12px;margin-left:5px;"><span>{{item.content}}</span></div>
                </div>
            </div>
        </div>

        <div class="row box margin-x clear-margin padding-x" style="width: 96%;float: left;">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;font-size: 14px;">
                    接口流量
                </blockquote>
            </div>
            <div class="modal-body">
<!--                <contrastLine></contrastLine>-->
                <Flow :flow="flowOpt"/>
            </div>
        </div>
    </div>
</template>
<script>
    // import JustGage from "../../assets/js/justgage.js";
    import JkTabs from "@/components/JkTabs.vue";
    // import contrastLine from "../../components/chart/contrastLine2";
    import Flow from "@/components/chart/Flow.vue";
    import axios from 'axios'

    export default {
        name: "SysInfo",
        components: {Flow, JkTabs},
        data(){
            return {
                randomMovieList:[
                    {title: "系统名称  ：",content: null},
                    {title: "系统型号  ：",content: "7300D"},
                    {title: "软件版本  ：",content: null},
                    {title: "发布时间  ：",content: null},
                    {title: "license状态  ：",content: null},
                    // {title: "剩余天数  ：",content: null},
                ],
                g1: null,
                g2: null,
                g3: null,
                netIfs: [],
                timestamp: null,
                timeData: [],
                recvSpeed: [], //接收流量
                sendSpeed: [], //发送流量
                timer: "",//定义一个定时器的变量
                flowOpt: [],
                num: 0,
                loginType: null,//系统类型
                links: [
                    {name: "上报模块", to: "/sys/info/upload"},
                    {name: "采集模块", to: "/sys/info/collect"},
                ],
                licenseInfo: {
                    code: "",
                    type: "",
                    currentLicenseState: '',
                    expireDate: '',
                },
            }
        },
        created() {
            // var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
        },
        mounted() {
            this.$storage.getStorage("loginType") == "true" ? this.loginType = true : this.loginType = false;
            this.connWebSocket();
            this.showData();
            this.g1 = this.$refs.g1.draw({
                id: 'g1',
                value: 1,
                min: 0,
                max: 100,
                title: "CPU使用率",
                label: "%"
            });
            this.g2 = this.$refs.g2.draw({
                id: 'g2',
                value: 1,
                min: 0,
                max: 100,
                title: "内存使用率",
                label: "%"
            });
            this.g3 = this.$refs.g3.draw({
                id: 'g3',
                value: 1,
                min: 0,
                max: 100,
                title: "磁盘使用率",
                label: "%"
            });
            // this.currentTime();
            // this.timer = setInterval(this.getTime, 1000);
        },
        methods:{
            getTime() {
                this.randomMovieList[4].content = this.$util.time_stamp2time_date().format("yyyy-MM-dd hh:mm:ss");
            },
            showData() {
                this.$https.fetchGet(this.$api.software.software.url).then((resp) => {
                    this.randomMovieList[0].content = resp.data.data.programName;
                    this.randomMovieList[1].content = resp.data.data.model;
                    this.randomMovieList[2].content = resp.data.data.version;
                    // this.randomMovieList[2].content = '3.0.3.1'
                    this.randomMovieList[3].content = this.$util.time_stamp2time_date(resp.data.data.startUptime).format("yyyy-MM-dd hh:mm:ss");
                    console.log(this.randomMovieList,'this.randomMovieList')
                }).catch(err => {
                    console.log(err)
                })
                
                this.$https.fetchGet(this.$api.system.license.show.url).then((resp) => {
                    this.licenseInfo.code = resp.data.data.devSerialnumber;
                    if(resp.data.data.currentLicenseState == 'UNREGISTERED') {this.licenseInfo.currentLicenseState = '未注册'}
                    else if(resp.data.data.currentLicenseState == 'EXPIRED') {this.licenseInfo.currentLicenseState = '已过期'}
                    else if(resp.data.data.currentLicenseState == 'NORMAL') {this.licenseInfo.currentLicenseState = '试用'}
                    else if(resp.data.data.currentLicenseState == 'ABNORMAL') {this.licenseInfo.currentLicenseState = '异常'}
                    this.randomMovieList[4].content = this.licenseInfo.currentLicenseState
                    let timestamp = Date.parse(new Date());
                    let day = (resp.data.data.expireDate * 1000 - timestamp)/(24*60*60*1000)
                    let data = this.$util.time_stamp2time_date(resp.data.data.expireDate * 1000);
                    timestamp = this.$util.time_stamp2time_date(timestamp);
                    if(this.licenseInfo.currentLicenseState == '试用'){
                        this.randomMovieList[4].content = this.randomMovieList[4].content + '(剩余' +parseInt(day) + '天)'
                    }
                    // this.randomMovieList[5].content = parseInt(day) + '天'
                    this.licenseInfo.expireDate = data.format("yyyy-MM-dd hh:mm:ss");

                    let type = resp.data.data.license.type == "OFFICIAL" ? "正式" : "试用 ("+resp.data.data.license.trialDays+") 天";
                    this.licenseInfo.type = type;
                    for(let i in this.content) {
                        let title = this.content[i].title;
                        this.content[i].val = resp.data.data.license.register[title];
                    }
                    this.randomMovieList[4].content = "正式版"
                    // console.log(this.licenseInfo.expireDate,"license")
                }).catch(err => {
                    console.log(err)
                })
            },
            connWebSocket() {
                // let url = "wss://192.168.104.152:9999/collect/websocket";
                let url = null;
                let api = null;
                this.loginType ? api = "/collect/runner" : api = "/collect/run/websocket"
                if(axios.defaults.baseURL == "/") {url = "wss://"+window.location.host+api;}
                else {
                    let str = axios.defaults.baseURL;
                    let index = str .lastIndexOf("/")
                    str =str .substring(index+1,str.length);
                    url = "wss://"+str+api;
                }
                let webSocket = new WebSocket(url);
                this.webSocket = webSocket;

                webSocket.onmessage = this.$options.methods.onmessage.bind(this);
                webSocket.onopen = (e) => {
                    console.log("建立连接", e)
                    this.send();
                };
                webSocket.onerror = (e) => console.log("连接异常", e);
                webSocket.onclose = (e) => {
                    console.log("连接关闭", e)
                };

            },
            closeWebSocket() {
                if (this.webSocket != null)
                    this.webSocket.close();
            },
            onmessage(e) {
                let data = JSON.parse(e.data);
                // console.log(data);

                let allNum = JSON.parse(data).mem[0];
                let useNUm = JSON.parse(data).mem[1];
                let test = (allNum - useNUm) / allNum * 100;

                this.g1.refresh(JSON.parse(data).cpu);
                this.g2.refresh(test.toFixed(0));
                this.g3.refresh(JSON.parse(data).disk);

                let netIfs1 = JSON.parse(data).netIfs;
                let timestamp = JSON.parse(data).timestamp;
                for(let i in netIfs1) {
                    if(netIfs1[i].name == 'docker0') {
                        netIfs1.splice(i, 1);
                    }
                    if(this.netIfs.length == 0) {
                        // netIfs1[i].recvSpeed = ((0 - netIfs1[i].bytesRecv) / (0 - timestamp)).toFixed(2);
                        // netIfs1[i].sendSpeed = ((0 - netIfs1[i].bytesSend) / (0 - timestamp)).toFixed(2);
                        netIfs1[i].recvSpeed = ((netIfs1[i].bytesRecv - 0) / (timestamp - 0)).toFixed(2);
                        netIfs1[i].sendSpeed = ((netIfs1[i].bytesSend - 0) / (timestamp - 0)).toFixed(2);
                    }else {
                        // netIfs1[i].recvSpeed = ((this.netIfs[i].bytesRecv - netIfs1[i].bytesRecv) / (this.timestamp - timestamp)).toFixed(2);
                        // netIfs1[i].sendSpeed = ((this.netIfs[i].bytesSend - netIfs1[i].bytesSend) / (this.timestamp - timestamp)).toFixed(2);
                        netIfs1[i].recvSpeed = ((netIfs1[i].bytesRecv - this.netIfs[i].bytesRecv) / (timestamp - this.timestamp)).toFixed(2);
                        netIfs1[i].sendSpeed = ((netIfs1[i].bytesSend - this.netIfs[i].bytesSend) / (timestamp - this.timestamp)).toFixed(2);
                    }
                }
                this.netIfs = netIfs1;
                this.timestamp = timestamp;
                this.flowOpt = netIfs1;
            },
            send() {
                let data = {
                    instruct: 'MONITOR_COLLECT_DEV',
                    // param: this.value
                };
                this.webSocket.send(JSON.stringify(data));
            },
            scrollBottom() {
                this.$nextTick(function () {
                    let div = document.getElementById('asd');
                    div.scrollTop = div.scrollHeight;
                })
            },
        },
        beforeDestroy() {
            this.closeWebSocket();
            clearInterval(this.timer);
        }

    };
</script>
<style scoped lang="less">

    @import "../../assets/css/bootstrap.min.css";
    @import "../../assets/css/animate.css";
    @import "../../assets/css/dev-register.css";
    /*@import "../../assets/css/index.css";*/
    @import "../../assets/css/multiple-select.css";
    @import "../../assets/css/omas-basic.css";

    #g1, #g2, #g3 {
        width: 29%;
        /*width: 30%;*/
        // display: inline-block;
        float: left;
        margin-right: 4%;
        /*margin-left: 9%;*/
    }
    /*.content{*/
    /*    font-size: .875rem;*/
    /*    position: relative;*/
    /*    width: 96%;*/
    /*    margin: 12px auto 30px;*/
    /*}*/
    .box {
        font-size: .875rem;
        position: relative;
        /*margin-bottom: 30px;*/
        background-color: white;
        padding: 10px 20px 20px 20px;
        border: solid 1px #e9e9e9;
        box-shadow: 1px 12px 12px 0 #dcdcdc;
        table {
            //border: solid 1px black;
            td, th {
                padding: 12px 10px 12px 50px;
            }

        }
    }

    @deep: ~'>>>';
    @{deep} .ivu-tabs-bar {
        border-bottom: none;
        /*margin: 14px 0;*/
        margin-bottom: 14px ;
    }
    @{deep} .ivu-tabs-nav {

        font-size: 1em;
        /*background-color: #e5e5e5;*/
        background-color: #faf8f7;
        border-radius: 5px;

        padding-left: 0;
        margin: 0;
        float: left;
        list-style: none;
        box-sizing: border-box;
        position: relative;
        transition: transform .5s ease-in-out;
    }
    @{deep} .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        margin: 0;
        margin-right: 0;
        height: auto;
        padding: 3px 16px ;
        vertical-align: middle;
        border: none;
        border-bottom: 0;
        border-radius: 6%;
        transition: all .3s ease-in-out;
        background: transparent;
        &:hover{
            color: white;
            border-radius: 6%;
            background-color: #ff6600;
        }
    }
    @{deep} .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
        color: white;
        border: none;
        border-radius: 6%;
        background-color: #ff6600;
    }
    @{deep} .modal-body {
        position: relative;
        padding: 10px;
    }
    // @{deep} .modal-header {
    //     padding: 10px;
    //     border-bottom: 1px solid #e5e5e5;
    // }
</style>
