<template>
    <Drawer title="条件过滤" :closable="false" v-model="model" width="320">
        <Form ref="item_form" :model="filterResqItem" class="form" :label-width="80">
            <FormItem :rules="rules" prop="filed" label="筛选字段">
                <Select v-model="filterResqItem.filed" clearable @on-change="filedChange">
                    <Option v-for="item in filter" :value="item.filed" :key="item.filed">
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem :rules="rules" prop="filterType"  label="过滤类型">
                <Select v-model="filterResqItem.filterType"
                        clearable @on-change="filedTypeChange"
                        :disabled="filterResqItem.filterParm.typeDisabled">
                    <Option v-for="item in filterResqItem.filterParm.filterTypeList" :value="item.filed"
                            :key="item.filed">
                        {{item.name}}
                    </Option>
                </Select>
            </FormItem>

            <FormItem :rules="rules" v-if="filterResqItem.filterParm.searchShow=='str'" label="词项查询"
                      prop="filterAttr.str.value">
                <Input v-model="filterResqItem.filterAttr.str.value" type="text" placeholder="Username"/>
            </FormItem>

            <FormItem v-if="filterResqItem.filterParm.searchShow=='intRange'" label="数值范围"
                      prop="filterAttr.intRange">
                <Row>
                    <Col span="11">
                        <InputNumber v-model="filterResqItem.filterAttr.intRange.form" style="width: 100%"/>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <InputNumber v-model="filterResqItem.filterAttr.intRange.to" style="width: 100%"/>
                    </Col>
                </Row>
            </FormItem>
            <FormItem :rules="rulesNumber" v-if="filterResqItem.filterParm.searchShow=='int'" label="数值查询" prop="filterAttr.int.value">
                <InputNumber v-model="filterResqItem.filterAttr.int.value" style="width: 100%"/>
            </FormItem>

            <FormItem  v-if="filterResqItem.filterParm.searchShow=='dateRange'" label="时间范围" prop="filterAttr.dateRange">
                <Row>
                    <Col span="11">
                        <DatePicker v-model="filterResqItem.filterAttr.dateRange.form" type="datetime" split-panels/>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <DatePicker v-model="filterResqItem.filterAttr.dateRange.to" type="datetime" split-panels/>
                    </Col>
                </Row>
            </FormItem>
            <FormItem :rules="rulesDate"  v-if="filterResqItem.filterParm.searchShow=='date'" label="时间查询" prop="filterAttr.date.value">
                <DatePicker v-model="filterResqItem.filterAttr.date.value" type="datetime" split-panels/>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="handleSubmit">添加</Button>
            </FormItem>
        </Form>
    </Drawer>
</template>
<script>
    export default {
        components: {},
        props: {
            resqItem: {
                type: Object, default() {
                    return {}
                }
            },
            filter: {
                type: Object, default() {
                    return {}
                }
            },
            //修改还是添加
            type: {type: Number, default: -1},
            flush: {type: Number, default: 0},
        },
        data() {
            return {
                model: false,
                rules: {required: true, message: "不能为空", trigger: "blur"},
                rulesDate: {required: true,type:'date', message: "不能为空", trigger: "blur"},
                rulesNumber: {required: true,type:'number', message: "不能为空", trigger: "blur"},
                rules1: {
                    required: true,
                    validator: (rule, value, callback) => {
                        console.log(rule,value);
                        /*if (!(value instanceof Array) || value.length !== 2) {
                            callback(new Error('请使用控件进行操作'));
                        } else if (!(value[0] instanceof Date && value[1] instanceof Date)) {
                            callback(new Error('不能为空'));
                        } else {
                            callback();
                        }*/
                    }, trigger: 'blur'
                },
                filterTypeMap: {
                    str: [
                        {filed: "is", name: "等于"},
                        {filed: "is not", name: "不等于"},
                        //{filed: "is one of", name: "属于其中"},
                        //{filed: "is not one of", name: "不属于其中"},
                        //{filed: "exists", name: "存在"},
                        //{filed: "does not exist", name: "不存在"},
                    ],
                    int: [
                        {filed: "is", name: "等于"},
                        {filed: "is not", name: "不等于"},
                        //{filed: "is one of", name: "属于其中"},
                        //{filed: "is not one of", name: "不属于其中"},
                        //{filed: "exists", name: "存在"},
                        //{filed: "does not exist", name: "不存在"},
                        {filed: "between", name: "存在范围"},
                        {filed: "not between", name: "不在范围"},
                    ],
                    date: [
                        {filed: "is", name: "等于"},
                        {filed: "is not", name: "不等于"},
                        //{filed: "is one of", name: "属于其中"},
                        //{filed: "is not one of", name: "不属于其中"},
                        //{filed: "exists", name: "存在"},
                        //{filed: "does not exist", name: "不存在"},
                        {filed: "between", name: "存在范围"},
                        {filed: "not between", name: "不在范围"},
                    ],
                },
                filterResqItem: {
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
            }
        },
        mounted() {
        },
        computed: {},
        methods: {
            handleSubmit() {
                this.$refs["item_form"].validate((valid) => {
                    if (valid) {
                        this.$emit("sendtoFu", JSON.parse(JSON.stringify(this.filterResqItem)) );
                        this.filterResqItem = {
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
                        };
                        this.model = false;
                    }/* else {
                        this.$Notice.error({
                            title: '参数属性不规范',
                            desc: '当前筛选参数不符合规范，请查看提示重新输入。',
                            duration:2.5
                        });
                    }*/
                });

            },
            filedChange(value) {

                let msg = [];
                if (!value && !this.filter.hasOwnProperty(value)) {
                    this.filterResqItem.filterType = "";
                    this.filterResqItem.filterParm.filterTypeList = msg;
                    this.filterResqItem.filterParm.typeDisabled = true;
                    return;
                }

                let type = this.filter[value].filedType;
                if (this.filterTypeMap.hasOwnProperty(type))
                    msg = this.filterTypeMap[type].slice(0);

                this.filterResqItem.filterType = "";
                this.filterResqItem.filterParm.filterTypeList = msg;
                this.filterResqItem.filterParm.typeDisabled = false;
            },
            filedTypeChange(value) {
                if (!value) {
                    this.filterResqItem.filterParm.searchShow = "";
                    return;
                }

                let filed = this.filterResqItem.filed;
                let filedType = this.filter[filed].filedType;

                if (filedType === "str")
                    this.filterResqItem.filterParm.searchShow = "str";
                else if (filedType === "int") {
                    if (value.indexOf("between") >= 0)
                        this.filterResqItem.filterParm.searchShow = "intRange";
                    else
                        this.filterResqItem.filterParm.searchShow = "int";
                } else if (filedType === "date") {
                    if (value.indexOf("between") >= 0)
                        this.filterResqItem.filterParm.searchShow = "dateRange";
                    else
                        this.filterResqItem.filterParm.searchShow = "date";
                } else
                    this.filterResqItem.filterParm.searchShow = "";
            },
        },
        watch: {
            flush(v, ov) {
                if (this.type >= 0)
                    this.filterResqItem = JSON.parse(JSON.stringify(this.resqItem));
                this.model = true;
            }
        }


    }
</script>
<style scoped lang="less">


</style>
