<template>
    <div>
        <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;" v-for="(value,i) in links" :key="i">
            <div v-if="value.title != null">

            <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{value.title}}</span>
            <div style="margin: 15px 10px;">
                <div style="float: left;margin: 0 0 10px 10px;" v-for="(v,i) in value.child" :key="i">
                    <div v-if="v.arr">
                        <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                            <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{v.title}}</span>
                            <div style="margin: 15px 10px;">
                                <div style="float: left;margin: 0 0 10px 10px;" v-for="(j,i) in v.child" :key="i">
                                    <div v-if="j.arr">
                                        <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                                            <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">{{j.title}}</span>
                                            <div style="margin: 15px 10px;">
                                                <div style="float: left;margin: 0 0 10px 10px;" v-for="(z,i) in j.child" :key="i">
                                                    <span style="margin-right: 15px;font-size: 12px;">{{z.name}}:</span>
                                                    <Input v-if="z.input" v-model="z.val" :val="z.data" :disabled="z.disabled" style="width: 150px;" />
                                                    <i-Switch v-if="z.swith" v-model="z.val" :val="z.data" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <span style="margin-right: 15px;font-size: 12px;">{{j.name}}:</span>
                                        <Input v-if="j.input" v-model="j.val" :val="j.data" :disabled="j.disabled" style="width: 150px;" />
                                        <i-Switch v-if="j.swith" v-model="j.val" :val="j.data" />
                                    </div>


<!--                                    <span style="margin-right: 15px;font-size: 12px;">{{j.name}}:</span>-->
<!--                                    <Input v-if="j.input" v-model="j.val" :val="j.data" :disabled="v.disabled" style="width: 150px;" />-->
<!--                                    <i-Switch v-if="j.swith" v-model="j.val" :val="j.data" />-->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <span style="margin-right: 15px;font-size: 12px;">{{v.name}}:</span>
                        <Input v-if="v.input" v-model="v.val" :val="v.data" :disabled="v.disabled" style="width: 150px;" />
                        <i-Switch v-if="v.swith" v-model="v.val" :val="v.data" />
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <span style="margin-right: 15px;font-size: 12px;">{{value.name}}:</span>
            <Input v-if="value.input" v-model="value.val" :val="value.data" :disabled="value.disabled" style="width: 150px;" />
            <i-Switch v-if="value.swith" v-model="value.val" :val="value.data" />
        </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "ContentTabs",
        props: {
            links: {type: Array},//[{name: "用户管理", to: "about"}]
        },
        data(){
            return {
                // test111: {
                //     title: "信息介绍",
                //     model: false,
                //     onOK: "aa",
                //     cancel: "bb",
                //     data: [
                //         {title: "基本配置", content: [{name: "名称", input: true, swith: false, val: "test"},{name: "是否开启", input: false, swith: true, val: "test1"}]},
                //         {title: "通道配置", content: [{name: "名称", input: true, swith: false, val: "test3"}]}
                //     ]
                // },
                // model14: true
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