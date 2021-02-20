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
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">首页刷新状态:</span></td>
                                <td>
                                    <i-Switch size="large" v-model="value5" style="margin-left: 15px;">
                                        <span slot="open">开启</span>
                                        <span slot="close">关闭</span>
                                    </i-Switch>
                                </td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">首页刷新频率(秒):</span></td>
                                <td>
                                    <Input v-model="value6" style="width: 200px;margin-left: 15px;" placeholder="填写1-30的正整数..." />
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
        name: "SysDrive",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                time: "",
                value5: true,
                value6: '',
                data: {
                    collectInterval: null,
                    enable: null
                },
                links: [
                    {name: "系统设置", to: "/sys/drive"}
                ]
            }
        },
        mounted() {
            this.showData();
        },
        methods: {
            showData() {
                this.$https.fetchGet(this.$api.system.drive.url).then((resp) => {
                    this.value6 = resp.data.data.collectInterval;
                    this.value5 = resp.data.data.enable;
                }).catch(err => {
                    console.log(err)
                })
            },
            update() {
                if(!this.checkInput()) {
                    this.data.collectInterval = Number(this.value6);
                    this.data.enable = this.value5;
                    this.$https.fetchPut(this.$api.system.drive.url, this.data).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '采集间隔设置成功', desc: "正在刷新界面", duration: 3});
                            location.reload();
                        } else
                            this.$Notice.error({title: '采集间隔设置失败', desc: "错误代码：" + resp.data.describe, duration: 3});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 3});
                        console.log(err)
                    });
                }
            },
            checkInput() {
                let status = false;
                if(this.value6 === '') {this.$Message.error({content: '请填写刷新频率...', duration: 3});    status = true;}
                else if(!/^([12][0-9]|30|[1-9])$/.test(this.value6)) {this.$Message.error({content: '刷新频率填写1-30的正整数...', duration: 3});    status = true;}
                return status;
            }
        }
    }
</script>

<style scoped>
</style>