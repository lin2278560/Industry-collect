<template>
    <div class="JkTable">



        <Row class="header">
            <Col span="4">
                <h2 style="font-weight: normal">{{title}}</h2>
            </Col>
            <Col span="20">
                <InputNumber :max="10" :min="1" v-model="size"></InputNumber>
                <span>
                        <Dropdown trigger="click" placement="bottom-end">
                          <Button>
                              操作
                              <Icon type="ios-arrow-down"></Icon>
                          </Button>
                          <DropdownMenu slot="list">
                              <DropdownItem style="border:solid 1px black">
                                  <span style="border:solid 1px black">添加设备</span>
                              </DropdownItem>
                              <DropdownItem>
                                  <span style="border:solid 1px black">删除设备</span>
                              </DropdownItem>
                              <DropdownItem>修改设备</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                    </span>
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

    export default {
        components: {

        },
        props: {
            title: String,
            columns: Array,
            url: String,
            formDynamic: Object
        },
        data() {
            return {

                loading: false,
                data: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    }, {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    }, {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    }, {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    }, {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ],
                total: 0,
                page: 1,
                size: 10,
            }
        },
        mounted() {
            this.getData();
        },
        computed: {},
        methods: {
            sizeChange(size) {
                this.selectArray.splice(0, this.selectArray.length);
                this.page = 1;
                this.getData();
            },
            pageChange(page) {
                this.selectArray.splice(0, this.selectArray.length);
                this.page = page;
                this.getData();
            },

            getData() {
                let filterBeans = [];
                for (let key in this.formDynamic.form) {
                    let item = this.formDynamic.form[key];
                    if (item.search) {
                        filters.push({field: key, type: item.type, value: item.value});
                    }
                }
                let params = {
                    'page': this.page,
                    'size': this.size,
                    'filters': filters
                };
                this.loading = true;
                this.$https.fetchPost(this.url, params).then((resp) => {
                    this.total = resp.data.data.count;
                    this.data = resp.data.data.data;
                    this.loading = false;
                    console.log(resp);
                }).catch(err => {
                    console.log(err)
                })
            },
        },
        watch: {
            'formDynamic.submit'(nv, ov) {
                this.getData();
            }
        }
    };
</script>
<style scoped lang="less">
    @deep: ~'>>>';
    .JkTable {
        font-size: .875rem;
        position: relative;
        background-color: white;


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
