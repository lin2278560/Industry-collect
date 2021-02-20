<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 700px;overflow: auto;">
                <Table :loading="tableloading" size="small" border :columns="columns1" :data="data1">
                    <template slot-scope="{ index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="updateInterface(index)">修改</Button>
                        <Button type="error" size="small" @click="deleteInterface(index)">删除</Button>
                    </template>
                    <div slot="loading">
                        <div style="height: 10px; width: 200px">
                        <Row>
                            <Col class="demo-spin-col" span="8">
                                <Spin fix>
                                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                    <div>Loading</div>
                                </Spin>
                            </Col>
                        </Row>
                        </div>
                    </div>
                </Table>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "SysCollectCount",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                tableloading:true,
                columns1: [
                    {title: '序号', width: 70, align: 'center', render: (h, params) => {return h("span", params.index + 1);}},
                    {title: '通道类型',width: 170,  key: 'channelType', align: 'center', render: (h, params) => 
                    {
                        // let time = params.row.channelType.replace(/_/g, "")
                        // return h('span', time);
                        // }
                        // params.row.channelType = params.row.channelType.replace(/_/g, "")
                        if(params.row.channelType == "MOD_BUS_TCP_SLAVE"){
                            // this.$set(params.row,"channelType","MODBUS_TCP从站推送")
                            params.row.channelType = "MODBUS_TCP从站推送"
                        }
                        else if(params.row.channelType == "MOD_BUS_RTU_SLAVE"){
                            params.row.channelType = "MODBUS_RTU从站推送"
                            // this.$set(params.row,"channelType","MODBUS_RTU从站推送")
                        }
                        else if(params.row.channelType == "MOD_BUS_ASCII_SLAVE"){
                            params.row.channelType = "MODBUS_ASCII从站推送"
                            // this.$set(params.row,"channelType","MODBUS_ASCII从站推送")
                        }
                        else if(params.row.channelType == "OPC_DA_HTTP"){
                            params.row.channelType = "OPC_DA桥接客户端"
                            // this.$set(params.row,"channelType","OPC_DA桥接客户端")
                        }

                        // else if(params.row.channelType == "OPCDA"){
                        //     params.row.channelType = "OPC_DA"
                        //     // this.$set(params.row,"channelType","OPC_DA")
                        // }
                        // else if(params.row.channelType == "OPCUA"){
                        //     params.row.channelType = "OPC_UA"
                        //     // this.$set(params.row,"channelType","OPC_UA")
                        // }
                        else if(params.row.channelType == "MOD_BUS_TCP"){
                            params.row.channelType = "MODBUS_TCP"
                            // this.$set(params.row,"channelType","MODBUS_TCP")
                        }
                        else if(params.row.channelType == "MOD_BUS_RTU"){
                            params.row.channelType = "MODBUS_RTU"
                            // this.$set(params.row,"channelType","MODBUS_RTU")
                        }
                        else if(params.row.channelType == "MOD_BUS_ASCII"){
                            params.row.channelType = "MODBUS_ASCII"
                            // this.$set(params.row,"channelType","MODBUS_ASCII")
                        }
                        // else if(params.row.channelType == "MQTTSERVER"){
                        //     params.row.channelType = "MQTT_SERVER"
                        //     // this.$set(params.row,"channelType","MQTT_SERVER")
                        // }
                        return h('div', [h('span', {style:
                            {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                            domProps: {title: params.row.channelType}},
                            params.row.channelType)])
                            }
                        },
                    {title: '通道总数', key: 'channelCount', align: 'center', sortable: true,},
                    {title: '驱动总数', key: 'driveCount', align: 'center', sortable: true,},
                    {title: '节点总数', key: 'itemCount', align: 'center', sortable: true,},
                    {title: '今日采集次数', key: 'todayCount', align: 'center', sortable: true, render: (h, params) =>
                    {
                        // if(params.row.channelType == "MOD_BUS_TCP_SLAVE"){
                        //     params.row.todayCount = params.row.todayCount+"(推送次数)"
                        // }
                        // else if(params.row.channelType == "MOD_BUS_RTU_SLAVE"){
                        //     params.row.todayCount = params.row.todayCount+"(推送次数)"
                        // }
                        // else if(params.row.channelType == "MOD_BUS_ASCII_SLAVE"){
                        //     params.row.todayCount = params.row.todayCount+"(推送次数)"
                        // }
                        
                        return h('div', [
                        h('Tag', {
                                props: {
                                    color: 'primary',
                                }        
                            }, [
                                params.row.todayCount, // 表格显示文字
                                h('div', {
                                        style: {
                                            minWidth: '35px'
                                        }
                                    }, params.row.todayCount // 气泡内的文字
                                )
                            ])
                        ])
                    }
                    //  {return h("Tag", {props: {color: 'primary'}}, params.row.todayCount)}
                     },
                    {title: '本周采集次数', key: 'weekCount', align: 'center', sortable: true, render: (h, params) => 
                    // {return h("Tag", {props: {color: 'warning'}}, params.row.weekCount)}}
                    {
                        // if(params.row.channelType == "MOD_BUS_TCP_SLAVE"){
                        //     params.row.todayCount = params.row.todayCount+"(推送次数)"
                        // }
                        // else if(params.row.channelType == "MOD_BUS_RTU_SLAVE"){
                        //     params.row.todayCount = params.row.todayCount+"(推送次数)"
                        // }
                        // else if(params.row.channelType == "MOD_BUS_ASCII_SLAVE"){
                        //     params.row.todayCount = params.row.todayCount+"(推送次数)"
                        // }
                        return h('div', [
                        h('Tag', {
                                props: {
                                    color: 'primary',
                                }        
                            }, [
                                params.row.weekCount, // 表格显示文字
                                h('div', {
                                        style: {
                                            minWidth: '35px'
                                        }
                                    }, params.row.weekCount // 气泡内的文字
                                )
                            ])
                        ])
                    }
                    },
                    {title: '本月采集次数', key: 'monthCount', align: 'center', sortable: true, render: (h, params) => 
                    // {return h("Tag", {props: {color: 'warning'}}, params.row.weekCount)}}
                    {
                        // if(params.row.channelType == "MOD_BUS_TCP_SLAVE"){
                        //     params.row.todayCount = params.row.todayCount+"(推送次数)"
                        // }
                        // else if(params.row.channelType == "MOD_BUS_RTU_SLAVE"){
                        //     params.row.todayCount = params.row.todayCount+"(推送次数)"
                        // }
                        // else if(params.row.channelType == "MOD_BUS_ASCII_SLAVE"){
                        //     params.row.todayCount = params.row.todayCount+"(推送次数)"
                        // }
                        return h('div', [
                        h('Tag', {
                                props: {
                                    color: 'primary',
                                }        
                            }, [
                                params.row.weekCount, // 表格显示文字
                                h('div', {
                                        style: {
                                            minWidth: '35px'
                                        }
                                    }, params.row.weekCount // 气泡内的文字
                                )
                            ])
                        ])
                    }
                    }
                ],
                data1: [],
                links: [
                    {name: "采集统计", to: "/sys/count/collect"},
                    {name: "上报统计", to: "/sys/count/upload"}
                ],
                url: null,
                loginType: null,//系统类型
                timer: "",//定义一个定时器的变量
            }
        },
        mounted: function() {
            if(this.$storage.getStorage("loginType") == "true") {
                this.links.splice(1, 1);
            }
            this.showData();
            this.timer = setInterval(this.showData, 5000);
        },
        methods: {
            showData() {
                this.$https.fetchGet(this.$api.collect.count.url).then((resp) => {
                    this.tableloading = false
                    this.data1 = resp.data.data;
                    for(let i in this.data1){
                        if(this.data1[i].channelType == "MOD_BUS_TCP_SLAVE" || this.data1[i].channelType == "MOD_BUS_RTU_SLAVE" || this.data1[i].channelType == "MOD_BUS_ASCII_SLAVE"){
                            this.data1[i].todayCount = this.data1[i].todayCount+"(推送)"
                            this.data1[i].weekCount = this.data1[i].weekCount+"(推送)"
                        }
                        // else if(this.data1[i].channelType == "MOD_BUS_RTU_SLAVE"){
                        //     this.data1[i].todayCount = this.data1[i].todayCount+"(推送)"
                        //     this.data1[i].weekCount = this.data1[i].weekCount+"(推送)"
                        // }
                        // else if(this.data1[i].channelType == "MOD_BUS_ASCII_SLAVE"){
                        //     this.data1[i].todayCount = this.data1[i].todayCount+"(推送)"
                        //     this.data1[i].weekCount = this.data1[i].weekCount+"(推送)"
                        // }
                    }
                    
                })
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
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>