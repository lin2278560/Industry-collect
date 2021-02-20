<template>
    <div>
        <Row class="header">
            <Col span="10">
                <h4 style="font-weight: normal">{{title}}</h4>
            </Col>
            <Col span="14" style="margin-top: 5px;">
                <Row type="flex" justify="end">
                    <Input class="header-span" type="text" search @on-search="search"
                           v-if="filterAttr"
                           :placeholder="filterAttr.label" v-model="value"/>
                    <InputNumber class="header-span"
                                 @on-change="search"
                                 :formatter="value => `页数:${value}`"
                                 :parser="value => value.replace('页数：', '')"
                                 :max="100" :min="1" v-model="size"/>
                    <span v-if="render" class="header-span">
                        <model :render="render"/>
                    </span>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>

    import model from "../model.js";

    export default {
        components: {
            model
        },
        props: {
            title: String,
            filterAttr: Object,
            render: Function
        },
        data() {
            return {
                value: null,
                size: 10,
            }
        },
        mounted() {
            this.search();
        },
        computed: {},
        methods: {
            search() {
                let filter;
                if (this.filterAttr && this.value) {
                    filter = [{
                        filed: this.filterAttr.filed,
                        type: 'like',
                        params: this.value
                    }]
                }
                this.$emit("tableFilterSimple", this.size, filter);
            },

        },
        watch: {}
    };
</script>
<style scoped lang="less">

    .header {
        border-bottom: 1px solid #e9e9e9;
        /*padding: 12px 0 12px 50px;*/

        .header-span {
            max-width: 200px;
            margin-left: 16px;
        }
    }


</style>
