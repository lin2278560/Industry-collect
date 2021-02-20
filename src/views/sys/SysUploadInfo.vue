<template>
    <div class="container-fluid">
        <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;width: 96%;">
            <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                <JkTabs :links="links" style="float: left;font-size: 14px;"></JkTabs>
            </blockquote>
        </div>
        <div style="width:98%;display:flex;flex-wrap: nowrap">
            <div class="row box margin-x clear-margin padding-x" style="width: 660px;height: 248px;float: left;">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;font-size: 14px;">
                    资源监控
                </blockquote>
            </div>
            <div class="modal-body">
                <vue-justgage ref="g1" id="g1" class="gauge"></vue-justgage>
                <vue-justgage ref="g2" id="g2" class="gauge"></vue-justgage>
                <vue-justgage ref="g3" id="g3" class="gauge"></vue-justgage>
                <!--                <vue-justgage ref="g3" id="g3" class="gauge"></vue-justgage>-->
            </div>
        </div>

        <div class="row box margin-x clear-margin padding-x" style="width: 43%;height: 248px;float: left;margin-left: 30px;">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;font-size: 14px;">
                    设备信息
                </blockquote>
            </div>
            <div class="modal-body" style="margin-top: 5px;">
                <div :key="i" v-for="(item,i) in randomMovieList" style="margin-bottom: 20px;">
                    <div style="width: 105px;float: left;margin-left: 5%;font-size: 12px;"><span>{{item.title}}</span></div>
                    <div style="font-size: 12px;"><span>{{item.content}}</span></div>
                </div>
            </div>
        </div>
        </div>
        
        <div class="row box margin-x clear-margin padding-x" style="overflow:hidden;width: 98%;float: left;">
            <div style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <Tabs type="line" @on-click="handleTabClick">
                        <TabPane label="流量统计"></TabPane>
                        <TabPane label="上报驱动监控"></TabPane>
                    </Tabs>
                </blockquote>
            </div>
            
            <div v-if="tabsShow" class="modal-body">
                <!--                <contrastLine></contrastLine>-->
                <Flow :flow="flowOpt"/>
            </div>
            <div v-if="!tabsShow" class="modal-body">
                <Table stripe border :columns="columns1" :data="data1">
                    <template slot-scope="{ row }" slot="state">
                        <div v-if="row.status">
                            <Tag type="dot" color="success">运行中</Tag>
                        </div>
                        <div v-if="!row.status">
                            <Tag type="dot" color="error">禁用中</Tag>
                        </div>
                    </template>
                </Table>
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
        name: "SysUploadInfo",
        components: {Flow, JkTabs},
        data(){
            return {
                data1:[],
                columns1:[
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {title: '通道名', key: 'channelName',align: 'center'},
                    {title: '驱动名', key: 'driveName',align: 'center'},
                    {title: '主机', key: 'host',align: 'center',width: 300,},
                    {title: '数据冻时(秒)', key: 'freezeTime',align: 'center',
                        render: (h, params) => {
                            if (0 >= params.row.freezeTime && params.row.freezeTime <= params.row.freezeWarnTime) {
                                return h("tag",{props: {color:'primary'}},params.row.freezeTime)
                            } if (params.row.freezeWarnTime > params.row.freezeTime && params.row.freezeTime <= params.row.freezeRiskTime) {
                                return h("tag",{props: {color:'warning'}},params.row.freezeTime)
                            } if ( params.row.freezeTime > params.row.freezeRiskTime) {
                                return h("tag",{props: {color:'error'}},params.row.freezeTime)
                            }
                        }
                    },
                    {title: '间隔时间(秒)', key: 'intervalTime',align: 'center'},
                    {title: '状态', key: 'status', align: 'center', width: 150,slot:'state',},
                ],
                tabsShow:true,
                randomMovieList:[
                    {title: "系统名称：",content: null},
                    {title: "系统型号：",content: "7300D"},
                    {title: "软件版本：",content: null},
                    {title: "发布时间：",content: null},
                    {title: "license状态：",content: null},
                    // {title: "剩余天数：",content: null},
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
                links: [
                    {name: "上报模块", to: "/sys/info/upload"},
                    {name: "采集模块", to: "/sys/info/collect"},
                ],
                links2:[
                    {name: "接口流量", to: "/sys/info/upload"},
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
            //设置定时器
            var timer = null
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
            handleTabClick(name){
                if(name == 1){
                    this.tabsShow = false
                    this.getDriveData()
                    // 实现轮询
                    this.timer = window.setInterval(() => {
                        setTimeout(this.getDriveData());
                    }, 5000);
                    // 清除定时器
                    this.$once('hook:beforeDestroy', () => {
                        clearInterval(this.timer)
                    })
                }else{
                    this.tabsShow = true
                    clearInterval(this.timer)
                }
            },
            getDriveData(){
                this.$https.fetchGet(this.$api.collect.findDriveList.url).then((resp) => {
                    if (resp.status == 200) {
                        this.data1 = resp.data.data
                        
                    } else
                        this.$Notice.error({title: '获取驱动信息失败', desc: "错误代码：" + resp.data.desc, duration: 2.5});
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                    console.log(err)
                })
            },
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
                }).catch(err => {
                    console.log(err)
                })
            },
            connWebSocket() {
                // let url = "wss://192.168.104.114:10000/websocket";
                let url = null;
                if(axios.defaults.baseURL == "/") {url = "wss://"+window.location.host+"/upload/websocket";}
                else {
                    let str = axios.defaults.baseURL;
                    let index = str .lastIndexOf("/")
                    str =str .substring(index+1,str.length);
                    url = "wss://"+str+"/upload/websocket";
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
                        netIfs1[i].recvSpeed = ((0 - netIfs1[i].bytesRecv) / (0 - timestamp)).toFixed(2);
                        netIfs1[i].sendSpeed = ((0 - netIfs1[i].bytesSend) / (0 - timestamp)).toFixed(2);
                    }else {
                        netIfs1[i].recvSpeed = ((this.netIfs[i].bytesRecv - netIfs1[i].bytesRecv) / (this.timestamp - timestamp)).toFixed(2);
                        netIfs1[i].sendSpeed = ((this.netIfs[i].bytesSend - netIfs1[i].bytesSend) / (this.timestamp - timestamp)).toFixed(2);
                    }
                }
                this.netIfs = netIfs1;
                this.timestamp = timestamp;
                this.flowOpt = netIfs1;
            },
            send() {
                let data = {
                    instruct: 'MONITOR_COLLECT_DEV',
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
        display: inline-block;
        
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
        margin-bottom: 0px ;
        margin-top: 5px ;
    }
    @{deep} .ivu-tabs-ink-bar {
        height: 0px;
        border-radius:5%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        background-color: #2d8cf0;
        background-color: #e86429;
        position: absolute;
        left: 0;
        bottom: 3px;
        z-index: 1;
        -webkit-transition: -webkit-transform .3s ease-in-out;
        transition: -webkit-transform .3s ease-in-out;
        transition: transform .3s ease-in-out;
        transition: transform .3s ease-in-out, -webkit-transform .3s ease-in-out;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
    }
    @{deep} .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
        height: 32px;
        padding-bottom: 5px;
        background: #fff;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        border-color: #dcdee2;
        color: #2d8cf0;
        color: #e86429;
    }
    // @{deep} .ivu-tabs-nav {

    //     font-size: 1em;
    //     /*background-color: #e5e5e5;*/
    //     background-color: #faf8f7;
    //     border-radius: 5px;

    //     padding-left: 0;
    //     margin: 0;
    //     float: left;
    //     list-style: none;
    //     box-sizing: border-box;
    //     position: relative;
    //     transition: transform .5s ease-in-out;
    // }
    // @{deep} .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    //     margin: 0;
    //     margin-right: 0;
    //     height: auto;
    //     padding: 3px 16px ;
    //     vertical-align: middle;
    //     border: none;
    //     border-bottom: 0;
    //     border-radius: 6%;
    //     transition: all .3s ease-in-out;
    //     background: transparent;
    //     &:hover{
    //         color: white;
    //         border-radius: 6%;
    //         background-color: #ff6600;
    //     }
    // }
    // @{deep} .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    //     color: white;
    //     border: none;
    //     border-radius: 6%;
    //     background-color: #ff6600;
    // }
    @{deep} .modal-body {
        position: relative;
        padding: 10px;
    }
    @{deep} .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: #57a3f3;
        color: #e86429;
    }
    @{deep} .ivu-tabs-nav .ivu-tabs-tab-active {
        color: #2d8cf0;
        color: #e86429;
    }
    @{deep} .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
        // border-color: #57a3f3 !important
        border-color: #e86429 !important
    }
    // @{deep} .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    //     color: white;
    //     border: none;
    //     border-radius: 6%;
    //     background-color: #ff6600;
    // }
    // @{deep} .modal-header {
    //     padding: 10px;
    //     border-bottom: 1px solid #e5e5e5;
    // }
</style>
