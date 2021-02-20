<template>
<div>
    <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;" :key="i" v-for="(value,i) in links">
        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{value.title}}</span>
        <div style="margin: 15px 10px;">
<!--            <div style="float: left;margin: 0 0 10px 10px;" v-for="(v,i) in value.child">-->
            <div style="float: left;margin-bottom: 10px;width: 220px;height: 32px;text-align: center;" v-for="(v,i) in value.child" :key="i">
                <div v-if="value.arr">
                    <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{v.title}}</span>
                        <div style="margin: 15px 10px;display:flex;align-items: center;flex-wrap:wrap ">
<!--                            <div style="float: left;margin: 0 0 10px 10px;" v-for="(j,i) in v.child">-->
                            <div style="margin-bottom: 10px;" v-for="(j,i) in v.child" :key="i">
<!--                                <div style="width: 230px;">-->
                                    <span style="margin-right: 25px;font-size: 12px;">{{j.name}}:</span>
                                    <Input v-if="j.input" v-model="j.val" :val="j.data" :disabled="v.disabled" style="width: 100px;" />
                                    <i-Switch v-if="j.swith" v-model="j.val" :val="j.data">
                                        <span slot="open">开</span>
                                        <span slot="close">关</span>
                                    </i-Switch>
                                    <Input v-if="j.pwd" type="password" v-model="j.val" :val="j.data" style="width: 100px;" />
                                    <Select v-if="j.select" v-model="j.val" :val="j.data" style="width:100px">
                                        <Option v-for="item in j.cityList" :value="item.val" :key="item.val">{{ item.name }}</Option>
                                    </Select>
                                    <span v-if="j.select" style="margin-left: 5px;">&nbsp;</span>
                                    <span v-if="j.sign" style="color: red;margin-left: 5px;">*</span>
                                    <span v-if="!j.sign" style="margin-left: 5px;">&nbsp;</span>
<!--                                </div>-->
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
<!--                    <div style="width: 160px;text-align: right;">-->
                        <!-- <div style="display:inline-block;margin:0 10px 0 100px;font-size: 14px;float:left">{{v.name}}:</div>
                        <span style="font-size: 14px;">{{v.data}}</span> -->
                        
                        <span style="margin-right:25px;font-size: 12px;">{{v.name}}&nbsp;&nbsp;:&nbsp;&nbsp;{{v.val}}</span>
                        <!-- <i-Switch size="large" v-if="v.swith" v-model="v.val" :val="v.data" style="margin: 5px 74px 0 0;" >
                            <span slot="open">开启</span>
                            <span slot="close">关闭</span>
                        </i-Switch>
                        <Input v-if="v.input" v-model="v.val" :val="v.data" :disabled="v.disabled" style="width: 130px;" />
                        <Input v-if="v.pwd" type="password" v-model="v.val" :val="v.data" style="width: 130px;" />
                        <Select v-if="v.select" v-model="v.val" :val="v.data" style="width: 130px;text-align:left;margin-right:-8px;">
                            <Option v-for="item in v.cityList" :value="item.val" :key="item.val">{{ item.name }}</Option>
                        </Select>
                        <span v-if="v.select" style="margin-left: 5px;">&nbsp;</span>
                        <Select v-if="v.input_select" class="select-box" @on-change="okSelect">
                            <Option v-for="(item, index) in v.options" :key="index" :value="item">{{item}}</Option>
                        </Select>
                        
                        <Input v-if="v.input_select" class="input-box" v-model="v.val" :val="v.data" />
                        <span v-if="v.input_select" style="margin-left: 5px;">&nbsp;</span>
                        <span v-if="v.sign" style="color: red;margin-left: 5px;">*</span>
                        <span v-if="!v.sign" style="margin-left: 5px;">&nbsp;</span> -->
<!--                    </div>-->
                    
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script>
    export default {
        name: "DetailTabs",
        props: {
            links: {type: Array},//[{name: "用户管理", to: "about"}]
        },
        data(){
            return {

            }
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
            okSelect(data) {
                this.links[3].child[2].val = data;
            }
        },
        mounted: function() {
            // this.links[0].pop();
            // console.log(this.links[0],"this.links[0]")
        },
    }
</script>

<style scoped>
    .select-box {
        width: 130px;
        height: 50px;
        padding-left: 40px;
        font-size: 18px;
    }

    .input-box {
        position: absolute;
        margin-left: -130px;
        box-sizing: border-box;
        /*border: 1px solid #9e9e9e;*/
        border-right: none;
        width: 105px;
        height: 50px;
        /*padding-left: 20px;*/
        font-size: 18px;
    }
    .self-adaption{
        margin-bottom: 15px;
        width: 50%;
    }
</style>