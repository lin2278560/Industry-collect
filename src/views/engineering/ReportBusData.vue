<template>
    <div class="container-fluid" style="float: left;width: 100%;overflow: auto;">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 715px;">
                <div v-if="item.driveType == 'OPC_UA_SERVER' || item.driveType == 'MQTT_CLIENT'" style="float: right;margin-bottom: 10px;">
                    <span style="font-size: 12px;margin-right: 10px;" v-if="item.driveType == 'OPC_UA_SERVER'">选择节点标识:</span>
                    <span style="font-size: 12px;margin-right: 10px;" v-if="item.driveType == 'MQTT_CLIENT'">选择主题标识:</span>
                    <Select size="small" v-model="page.form.sign" style="width:70px;" @on-change="switchSign">
                        <Option v-for="item in signList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </div>
                <div style="width: 100%;float: left;">
                    <Table size="small" border :columns="columns1" :data="data1" />
                    <div class="foot">
                        <span class="desc" style="font-size: 13px;">查询{{total}}条，当前第{{page.form.nodePage}}页</span>
                        <Page class="btn" @on-change="pageChange" :current="page.form.nodePage" :total="total" :page-size="page.form.nodeSize" show-elevator/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "NodeConfig",
        inject: ["reload"],
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                columns1: [
                    {title: '节点名', key: 'name', align: 'center'},
                    {title: '数据类型', key: 'type', align: 'center'},
                    {title: '通讯质量', align: 'center', render: (h, params) => {let data = null; if(params.row.quality == '192') {data = '正常'} else if(params.row.quality == '64') {data = '警告'} else {data = '异常'};
                            return h('span', data);}},
                    {title: '采集数据', key: 'processedData', align: 'center'},
                    {title: '创建时间', align: 'center', render: (h, params) => {let data = this.$util.time_stamp2time_date(params.row.timestamp);
                            return h('span', data.format("yyyy-MM-dd hh:mm:ss"));}},
                ],
                data1: [],
                total: 0,
                signList: null,
                page: {
                    form: {
                        driveUuid: null,
                        nodePage: 1,
                        nodeSize: 10,
                        sign: null
                    }
                },
                item: {},
                url: null,
                busDataUrl: null,
                timer: "",//定义一个定时器的变量
                links: [
                    {name: "驱动配置", to: "/engineering/reportingService/driveConfig"},
                    {name: "节点配置", to: "/engineering/reportingService/nodeConfig"},
                    {name: "业务数据", to: "/engineering/reportingService/busData"}
                ]
            }
        },
        created: function() {

        },
        mounted: function() {
            this.showData();
            this.timer = setInterval(this.findItemBusDataByPage, 5000);
        },
        methods: {
            showData(){
                this.item = JSON.parse(this.$storage.getStorage("getItem"));

                if(this.item.driveType == "OPC_UA_SERVER") {
                    this.url = this.$api.upload.item.uaServer.url + "/findItemBusDataByPage";
                    this.busDataUrl = this.$api.upload.item.uaServer.url+"/findOpcUaServerNode?driveUuid="+this.item.uuid;
                }else if(this.item.driveType == "OPC_UA_UPLOAD") {
                    this.url = this.$api.upload.item.uaUpload.url + "/findItemBusDataByPage";
                }else if(this.item.driveType == "OPC_DA_UPLOAD") {
                    this.url = this.$api.upload.item.daUpload.url + "/findItemBusDataByPage";
                }else if(this.item.driveType == "SOCKET_CLIENT") {
                    this.url = this.$api.upload.item.socket.url + "/findItemBusDataByPage";
                }else if(this.item.driveType == "MQTT_CLIENT") {
                    this.url = this.$api.upload.item.mqtt.url + "/findItemBusDataByPage";
                    this.busDataUrl = this.$api.upload.item.mqtt.url+"/findMqttTopic?driveUuid="+this.item.uuid;

                }else if(this.item.driveType == "SQL") {
                    this.url = this.$api.upload.item.sql.url + "/findItemBusDataByPage";
                }

                // this.uploadNode = this.node.url+"/actions/upexcel";
                this.page.form.driveUuid = this.item.uuid;
                if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT") {
                    this.$https.fetchPost(this.busDataUrl).then((resp) => {
                        this.page.form.sign = resp.data.data[0];
                        this.signList = resp.data.data;
                        this.findItemBusDataByPage();
                    }).catch(err => {
                        console.log(err)
                    });
                }else {
                    this.findItemBusDataByPage();
                }
            },
            findItemBusDataByPage() {
                this.$https.fetchPost(this.url, this.page.form).then((resp) => {
                    this.total = resp.data.data.count;
                    if(resp.data.data.items == null) {
                        this.data1 = [];
                    }else {
                        this.data1 = resp.data.data.items;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            switchSign(sign) {
                this.page.form.sign = sign;
                this.findItemBusDataByPage();
            },
            pageChange(page){
                this.page.form.nodePage = page;
                this.findItemBusDataByPage();
            }
        },
        beforeDestroy() {
            clearInterval(this.timer);
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