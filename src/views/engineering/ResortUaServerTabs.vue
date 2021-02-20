<template>
    <div>
        <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;" v-for="(value,i) in links" :key="i">
            <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{value.title}}</span>
            <div style="margin: 15px 10px;">
                <div style="float: left;margin: 0 0 10px 10px;" v-for="(v,i) in value.child" :key="i">
                    <div v-if="value.arr">
                        <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                            <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{v.title}}</span>
                            <div style="margin: 15px 10px;">
                                <div style="float: left;margin: 0 0 10px 10px;" v-for="(j,i) in v.child" :key="i">
                                    <span style="margin-right: 15px;font-size: 12px;">{{j.name}}:</span>
                                    <Input v-if="j.input" v-model="j.val" :val="j.data" :disabled="v.disabled" style="width: 100px;" />
                                    <i-Switch v-if="j.swith" v-model="j.val" :val="j.data" />
                                    <Select v-if="j.select" v-model="j.val" :val="j.data" style="width:100px">
                                        <Option v-for="item in j.cityList" :value="item" :key="item">{{ item }}</Option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <span style="margin-right: 15px;font-size: 12px;">{{v.name}}:</span>
                        <Input v-if="v.input" v-model="v.val" :val="v.data" :disabled="v.disabled" style="width: 100px;" />
                        <i-Switch v-if="v.swith" v-model="v.val" :val="v.data" />
                        <Select v-if="v.select" v-model="v.val" :val="v.data" style="width:100px">
                            <Option v-for="item in v.cityList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "ResortUaServerTabs",
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
            }
        }
    }
</script>

<style scoped>

</style>