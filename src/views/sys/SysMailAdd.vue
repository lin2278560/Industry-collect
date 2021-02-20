<template>
    <div>
        <Button type="primary" @click="showAddDrawer">
            新增邮件账号
        </Button>
        <Drawer title="本地邮件服务" v-model="platForm.show" width="1000">
            <Form ref="plat_form" :rules="platForm.rules" :model="platForm.form"
                  :label-width="150">
                <FormItem label="用户名" prop="username" style="margin-bottom: 15px;">
                    <Input v-model="platForm.form.username"/>
                </FormItem>
                <FormItem label="密码" prop="password" style="margin-bottom: 15px;">
                    <Input type="password" v-model="platForm.form.password"/>
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
    export default {
        name: "LocalMailAdd",
        components: {},
        data() {
            return {
                platForm: {
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
                this.$https.fetchPost(this.$api.mail.addMailUser.url,this.platForm.form).then((resp) => {
                    if (resp.data.status == 200) {
                        this.$Notice.success({title: '邮件账号添加成功', desc: "正在刷新界面", duration: 2.5});
                        setTimeout(() => {
                            location.reload();
                        }, 250);
                    } else
                        this.$Notice.error({title: '邮件账号添加失败', desc: "错误代码：" + resp.data.desc, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        console.log(err)
                    })
                });
            },
            restPlatForm() {
                this.$refs['plat_form'].resetFields();
            }
        }
    };
</script>
<style scoped lang="less">
</style>