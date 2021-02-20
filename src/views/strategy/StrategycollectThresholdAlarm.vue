<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header" style="border-bottom: 1px solid #a9a9a9;padding-bottom:15px;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <span style="float:right;font-size:12px;">柱状图 / 饼图 <i-switch  v-model="switch1" @on-change="changeEcharts" /></span>
                </blockquote>
            </div>
            <div class="modal-body" >
                <div style="display:flex;height:90%;justify-content: center;position: relative;">
                    <Pies @sendDriveLogData="getDriveLogData" :warning="drivecheckgroup" ref="pies" style="width: 48%; height: 510px" id="1"></Pies>
                    <Card v-if="tablelogShow" style="width: 48%;height:510px;margin-left:3%;">
                        <div style="height:92%;overflow-y:scroll;background:#fff;height:450px;">
                            <table :dataArr="pieData" style="width:100%;border-collapse:collapse;" >
                                <thead style="border-bottom:1px;solid;black;">
                                    <tr style="background-color: #eee;text-align:center;padding:10px 5px;">
                                        <span style="margin:0 auto;display:block;width:100%;font-weight:bold;padding:5px 0;">{{driveWarningTitle}}</span>
                                    </tr>
                                </thead>
                            </table>
                            <ul class="connectList agile-list" :key="index" v-for="(item,index) in itemList" >
                                <li style="width: 100%;table-layout: fixed;maring:10px;" :class="(item.alarmType==true)?'danger-element':'warning-element'">
                                    {{(page.page-1)*10+index+1+'. '}} {{item.alarmMsg}}
                                    <div class="agile-detail">
                                        <Icon v-if="item.alarmMsg=='暂无数据'?false:true" type="md-time" size="12" style="margin-right:5px;" />
                                        {{item.updateTime | dateFormat}}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <!-- <Page style="margin-top:5px;" :current.sync="page.currentPage" :total="page.datacount" @on-change="pagechange" /> -->
                    </Card> 
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import Pies from "@/components/up/logpie.vue";
    export default {
        inject: ["reload"],
        filters: {
            ellipsis (value) {
                if (!value) return ''
                if (value.length > 50) {
                    return value.slice(0,47) + '...'
                }
                return value
            },
            dateFormat (dataStr) {
                if(!dataStr){
                    return ''
                }
                var time = new Date(dataStr);
                
                function timeAdd0(str) {
                    if (str < 10) {
                    str = '0' + str;
                    }
                    return str
                }
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s);
            }

        },
        name: "StrategyList",
        components: {
            jk_tabs: JkTabs,Pies
        },
        data(){
            return {
                switch1:true,
                PASSmodel:true,
                password:'',
                //工作模式验证狂
                confirmModal:false,
                //控制统计右侧详情表格显示
                tablelogShow:false,
                //统计饼图详情里的分页
                page:{
                    datacount:0,
                    page:1,
                    currentPage:1,
                },
                driveWarningTitle:'',
                drivecheckgroup:'全部',
                itemList: [],
                //表格被选择的数组
                selected:[],
                strategyData:'',
                strategyBackupData:'',
                StrategyDatas:'',
                //策略列表
                strategyListdata:[
                    {name:"全通模式",val:"1"},{name:"工作模式",val:"2"},{name:"测试模式",val:"3"},
                ],
                timeselectlist:'',
                weeks:[{name:"每天",value:0},{name:"每周一",value:1},{name:"每周二",value:2},{name:"每周三",value:3},
                {name:"每周四",value:4},{name:"每周五",value:5},
                {name:"每周六",value:6},{name:"每周日",value:7},],
                // 初始化信息总条数
                dataCount: 0,
                currentPage:1,
                // 每页显示多少条
                pageSize: 10,
               
                data1: [],
                data3 : [],
                stateTitle: "",
                stateContent: "",
                links: [
                    {name: "阈值告警", to: "/strategy/thresholdAlarm"},
                    {name: "采集阈值", to: "/strategy/collectThresholdAlarm"},
                    {name: "上报阈值", to: "/strategy/uploadThresholdAlarm"},
                ],
                iconName: null,
                //统计modal
                StatisticsModal:false,
                pieData:[],
                //保存发送告警日志请求得参数，以便于分页使用
                resp:{
                    Duuid:'',
                    Suuid:''
                }
            }
        },
        mounted: function() {
            //获取饼图信息
            this.getData(true)
        },
        methods: {
            changeEcharts(){
                this.getData(this.switch1) 
            },
            cancelCheckidentity(){
                this.confirmModal = false
                this.strategyData = this.strategyBackupData
            },
            //点击饼图拿驱动日志
            getDriveLoginfo(name){
                let page = {
                    filters: [
                        {
                        filed: "alarmType",
                        params: [
                            "CPU"//CPU || MEM || DISK || UPFLOW || DOWNFLOW
                        ]
                        },
                    {
                        filed: "alarmLevel",
                        params: [
                            "2"
                        ]
                        }
                    ],
                    page: 1,
                    size: 10
                }
                console.log(name,'name')
                if(name=='cpuWarnCount'){
                    page.filters[0].params = ['CPU']
                    page.filters[1].params = ['1']
                }else if(name=='cpuRiskCount'){
                    page.filters[0].params = ['CPU']
                    page.filters[1].params = ['2']
                }
                else if(name=='memWarnCount'){
                    page.filters[0].params = ['MEM']
                    page.filters[1].params = ['1']
                }
                else if(name=='memRiskCount'){
                    page.filters[0].params = ['MEM']
                    page.filters[1].params = ['2']
                }
                else if(name=='diskWarnCount'){
                    page.filters[0].params = ['DISK']
                    page.filters[1].params = ['1']
                }
                else if(name=='diskRiskCount'){
                    page.filters[0].params = ['DISK']
                    page.filters[1].params = ['2']
                }
                else if(name=='upFlowWarnCount'){
                    page.filters[0].params = ['UPFLOW']
                    page.filters[1].params = ['1']
                }
                else if(name=='upFlowRiskCount'){
                    page.filters[0].params = ['UPFLOW']
                    page.filters[1].params = ['2']
                }
                else if(name=='downFlowWarnCount'){
                    page.filters[0].params = ['DOWNFLOW']
                    page.filters[1].params = ['1']
                }
                else if(name=='downFlowRiskCount'){
                    page.filters[0].params = ['DOWNFLOW']
                    page.filters[1].params = ['2']
                }
                this.$https.fetchPost(this.$api.strategy.findCollectAlarmLog.url,page).then((resp) => {
                    if (resp.data.code == 200) {
                        this.tablelogShow = true
                        this.itemList= resp.data.data.data
                        console.log(resp.data.data,"data.data")
                        console.log(this.itemList,'itemList')
                        if(resp.data.data.count == 0){
                            this.itemList=[{alarmMsg:"暂无数据"}]
                        }else{
                             if(this.itemList[0].uuid.indexOf("risk") != -1){
                                for(let i in this.itemList){
                                    this.itemList[i].alarmType = true
                                }
                            }
                        }
                    } else
                        this.$Notice.error({title: '数据源对象添加失败', desc: "错误：" + resp.data.desc, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
            },
            //pie组件接受获取回来的告警日志信息
            getDriveLogData(name,cname){
                this.page.page = 1
                this.page.currentPage = 1
                this.getDriveLoginfo(cname)
                console.log(name)
                // name = name.substring(0,name.length-1)
                this.driveWarningTitle = name + '拦截详情'
            },
            //分页下一页点击事件
            changepage(index) {
                this.currentPage = index;
                this.showData(index,10);
            },
            //获取上报系统告警统计
            getData(bool){
                this.$https.fetchGet(this.$api.strategy.collectSystemAlarmCount.url).then((resp) => {
                    if (resp.data.code == 200) {
                        this.pieData= resp.data.data
                        console.log(this.pieData,'pieData')
                        if(bool){
                            this.$refs.pies.chart(this.pieData)
                        }else{
                            this.$refs.pies.barchart(this.pieData)
                        }
                    } else
                        this.$Notice.error({title: '数据源对象添加失败', desc: "错误：" + resp.data.desc, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
            },
        }
            
            
        
    }
</script>

<style scoped>
    .ivu-table {
        font-size: 8px !important;
    }

    .ivu-table-header thead tr th {
        padding: 0px !important;
        height: 26px;
        line-height: 26px;
    }

    .ivu-table-fixed-header thead tr th {
        padding: 0px !important;
        height: 26px;
        line-height: 26px;
        font-size: 12px;
    }

    .ivu-table-fixed-right-header {
        height: 29px !important;
    }

    .ivu-table-cell {
        white-space: nowrap !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
    }

    .ivu-table td, .ivu-table th {
        height: 26px;
        line-height: 26px;
    }
    .modal-body{
        width: 100%;
    }
    /deep/ .ivu-tooltip-inner {
        max-width: 300px !important;
        z-index: 999 !important;
        min-height: 34px;
        padding: 8px 12px;
        color: #fff;
        text-align: left;
        text-decoration: none;
        background-color: rgba(70, 76, 91, .9);
        border-radius: 4px;
        -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
        box-shadow: -2 1px 6px rgba(0, 0, 0, .2);
        white-space: nowrap;
    }
    /*/deep/ .ivu-select-dropdown {
        width: inherit;
        max-height: 200px;
        overflow: visible;
        margin: 5px 0;
        padding: 5px 0;
        background-color: #fff;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border-radius: 4px;
        -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
        position: absolute;
        z-index: 900;
    }
     */
    /deep/ .ivu-table-cell {
            padding-left: 5px;
            padding-right: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
        
        .agile-list {
            list-style: none;
            margin: 0;
        }
        
        .agile-list li {
            background: #FAFAFB;
            border: 1px solid #e7eaec;
            margin: 0px 0 10px 0;
            padding: 10px;
            border-radius: 2px;
        }
        
        .agile-list li:hover {
            background: #fff;
        }
        
        .agile-detail {
            margin-top: 5px;
            font-size: 12px;
        }
        
        .agile-list {
            list-style: none;
            margin: 0;
        }
        
        .agile-list li {
            background: #FAFAFB;
            border: 1px solid #e7eaec;
            margin: 0px 0 10px 0;
            padding: 10px;
            border-radius: 2px;
        }
        
        .agile-list li:hover {
            /* cursor: pointer; */
            background: #fff;
        }
        
        .agile-list li.warning-element {
            border-left: 3px solid #f8ac59;
        }
        
        .agile-list li.danger-element {
            border-left: 3px solid #ed5565;
        }
</style>