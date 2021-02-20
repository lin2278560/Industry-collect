<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
<!--                    <role-add style="float: right"></role-add>-->
                </blockquote>
            </div>
            <div class="modal-body" style="height: 550px;">
                <Table border size="small" :columns="columns1" :data="data1">
<!--                    <template slot-scope="{ row, index }" slot="action">-->
<!--                        <Button type="primary" size="small" style="margin-right: 5px" @click="update(index)">修改</Button>-->
<!--                        <Button type="error" size="small" @click="del(row.uuid)">删除</Button>-->
<!--                    </template>-->
                </Table>
                <div class="foot">
                    <span class="desc" style="font-size: 13px;">查询{{total}}条，当前第{{find.page}}页</span>
                    <Page class="btn" @on-change="pageChange" :current="find.page" :total="total" :page-size="find.size" simple/>
                </div>
            </div>
        </div>

<!--        <Drawer title="角色配置" v-model="modal.show" width="1000">-->
<!--            <Form ref="info_form" :rules="modal.rules" :model="modal.form"-->
<!--                  :label-width="150">-->
<!--                <FormItem label="角色名" prop="vhid" style="margin-bottom: 0px;">-->
<!--                    <Input v-model="modal.form.name" />-->
<!--                </FormItem>-->
<!--                <FormItem>-->
<!--                    <Button type="primary" @click="addPlatForm">确认</Button>-->
<!--                    <Button style="margin-left: 8px" @click="restPlatForm">重置</Button>-->
<!--                </FormItem>-->
<!--            </Form>-->
<!--        </Drawer>-->
        <Modal
                title="角色配置"
                v-model="modal.show" @on-ok="addPlatForm"
                class-name="vertical-center-modal" width="500" :styles="{top: '25%'}">
            <Form ref="info_form" :rules="modal.rules" :model="modal.form"
                  :label-width="150">
                <FormItem label="角色名" prop="vhid" style="margin-bottom: 0px;">
                    <Input v-model="modal.form.name" style="width: 250px;" />
                </FormItem>
            </Form>

        </Modal>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import roleAdd from "./UserRoleAdd";
    export default {
        name: "UserRole",
        components: {
            jk_tabs: JkTabs,roleAdd
        },
        data(){
            return {
                columns1: [
                    {title: '序号', width: 70, align: 'center', render: (h, params) => {return h("span", params.index + 1);}},
                    {title: '角色名称', key: 'name', align: 'center'},
                    // {title: '操作', slot: 'action', width: 130, align: 'center'}
                ],
                total: null,
                find: {
                    page: 1,
                    size: 10
                },
                modal: {
                    show: false,
                    form: {
                        uuid: null,
                        name: null,
                    }
                },
                links: [
                    {name: "用户", to: "/user/userConfig"},
                    {name: "角色", to: "/user/userRole"},
                    {name: "用户管理", to: "/user/userManage"},
                ],
                data1: []
            }
        },
        mounted: function() {
            this.showRole();
        },
        methods: {
            showRole(){
                this.$https.fetchPost(this.$api.user.role.url+"/actions/page_search", this.find).then((resp) => {
                    this.data1 = resp.data.data.data;
                    // this.columns1 = this.columns2;
                    this.total = resp.data.data.count;
                }).catch(err => {
                    console.log(err)
                })
            },
            pageChange(page){
                this.find.page = page;
                this.showRole();
            },
            del(index) {
                this.$Modal.confirm({
                    title: '删除角色信息',
                    content: '<p>当前操作将会删除角色信息，请确认删除</p>',
                    loading: true,
                    onOk: () => {
                        this.$https.fetchDelete(this.$api.user.role.url+"/"+index).then((resp) => {
                            if (resp.data.code == 200) {
                                location.reload();
                            } else {
                                this.$Modal.remove();
                                this.$Message.info('角色信息删除失败');
                            }
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                            console.log(err)
                        })
                    }
                });
            },
            update(index) {
                this.modal.show = true;
                this.modal.form.uuid = this.data1[index].uuid;
                this.modal.form.name = this.data1[index].name;
            },

            restPlatForm() {
                this.$refs['info_form'].resetFields();
            },
            addPlatForm() {
                this.$refs['info_form'].validate((valid) => {
                    if (!valid)
                        return;
                    this.$https.fetchPut(this.$api.user.role.url, this.modal.form).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '角色信息修改成功', desc: "正在刷新界面", duration: 2.5});
                            location.reload();
                        } else
                            this.$Notice.error({title: '角色信息修改失败', desc: "错误代码：" + resp.data.status, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        console.log(err)
                    });
                });
            },
        }
    }
</script>

<style scoped>
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
</style>