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
                    <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">系统参数</span>
                    <div style="margin: 15px 10px;">
                        <table border="1" style="width: 100%;">
                            <tr style="height: 40px;">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">会话超时设置(分钟):</span></td>
                                <td>
                                    <Input v-model="data.userSessionTime" style="width: 200px;margin-left: 15px;" placeholder="填写1-180的正整数..." />
                                </td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">登录可尝试次数:</span></td>
                                <td>
                                    <Input v-model="data.loginFailuresNumber" style="width: 200px;margin-left: 15px;" placeholder="填写1-30的正整数..." />
                                </td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">登录账号锁定时间(分钟):</span></td>
                                <td>
                                    <Input v-model="data.loginFailuresLockTime" style="width: 200px;margin-left: 15px;" placeholder="填写1-180的正整数..." />
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div>
                    <Button type="primary" style="margin: 10px 50%;" @click="update">确认</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "UserManage",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                time: "",
                data: {
                    loginFailuresLockTime: null,
                    loginFailuresNumber: null,
                    userSessionTime: null,
                    uuid: null
                },
                links: [
                    {name: "用户", to: "/user/userConfig"},
                    {name: "角色", to: "/user/userRole"},
                    {name: "用户管理", to: "/user/userManage"},
                ]
            }
        },
        mounted() {
            this.showData();
        },
        methods: {
            showData() {
                this.$https.fetchGet(this.$api.user.user_cfg.url).then((resp) => {
                    this.data.loginFailuresLockTime = resp.data.data.loginFailuresLockTime;
                    this.data.loginFailuresNumber = resp.data.data.loginFailuresNumber;
                    this.data.userSessionTime = resp.data.data.userSessionTime;
                    this.data.uuid = resp.data.data.uuid;
                }).catch(err => {
                    console.log(err)
                })
            },
            update() {
                if(!this.checkInput()) {
                    this.$https.fetchPut(this.$api.user.user_cfg.url, this.data).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '时间设置成功', desc: "正在刷新界面", duration: 3});
                            location.reload();
                        } else
                            this.$Notice.error({title: '时间设置失败', desc: resp.data.describe, duration: 3});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 3});
                        console.log(err)
                    });
                }
            },
            checkInput() {
                console.log(this.data.userSessionTime);
                let status = false;
                if(this.data.loginFailuresLockTime === '' || this.data.loginFailuresNumber === '' || this.data.userSessionTime === '') {this.$Message.error({content: '请填写会话超时时间、登录可尝试次数、登录账号锁定时间...', duration: 3});    status = true;}
                else if(!/^(([1-9]|[1-9][0-9]|1[0-7][0-9])(\.[0-9]+)?|180)$/.test(this.data.userSessionTime)) {this.$Message.error({content: '会话超时时间填写1-180的正整数...', duration: 3});    status = true;}
                else if(!/^([12][0-9]|30|[1-9])$/.test(this.data.loginFailuresNumber)) {this.$Message.error({content: '登录可尝试次数填写1-30的正整数...', duration: 3});    status = true;}
                else if(!/^(([1-9]|[1-9][0-9]|1[0-7][0-9])(\.[0-9]+)?|180)$/.test(this.data.loginFailuresLockTime)) {this.$Message.error({content: '登录账号锁定时间填写1-180的正整数...', duration: 3});    status = true;}
                return status;
            }
        }
    }
</script>

<style scoped>
</style>