<template>
    <div class="container-fluid" style="min-width:0;flex:1;">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body" style="min-height: 715px; overflow:auto;">
                <Table size="small" border :columns="columns1" :data="data1" />
            </div>
            
            <!-- <Button type="primary">
                Forward
                <Icon type="ios-arrow-forward"></Icon>
            </Button>
            <div v-show="flexbtn" style="width:20px;height:40px;border-radius:3px;background:#1890ff;position: relative;
            left: -10px;
            top: -600px;">
            <Icon type="ios-arrow-dropleft-circle" /></div> -->
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    
    import {formatDate} from "@/util/date";
    export default {
        name: "CollectionServiceInfo",
        components: {
            jk_tabs: JkTabs,
        },
        data(){
            return {
                columns1: [
                    {title: '序号', width: 70, align: 'center', render: (h, params) => {return h("span", params.index + 1);}},
                    {title: '名称', key: 'name',align: 'center'},
                    {title: '描述', key: 'remark',align: 'center'},
                    {title: '协议', key: 'driveType',align: 'center'},
                    {title: '创建时间', key: 'createTime',align: 'center'},
                ],
                data1: [],
                links: [
                    {name: "采集服务", to: "/engineering/collectionService/info"}
                ],
                flexbtn:false,
                message :'',
            }
        },
        mounted: function() {
            this.showData();
        },
        methods: {
            
            showData(){
                this.$https.fetchGet(this.$api.collect.channelInfo.url).then((resp) => {
                    this.data1 = resp.data.data;
                    for(var i in this.data1) {
                        this.data1[i].createTime = this.formatDate(this.data1[i].createTime )
                    }
                    console.log(this.data1)
                }).catch(err => {
                    console.log(err)
                })
            },
            formatDate(time) {
                var date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
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
    .flexbtn{
        
    }
</style>