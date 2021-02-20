<template>
    <div>
        <Button icon="md-add-circle" type="primary" @click="showAddDrawer">
            新增
        </Button>
        <Modal title="新增上报策略" v-model="platForm.show" width="700" >
            <Form ref="plat_form" :rules="platForm.rules" :model="platForm.form" 
                  :label-width="100">
                <!-- <FormItem label="状态" prop="status" style="margin-bottom: 15px;">
                    <RadioGroup v-model="platForm.form.state">
                        <Radio label="禁用"></Radio>
                        <Radio label="启用" disabled></Radio>
                    </RadioGroup>
                </FormItem> -->
                <FormItem label="规则名" prop="strName" style="margin-bottom: 15px;">
                    <Input :maxlength=50 v-model="platForm.form.strName" style="width:100%;" />
                </FormItem>
                <FormItem label="过滤对象" prop="strType" style="margin-bottom: 15px;">
                    <Select v-model="platForm.form.strType" style="width:100%;">
                        <Option v-for="type in modelList" :value="type.val" :key="type.name">{{ type.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="数据源对象" prop="sourceUuid" style="margin-bottom: 15px;">
                    <Select v-model="platForm.form.sourceUuid" clearable style="width:100%;">
                        <Option v-for="(type,i) in sourcePropData" :value="type.uuid" :key="i" >{{ type.sourceName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="时效范围" prop="iface" style="margin-bottom: 12px;">
                    <RadioGroup style="margin-bottom: 10px;" v-model="timeselectlist" @on-change="timeselectlistchange">
                        <Radio label="时间段"></Radio>
                        <Radio label="时间内"></Radio>
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
                <Checkbox v-model="platForm.form.hhighStatus"></Checkbox>
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
                <Button type="primary" size="large" @click="addTest">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        inject: ["reload"],
        props: {
            sourcePropData: Array,
        },
        name: "StrategyAdd",
        components: {},
        data() {
            return {
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
                // props: ["typeListdata"],
                timeselectlist:'时间段',
                days:[],
                platForm: {
                    show: false,
                    form: {
                        uuid: "",
                        strId: "",
                        strName: "",
                        strType: "",
                        timeType: 0,
                        sjnLaterTime: "",
                        sjdEndTime: "12:00:00",
                        sjdRate: 0,
                        sjdStartTime: '00:00:00',
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
                        llowStatus: false
                    },
                    rules:{
                        strName:[
                            { required: true, message: '不能为空', trigger: 'blur' },
                            { required: true, pattern: /^[\da-zA-Z\u4e00-\u9fa5_]{0,50}$/, message: '请输入中文数字或英文的组合', trigger: 'blur' },
                        ],
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
                weeks:[{name:"每天",value:0},{name:"每周一",value:1},{name:"每周二",value:2},{name:"每周三",value:3},
                {name:"每周四",value:4},{name:"每周五",value:5},
                {name:"每周六",value:6},{name:"每周日",value:7},],
                modelList:[{name:"温度",val:"WD"},{name:"液体",val:"YW"},{name:"气体",val:"QT"},{name:"压力",val:"YL"}],
            }
        },
        computed: {},
        mounted: function() {
            // console.log(this.sourceData)
        },
        methods: {
            //日期全选变每天勾选
            weeksListchange(){
                if(this.days.length == 7){
                    this.timeswitch = true
                }else{
                    this.timeswitch = false
                }
            },
            // //子策略禁用开关按钮
            // checkedchange2(){
            //     if(this.platForm.form.hhighStatus == true){
            //         this.checkedshow2 = true
            //     }else{
            //         this.checkedshow2 = false
            //     }
            // },
            // checkedchange1(){
            //     if(this.platForm.form.llowStatus == true){
            //         this.checkedshow1 = true
            //     }else{
            //         this.checkedshow1 = false
            //     }
            // },
            // checkedchange3(){
            //     if(this.platForm.form.highStatus == true){
            //         this.checkedshow3 = true
            //     }else{
            //         this.checkedshow3 = false
            //     }
            // },
            // checkedchange4(){
            //     if(this.platForm.form.lowStatus == true){
            //         this.checkedshow4 = true
            //     }else{
            //         this.checkedshow4 = false
            //     }
            // },
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
            //添加策略
            addTest(){
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
                    this.$https.fetchPost(this.$api.strategy.addStrategyCfg.url,this.platForm.form).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '策略添加成功', desc: "正在刷新界面", duration: 2.5});
                            setTimeout(() => {
                                this.reload();
                            }, 250);
                        } else
                            this.$Notice.error({title: '策略添加失败', desc: "错误：" + resp.data.describe, duration: 5});
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                            console.log(err)
                        })
                })
            },
            updateType(val){
                // this.typeListdata = []
            },

            showAddDrawer() {
                this.platForm.show = true;
            },

            addPlatForm() {

            },
        }
    };
</script>
<style scoped lang="less">
    //    /deep/ .ivu-select-dropdown{
    //         min-width: 633px !important;
    //    }
</style>