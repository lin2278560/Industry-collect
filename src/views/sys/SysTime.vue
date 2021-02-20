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
                    <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">系统时间</span>
                    <div style="margin: 15px 10px;">
                        <table border="1" style="width: 100%;">
                            <tr style="height: 40px;">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">系统当前时间:</span></td>
                                <td><span style="margin-left: 15px;font-size: 12px;">{{time}}</span></td>
                            </tr>
                            <tr style="height: 40px;">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">设置系统时间:</span></td>
                                <td><DatePicker v-model="value6" type="datetime" placeholder="Select date and time" style="width: 200px;margin-left: 15px;"></DatePicker></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div>
<!--                    <div class="btn btn-sm btn-custom add_fontclient" data-toggle="modal" style="margin: 10px 50%;">确认</div>-->
                    <Button type="primary" style="margin: 10px 50%;" @click="update">确认</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "SysTime",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                time: "",
                value6: null,
                links: [
                    {name: "设置系统时间", to: "/sys/time"}
                ]
            }
        },
        mounted() {
            this.showData();
        },
        methods: {
            showData() {
                this.$https.fetchGet(this.$api.system.date.find.url).then((resp) => {
                    let data = this.$util.time_stamp2time_date(resp.data.data * 1000);
                    this.time = data.format("yyyy-MM-dd hh:mm:ss");
                }).catch(err => {
                    console.log(err)
                })
            },
            update() {
                if(this.value6 == null || this.value6 == '') {
                    this.$Notice.error({title: '未填写系统时间', desc: "请重新填写系统时间...", duration: 3});
                }else {
                    let data = this.$util.time_stamp2time_date(this.value6).format("yyyy-MM-dd hh:mm:ss");
                    this.$https.fetchPut(this.$api.system.date.update.url +"/"+ data).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '时间修改成功', desc: "正在刷新界面", duration: 3});
                            // location.reload();
                            this.reload();
                        } else
                            this.$Notice.error({title: '时间修改失败', desc: "错误代码：" + resp.data.describe, duration: 3});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 3});
                        console.log(err)
                    });
                }
            }
        }
    }
</script>

<style scoped>
</style>