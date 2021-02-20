<template>
    <div class="nav">
        <img class="nav-log" src="../../public/logo.png"/>
        <h3 class="nav-title">{{ title}}</h3>
       
        <Dropdown class="nav-dropdown" :style='{float:"right",margin:"32px 30px 27px 40px"}'>
            <a style="font-size: 14px;" href="javascript:void(0)">{{users}}
                <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem>
                   <div @click="updataPass">修改密码</div>
            </DropdownItem>
                <DropdownItem>
                    <div @click="logout">退出</div>
                </DropdownItem>
               
            </DropdownMenu>
        </Dropdown>
        <div class="nav-log" style="margin: 15px -100px 5px 30px;width:250px;color:white;font-size:16px;line-height:53px;float:right;">{{timestamp}}</div>
        <Modal v-model="modal" title="修改当前用户密码" width="200" @on-cancel="cancel">
            <Form ref="form" :model="login" :rules="rule" >
<!--                <FormItem prop="oldPassword">-->
<!--                    <Input v-model="login.oldPassword" prefix="md-person" type="password" placeholder="原密码"/>-->
<!--                </FormItem>-->
                <FormItem prop="newPassword">
                    <Input v-model="login.newPassword" prefix="md-lock" type="password" placeholder="新密码"/>
                </FormItem>
                <FormItem prop="repeatPwd">
                    <Input v-model="login.repeatPwd" prefix="md-lock" type="password" placeholder="确认密码"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">重置</Button>
                <Button type="primary" @click="ok">确定</Button>
            </div>
        </Modal>
        <!--<div class="nav-time" >
          系统运行时间:<Time :time="time" type="datetime" :interval="1"/>
        </div>-->

    </div>
</template>
<script>
    export default {
        data(){
            return {
                timestamp:'',
                modal: false,
                users: null,
                loading: true,
                title: null,

                login: {
                    // oldPassword: "",
                    newPassword: "",
                    repeatPwd: ""
                },
                from: {
                    password: "",
                    roleUuidList: [],
                    state: "",
                    uuid: ""
                },
                find: {
                    page: 1,
                    size: 10
                },
                rule: {
                    // oldPassword: [//6-18
                    //     {required: true, message: '请输入原密码', trigger: "blur"},
                    //     {type: "string", min: 6, max: 18, message: '请输入长度为6-18个密码字符', trigger: "blur"}
                    // ],
                    newPassword: [//6-18
                        {required: true, message: '请输入新密码', trigger: "blur"},
                        {type: "string", min: 6, max: 18, message: '请输入长度为6-18个密码字符', trigger: "blur"}
                    ],
                    repeatPwd: [//6-18
                        {required: true, message: '请输入确认密码', trigger: "blur"},
                        {
                            required: false, trigger: "blur", validator: (rule, value, callback) => {
                                if (this.login.newPassword != value)
                                    callback(new Error("新密码和确认密码不一致"));
                                else
                                    callback();

                            }
                        }
                    ]
                }
            }
        },
        mounted: function() {
            this.timer = setInterval(this.getTime, 1000);
            this.showPermission();
            // this.$storage.getStorage("loginType") == "true" ? this.title = '伟思信安物联网采集安全隔离网闸系统-采集模块' : this.title = '伟思信安物联网采集安全隔离网闸系统-上报模块';
            this.$storage.getStorage("loginType") == "true" ? this.title = '伟思信安工业数据采集网闸系统-采集模块' : this.title = '伟思信安工业数据采集网闸系统-上报模块';
            // this.$storage.getStorage("loginType") == "true" ? this.title = '伟思信安工业数据采集单向光闸系统-采集模块' : this.title = '伟思信安工业数据采集单向光闸系统-上报模块';
            // this.timestamp = Date.parse(new Date());
            // this.timestamp = this.$util.time_stamp2time_date(this.timestamp);
            // this.timestamp = this.timestamp.format("yyyy-MM-dd hh:mm:ss")
        },
        methods: {
            getTime() {
                this.timestamp = Date.parse(new Date());
                this.timestamp = this.$util.time_stamp2time_date(this.timestamp);
                this.timestamp = this.timestamp.format("yyyy-MM-dd hh:mm:ss")
            },
            showPermission() {
                let users = this.$storage.getStorage("users");
                if(users != null) {users  = users.replace("\"","").replace("\"","");}
                if(users == "usermanager") {
                    this.users = "安全管理员";
                }else if(users == "logauditor") {
                    this.users = "审计管理员";
                }else {
                    this.users = "系统管理员";
                }
            },
            logout(){
                this.$https.fetchGet(this.$api.user.logout.url).then((response) => {
                    if (response.data.code == 200) {
                        // sessionStorage.removeItem("user");
                        sessionStorage.removeItem("users");
                        sessionStorage.removeItem("userName");
                        sessionStorage.removeItem("loginType");
                        this.$Notice.info({
                            title: "退出成功"
                        });
                        this.$router.push({path: "/login"});
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            updataPass() {
                this.modal = true;
                let userName = this.$storage.getStorage("userName");
                userName = userName.replace(/"/g, "");
                this.from.roleUuidList = [];
                this.find.filters = [];
                this.find.filters.push({"filed": "username", "params": [userName], "type": "equal"});
                this.showUser();
            },
            showUser() {
                this.$https.fetchPost(this.$api.user.user.url+"/actions/page_search", this.find).then((resp) => {
                    this.from.uuid = resp.data.data.data[0].uuid;
                    this.from.state = resp.data.data.data[0].state;
                    this.from.roleUuidList.push(resp.data.data.data[0].roleList[0].uuid);
                }).catch(err => {
                    console.log(err)
                })
            },
            ok(){
                this.$refs["form"].validate((valid) => {
                    if (!valid)
                        return;

                    this.from.password = this.login.newPassword;

                    // this.$axios.post(this.$config.updatePass, this.login).then((response) => {
                    //     if (response.data.ok) {
                    //         this.$Notice.success({title: "修改成功", desc: "请重新登录"});
                    //         this.$options.methods.logout.bind(this)();
                    //     } else {
                    //         this.$Notice.error({title: "修改失败", desc: response.data.msg});
                    //     }
                    // }).catch(function (error) {
                    //     console.log(error);
                    // });
                    this.$https.fetchPut(this.$api.user.user.url, this.from).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '用户信息修改成功', desc: "请重新登录"});
                            // this.$options.methods.logout.bind(this)();
                            this.logout();
                        } else
                            this.$Notice.error({title: '用户信息修改失败', desc: "错误代码：" + resp.data.status});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        console.log(err)
                    });

                })

            },
            cancel(){
                this.$refs["form"].resetFields();
            }
        },
    }
</script>
<style scoped>
    .nav {
        width: 100%;
        height: 80px;
        background-color: #4e4e4e;
        /*background-color: #4e4e4e;*/
    }

    .nav-log {
        float: left;
        height: 70px;
        width: 90px;
        padding: 0;
        margin: 5px 16px 5px 30px;
    }

    .nav-title {
        float: left;
        color: white;
        font-size: 19px;
        margin: 32px 0;
        line-height: 1;
        font-family: 'Source Sans Pro',Arial,sans-serif;
        font-weight: 600;
    }

    .nav-time {
        float: right;
        color: white;
        font-size: 14px;
        line-height: 1;
        margin: 28px 0;
    }

    .nav-dropdown a {
        color: white;
        font-size: 16px;
        line-height: 1;
    }
</style>

