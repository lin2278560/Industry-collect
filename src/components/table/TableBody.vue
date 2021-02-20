<template>
    <div>
        <Table :loading="loading" :columns="columns" :data="data"/>
        <div class="foot">
            <span class="desc">查询{{total}}条，当前第{{page}}页</span>
            <Page class="btn" @on-change="test"
                  :current="page" :total="total" :page-size="size" simple/>
        </div>
    </div>
</template>

<script>

    export default {
        components: {},
        props: {
            url: String,
            columns: Array,

            size: {type: Number, default: 10},
            filter: Object,
            flush: Number
        },
        data() {
            return {
                loading: false,
                data: [],

                total: 0,
                page: 1,
            }
        },
        mounted() {
        },
        computed: {},
        methods: {
            test(value) {
                this.page = value;
                this.getData();
            },
            getData() {
                let params = {
                    'page': this.page,
                    'size': this.size,
                    'filters': this.filter
                };
                this.loading = true;
                this.$https.fetchPost(this.url, params).then((resp) => {
                    this.total = resp.data.data.count;
                    this.data = resp.data.data.data;
                    console.log(this.data);
                    this.loading = false;
                }).catch(err => {
                    console.log(err)
                })
            },
        },
        watch: {
            'flush'(nv, ov) {
                this.page = 1;
                this.getData();
            }
        }
    };
</script>
<style scoped lang="less">
    @deep: ~'>>>';

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

</style>
