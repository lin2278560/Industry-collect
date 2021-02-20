<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 800px;overflow: auto;">
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
        name: "SysUploadCount",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                tableloading:true,
                columns1: [
                    {title: '序号', width: 70, align: 'center', render: (h, params) => {return h("span", params.index + 1);}},
                    {title: '通道类型', key: 'channelType', align: 'center', render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                domProps: {title: params.row.channelType}}, params.row.channelType)])}},
                    {title: '通道总数', key: 'channelCount', align: 'center', sortable: true,},
                    {title: '驱动总数', key: 'driveCount', align: 'center', sortable: true,},
                    {title: '节点总数', key: 'itemCount', align: 'center', sortable: true,},
                    {title: '今日上报数', key: 'todayCount', align: 'center', sortable: true, render: (h, params) => 
                    // {return h("Tag", {props: {color: 'primary'}}, params.row.todayCount);}},
                    {
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
                    }},
                    {title: '本周上报数', key: 'weekCount', align: 'center', sortable: true, render: (h, params) => 
                    // {return h("Tag", {props: {color: 'warning'}}, params.row.weekCount);}},
                    {
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
                    }},
                    {title: '本月上报数', key: 'monthCount', align: 'center', sortable: true, render: (h, params) => 
                    // {return h("Tag", {props: {color: 'warning'}}, params.row.weekCount);}},
                    {
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
                    }},
                    {title: '今日上报失败数', key: 'todayFailCount', align: 'center', sortable: true, render: (h, params) => 
                    // {return h("Tag", {props: {color: 'error'}}, params.row.todayFailCount);}},
                    {
                        return h('div', [
                        h('Tag', {
                                props: {
                                    color: 'error',
                                }        
                            }, [
                                params.row.todayFailCount, // 表格显示文字
                                h('div', {
                                        style: {
                                            minWidth: '35px'
                                        }
                                    }, params.row.todayFailCount // 气泡内的文字
                                )
                            ])
                        ])
                    }},
                    
                ],
                data1: [],
                links: [
                    {name: "采集统计", to: "/sys/count/collect"},
                    {name: "上报统计", to: "/sys/count/upload"}
                ],
                timer: "",//定义一个定时器的变量
            }
        },
        mounted: function() {
            this.showData();
            this.timer = setInterval(this.showData, 5000);
        },
        methods: {
            showData() {
                this.$https.fetchGet(this.$api.upload.count.url).then((resp) => {
                    this.tableloading = false
                    this.data1 = resp.data.data;
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