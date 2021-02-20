<template>
    <div>
        
        <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;" :key="i" v-for="(value,i) in links">
            <div v-if="!value.detailshow">
                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{value.title}}</span>
                <div style="margin: 15px 10px;">
    <!--                <div style="float: left;margin: 0 0 10px 10px;" v-for="(v,i) in value.child">-->
                    <div style="float: left;margin-bottom: 10px;height: 32px;margin-left: 35px;text-align: right;" :key="i" v-for="(v,i) in value.child">
                    <span style="margin-right: 15px;font-size: 12px;">{{v.name}}:</span>
                        <Input v-if="v.input" v-model="v.val" :val="v.data" :disabled="v.disabled" :placeholder="v.placeholder" style="width: 100px;" />
                        <i-Switch v-if="v.swith" v-model="v.val" :val="v.data" />
                        <Input v-if="v.pwd" type="password" v-model="v.val" :val="v.data" style="width: 130px;" />
                        <Select v-if="v.select" v-model="v.val" :val="v.data" style="width:130px" @on-change="test">
                            <Option v-for="item in v.cityList" :value="item.val" :key="item.val">{{ item.name }}</Option>
                        </Select>
                        <span v-if="v.sign" style="color: red;margin-left: 5px;">输入表达式请携带参数#{v}，#{v}代表采集到的原始数据</span>
                    </div>
                </div>
            </div>
        
            <div v-else>
                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{value.title}}</span>
                <div style="margin: 15px 10px;">
                    <div style="float: left;margin-bottom: 10px;height: 32px;margin-left: 35px;text-align: right;" :key="i" v-for="(v,i) in value.child">
                        <span style="margin-right: 15px;font-size: 12px;">{{v.name}}&nbsp;&nbsp;:&nbsp;&nbsp;{{v.val|select}}</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NumberFormatTabs",
        props: {
            links: {type: Array},//[{name: "用户管理", to: "about"}]
        },
        data(){
            return {
                arr: []
            }
        },
        filters: {
            'select': function (value1) {
                let name = ""
                if(value1 == "NONE"){
                    name = "(默认模式)"
                    return value1 + name
                }
                if(value1 == "ABS"){
                    name = "(绝对值)"
                    return value1 + name
                }
                if(value1 == "DECIMALS"){
                    name = "(保留小数位位数)"
                    return value1 + name
                }
                if(value1 == "EXP"){
                    name = "(自定义格式)"
                    return value1 + name
                }
                
            }
        },
        mounted() {

        },
        methods: {
            common_event(event_name, title){
                this[event_name](title)
            },
            pass(v){
                alert(v)
            },
            nopass(v){
                alert(v)
            },
            test(data) {
                // this.links[0].child = [{name: "格式化方式", select: true, sign: true, data: "formatEnum", cityList: [{name: 'NONE',val: 'NONE'},{name: 'ABS',val: 'ABS'},{name: 'DECIMALS',val: 'DECIMALS'},{name: 'EXP',val: 'EXP'}]}];
                if(this.links[0].child.length > 1){
                    this.links[0].child.splice(1,1);
                }
                if(data == "DECIMALS") {
                    this.links[0].child.push({name: "小数位", input: true, data: "decimal", val: ''});
                }else if(data == "EXP") {
                    this.links[0].child.push({name: "格式化表达式", input: true, data: "exp", val: '', placeholder: '#{v}*10', sign: true});
                }
            }
        }
    }
</script>

<style scoped>
    .liStyle1{
        border-bottom:2px solid black;
        color: black;
    }
    .liStyle2{
        border-bottom:2px solid black;
        color: black;
    }
    .liStyle3{
        border-bottom:2px solid black;
        color: black;
    }
    .liStyle4{
        border-bottom:2px solid black;
        color: black;
    }
    .liStyle5{
        border-bottom:2px solid black;
        color: black;
    }
</style>