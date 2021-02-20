<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header" style="border-bottom: 1px solid #a9a9a9;padding-bottom:5px;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <Strategy_add v-if="PASSmodel" :sourcePropData="sourceData" style="float: right;"></Strategy_add>
                    <Button icon="md-add-circle" v-if="!PASSmodel" disabled type="primary" style="float: right;">新增</Button>
                </blockquote>
            </div>
            <div class="modal-body" >
                <div style="margin-bottom:10px;">
                    <span>
                    <span style="font-size:13px;">工作模式:  </span>
                        <RadioGroup v-model="strategyData" style="margin-top:4px;margin-left:2px;" @on-change="changeStrategyData">
                            <Tooltip placement="bottom-start" content="允许所有数据通过,不产生过滤日志,也不拦截数据">
                                <Radio style="width:75px;" label="PASS" value="PASS">全通模式</Radio>
                            </Tooltip>
                            <Tooltip placement="bottom-start" content="对符合规则的数据进行过滤,拦截数据,产生过滤日志">
                                <Radio style="width:75px;" label="WORK" value="WORK">工作模式</Radio>
                            </Tooltip>
                            <Tooltip placement="bottom-start" content="对符合规则的数据进行过滤,产生过滤日志">
                                <Radio style="width:75px;" label="TEST" value="TEST">测试模式</Radio>
                            </Tooltip>
                        </RadioGroup>
                        <!-- <Button type="primary" style="float:right;margin:0 5px;" size="small" @click="batchDelete()">批量删除</Button> -->
                        <Button type="primary" v-if="PASSmodel" style="float:right;margin:0 5px;" size="small" @click="batchColse()">批量关闭</Button>
                        <Button type="primary" v-if="PASSmodel" style="float:right;margin:0 5px;" size="small" @click="batchOpen()">批量开启</Button>
                        <Button type="primary" disabled v-if="!PASSmodel" style="float:right;margin:0 5px;" size="small" @click="batchColse()">批量关闭</Button>
                        <Button type="primary" disabled v-if="!PASSmodel" style="float:right;margin:0 5px;" size="small" @click="batchOpen()">批量开启</Button>
                    </span>
                </div>
                <Table
                @on-select-all-cancel="handleCancelSelectAll"
                @on-select-all="handleSelectAll"
                @on-select="handleSelect"
                @on-select-cancel="handleCancel"
                ref="selection"
                size="small" border :columns="columns1" :data="data3">
                    <template slot-scope="{ row }" slot="driveList">
                        <div v-if="row.source">
                            {{row.source.sourceName}}
                        </div>
                    </template>
                    <template slot-scope="{ row }" slot="timeType">
                        <div v-if="row.status=='启用'">
                            <div v-if="row.timeType == 1">
                                {{row.sjdStartTime}} - {{row.sjdEndTime}}
                            </div>
                            <div v-if="row.timeType == 0">
                                {{ $util.time_stamp2time_date(row.sjnStartTime,'yyyy-MM-dd h:m:s').format('yyyy-MM-dd h:m:s')}}
                            </div>
                        </div>
                        <div v-if="row.status=='禁用'">禁用中</div> 
                    </template>
                    <template slot-scope="{ row }" slot="lbModel">
                        <div style="">
                            <span style="text-align:center;display:inline-block;width:20%;margin:0 4px;"><img src="../../../assets/up2arrow1.png" style="margin:0 4px;" alt="">{{row.hhighAlarm}}</span>
                            <span style="text-align:center;display:inline-block;width:20%;margin-right:4px;"><img style="width:13px;height:15px;" src="../../../assets/uparrow.png" alt="">{{row.highAlarm}}</span>
                            
                            <span style="text-align:center;display:inline-block;width:20%;margin-left:4px;"><img style="width:13px;height:15px;" src="../../../assets/downarrow.png" alt="">{{row.lowAlarm}}</span>
                            <span style="text-align:center;display:inline-block;width:20%;margin:0 4px;"><img src="../../../assets/down2arrow1.png" style="margin:0 4px;" alt="">{{row.llowAlarm}}</span>
                        </div>
                    </template>
                    <template slot-scope="{ row, index }" slot="state">
                        <Button v-if="data3[index].iconName" :icon="data3[index].iconName" size="small" style="margin:0 auto;width:80px" @click.native="updateState(row,index)">
                            <span :style="{'color':data3[index].color}">
                                {{ row.status }}
                            </span>
                        </Button>
                        <!-- <div v-if="!data3[index].iconName" @click.native="updateState(row,index)">
                            <span :style="{'color':data3[index].color}">
                                {{ row.status }}
                            </span>
                        </div> -->
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <!-- <Button type="success" size="small" style="margin-right: 5px" @click="updateInterface(index,row.state)">查看</Button>
                        <Button type="primary" size="small" style="margin-right: 5px" @click="updateInterface(index,row.state)">修改</Button>
                        <Button type="error" size="small" @click="deleteInterface(index,row.state)">删除</Button> -->
                        <div style="display:flex;justify-content: center ;align-items: center;">
                            
                            <Tooltip placement="top" content="统计">
                                <div style="margin:0 5px;cursor:pointer" @click="showNode(row)">
                                    <!-- <Icon size="24" type="md-search" /> -->
                                    <img src="../../../assets/images/detail3.png" width="21px" height="20px" alt="">
                                </div>
                            </Tooltip>
                            <Tooltip  placement="top" content="删除">
                                <div v-if="PASSmodel"  style="margin:0 5px;cursor:pointer" @click="delNode(row)">
                                    <!-- <Icon size="24" type="md-trash" /> -->
                                    <img src="../../../assets/images/delete3.png" width="21px" height="18.5px" alt="">
                                </div>
                            </Tooltip>
                            <Tooltip placement="top" content="修改">
                                <div v-if="PASSmodel" style="margin:0 7px;cursor:pointer" @click="updateNode(index,row.status)">
                                    <!-- <Icon size="24" type="md-build" /> -->
                                    <img src="../../../assets/images/update3.png" width="21px" height="18.5px" alt="">
                                </div>
                            </Tooltip>
                        </div>
                    </template>
                </Table>
                <Page :current.sync="currentPage"
                            :total="dataCount"
                            show-elevator
                            :page-size="pageSize"
                            :show-total="true"
                            @on-change="changepage"
                            style="margin-top:10px;" />
            </div>
        </div>

        <Modal title="修改上报策略" v-model="platForm.show" width="700" >
            <Form ref="plat_form" :rules="platForm.rules" :model="platForm.form" 
                  :label-width="100">
                <!-- <FormItem label="状态" prop="status" style="margin-bottom: 15px;">
                    <RadioGroup v-model="platForm.form.state">
                        <Radio label="禁用"></Radio>
                        <Radio label="启用" disabled></Radio>
                    </RadioGroup>
                </FormItem> -->
                <FormItem label="规则名" prop="strName" style="margin-bottom: 15px;">
                    <Input :maxlength=50 disabled v-model="platForm.form.strName" style="width:100%;" />
                </FormItem>
                <FormItem label="过滤对象" prop="strType" style="margin-bottom: 15px;">
                    <Select v-model="platForm.form.strType" style="width:100%;">
                        <Option v-for="type in modelList" :value="type.val" :key="type.name">{{ type.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据源对象" prop="sourceUuid" style="margin-bottom: 15px;">
                    <Select v-model="platForm.form.sourceUuid" clearable style="width:100%;">
                        <Option v-for="(type,i) in sourceData" style="width:100%;overflow:hidden;" :label="type.sourceName" :value="type.uuid" :key="i" >
                            <!-- <Poptip trigger="hover" :content="type.sourceContent"> -->
                            <Tooltip placement="right" :content="type.sourceContent">
                                <span>{{ type.sourceName }}</span>
                            </Tooltip>
                                <span style="text-align:right;width:65%;float:right;color:#ccc;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ type.sourceContent | ellipsis}}</span>
                            <!-- </Poptip> -->
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="时效范围" prop="timeselectlist" style="margin-bottom: 12px;">
                    <RadioGroup style="margin-bottom: 10px;" v-model="timeselectlist" @on-change="timeselectlistchange">
                        <Radio label="时间内"></Radio>
                        <Radio label="时间段"></Radio>
                    </RadioGroup>
                    <div v-if="timeshow" style="margin-bottom:12px;">
                        <Input v-model="platForm.form.sjnLaterTime" type="number" style="width:55px;" />
                           分钟后开启，持续
                        <Input v-model="platForm.form.sjnEndTime" type="number" style="width:55px;" />
                            小时
                    </div>
                    <div v-if="!timeshow" style="margin-bottom:12px;">
                        开始:
                        <TimePicker v-model="platForm.form.sjdStartTime" format="HH:mm:ss" style="width: 135px;margin-right:15px;"></TimePicker>
                        结束:
                        <TimePicker v-model="platForm.form.sjdEndTime" format="HH:mm:ss" style="width: 135px;margin-right:15px;"></TimePicker>
                        频率:
                        <Select v-model="platForm.form.sjdRate" @on-change="weeksListchange()" style="width:130px;">
                            <Option v-for="item in weeks" v-model="item.value" :key="item.value">{{ item.name }}</Option>
                        </Select>
                    </div>
                </FormItem>
                
                <!-- <DatePicker v-if="timeshow" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" style="width: 300px;margin: 0 0 20px 85px;"></DatePicker>
                <div v-if="!timeshow">
                    <div style="margin-left:85px;"><Checkbox v-model="timeswitch" @on-change="timechange">每天</Checkbox></div>
                    <Select v-model="days" multiple @on-change="weeksListchange()" style="width:87%;margin: 0 0 5px 85px;">
                        <Option v-for="item in weeks" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                    <TimePicker v-if="!timeshow" type="timerange" style="width: 168px;margin: 0 0 20px 85px;"></TimePicker>
                </div> -->
                <FormItem label="子策略" prop="lbModel" style="margin-bottom: 15px;">
                    <Checkbox v-model="platForm.form.hhighStatus" ></Checkbox>
                    <span>高高报: <Input v-model="platForm.form.hhighAlarm" number style="width:11%;" /></span>
                    <!-- <span v-if="!checkedshow2">高高报: <Input disabled v-model="platForm.form.hhighAlarm" style="width:11%;" /></span> -->
                    <Checkbox v-model="platForm.form.highStatus" style="margin-left:15px;"></Checkbox>
                    <span>高报: <Input v-model="platForm.form.highAlarm" number style="width:11%;" /></span>
                    <!-- <span v-if="!checkedshow3">高报: <Input disabled v-model="platForm.form.highAlarm" style="width:11%;" /></span> -->
                    <Checkbox v-model="platForm.form.lowStatus" style="margin-left:15px;"></Checkbox>
                    <span>低报: <Input v-model="platForm.form.lowAlarm" number style="width:11%;" /></span>
                    <!-- <span v-if="!checkedshow4">低报: <Input disabled v-model="platForm.form.lowAlarm" style="width:11%;" /></span> -->
                    <Checkbox v-model="platForm.form.llowStatus" style="margin-left:15px;"></Checkbox>
                    <span>低低报: <Input v-model="platForm.form.llowAlarm" number style="width:11%;" /></span>
                    <!-- <span v-if="!checkedshow1">低低报: <Input disabled v-model="platForm.form.llowAlarm" style="width:11%;" /></span> -->
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="platForm.show = false">取消</Button>
                <Button type="primary" size="large" @click="updateTest">确定</Button>
            </div>
        </Modal>

        <Modal title="拦截统计" v-model="StatisticsModal" width="80%" >
            <div style="display:flex;height:90%;justify-content: center;position: relative;">
                <!-- <span style=" position: absolute;top: 0;left: 0;">点击饼图查看详情</span> -->
                <Pies @sendDriveLogData="getDriveLogData" :warning="drivecheckgroup" ref="pies" style="width: 48%; height: 401px" id="1"></Pies>
                <div v-if="tablelogShow" style="width: 47%;height:420px;margin-left:3%;">
                    <div style="height:92%;overflow-y:scroll;background:#fff;">
                        <table :dataArr="pieData" style="width:100%;border-collapse:collapse;" >
                            <thead style="border-bottom:1px;solid;black;line-height:33px;font-weight:bold">
                                <tr style="background-color: #eee;">
                                    <span style="margin-left:10%;;">{{driveWarningTitle}}</span>
                                    <div style="float:right;margin-right:10px;">
                                        <Input suffix="ios-search" v-model="driveItemName" placeholder="请输入具体节点名" style="width: auto;" />
                                        <Select style="width:60px;" v-model="drivecheckgroup" >
                                            <Option v-for="item in warnList" :value="item.val" :key="item.val">{{ item.name }}</Option>
                                        </Select>
                                        <Button type="primary" @click="driveLogSerach(driveItemName,drivecheckgroup)">查询</Button>
                                    </div>
                                    
                                </tr>
                            </thead>
                        </table>
                        <ul class="connectList agile-list" :key="index" v-for="(item,index) in itemList" >
                            <li style="width: 100%;table-layout: fixed;maring:10px;" :class="(item.alarmType==2)?'danger-element':'warning-element'">
                                {{(page.page-1)*10+index+1+'. '}} {{item.alarmMsg}}
                                <div class="agile-detail">
                                    <Icon v-if="item.alarmMsg=='暂无数据'?false:true" type="md-time" size="12" style="margin-right:5px;" />
                                    {{item.alarmTime | dateFormat}}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <!-- <Page style="margin-top:5px;" :current.sync="page.currentPage" :total="page.datacount" @on-change="pagechange" /> -->
                </div> 
            </div>
            <div slot="footer">
                <!-- <Button type="primary" size="large" @click="StatisticsModal = false">确定</Button> -->
            </div>
        </Modal>
        <Modal title="验证身份" :closable='false' :mask-closable='false' v-model="confirmModal" width="450" >
            <div style="">
               请输入密码： <Input v-model="password" type="password" style="width: 300px" />
            </div>
            <div slot="footer">
                <Button size="large" @click="cancelCheckidentity()">取消</Button>
                <Button type="primary" size="large" @click="checkidentity()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import Strategy_add from "./StrategyAdd";
    import Pies from "@/components/up/pie.vue";
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
            jk_tabs: JkTabs,Strategy_add,Pies
        },
        data(){
            return {
                //驱动日志查询关键字
                driveItemName:'',
                warnList:[
                    {name:'全部',val:0},
                    {name:'一般',val:1},
                    {name:'严重',val:2},
                ],
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
                drivecheckgroup:0,
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
                columns1: [
                    // {title: '序号', key: 'id',align: 'center', size: '12',width: 70,
                    // render: (h, params) => {
                    //     return h("span",  params.index +(this.currentPage - 1) * this.pageSize + 1);
                    // }},
                    {
                        title: "状态",
                        type: "selection",
                        align: "center",
                        width: 60
                    },
                    {title: '规则ID', key: 'strId',align: 'center'},
                    {title: '规则名', key: 'strName',align: 'center'},
                    {title: '过滤对象', key: 'strType',align: 'center',
                        render: (h, params) => {
                            if (params.row.strType == "WD") {
                                return h("div", "温度"+"-"+params.row.strType)
                            } if (params.row.strType == "QT") {
                                return h("div", "气体"+"-"+params.row.strType)
                            } if (params.row.strType == "YW") {
                                return h("div", "液体"+"-"+params.row.strType)
                            } else {
                                return h("div", "压力"+"-"+params.row.strType)
                            }
                        }
                    },
                    {title: '数据源对象', key: 'source',align: 'center',slot:'driveList'},
                    {title: '时效范围', key: 'timeType',align: 'center',slot:'timeType',width: 160,},
                    {title: '子策略', slot: 'lbModel',align: 'center',width: 240,},
                    {title: '状态', key: 'status', align: 'center', width: 95,slot:'state',
                        // render: (h, params) => {
                        //     let status = params.row.status;
                        //     let color = params.row.status ? 'success' : 'error';
                        //     if (status) {
                        //         return h("Tag", {style: {paddingLeft: '18px',border:"none !important"},props: {type: "dot", color: "success"}},)
                        //     } else {
                        //         return h("Tag", {style: {paddingLeft: '18px',border:"none !important"},props: {type: "dot", color: "error"}},)
                        //     }
                        // }
                    },
                    {title: '操作', slot: 'action', width: 120, align: 'center'}
                ],
                 //子策略禁用框
                checkedshow1:false,
                checkedshow2:false,
                checkedshow3:false,
                checkedshow4:false,
                llowStatus:false,
                hhighStatus:false,
                highStatus:false,
                lowStatus:false,
                timeshow:true,
                timeswitch:false,
                days:[],
                modelList:[{name:"温度",val:"WD"},{name:"液体",val:"YW"},{name:"气体",val:"QT"},{name:"压力",val:"YL"}],
                sourceData:[],
                platForm: {
                    show: false,
                    form: {
                        uuid: "",
                        strId: "",
                        strName: "",
                        strType: "",
                        timeType: 0,
                        sjdStartTime: "00:00:00",
                        sjdEndTime: "12:00:00",
                        sjdRate: 0,
                        sjnStartTime: 0,
                        sjnLaterTime: 5,
                        sjnEndTime: 12,
                        highAlarm: 45,
                        highStatus: false,
                        lowAlarm: 5,
                        lowStatus: false,
                        status: false,
                        timestamp: 0,
                        sourceUuid: '',
                        hhighAlarm: 50,
                        llowAlarm: 0,
                        hhighStatus: false,
                        llowStatus: false,
                        source:'',
                    },
                    rules:{
                        // strName:[
                        //     { required: true, message: '不能为空', trigger: 'blur' },
                        //     { required: true, pattern: /^[\da-zA-Z\u4e00-\u9fa5_]{0,50}$/, message: '请输入中文数字或英文的组合', trigger: 'blur' },
                        // ],
                        strType:[
                            { required: true, message: '不能为空', trigger: 'blur' },
                        ],
                        // sourceUuid:[
                        //     { required: true, message: '不能为空', trigger: 'blur' },
                        // ],
                        iface:[
                            {
                                validator: (rule, value, callback)=>{
                                    if(this.timeselectlist == '时间段'){
                                        if(this.platForm.form.sjnEndTime <= 0){
                                            callback(new Error('持续时间不能小于等于0'))
                                        }
                                        if(this.platForm.form.sjnLaterTime < 0) {
                                            callback(new Error('延迟开启时间不能小于0'))
                                        }
                                        else{
                                            callback()
                                        }
                                    }else{
                                        if(!this.platForm.form.sjdStartTime){
                                            callback(new Error('请选择开始时间'))
                                        }
                                        if(!this.platForm.form.sjdEndTime) {
                                            callback(new Error('请选择结束时间'))
                                        }
                                        else{
                                            callback()
                                        }
                                    }
                                }
                            }
                        ],
                        lbModel:[
                            {
                                validator: (rule, value, callback)=>{                                    
                                    if(this.platForm.form.llowAlarm >= this.platForm.form.lowAlarm){
                                        callback(new Error('低低报必须小于低报'))
                                    }
                                    if(this.platForm.form.hhighAlarm <= this.platForm.form.highAlarm) {
                                        callback(new Error('高高报报必须大于高报'))
                                    }
                                    else{
                                        callback()
                                    } 
                                }
                            }
                        ]
                    }
                },
                data1: [],
                data3 : [],
                stateTitle: "",
                stateContent: "",
                links: [
                    {name: "策略管理", to: "/strategy/strategylist"},
                    {name: "数据源对象", to: "/strategy/datasource"},
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
            //拿表数据
            this.showData(1,10);
            //拿工作模式
            this.getstrategyInfo()
            //拿数据源对象
            this.getsourceinfo();
        },
        methods: {
            //告警驱动条件日志查询
            driveLogSerach(driveItemName,drivecheckgroup){
                this.getDriveLoginfo(this.resp.Duuid,this.resp.Suuid,driveItemName,drivecheckgroup)
            },
            cancelCheckidentity(){
                this.confirmModal = false
                this.strategyData = this.strategyBackupData
            },
            //验证身份
            checkidentity(){
                let uuid = this.$storage.getStorage("userUuid")
                uuid=uuid.replace("\"","");
                uuid=uuid.replace("\"","");
                this.$https.fetchPost(this.$api.strategy.changeStrategyCheckUser.url,{
                    userPwd: this.password,
                    userUuid: uuid
                }).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$https.fetchPost(this.$api.strategy.updateStrategyInfo.url,{"type":this.StrategyDatas}).then((resp) => {
                            if (resp.data.code == 200) {
                                this.$Notice.success({title: resp.data.title, desc: "正在刷新界面", duration: 2.5});
                                setTimeout(() => {
                                    this.confirmModal = false
                                    this.password = ''
                                    this.getstrategyInfo()
                                }, 250);
                            } else
                                this.$Notice.error({title: resp.data.title, desc: "错误：" + resp.data.describe, duration: 5});
                            }).catch(err => {
                                this.$Notice.error({title: resp.data.title, desc: err, duration: 5});
                                console.log(err)
                            })
                    } else
                        this.$Notice.error({title: resp.data.title, desc: "错误：" + resp.data.describe, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })

                
            },
            pagechange(index){
                this.page.page = index
                
                this.getDriveLoginfo(this.resp.Duuid,this.resp.Suuid)
            },
            //点击饼图拿驱动日志
            getDriveLoginfo(Duuid,Suuid,itemNameitem='',alarmLevelitem=0){
                this.resp.Duuid = Duuid
                this.resp.Suuid = Suuid
                let page = {
                    alarmLevel: alarmLevelitem,
                    itemName: itemNameitem,  
                    num:10,
                    uuid:Duuid, 
                }
                this.$https.fetchPost(this.$api.strategy.findStrategyAlarmLog.url,page).then((resp) => {
                    if (resp.data.code == 200) {
                        this.tablelogShow = true
                        this.itemList= resp.data.data.data
                        console.log(resp.data.data,"data.data")
                        console.log(this.itemList,'itemList')
                        // for(let i in this.itemList){
                        //     this.itemList[i].alarmTime = this.itemList[i].alarmMsg.substring(0,20)
                        //     this.itemList[i].alarmMsg = this.itemList[i].alarmMsg.substr(20)
                        // }
                        if(this.itemList.length == 0){
                            this.itemList=[{alarmMsg:"暂无数据"}]
                        }

                        // this.page.page = 1
                        this.page.datacount = resp.data.data.count
                    } else
                        this.$Notice.error({title: '数据源对象添加失败', desc: "错误：" + resp.data.desc, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
            },
            //pie组件接受获取回来的告警日志信息
            getDriveLogData(uuid,Suuid,driveWarningTitle){
                this.page.page = 1
                this.page.currentPage = 1
                this.getDriveLoginfo(uuid,Suuid)
                this.driveWarningTitle = driveWarningTitle
            },
            showNode(row){
                //get请求中#会被转义为%23
                console.log(row.uuid+'#'+row.strId,'row')
                let str = row.uuid+'%23'+row.strId
                this.itemList = []
                this.driveWarningTitle = ''
                this.drivecheckgroup = 0
                this.StatisticsModal = true
                this.tablelogShow = false
                 this.$https.fetchGet(this.$api.strategy.strategyAlarmCount.url+'/'+str).then((resp) => {
                    if (resp.data.code == 200) {
                        this.pieData= resp.data.data
                        console.log(this.pieData,'pieData')
                        this.$refs.pies.chart(this.pieData,row.strId,row.uuid)
                    } else
                        this.$Notice.error({title: '数据源对象添加失败', desc: "错误：" + resp.data.desc, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
            },
            getsourceinfo(){
                this.$https.fetchGet(this.$api.strategy.findStrategyDataSourceAll.url).then((resp) => {
                    if (resp.data.code == 200) {
                        this.sourceData= resp.data.data
                        console.log(this.sourceData,'sourceData')
                    } else
                        this.$Notice.error({title: '数据源对象添加失败', desc: "错误：" + resp.data.desc, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
            },
            delNode(row){
                this.$Modal.confirm({
                    title: '删除策略',
                    content: '<p>当前删除的是'+row.strName+',请确认删除</p>',
                    onOk: () => {
                        this.$https.fetchPost(this.$api.strategy.deleteStrategy.url+"/"+row.uuid).then((resp) => {
                            if (resp.data.code == 200) {
                                this.$Notice.success({title: '策略删除成功', desc: "正在刷新界面", duration: 2});
                                setTimeout(() => {
                                    this.showData(this.currentPage,10);
                                    // this.reload();
                                }, 250);
                            } else {
                                this.$Notice.error({title: '策略删除失败', desc: "错误：" + resp.data.describe, duration: 5});
                            }
                            this.$Modal.remove();
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                            this.$Modal.remove();
                        })
                    }
                })
            },
            batchOpen(){
                let list = []
                for(let i in this.selected){
                    list.push(this.selected[i].uuid)
                }
                if(list.length == 0){
                    this.$Notice.error({title: "批量启动失败", desc: "没有勾选策略", duration: 2});
                    return
                }else{
                    this.$https.fetchPost(this.$api.strategy.batchStartStrategy.url,list).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: resp.data.title, desc: "正在刷新界面", duration: 2.5});
                        setTimeout(() => {
                            this.showData(this.currentPage,10);
                            // this.reload();
                        }, 250);
                    } else
                        this.$Notice.error({title: resp.data.title, desc: "错误：" + resp.data.describe, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: resp.data.title, desc: err, duration: 5});
                        console.log(err)
                    })
                }
            },
            batchColse(){
                let list = []
                for(let i in this.selected){
                    list.push(this.selected[i].uuid)
                }
                if(list.length == 0){
                    this.$Notice.error({title: "批量关闭失败", desc: "没有勾选策略", duration: 5});
                    return
                }else{
                    this.$https.fetchPost(this.$api.strategy.batchStopStrategy.url,list).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: resp.data.title, desc: "正在刷新界面", duration: 2.5});
                            setTimeout(() => {
                                this.showData(this.currentPage,10);
                                // this.reload();
                            }, 250);
                        } else
                            this.$Notice.error({title: resp.data.title, desc: "错误：" + resp.data.describe, duration: 5});
                        }).catch(err => {
                            this.$Notice.error({title: resp.data.title, desc: err, duration: 5});
                            console.log(err)
                        })
                }
            },
            batchDelete(){
                let list = []
                for(let i in this.selected){
                    list.push(this.selected[i].uuid)
                }
                this.$https.fetchPost(this.$api.strategy.batchStopStrategy.url,list).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: resp.data.title, desc: "正在刷新界面", duration: 2.5});
                        setTimeout(() => {
                            this.showData(this.currentPage,10);
                            // this.reload();
                        }, 250);
                    } else
                        this.$Notice.error({title: resp.data.title, desc: "错误代码：" + resp.data.describe, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: resp.data.title, desc: err, duration: 5});
                        console.log(err)
                    })
            },
            //把源数据加上_checedked字段，遍历已选项数据，更新选中状态
            updateChecked() {
                
                for (var i = 0; i < this.data3.length; i++) {
                    this.data3[i]._checked = false;
                    for (var j = 0; j < this.selected.length; j++) {
                        if (this.selected[j].uuid === this.data3[i].uuid) {
                            console.log(i)
                            this.data3[i]._checked = true;
                        }
                    }
                }
                console.log(this.data3,"data3")
                console.log(this.selected,"selected")
            },
            handleCancel(selection, row) {
                console.log(row);
                //从已选项中去除取消项
                this._.remove(this.selected, n => {
                    return n.path === row.path;
                });
            },
            handleSelect(selection, row) {
                //添加到已选项
                // console.log("row", row);
                console.log(this.selected,"selected")
                this.selected.push(row);
            },
            handleSelectAll(selection) {
                //数组合并，有可能用户先选择了某几项，已经被我们push进去，因此数组合并需要去重一下
                // console.log(selection)
                this.selected = this._.uniqBy(this.selected.concat(selection), "uuid");
            },
            handleCancelSelectAll(selection) {
                //从已选项中移除当页数据
                this.selected = this._.differenceBy(this.selected,this.data3,"uuid");
            },
            //更改策略模式
            changeStrategyData(item){
                this.StrategyDatas = item
                this.confirmModal = true   
            },
            strategyListdatafocus(data){
                console.log(data)
            },
            //分页下一页点击事件
            changepage(index) {
                this.currentPage = index;
                this.showData(index,10);
                
                // var _start = (index - 1) * this.pageSize;
                // var _end = index * this.pageSize;
                // this.data3 = this.data1.slice(_start, _end);
                // for(let i in this.data3){
                //     if(this.data3[i].lbModel == "SINGLE"){
                //         this.data3[i]["lbModel"] = "单机";
                //     }else {
                //         this.data3[i]["lbModel"] = "主备";
                //     }
                // }
                // this.updateChecked();
            },
            //get工作模式
            getstrategyInfo (){
                this.$https.fetchGet(this.$api.strategy.strategyInfo.url).then((resp) => {
                    if (resp.status == 200) {
                        this.strategyData = resp.data.data.type
                        this.strategyBackupData = resp.data.data.type
                        if(this.strategyData == 'PASS'){
                            this.PASSmodel = false
                        }else{
                            this.PASSmodel = true
                        }
                    } else
                        this.$Notice.error({title: '获取数据失败', desc: "错误：" + resp.data.desc, duration: 5});
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                    console.log(err)
                })
            },
            //获取策略数据
            showData(page,size){
                this.$https.fetchPost(this.$api.strategy.findStrategyByPage.url,{"page": page,"size": size,
                    sorts: [{
                        filed: "strId",
                        order: true
                        }
                    ]}).then((resp) => {
                    this.data1 = resp.data.data.data;
                    this.dataCount = resp.data.data.count
                    this.data3 = this._.cloneDeep(resp.data.data.data)
                    // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                    if (this.data1.length < this.pageSize) {
                        this.data3 = this.data3 
                    } else {
                        this.data3 = this._.cloneDeep(this.data1.slice(0, this.pageSize))
                    }
                    for(let i in this.data3){
                        if(this.data3[i].status == false){
                            this.data3[i]["status"] = "禁用";
                            this.data3[i]["color"] = "red";
                            this.data3[i]["iconName"] = "ios-pause";
                        }else {
                            this.data3[i]["status"] = "启用";
                            this.data3[i]["color"] = "green";
                            this.data3[i]["iconName"] = "ios-play";
                        }
                    }
                    this.updateChecked()
                }).catch(err => {
                    console.log(err)
                })
            },
            //单击修改状态
            updateState(row,index){
                if(this.data1[index]["status"] == "禁用" || this.data1[index]["status"] == false){
                    this.stateTitle = "启用策略";
                    this.stateContent = "确定要启用此策略吗?";
                    // this.modal.form.state = true;
                    var updateUrl = this.$api.strategy.batchStartStrategy.url
                    var list = []
                    list.push(row.uuid)
                }else {
                    this.stateTitle = "禁用策略";
                    this.stateContent = "确定要禁用此策略吗?";
                    // this.modal.form.state = false;
                    var updateUrl = this.$api.strategy.batchStopStrategy.url
                    var list = []
                    list.push(row.uuid)
                }
                var that = this
                this.$Modal.confirm({
                    title: this.stateTitle,
                    content: '<p>'+this.stateContent+'</p>',
                    onOk: () => {
                        this.$https.fetchPost(updateUrl,list).then((resp) => {
                            if (resp.data.code == 200) {
                                this.$Notice.success({title: '策略启停成功', desc: "正在刷新界面", duration: 2.5});
                                setTimeout(() => {
                                    this.showData(this.currentPage,10);
                                        // this.reload();
                                    }, 250);
                            } else
                                this.$Notice.error({
                                    title: '策略启停失败',
                                    desc: "错误代码：" + resp.data.desc,
                                    duration: 2.5
                                });
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                            console.log(err)
                        });
                    }
                });
            },

            updateNode(index,state) {
                if (state==true || state=="启用") {
                    this.$Modal.info({
                    title: "警告",
                    content: "策略启用时无法操作，请将策略状态调整为禁用后再操作",
                })
                }else{
                    this.platForm.show = true;
                    this.platForm.form = this.data1[index]
                    if(this.platForm.form.llowStatus){
                        this.checkedshow1 = true
                    }else{
                        this.checkedshow1 = false
                    }
                    if(this.platForm.form.hhighStatus){
                        this.checkedshow2 = true
                    }else{
                        this.checkedshow2 = false
                    }
                    if(this.platForm.form.highStatus){
                        this.checkedshow3 = true
                    }else{
                        this.checkedshow3 = false
                    }
                    if(this.platForm.form.lowStatus){
                        this.checkedshow4 = true
                    }else{
                        this.checkedshow4 = false
                    }
                    if(this.platForm.form.timeType == 1){
                        this.timeselectlist = "时间内"
                        this.timeshow = false
                        // this.$util.time_stamp2time_date(this.platForm.form.sjdStartTime).format('hh:mm:ss')
                        // this.$util.time_stamp2time_date(this.platForm.form.sjdEndTime).format('hh:mm:ss')
                    }else{
                        this.timeselectlist = "时间段"
                        this.timeshow = true
                    }
                    this.platForm.form.sourceUuid = this.data1[index].source.uuid
                    console.log(this.data1[index])
                } 
            },



            //修改子策略
             //日期全选变每天勾选
            weeksListchange(){
                if(this.days.length == 7){
                    this.timeswitch = true
                }else{
                    this.timeswitch = false
                }
            },
            //时效范围时间段或时间内
            timeselectlistchange(){
                if(this.timeselectlist == "时间段"){
                    this.timeshow = true
                }else{
                    this.timeshow = false
                    // platForm.form.sjnLaterTime = 0
                    // platForm.form.sjnEndTime = 0
                }
            },
            //时效范围每天按钮
            timechange(){
                if(this.timeswitch == true){
                    this.days = []
                    for(let i in this.weeks){
                        this.days.push(this.weeks[i].value)
                    }
                }else{
                    this.days = []
                }
            },
            //修改策略
            updateTest(){
                this.$refs['plat_form'].validate((valid) => {
                    if (!valid)
                        return; 
                    if(this.timeselectlist == "时间段"){
                        this.platForm.form.timeType = 0
                    }else{
                        this.platForm.form.timeType = 1
                    }
                    if(!this.platForm.form.sourceUuid){
                        this.platForm.form.sourceUuid = null
                    }
                    console.log(this.platForm.form,"form")
                    this.$https.fetchPost(this.$api.strategy.updateStrategyCfg.url,this.platForm.form).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '策略修改成功', desc: "正在刷新界面", duration: 2.5});
                            setTimeout(() => {
                                this.platForm.show = false
                                this.showData(this.currentPage,10);
                                // this.reload();
                            }, 250);
                        } else
                            this.$Notice.error({title: '策略修改失败', desc: "错误：" + resp.data.describe, duration: 5});
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                            console.log(err)
                        })
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
            cursor: pointer;
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