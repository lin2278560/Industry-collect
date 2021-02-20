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
                    <span style="background:#faf8f7; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">邮件服务器设置</span>
                    <div style="margin: 15px 10px;">
                        <table border="1" style="width: 100%;">
                            <tr style="height: 40px;">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">邮件服务器IP:</span></td>
                                <td><Input v-model="platForm.form.ip" placeholder="" style="width: 150px;margin-left: 15px;" /></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">smtp服务器端口:</span></td>
                                <td><Input v-model="platForm.form.smtpPort" placeholder="" style="width: 150px;margin-left: 15px;" /><span style="margin-left: 5px;font-size: 12px;">默认端口为25</span></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">pop3服务器端口:</span></td>
                                <td><Input v-model="platForm.form.pop3Port" placeholder="" style="width: 150px;margin-left: 15px;" /><span style="margin-left: 5px;font-size: 12px;">默认端口为110</span></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">邮件服务器最大连接数:</span></td>
                                <td><Input v-model="platForm.form.maxConnection" placeholder="" style="width: 150px;margin-left: 15px;" /><span style="margin-left: 5px;font-size: 12px;">默认最大连接为10</span></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">邮件服务器超时时间:</span></td>
                                <td><Input v-model="platForm.form.timeOut" placeholder="" style="width: 150px;margin-left: 15px;" /><span style="margin-left: 5px;font-size: 12px;">默认超时时间为20s</span></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">是否开启邮件服务器:</span></td>
                                <td>
                                    <i-switch style="margin-left:12px" v-model="action" @on-change="checkaction" size="large">
                                        <span slot="open">开启</span>
                                        <span slot="close">关闭</span>
                                    </i-switch>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div>
                    <div class="btn btn-sm btn-custom add_fontclient" @click="submit" style="margin: 10px 0 0 50%;">保存</div>
                    <mailAdd style="float: right;margin-top: 10px;"></mailAdd>
                </div>
                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin:20px 0;">
                    <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">邮件列表</span>
                    <div style="margin: 15px 10px;">
                        <Table size="small" :columns="columns1" :data="data1">
                            <template slot-scope="{ row, index }" slot="action">
                                <Button type="primary" size="small" style="margin-right: 5px" @click="updateMailUser(index)">修改</Button>
                                <Button type="error" size="small" @click="deleteMailUser(row.id,index)">删除</Button>
                            </template>
                        </Table>
