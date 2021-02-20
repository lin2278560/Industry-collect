<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body">
                <div style="border:1px solid #666;width: 100%;position: relative;margin-top: 20px;height: 60px;">
                    <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">查询条件</span>
                    <div style="margin: 15px 10px;height: 70px;">
                        <div style="width: 400px;float: left;font-size: 12px;">
                            时间范围：
                            <DatePicker v-model="timeVal" type="datetimerange" style="width: 300px"></DatePicker>
                        </div>
                        <div style="float: left;margin-top: 3px;">
                            <Button size="small" type="primary" @click="query">查询</Button>
                        </div>
                    </div>
                </div>
                <Table size="small" border :loading="loading" :columns="columns" :data="data" style="margin-top: 30px;"/>
                <div class="foot">
                    <span class="desc" style="font-size: 13px;">查询{{total}}条，当前第{{page.form.page}}页</span>
                    <Page class="btn" @on-change="pageChange" :current="page.form.page" :total="total" :page-size="page.form.size" simple/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import {formatDate} from "@/util/date";
    export default {
        name: "LogStrategyWarning",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                columns: [
                    {title: '序号', width: 70, align: 'center', render: (h, params) => {return h("span", params.index + 1);}},
                    {title: '告警级别', key: 'alarmType', align: 'center'},
                    {title: '发送状态', key: 'sendResult', align: 'center',render: (h, params) => {return h('p', params.row.sendResult ? '成功' : '失败');}},
                    {title: '告警消息', key: 'alarmMsg' ,width: 500, align: 'center', render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                            domProps: {title: params.row.alarmMsg}}, params.row.alarmMsg)])}},
                    {title: '发送时间',width: 180, sortable: true, align: 'center', render: (h, params) => {let data = this.$util.time_stamp2time_date(params.row.sendTime);
                            return h('p', data.format("yyyy-MM-dd hh:mm:ss"));}},
                    {title: '告警时间',width: 180, sortable: true, align: 'center', render: (h, params) => {let data = this.$util.time_stamp2time_date(params.row.alarmTime);
                            return h('p', data.format("yyyy-MM-dd hh:mm:ss"));}}
                ],
                timeVal: null,

                loading: false,
                data: [],
                total: 0,
                page: {
                    form: {
                        page: 1,
                        size: 10,
                        // sorts: [{filed: "timestamp", order: true}]
                    }
                },

                links: [
                    {name: "上报策略告警日志", to: "/logs/logStrategyWarning"}
                ]
            }
        },
        mounted: function() {
            this.showData();
        },
        methods: {
            showData() {
                this.$https.fetchPost(this.$api.log.upload.strategyAlarmLog.url, this.page.form).then((resp) => {
                    this.data = resp.data.data.data;
                    this.total = resp.data.data.count;
                }).catch(err => {
                    console.log(err)
                })
            },
            pageChange(page){
                // console.log(page)
                this.page.form.page = page;
                this.showData();
            },
            formatDate(time) {
                var date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            },
            query() {
                this.page.form.filters = [];
                if(this.timeVal[0] != "" && this.timeVal[1] != "") {
                    let startData = (new Date(this.$util.time_stamp2time_date(this.timeVal[0]).format("yyyy-MM-dd hh:mm:ss"))).getTime();
                    let endData = (new Date(this.$util.time_stamp2time_date(this.timeVal[1]).format("yyyy-MM-dd hh:mm:ss"))).getTime();
                    this.page.form.filters.push({"filed": "timestamp", "params": [startData,endData], "type": "between"});
                }
                this.showData();
            }
        }
    }
</script>

<style scoped>

    .ivu-btn-warning {
        color: #fff;
        background-color: #e66534;
        border-color: #e66534;
    }

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