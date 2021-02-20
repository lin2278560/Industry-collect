<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body">
                <table border="1" style="width: 100%;">
                    <tr style="height: 40px;">
                        <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float:right;font-size:12px;margin-right:15px;">配置同步</span></td>
                        <td><Button type="primary" style="margin-left: 15px;" :loading="loading" @click="synch">一键同步</Button></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "Engineered",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                columns: [
                    {title: '序号', width: 70, align: 'center', render: (h, params) => {return h("span", params.index + 1);}},
                    // {title: '日志类型', key: '', align: 'center'},
                    {title: '状态', align: 'center', render: (h, params) => {return h('p', params.row.state ? '成功' : '失败');}},
                    {title: '访问时间', align: 'center', render: (h, params) => {let data = this.$util.time_stamp2time_date(params.row.createTime);
                            return h('p', data.format("yyyy-MM-dd hh:mm:ss"));}},
                    {title: '操作', slot: 'action', width: 160, align: 'center'}
                ],
                loading: false,
                data: [],
                total: 0,
                page: {
                    form: {
                        page: 1,
                        size: 10,
                        sorts: [{filed: "createTime", order: true}]
                    }
                },

                links: [
                    {name: "工程导出", to: "/engineering/engineered"},
                    // {name: "配置同步", to: "/engineering/engineeredSynch"}
                ]
            }
        },
        mounted: function() {
            if(this.$storage.getStorage("loginType") == "true" ){
                this.links.push({name: "配置同步", to: "/engineering/engineeredSynch"})
            }
        },
        methods: {
            synch() {
                this.loading = true
                this.$https.fetchGet(this.$api.collect.engineered.synch.url).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '同步成功', duration: 2.5});
                        this.loading = false
                    } else{
                        this.loading = false
                        this.$Notice.error({title: '同步失败', desc: "错误：" + resp.data.describe, duration: 2.5});
                    }
                }).catch(err => {
                    this.loading = false
                    this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                    console.log(err)
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
        vertical-align: middle;
        float: right
    }
</style>