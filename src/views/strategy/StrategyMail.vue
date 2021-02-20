<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body">
                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin-top: 20px;">
                    <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">邮件服务器设置</span>
                    <div style="margin: 15px 10px;">
                        <table border="1" style="width: 100%;">
                            <tr style="height: 40px;">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">邮件服务器地址:</span></td>
                                <td><Input v-model="platForm.form.serverIp" style="width: 20%;margin-left: 15px;" /></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">邮件服务器端口:</span></td>
                                <td><Input v-model="platForm.form.serverPort" style="width: 20%;margin-left: 15px;" /><span style="margin-left: 5px;font-size: 12px;"></span></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">发件人账号:</span></td>
                                <td><Input v-model="platForm.form.fromEmail" style="width: 20%;margin-left: 15px;" /><span style="margin-left: 5px;font-size: 12px;"></span></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">发件人密码:</span></td>
                                <td><Input v-model="platForm.form.fromPass" type="password" style="width: 20%;margin-left: 15px;" /><span style="margin-left: 5px;font-size: 12px;"></span></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">接收人邮箱:</span></td>
                                <td>
                                    <div style="display:flex;flex-wrap:wrap;">
                                        <span style="width:33%;display:inline-block;margin-top:10px;" v-for="(item,index) in platForm.form.recipients" :key="index">
                                            <Input v-model="item.toEmail" style="width: 61%;;margin-left: 15px;" />
                                            <i-button size="small" style="margin-left:5px;;" @click="deleteList(index)">删除</i-button>
                                        </span>
                                    </div>
                                    <div style="margin:10px 10px 10px 15px;"><i-button icon="md-add" size="small" @click="addList()">添加</i-button></div>
                                </td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">邮件服务器开关:</span></td>
                                <td><i-switch style="margin-left:12px" v-model="platForm.form.status" size="large">
                                        <span slot="open">开启</span>
                                        <span slot="close">关闭</span>
                                    </i-switch>
                                    <span style="margin-left: 5px;font-size: 12px;"></span>
                                </td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">定时发送:</span></td>
                                <td>
                                    <TimePicker :value="time1" format="HH:mm" placeholder="Select time" style="width: 112px;margin:12px;"></TimePicker>
                                    <TimePicker :value="time2" format="HH:mm" placeholder="Select time" style="width: 112px;margin:12px;"></TimePicker>
                                    <TimePicker :value="time3" format="HH:mm" placeholder="Select time" style="width: 112px;margin:12px;"></TimePicker>
                                    <!-- <Alert style="width:20%;padding: 8px 8px 8px 28px;margin-left:12px;display:inline-block;" show-icon>邮箱告知</Alert> -->
                                    <!-- <span style="width:20%;font-size:12px;margin-left:12px;display:inline-block;"><Icon type="ios-bulb-outline" slot="icon"></Icon>邮箱告知</span> -->
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div style="text-align:center;">
                    <!-- <div class="btn btn-sm btn-custom add_fontclient" @click="submit()" style="margin: 10px 0 0 50%;">保存</div> -->
                    <Button type="primary" style="margin-top:10px;margin-right:10px;" :loading="testloading" @click="submitTest()" >通讯测试</Button>
                    <!-- <Button type="primary" style="margin-top:10px;"  v-if="submitshow" @click="submit()" >保存</Button> -->
                    <Button type="primary" style="margin-top:10px;" @click="submit()" >保存</Button>
                    <!-- <mailAdd style="float: right;margin-top: 10px;"></mailAdd> -->
                </div>
                <!-- <div style="border:1px solid #666;width:100%;position:relative;float: left;margin:20px 0;">
                    <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">邮件列表</span>
                    <div style="margin: 15px 10px;">
                        <Table size="small" :columns="columns1" :data="data1">
                            <template slot-scope="{ row, index }" slot="action">
                                <Button type="primary" size="small" style="margin-right: 5px" @click="updateMailUser(index)">修改</Button>
                                <Button type="error" size="small" @click="deleteMailUser(row.id,index)">删除</Button>
                            </template>
                        </Table>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    // import mailAdd from "./SysMailAdd";
    export default {
        inject: ["reload"],
        name: "StrategyMail",
        components: {
            jk_tabs: JkTabs,
            // mailAdd
        },
        data(){
            return {
                time1:"09:00",
                time2:"15:00",
                time3:"21:00",
                submitshow:false,
                testloading:false,
                columns1: [
                    {title: '序号', key: 'id', align: 'center',width: 100,
                    render: (h, params) => {
                            return h('span', params.index +1);
                        }
                    },
                    {title: '账号', align: 'center', key: 'username'},
                    {title: '密码', align: 'center', key: 'password'},
                    {title: '操作', slot: 'action', width: 150, align: 'center'}
                ],
                action:false,//启用邮件服务按钮值
                data1:[],
                indeterminate: false,
                checkAll: false,
                checkAllGroup: [],
                //邮件表单
                platForm:{
                    form:{
                        serverIp: '',
                        serverPort: 0,
                        fromEmail: '',
                        fromPass: '',
                        status:false,
                        recipients: [
                            {
                                toEmail: ''
                            }
                        ]
                    }
                },
                links: [
                    {name: "邮箱通知", to: "/strategy/mail"}
                ],
            }
        },
        mounted: function() {
            this.getinfo()
        },
        methods: {
            submitTest(){
                this.testloading = true
                this.$https.fetchPost(this.$api.strategy.testMailInfo.url,this.platForm.form).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '通讯测试成功' ,duration: 2.5});
                        this.testloading = false
                        this.submitshow = true
                    } else{
                        this.testloading = false
                        this.submitshow = false
                        this.$Notice.error({title: '通讯失败', desc: "错误：" + resp.data.describe, duration: 5});
                    }   
                    }).catch(err => {
                        this.submitshow = false
                        this.testloading = false
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
            },
            deleteList(index){
                if(this.platForm.form.recipients.length>1){
                    this.platForm.form.recipients.splice(index,1)
                }else{
                    this.$Notice.warning({title: '删除失败', desc: '至少有一位收件人', duration: 5});
                    return
                }
            },
            addList(){
                if(this.platForm.form.recipients.length>=20){
                    this.$Notice.warning({title: '新增失败', desc: '收件人最多添加20人', duration: 5});
                    return
                }
                this.platForm.form.recipients.push({
                    toEmail: ''
                })
            },
            restPlatForm() {
                this.$refs['plat_form'].resetFields();
            },
            
            //提交邮件表单
            submit(){
                console.log(this.platForm.form)
                this.platForm.form.serverPort = this.platForm.form.serverPort.toString()
                if(!this.platForm.form.serverIp){
                    this.$Notice.error({title: '修改失败', desc: '邮件服务器地址不能为空', duration: 5});
                    return
                }
                else if(!this.$util.testportnumber(this.platForm.form.serverPort)){
                          this.$Notice.error({title: '修改失败', desc: '邮件服务器端口请输入正确的端口格式', duration: 5});
                          return
                }else if(!this.platForm.form.fromEmail){
                          this.$Notice.error({title: '修改失败', desc: '发件人账号不能为空', duration: 5});
                          return
                }
                else if(!this.platForm.form.fromPass){
                          this.$Notice.error({title: '修改失败', desc: '发件人密码不能为空', duration: 5});
                          return
                }else if(this.platForm.form.recipients.length < 1){
                          this.$Notice.error({title: '修改失败', desc: '接收人邮箱不能为空', duration: 5});
                          return
                }
                for(let i in this.platForm.form.recipients){
                    let flag = this.$util.testportMail(this.platForm.form.recipients[i].toEmail)
                    console.log(flag)
                    console.log(this.platForm.form.recipients[i].toEmail)
                    if(!flag){
                        this.$Notice.error({title: '修改失败', desc: '接收人邮箱格式错误', duration: 5});
                        return;
                    }
                }
                
                this.$https.fetchPost(this.$api.strategy.updateMailInfo.url,this.platForm.form).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '邮件服务修改成功', desc: "正在刷新界面", duration: 2.5});
                        setTimeout(() => {
                                this.reload();
                            }, 250);
                    } else
                        this.$Notice.error({title: '邮件服务修改失败', desc: "错误：" + resp.data.describe, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
            },
            getinfo(){
                this.$https.fetchGet(this.$api.strategy.mailInfo.url).then((resp) => {
                if (resp.data.code == 200) {
                    console.log(resp.data.data,"邮件数据")
                    if(resp.data.data){
                        this.platForm.form = resp.data.data
                    }
                    
                } else
                    this.$Notice.error({title: '获取数据失败', desc:  resp.data.describe, duration: 5});
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                    console.log(err)
                })
            },
        }
    }
</script>

<style scoped>
</style>