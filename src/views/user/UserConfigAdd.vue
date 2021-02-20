<template>
    <div>
        <Button type="primary" @click="showAddDrawer">
            新增
        </Button>
<!--        <Drawer title="用户配置" v-model="platForm.show" width="700">-->
<!--            <Form ref="plat_form" :rules="platForm.rules" :model="platForm.form"-->
<!--                  :label-width="150">-->
<!--                <FormItem label="禁用" prop="subnet" style="margin-bottom: 0px;">-->
<!--                    <Checkbox v-model="platForm.state" />-->
<!--                </FormItem>-->
<!--                <FormItem label="用户名" prop="vhid" style="margin-bottom: 0px;">-->
<!--                    <Input v-model="platForm.form.username" />-->
<!--                </FormItem>-->
<!--                <FormItem label="密码" prop="password" style="margin-bottom: 0px;">-->
<!--                    <Input type="password" v-model="pwd" />-->
<!--                    <div class='input_span'>-->
<!--                        <span id="one" style="margin: auto;"></span>-->
<!--                        <span id="two"></span>-->
<!--                        <span id="three"></span>-->
<!--                    </div>-->
<!--                </FormItem>-->
<!--                <FormItem label="角色" prop="password" style="margin-bottom: 0px;">-->
<!--                    <Select v-model="platForm.roleUuid">-->
<!--                        <Option v-for="(item, i) in roleList" :label="item.name" :value="item.uuid"></Option>-->
<!--&lt;!&ndash;                        <Option label="用户管理员" value="NUM2"></Option>&ndash;&gt;-->
<!--&lt;!&ndash;                        <Option label="日志审计员" value="NUM3"></Option>&ndash;&gt;-->
<!--                    </Select>-->
<!--                </FormItem>-->
<!--                <FormItem>-->
<!--                    <Button type="primary" @click="addPlatForm">确认</Button>-->
<!--                    <Button style="margin-left: 8px" @click="restPlatForm">重置</Button>-->
<!--                </FormItem>-->
<!--            </Form>-->
<!--        </Drawer>-->


        <Modal
                title="用户配置"
                v-model="platForm.show" @on-ok="addPlatForm"
                class-name="vertical-center-modal" width="500" :styles="{top: '25%'}">
            <Form ref="plat_form" :rules="platForm.rules" :model="platForm.form"
                  :label-width="150">
                <FormItem label="启用" prop="subnet" style="margin-bottom: 0px;">
                    <Checkbox v-model="platForm.state" />
                </FormItem>
                <FormItem label="用户名" prop="vhid" style="margin-bottom: 0px;">
                    <Input v-model="platForm.form.username" style="width: 250px;" />
                </FormItem>
                <FormItem label="密码" prop="password" style="margin-bottom: 0px;">
                    <Input type="password" v-model="pwd" style="width: 250px;" />
                    <div class='input_span'>
                        <span id="one" style="margin: auto;"></span>
                        <span id="two"></span>
                        <span id="three"></span>
                    </div>
                </FormItem>
                <FormItem label="角色" prop="password" style="margin-bottom: 0px;">
                    <Select v-model="platForm.roleUuid" style="width: 250px;">
                        <Option v-for="(item, i) in roleList" :label="item.name" :value="item.uuid"></Option>
