<template>
    <div class="container-fluid" style="float: left;width: 80%;">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <!--                    <interface_add style="float: right;"></interface_add>-->
                </blockquote>
            </div>
            <div class="modal-body" style="height: 795px;">
                <Table size="small" border :columns="columns1" :data="data1" />
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    // import {formatDate} from "@/util/date";
    export default {
        name: "SysDataStatistice",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                columns1: [
                    {title: '序号', key: 'uuid', align: 'center'},
                    {title: '通道名称', key: 'name', align: 'center'},
                    {title: '总节点数', key: 'remark', align: 'center'},
                    {title: '已启动节点数', key: 'driveType', align: 'center'},
                    {title: '今日节点采集数', key: 'createTime', align: 'center'},
                    {title: '本周节点采集数', key: 'createTime', align: 'center'},
                    {title: '通道状态', key: 'createTime', align: 'center'},
                ],
                data1: [],
                links: [
                    {name: "采集数据统计", to: "/engineering/collectionService/info"}
                ]
            }
        },
        mounted: function() {
            // this.showData();
        },
        methods: {
            // showData(){
            //     this.$https.fetchGet(this.$api.collect.channelInfo.url).then((resp) => {
            //         //console.log(resp);
            //         this.data1 = resp.data.data;
            //         for(var i in this.data1) {
            //             this.data1[i].createTime = this.formatDate(this.data1[i].createTime )
            //         }
            //     }).catch(err => {
            //         console.log(err)
            //     })
            // },
            // formatDate(time) {
            //     var date = new Date(time);
            //     return formatDate(date, 'yyyy-MM-dd hh:mm');
            // }
        }
    }
</script>

<style scoped>
    .ivu-table {
        font-size: 8px !important;
    }

    .ivu-table-header thead tr th {
        padding: 0px !important;
        height: 26px;
        line-height: 26px;
    }

    .ivu-table-fixed-header thead tr th {
        padding: 0px !important;
        height: 26px;
        line-height: 26px;
        font-size: 12px;
    }

    .ivu-table-fixed-right-header {
        height: 29px !important;
    }

    .ivu-table-cell {
        white-space: nowrap !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
    }

    .ivu-table td, .ivu-table th {
        height: 26px;
        line-height: 26px;
    }
</style>