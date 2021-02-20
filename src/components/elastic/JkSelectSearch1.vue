<template>
    <div class="JkSelectSearch">
        <Row type="flex" justify="end">
            <Col span="20">
                <div class="select-selection">
                    <Select @on-change="submit" v-model="index" style="width: 200px;padding: 3px 4px;" size="small">
                        <Option v-for="item1 in indexList" :value="item1" :key="item1">{{ item1 }}</Option>
                    </Select>
                    <div v-for="(item,key) in filterResq" :key="key" class="tag" @click="updateItem(key)">
                        <span class="tag-text">{{item.filed}}</span>
                        <Icon type="md-close" @click="deleteItem(key,$event)"/>
                    </div>
                    <Button icon="md-add" class="select-arrow" @click=" addItem">添加条件</Button>
                </div>
            </Col>
            <Select v-model="size" style="width: 50px;margin-left: 18px" @on-change="submit" placement="bottom-end">
                <Option v-for="item in sizeArray" :value="item.value" :key="item.value">{{ item.label}}</Option>
            </Select>
        </Row>
        <resqItem :flush="item.flush" :resqItem="item.resqItem" :type="item.type"
                  :filter="filter" @sendtoFu="sendtoFu"/>
    </div>
</template>
<script>
    import resqItem from "./JkSelectSearch2.vue";

    export default {
        name: "JkSelectSearch1",
        components: {resqItem},
        props: {
            indexList: {
                type: Array, default() {return []}
            },
            filter: {
                type: Object, default() {
                    return {}
                }
            },
            parameter: {type: Number, default: 0}
        },
        data() {
            return {
                filterResq: [],
                item: {
                    resqItem: {
                        filed: "",//字段
                        filterType: "",//过滤类型
                        filterAttr: {//过滤属性
                            str: {value: null},
                            int: {value: null},
                            intRange: {form: null, to: null},
                            date: {value: null},
                            dateRange: {form: null, to: null}
                        },
                        filterParm: {
                            filterTypeList: [],
                            typeDisabled: true,
                            searchShow: "",
                        },
                    },
                    type: -1,
                    flush: 1
                },
                index: "",
                sizeArray: [
                    {label: '10', value: 10},
                    {label: '20', value: 20},
                    {label: '40', value: 40},
                    {label: '70', value: 70},
                    {label: '99', value: 99}
                ],
                size: 10,
            }
        },

        mounted() {
        },
        computed: {},
        methods: {

            addItem() {
                this.item.type = -1;
                this.item.flush = new Date().getTime();
            },
            updateItem(index) {
                this.item.type = index;
                this.item.resqItem = this.filterResq[index];
                this.item.flush = new Date().getTime();
            },

            deleteItem(index, event) {
                this.filterResq.splice(index, 1);
                event.stopPropagation();
                this.submit();
            },

            sendtoFu(data) {
                let index = this.item.type;
                if (index >= 0)
                    this.$set(this.filterResq, index, data);
                else
                    this.filterResq.push(data);

                this.submit();
            },
            submit() {
                let filterBeans = this.filterResq.map(e => {
                    let fileType = e.filterParm.searchShow;
                    let attr = {};
                    if (fileType == "dateRange") {
                        attr.form = new Date(e.filterAttr.dateRange.form).getTime();
                        attr.to = new Date(e.filterAttr.dateRange.to).getTime();
                    } else if (fileType == "date") {
                        attr.value = new Date(e.filterAttr.date.value).getTime();
                    } else
                        attr = e.filterAttr[fileType];
                    return Object.assign(
                        {
                            filed: e.filed,
                            filterType: e.filterType,
                        },
                        attr);
                });
                let msg = {
                    indexName: this.index,
                    size: this.size,
                    filters: filterBeans
                };
                console.log("返回过滤参数", msg);
                this.$emit("parmChange", JSON.parse(JSON.stringify(msg)));
            }
        },
        watch: {
            indexList(v, ov) {
                console.log("初始化过滤条件");
                if (this.indexList && this.indexList.length > 0)
                    this.index = this.indexList[0];
                this.submit();
            }
        }
    }
</script>
<style scoped lang="less">

    .JkSelectSearch {
        clear: both;
        text-align: start;

        .select-selection {
            height: 32px;
            padding: 0 24px 0 4px;
            content: "";
            display: block;
            box-sizing: border-box;
            outline: 0;
            user-select: none;
            //cursor: pointer;
            position: relative;
            background-color: #fff;
            border-radius: 4px;
            border: 1px solid #dcdee2;
            transition: all .2s ease-in-out;

            .tag {
                height: 24px;
                line-height: 22px;
                margin: 3px 4px 3px 0;
                max-width: 99%;
                position: relative;
                display: inline-block;
                padding: 0 8px;
                border: 1px solid #e8eaec;
                border-radius: 3px;
                background: #f7f7f7;
                font-size: 12px;
                vertical-align: middle;
                opacity: 1;
                overflow: hidden;
                cursor: pointer;

                .tag-text {
                    color: #515a6e;
                }
            }

            .select-arrow {
                .tag;
                color: white;
                background-color: #f60;
                position: absolute;
                right: 0;
                line-height: 1;
                transition: all .2s ease-in-out;

            }
        }
    }


</style>