<!--                        <table border="1" style="width: 100%;">-->
<!--                            <tr style="height: 40px;">-->
<!--                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;">全选/取消:</span></td>-->
<!--                                <td><Checkbox style="margin-left: 15px;"-->
<!--                                              :indeterminate="indeterminate"-->
<!--                                              :value="checkAll"-->
<!--                                              @click.prevent.native="handleCheckAll">全选</Checkbox></td>-->
<!--                            </tr>-->
<!--                            <tr style="height: 40px;">-->
<!--                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;">用户管理:</span></td>-->
<!--                                <td>-->
<!--                                    <CheckboxGroup style="margin-left: 15px;" v-model="checkAllGroup" @on-change="checkAllGroupChange">-->
<!--                                        <Checkbox label="客户端防病毒引擎"></Checkbox>-->
<!--                                        <Checkbox label="客户端应用进程保护"></Checkbox>-->
<!--                                        <Checkbox label="客户端注册表保护"></Checkbox>-->
<!--                                    </CheckboxGroup>-->
<!--                                </td>-->
<!--                            </tr>-->
<!--                        </table>-->
                    </div>
                </div>
            </div>
        </div>
        <Drawer title="本地邮件服务" v-model="userform.show" width="1000">
            <Form ref="plat_form" :rules="userform.rules" :model="userform.form"
                  :label-width="150">
                <FormItem label="用户名" prop="username" style="margin-bottom: 15px;">
                    <Input v-model="userform.form.username"/>
                </FormItem>
                <FormItem label="密码" prop="password" style="margin-bottom: 15px;">
                    <Input type="password" v-model="userform.form.password"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="addPlatForm">确认</Button>
                    <Button style="margin-left: 8px" @click="restPlatForm">重置</Button>
                </FormItem>
            </Form>
        </Drawer>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import mailAdd from "./SysMailAdd";
    export default {
        inject: ["reload"],
        name: "SysMail",
        components: {
            jk_tabs: JkTabs,mailAdd
        },
        data(){
            return {
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
                        ip:'',
                        maxConnection:'',
                        pop3Port:'',
                        smtpPort:'',
                        timeOut:'',
                    }
                },
                //账号
                userform: {
                    show: false,
                    form: {
                        username:'',
                        password:'',
                    },
                    rules:{
                        username:{ required: true, message: '不能为空', trigger: 'blur' },
                        password:{ required: true, message: '不能为空', trigger: 'blur' },
                    }
                },
                links: [
                    {name: "邮箱通知", to: "/sys/mail"}
                ],
            }
        },
        mounted: function() {
            this.getinfo()
        },
        methods: {
            //修改邮件提交表单
            addPlatForm(){
                this.$refs['plat_form'].validate((valid) => {
                    if (!valid)
                        return;
                this.$https.fetchPost(this.$api.mail.updateMailUser.url,this.userform.form).then((resp) => {
                    if (resp.data.status == 200) {
                        this.$Notice.success({title: '邮件账号修改成功', desc: "正在刷新界面", duration: 2.5});
                        setTimeout(() => {
                            this.reload();
                        }, 250);
                    } else
                        this.$Notice.error({title: '邮件账号修改失败', desc: "错误代码：" + resp.data.desc, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        console.log(err)
                    })
                });
            },
            restPlatForm() {
                this.$refs['plat_form'].resetFields();
            },
            //删除邮件
            deleteMailUser(index,i) {
                console.log(index)
                this.$Modal.confirm({
                    title: '删除邮件用户',
                    content: '<p>当前操作将会导致该配置被删除，请确认删除</p>',
                    onOk: () => {
                        this.$https.fetchPost(this.$api.mail.deleteMailUser.url, {id:index}).then((resp) => {
                            if (resp.data.status == 200) {
                                this.$Message.info('邮件用户删除成功');
                                setTimeout(() => {
                                    this.reload();
                                    this.$Modal.remove();
                                }, 250);
                            } else {
                                this.$Modal.remove();
                                this.$Message.info('邮件用户删除失败');
                            }
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                            console.log(err)
                        })
                    }
                });
            },
            //修改邮件用户
            updateMailUser(index) {
                this.userform.show = true;
                this.userform.form.id = this.data1[index].id;
                this.userform.form.username = this.data1[index].username;
                this.userform.form.password = this.data1[index].password;
            },
            //提交邮件表单
            submit(){
                console.log(this.platForm.form)
                // this.$refs['plat_form'].validate((valid) => {
                //     if (!valid)
                //         return;
                this.platForm.form.pop3Port = this.platForm.form.pop3Port.toString()
                this.platForm.form.smtpPort = this.platForm.form.smtpPort.toString()
                // console.log(this.$util.testportnumber(this.platForm.form.pop3Port))
                if(!this.$util.queryDevIP4(this.platForm.form.ip) && !this.$util.queryDevIP6(this.platForm.form.ip)){
                          this.$Notice.error({title: '修改失败', desc: '请输入正确的ip格式', duration: 2.5});
                          return
                }
                else if(!this.$util.testportnumber(this.platForm.form.pop3Port)){
                          this.$Notice.error({title: '修改失败', desc: 'pop3端口请输入正确的端口格式', duration: 2.5});
                          return
                }else if(!this.$util.testportnumber(this.platForm.form.smtpPort)){
                          this.$Notice.error({title: '修改失败', desc: 'smtp端口请输入正确的端口格式', duration: 2.5});
                          return
                }
                else if(this.platForm.form.maxConnection<1 || this.platForm.form.maxConnection>100){
                          this.$Notice.error({title: '修改失败', desc: '最大连接数范围为1-100', duration: 2.5});
                          return
                }else if(this.platForm.form.timeOut<1 || this.platForm.form.timeOut>200){
                          this.$Notice.error({title: '修改失败', desc: '超时时间范围为1-200', duration: 2.5});
                          return
                }
                this.$https.fetchPost(this.$api.mail.updateMailServer.url,this.platForm.form).then((resp) => {
                    if (resp.data.status == 200) {
                        this.$Notice.success({title: '邮件服务修改成功', desc: "正在刷新界面", duration: 2.5});
                        setTimeout(() => {
                                this.reload();
                            }, 250);
                    } else
                        this.$Notice.error({title: '邮件服务修改失败', desc: "错误代码：" + resp.data.desc, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        console.log(err)
                    })
                // });
            },
            //邮件开关change事件
            checkaction(){
                console.log(this.action)
                let params = {}
                if(this.action){
                    this.$https.fetchPost(this.$api.mail.startMailService.url,params,{timeout: 20000}).then((resp) => {
                        if (resp.data.status == 200) {
                            this.$Notice.success({title: '邮件服务启动成功', desc: "正在刷新页面", duration: 2.5});
                            setTimeout(() => {
                                this.reload();
                            }, 250);
                        } else{
                            this.action = false
                            this.$Notice.error({title: '邮件服务启动失败', desc:  resp.data.desc, duration: 2.5});
                        }
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                            this.action = false
                            console.log(err)
                        })
                }else{
                    this.$https.fetchGet(this.$api.mail.stopMailService.url).then((resp) => {
                        if (resp.data.status == 200) {
                            this.$Notice.success({title: '邮件服务关闭成功', desc: "正在刷新页面", duration: 2.5});
                            setTimeout(() => {
                                this.reload();
                            }, 250);
                        } else{
                            this.action = true
                            this.$Notice.error({title: '邮件服务关闭失败', desc:  resp.data.desc, duration: 2.5});
                        }
                        }).catch(err => {
                            this.action = true
                            this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                            console.log(err)
                        })
                }
            },
            getinfo(){
                this.$https.fetchGet(this.$api.mail.getMailServerMessage.url).then((resp) => {
                if (resp.data.status == 200) {
                    console.log(resp.data.data,"邮件数据")
                    this.platForm.form = resp.data.data
                    if(resp.data.data.users){
                        this.data1 = resp.data.data.users
                    }
                    if (this.platForm.form.action==0) {
                        this.action = true
                    }else{
                        this.action = false
                    }
                } else
                    this.$Notice.error({title: '获取数据失败', desc:  resp.data.desc, duration: 2.5});
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                    console.log(err)
                })
            },

            // overTime(index){
            //     if (index == "minutes"){
            //         this.cycleList2 = this.minutes;
            //     }else if (index == "hours"){
            //         this.cycleList2 = this.hours;
            //     }else if (index == "day"){
            //         this.cycleList2 = this.day;
            //     }
            //     console.log(this.cycleList2);
            // },
            // handleCheckAll () {
            //     if (this.indeterminate) {
            //         this.checkAll = false;
            //     } else {
            //         this.checkAll = !this.checkAll;
            //     }
            //     this.indeterminate = false;

            //     if (this.checkAll) {
            //         this.checkAllGroup = ['客户端防病毒引擎', '客户端应用进程保护', '客户端注册表保护'];
            //     } else {
            //         this.checkAllGroup = [];
            //     }
            // },
            // checkAllGroupChange (data) {
            //     if (data.length === 3) {
            //         this.indeterminate = false;
            //         this.checkAll = true;
            //     } else if (data.length > 0) {
            //         this.indeterminate = true;
            //         this.checkAll = false;
            //     } else {
            //         this.indeterminate = false;
            //         this.checkAll = false;
            //     }
            // }
        }
    }
</script>

<style scoped>
</style>