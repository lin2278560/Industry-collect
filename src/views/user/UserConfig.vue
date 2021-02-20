<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <userAdd style="float: right"></userAdd>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 550px;">
                <Table border size="small" :columns="columns1" :data="data1">
                    <template v-if="row.username != 'sysAdmin' && row.username != 'userAdmin' && row.username != 'logAdmin'" slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="update(index, row.username)">修改</Button>
                        <Button type="error" size="small" @click="del(row.uuid, row.username)">删除</Button>
                    </template>
                </Table>
                <div class="foot">
                    <span class="desc" style="font-size: 13px;">查询{{total}}条，当前第{{find.page}}页</span>
                    <Page class="btn" @on-change="pageChange" :current="find.page" :total="total" :page-size="find.size" simple/>
                </div>
            </div>
        </div>

<!--        <Drawer title="用户配置" v-model="modal.show" width="1000">-->
<!--            <Form ref="info_form" :rules="modal.rules" :model="modal.form"-->
<!--                  :label-width="150">-->
<!--                <FormItem label="禁用" prop="subnet" style="margin-bottom: 0px;">-->
<!--                    <Checkbox v-model="modal.state" />-->
<!--                </FormItem>-->
<!--                <FormItem label="用户名" prop="vhid" style="margin-bottom: 0px;">-->
<!--                    <Input v-model="modal.username" disabled />-->
<!--                </FormItem>-->
<!--                <FormItem label="密码" prop="password" style="margin-bottom: 0px;">-->
<!--                    <Input type="password" v-model="modal.form.password" />-->
<!--                    <div class='input_span'>-->
<!--                        <span id="one" style="margin: auto;"></span>-->
<!--                        <span id="two"></span>-->
<!--                        <span id="three"></span>-->
<!--                    </div>-->
<!--                </FormItem>-->
<!--                <FormItem label="角色" prop="password" style="margin-bottom: 0px;">-->
<!--                    <Select v-model="modal.roleUuid">-->
<!--                        <Option v-for="(item, i) in roleList" :label="item.name" :value="item.uuid"></Option>-->
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
                v-model="modal.show" @on-ok="addPlatForm"
                class-name="vertical-center-modal" width="500" :styles="{top: '25%'}">
            <Form ref="info_form" :rules="modal.rules" :model="modal.form"
                  :label-width="110">
                <FormItem label="启用" prop="subnet" style="margin-bottom: 0px;">
                    <Checkbox v-model="modal.state" :disabled="disabled" />
                </FormItem>
                <FormItem label="用户名" prop="vhid" style="margin-bottom: 0px;">
                    <Input v-model="modal.username" disabled style="width: 250px;" />
                </FormItem>
                <FormItem label="密码" prop="password" style="margin-bottom: 0px;">
                    <Input type="password" v-model="password" style="width: 250px;" />
                    <span style="margin-left: 10px;font-size: 12px;color: red;">(不修改请留空...)</span>
                    <div class='input_span'>
                        <span id="oneShow" style="margin: auto;"></span>
                        <span id="twoShow"></span>
                        <span id="threeShow"></span>
                    </div>
                </FormItem>
                <FormItem label="角色" prop="password" style="margin-bottom: 0px;">
                    <Select v-model="modal.roleUuid" style="width: 250px;">
                        <Option v-for="(item, i) in roleList" :label="item.name" :value="item.uuid"></Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="modal.show = false">取消</Button>
                <Button type="primary" size="large" @click="addPlatForm">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import userAdd from "./UserConfigAdd";
    export default {
        name: "UserConfig",
        components: {
            jk_tabs: JkTabs,userAdd
        },
        data(){
            return {
                columns1: [
                    {title: '序号', width: 70, align: 'center', render: (h, params) => {return h("span", params.index + 1);}},
                    {title: '用户名', key: 'username', align: 'center'},
                    {title: '状态', key: 'state', align: 'center', render: (h, params) => {return h('span', params.row.state == 0 ? '禁用' : '启用');}},
                    {title: '角色', key: '', align: 'center', render: (h, params) => {return h('span', params.row.roleList[0].name);}},
                    {title: '操作', slot: 'action', width: 150, align: 'center'}
                ],
                total: null,
                find: {
                    page: 1,
                    size: 10
                },
                links: [
                    {name: "用户", to: "/user/userConfig"},
                    {name: "角色", to: "/user/userRole"},
                    {name: "用户管理", to: "/user/userManage"},
                ],
                modal: {
                    show: false,
                    state: false,
                    roleUuid: null,
                    username: null,
                    form: {
                        uuid: null,
                        state: null,
                        password: null,
                        roleUuidList: []
                    },
                },
                roleList: [],
                data1: [],
                password: '',
                disabled: false,
                userName: null,
            }
        },
        mounted: function() {
            this.userName = this.$storage.getStorage("userName").replace(/\"/g, "");
            this.showData();
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
                }).catch(err => {
                    console.log(err)
                })
            },
            showData(){
                this.$https.fetchPost(this.$api.user.user.url+"/actions/page_search", this.find).then((resp) => {
                    this.data1 = resp.data.data.data;
                    this.total = resp.data.data.count;
                }).catch(err => {
                    console.log(err)
                })
            },
            pageChange(page){
                this.find.page = page;
                this.showData();
            },
            del(index, name) {
                this.$Modal.confirm({
                    title: '删除用户信息',
                    content: '<p>当前操作将会删除用户信息，请确认删除</p>',
                    loading: true,
                    onOk: () => {
                        this.$https.fetchDelete(this.$api.user.user.url+"/"+index).then((resp) => {
                            if (resp.data.code == 200) {
                                location.reload();
                                if(name == this.userName) this.logout();
                            } else {
                                this.$Modal.remove();
                                this.$Message.info('用户信息删除失败');
                            }
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                            console.log(err)
                        })
                    }
                });
            },
            update(index, name) {
                // let userName = this.$storage.getStorage("userName").replace(/\"/g, "");
                if(name == this.userName) this.disabled = true;
                else this.disabled = false;

                document.getElementById("oneShow").style.background = "#eee";
                document.getElementById("twoShow").style.background = "#eee";
                document.getElementById("threeShow").style.background = "#eee";
                this.showRole();
                this.modal.show = true;
                this.modal.form.uuid = this.data1[index].uuid;
                // this.modal.form.status = this.data1[index].status;
                this.password = null;

                this.modal.state = this.data1[index].state == 0 ? false : true;
                this.modal.username = this.data1[index].username;
                this.modal.roleUuid = this.data1[index].roleList[0].uuid;
            },

            restPlatForm() {
                this.$refs['info_form'].resetFields();
            },
            addPlatForm() {
                this.$refs['info_form'].validate((valid) => {
                    if (!valid)
                        return;

                    this.modal.form.state = this.modal.state ? 1 : 0;
                    this.modal.form.password = this.password;
                    this.modal.form.roleUuidList.push(this.modal.roleUuid);

                    if(!this.checkPlatForm()) {
                        this.modal.show = false;
                        this.$https.fetchPut(this.$api.user.user.url, this.modal.form).then((resp) => {
                            if (resp.data.code == 200) {
                                this.$Notice.success({title: '用户信息修改成功', desc: "正在刷新界面", duration: 2.5});
                                location.reload();
                            } else
                                this.$Notice.error({title: '用户信息修改失败', desc: "错误代码：" + resp.data.status, duration: 2.5});
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                            console.log(err)
                        });
                    }
                });
            },
            checkPlatForm() {
                let status = false;

                if(this.password != null && this.password != '') {
                    if(!/^((?=.*[A-Za-z])|(?=.*\d))(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,30}$/.test(this.password)) {
                        this.$Message.error({content: '密码填写6-30位以内英文、数字或特殊字符(至少1个字母、1个特殊字符或者至少1个数字、1个特殊字符)...', duration: 3});    status = true;}
                }
                return status;
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
            password(newValue, oldValue) {
                if(newValue != null) {
                    this.msgText = this.checkStrong(newValue);
                    if(this.msgText > 1 || this.msgText == 1) {
                        document.getElementById("oneShow").style.background = "red";
                    } else {
                        document.getElementById("oneShow").style.background = "#eee";
                    }
                    if(this.msgText > 2 || this.msgText == 2) {
                        document.getElementById("twoShow").style.background = "orange";
                    } else {
                        document.getElementById("twoShow").style.background = "#eee";
                    }
                    if(this.msgText == 4) {
                        document.getElementById("threeShow").style.background = "#00D1B2";
                    } else {
                        document.getElementById("threeShow").style.background = "#eee";
                    }
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .foot {
        padding: 16px 0;
    }

    .desc {
        display: inline-block;
        vertical-align: middle;
    }

    .btn {
        display: inline-block;
        vertical-align: middle;
        float: right
    }

    .input_span span {
        display: inline-block;
        width: 85px;
        height: 10px;
        background: #eee;
        line-height: 20px;
    }

    #oneShow {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-right: 0px solid;
        margin-left: 20px;
        margin-right: 3px;
    }

    #twoShow {
        border-left: 0px solid;
        border-right: 0px solid;
        margin-left: -5px;
        margin-right: 3px;
    }

    #threeShow {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-left: 0px solid;
        margin-left: -5px;
    }
</style>