<!--                        <Option label="用户管理员" value="NUM2"></Option>-->
<!--                        <Option label="日志审计员" value="NUM3"></Option>-->
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="platForm.show = false">取消</Button>
                <Button type="primary" size="large" @click="addPlatForm">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "UserConfigAdd",
        components: {},
        data() {
            return {
                platForm: {
                    show: false,
                    state: false,
                    roleUuid: '',
                    form: {
                        state: null,
                        username: '',
                        password: '',
                        roleUuidList: []
                    },
                },
                roleList: [],
                msgText: '',

                pwd: '',
            }
        },
        computed: {},
        mounted() {
            this.showRole();
        },
        methods: {
            showRole(){
                let find = {page: 1, size: 100};
                this.$https.fetchPost(this.$api.user.role.url+"/actions/page_search", find).then((resp) => {
                    for(let i in resp.data.data.data) {
                        if(resp.data.data.data[i].name == '安全管理员') {
                            resp.data.data.data.splice(i, 1);
                        }
                    }
                    this.roleList = resp.data.data.data;
                    // this.columns1 = this.columns2;
                }).catch(err => {
                    console.log(err)
                })
            },
            showAddDrawer() {
                this.platForm.show = true;
            },
            addPlatForm() {
                this.$refs['plat_form'].validate((valid) => {
                    if (!valid)
                        return;
                    this.platForm.form.state = this.platForm.state ? 1 : 0;
                    this.platForm.form.password = this.pwd;
                    this.platForm.form.roleUuidList.push(this.platForm.roleUuid);

                    if(!this.checkPlatForm()) {
                        this.platForm.show = false;
                        this.$https.fetchPost(this.$api.user.user.url,
                            this.platForm.form
                            // {headers: {'Content-Type': 'multipart/form-data'}}
                        ).then((resp) => {
                            if (resp.data.code == 200) {
                                this.$Notice.success({title: '用户信息添加成功', desc: "正在刷新界面", duration: 2.5});
                                location.reload();
                            } else
                                this.$Notice.error({title: '用户信息失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                            console.log(err)
                        })
                    }
                });
            },
            restPlatForm() {},
            checkPlatForm() {
                let status = false;

                if(this.platForm.form.username === '' || this.pwd === '' || this.platForm.roleUuid === '') {
                    this.$Message.error({content: '请填写用户名、密码,选择用户角色...', duration: 3});    status = true;
                }
                else if(!/^[\da-zA-Z]{6,30}$/.test(this.platForm.form.username)) {this.$Message.error({content: '用户名填写6-30位以内英文、数字...', duration: 3});    status = true;}
                // else if(!/^[\da-zA-Z!@#$%^&*]{6,30}$/.test(this.pwd)) {this.$Message.error({content: '密码填写6-30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^((?=.*[A-Za-z])|(?=.*\d))(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,30}$/.test(this.pwd)) {
                    this.$Message.error({content: '密码填写6-30位以内英文、数字或特殊字符(至少1个字母、1个特殊字符或者至少1个数字、1个特殊字符)...', duration: 3});    status = true;}
                return status;
            },
            checkStrong(sValue) {
                var modes = 0;
                //正则表达式验证符合要求的
                if (sValue.length < 1) return modes;
                if (/\d/.test(sValue)) modes++; //数字
                if (/[a-z]/.test(sValue)) modes++; //小写
                if (/[A-Z]/.test(sValue)) modes++; //大写
                if (/\W/.test(sValue)) modes++; //特殊字符

                //逻辑处理
                switch (modes) {
                    case 1:
                        return 1;
                        break;
                    case 2:
                        return 2;
                        break;
                    case 3:
                    case 4:
                        return sValue.length < 4 ? 3 : 4;
                        break;
                }
                return modes;
            }
        },
        watch: {
            pwd(newValue, oldValue) {
                this.msgText = this.checkStrong(newValue);
                if(this.msgText > 1 || this.msgText == 1) {
                    document.getElementById("one").style.background = "red";
                } else {
                    document.getElementById("one").style.background = "#eee";
                }
                if(this.msgText > 2 || this.msgText == 2) {
                    document.getElementById("two").style.background = "orange";
                } else {
                    document.getElementById("two").style.background = "#eee";
                }
                if(this.msgText == 4) {
                    document.getElementById("three").style.background = "#00D1B2";
                } else {
                    document.getElementById("three").style.background = "#eee";
                }
            }
        }
    }
</script>
<style scoped lang="less">
    @deep: ~'>>>';
    @{deep} .ivu-drawer-content {
        background: #faf8f7;
    }

    .input_span span {
        display: inline-block;
        width: 85px;
        height: 10px;
        background: #eee;
        line-height: 20px;
    }

    #one {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-right: 0px solid;
        margin-left: 20px;
        margin-right: 3px;
    }

    #two {
        border-left: 0px solid;
        border-right: 0px solid;
        margin-left: -5px;
        margin-right: 3px;
    }

    #three {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-left: 0px solid;
        margin-left: -5px;
    }
</style>