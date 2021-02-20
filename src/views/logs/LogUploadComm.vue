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
                <Table size="small" border :loading="loading" :columns="columns" :data="data" style="margin-top: 30px;">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(row.uuid)">查看</Button>
                    </template>
                </Table>
                <div class="foot">
                    <span class="desc" style="font-size: 13px;">查询{{total}}条，当前第{{page.form.page}}页</span>
                    <Page class="btn" @on-change="pageChange" :current="page.form.page" :total="total" :page-size="page.form.size" simple/>
                </div>
            </div>


            <Modal
                    v-model="modal1"
                    title="上报详细信息">
                <div style="word-wrap:break-word;display: inline-block; width: 100%; height: 150px; overflow:auto;">{{upload_content}}</div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import {formatDate} from "@/util/date";
    export default {
        name: "LogCollectComm",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                columns: [
                    {title: '序号', width: 70, align: 'center', render: (h, params) => {return h("span", params.index + 1);}},
                    // {title: '日志类型', key: '', align: 'center'},
                    {title: '上报地址', key: 'address', align: 'center'},
                    {title: '加密类型', key: 'encryptionType', align: 'center'},
                    {title: '上报状态', key: 'status', align: 'center', render: (h, params) => {return h("span", params.row.status == 0 ? '失败' : '成功');}},
                    {title: '上报类型', key: 'type', align: 'center'},
                    {title: '上报时间', sortable: true, key: 'time', align: 'center'},
                    {title: '详细', slot: 'action', width: 130, align: 'center'}
                ],
                timeVal: null,

                loading: false,
                data: [],
                total: 0,
                page: {
                    form: {
                        page: 1,
                        size: 10,
                        sorts: [{filed: "time", order: true}]
                    }
                },
                modal1: false,
                upload_content: null,
                links: [
                    {name: "上报通讯日志", to: "/logs/logUploadComm"}
                ]
            }
        },
        mounted: function() {
            this.showData();
        },
        methods: {
            showData() {
                this.$https.fetchPost(this.$api.log.upload.comm.url, this.page.form).then((resp) => {
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
            show(uuid) {
                let data = {page: 1, size: 10, filters: [{"filed": "uuid", "params": [''+uuid+''], "type": "equal"}]};
                this.$https.fetchPost(this.$api.log.upload.comm_detail.url, data).then((resp) => {
                    this.modal1 = true;
                    this.upload_content = resp.data.data.data[0].message;
                }).catch(err => {
                    console.log(err)
                })
            },
            query() {
                this.page.form.filters = [];
                if(this.timeVal[0] != "" && this.timeVal[1] != "") {
                    let startData = (new Date(this.$util.time_stamp2time_date(this.timeVal[0]).format("yyyy-MM-dd hh:mm:ss"))).getTime();
                    let endData = (new Date(this.$util.time_stamp2time_date(this.timeVal[1]).format("yyyy-MM-dd hh:mm:ss"))).getTime();
                    this.page.form.filters.push({"filed": "time", "params": [startData,endData], "type": "between"});
                }
                this.showData();
            }
        }
    }
</script>

<style scoped lang="less">
    /*@deep: ~'>>>';
    @{deep} .ivu-modal-header {
        background: #e66534;
        border-radius: 6px;
    }
    @{deep} .ivu-modal-header-inner {
        color: white;
    }
    @{deep} .ivu-modal-close .ivu-icon-ios-close {
        color: white;
    }*/

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