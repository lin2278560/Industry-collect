<template>
    <div>
        <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;max-height:300px;" v-for="(value,i) in links" :key="i">
            <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{value.title}}</span>
            <div style="margin: 15px 10px;">
                <CheckboxGroup style="float: left;margin: 0 0 10px 10px;width: 100%;" v-model="value.checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="CT运算"></Checkbox>
                    <Checkbox label="高压电表读数运算"></Checkbox>
                    <Checkbox label="电压电表读数运算"></Checkbox>
                    <Checkbox label="PT运算"></Checkbox>
                    <Checkbox label="量程转换"></Checkbox>
                </CheckboxGroup>
                <div style="float: left;margin: 0 0 10px 10px;" v-for="(v,i) in value.child" :key="i">
                <div v-if="value.arr">
                        <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                            <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{v.title}}</span>
                            <div style="margin: 15px 10px;">
<!--                                <div style="float: left;margin: 0 0 10px 10px;" v-for="(j,i) in v.child">-->
                                <div style="float: left;margin: 0 0 10px 10px;" v-for="(j,i) in v.child" :key="i">
                                <span style="margin-right: 15px;font-size: 12px;">{{j.name}}:</span>
                                    <Input v-if="j.input" v-model="j.val" :val="j.data" :disabled="v.disabled" style="width: 60px;" />
                                    <i-Switch v-if="j.swith" v-model="j.val" :val="j.data" />
                                    <Input v-if="j.pwd" type="password" v-model="j.val" :val="j.data" style="width: 60px;" />
                                    <Select v-if="j.select" v-model="j.val" :val="j.data" style="width:60px">
                                        <Option v-for="item in j.cityList" :value="item.val" :key="item.val">{{ item.name }}</Option>
                                    </Select>
                                    <span v-if="j.sign" style="color: red;margin-left: 5px;">*</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ModbusTabs",
        props: {
            links: {type: Array},//[{name: "用户管理", to: "about"}]
        },
        data(){
            return {
                arr: []
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
            checkAllGroupChange (data) {
                if(this.links[0].child.length > data.length) {
                    for(let j in this.links[0].child) {
                        let z = 0;
                        if(data.length == 0) {
                            this.links[0].child = [];
                        }else {
                            for(let i in data) {
                                if (this.links[0].child[j].title == data[i]) {
                                    z++;
                                    break;
                                }
                            }
                            if(z == 0) {
                                this.links[0].child.splice(j,1);
                            }
                        }
                    }
                }else {
                    let i = data.length-1;
                    if(data[i] == "CT运算") {
                        this.links[0].child.push({title: "CT运算", data: "ct", child: [{name: "初级值", input: true, data: "primary", val: ''}]},);
                    }else if(data[i] == "高压电表读数运算") {
                        this.links[0].child.push({title: "高压电表读数运算", data: "hem", child: [{name: "电流互感器初级值", input: true, data: "ctPrimary", val: ''},{name: "电压互感器初级值", input: true, data: "ptPrimary", val: ''}]},);
                    }else if(data[i] == "电压电表读数运算") {
                        this.links[0].child.push({title: "电压电表读数运算", data: "lem", child: [{name: "电流互感器初级值", input: true, data: "ctPrimary", val: ''}]},);
                    }else if(data[i] == "PT运算") {
                        this.links[0].child.push({title: "PT运算", data: "pt", child: [{name: "初级值", input: true, data: "primary", val: ''}]},);
                    }else if(data[i] == "量程转换") {
                        this.links[0].child.push({title: "量程转换", data: "rc", child: [{name: "转换最小值", input: true, data: "minValue", val: ''},{name: "转换最大值", input: true, data: "maxValue", val: ''},{name: "量程最小值", input: true, data: "minChange", val: ''},{name: "量程最大值", input: true, data: "maxChange", val: ''},{name: "超出量程 默认值", input: true, data: "defValue", val: ''}]});
                    }
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