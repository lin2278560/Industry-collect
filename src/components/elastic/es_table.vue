<template>
    <div class="JkTable">


        <Row class="header">
            <Col span="4">
                <h2 style="font-weight: normal">{{title}}</h2>
            </Col>
            <Col span="20">
                <JkSelectSearch @parmChange="parmChange" :indexList="indexList" :filter="filter"></JkSelectSearch>
            </Col>
        </Row>
        <Table :loading="loading" :columns="columns" :data="data"/>
        <div class="foot">
            <span class="desc">查询{{total}}条，当前第{{page}}页</span>
            <Page class="btn" @on-change="pageChange" :current="page" :total="total" :page-size="size" simple/>
        </div>


    </div>
</template>

<script>
    import JkSelectSearch from "./JkSelectSearch1.vue";

    export default {
        name: "JkTable",
        components: {
            JkSelectSearch
        },
        props: {
            title: String,
            columns: Array,
            sortsNext: {
                type: Array, default() {
                    return [];
                }
            },
            sortsPrevious: {
                type: Array, default() {
                    return [];
                }
            },
            filter: {
                type: Object, default() {
                    return {}
                }
            },
            indexUrl: {type: String, default: ''},
            dateUrl: {type: String, default: ''}
        },
        data() {
            return {
                loading: false,
                indexList: [],//{syslog_192398434343}
                parm: {},

                data: [],
                total: 0,
                page: 1,
                size: 10,
            }
        },
        mounted() {
            this.getIndexList();
        },
        computed: {},
        methods: {

            /**
             * 获取索引列表
             */
            getIndexList() {
                this.$https.fetchGet(this.indexUrl).then((resp) => {
                    console.log("请求索引list", resp);
                    this.indexList = resp.data.data;
                }).catch(err => {
                    console.log(err)
                })
            },

            pageChange(page) {
                if (page - this.page > 0) {//
                    console.log("下一页");
                    this.page = page;
                    this.getData(1);
                } else if (page - this.page < 0) {//
                    console.log("后一页");
                    this.page = page;
                    this.getData(-1);
                }
            },

            parmChange(data) {
                this.size = data.size;
                this.parm = data;
                this.getData(0);
            },


            getData(pageDirection) {
                let searchAfter = null;
                let len = this.data.length;
                this.parm.sorts = this.sortsNext;
                if (pageDirection == 0) {
                    this.page = 1;
                    this.data = [];
                } else if (len > 0 && pageDirection == 1) {
                    searchAfter = this.data[len - 1]._sort;
                } else if (len > 0 && pageDirection == -1) {
                    searchAfter = this.data[0]._sort;
                    this.parm.sorts = this.sortsPrevious;
                }
                this.parm.searchAfter = searchAfter;

                console.log("请求参数", this.parm);


                this.loading = true;
                this.$https.fetchPost(this.dateUrl, this.parm).then((resp) => {
                    this.total = resp.data.data.count;
                    let data = resp.data.data.data;
                    if (pageDirection == -1) {
                        let key = this.sortsNext[0].filed;
                        data.sort((a, b) => {
                            return b[key] - a[key];
                        });
                    }
                    this.data = data;
                    this.loading = false;

                    console.log("返回结果", resp);
                }).catch(err => {
                    console.log(err)
                })
            },
        },
        watch: {}
    };
</script>
<style scoped lang="less">
    @deep: ~'>>>';
    .JkTable {
        font-size: .875rem;
        position: relative;
        background-color: white;

        table {
            border-spacing: 0;
        }

        .header {
            border-bottom: 1px solid #e9e9e9;
            padding: 12px 0 12px 50px;
        }

        .foot {
            padding: 16px 0;

            .desc {
                display: inline-block;
                vertical-align: middle;
            }

            .btn {
                display: inline-block;
                vertical-align: middle;
                float: right
            }

            @{deep} .ivu-page-simple .ivu-page-simple-pager input {
                cursor: not-allowed;
                pointer-events: none;
                border: none;
            }
        }

        @{deep} .ivu-table {
            font-size: .875rem;

            &:before {
                display: none;
            }

            &:after {
                display: none;
            }
        }

        @{deep} .ivu-table th {
            background-color: white;
            height: 48px;
        }

        @{deep} .ivu-table-wrapper {
            border: none;
        }

    }
</style>
