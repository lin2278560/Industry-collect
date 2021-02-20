<template>
    <div>
        <Button type="primary" @click="showAddDrawer">
            新增
        </Button>
<!--        <Drawer title="用户配置" v-model="platForm.show" width="700">-->
<!--            <Form ref="plat_form" :rules="platForm.rules" :model="platForm.form"-->
<!--                  :label-width="150">-->
<!--                <FormItem label="用户名" prop="vhid" style="margin-bottom: 0px;">-->
<!--                    <Input v-model="platForm.form.name" />-->
<!--                </FormItem>-->
<!--                <FormItem>-->
<!--                    <Button type="primary" @click="addPlatForm">确认</Button>-->
<!--                    <Button style="margin-left: 8px" @click="restPlatForm">重置</Button>-->
<!--                </FormItem>-->
<!--            </Form>-->
<!--        </Drawer>-->

        <Modal
                title="角色配置"
                v-model="platForm.show" @on-ok="addPlatForm"
                class-name="vertical-center-modal" width="500" :styles="{top: '25%'}">
            <Form ref="plat_form" :rules="platForm.rules" :model="platForm.form"
                  :label-width="150">
                <FormItem label="用户名" prop="vhid" style="margin-bottom: 0px;">
                    <Input v-model="platForm.form.name" style="width: 250px;" />
                </FormItem>
            </Form>

        </Modal>
    </div>
</template>

<script>
    export default {
        name: "UserRoleAdd",
        components: {},
        data() {
            return {
                platForm: {
                    show: false,
                    form: {
                        name: null
                    },
                },
                msgText: '',
                pwd: ''
            }
        },
        computed: {},
        methods: {
            showAddDrawer() {
                this.platForm.show = true;
            },
            addPlatForm() {
                this.$refs['plat_form'].validate((valid) => {
                    if (!valid)
                        return;

                    this.$https.fetchPost(this.$api.user.role.url,
                        this.platForm.form
                        // {headers: {'Content-Type': 'multipart/form-data'}}
                    ).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '用户角色添加成功', desc: "正在刷新界面", duration: 2.5});
                            location.reload();
                        } else
                            this.$Notice.error({title: '用户角色失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        console.log(err)
                    })
                });
            },
            restPlatForm() {},
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