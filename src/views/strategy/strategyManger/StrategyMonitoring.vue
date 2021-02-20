<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body">
                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin-top: 20px;">
                    <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">当前版本信息</span>
                    <div style="margin: 15px 10px;">
                        <table border="1" style="width: 100%;">
                            <tr style="height: 35px;" :key="index" v-for="(item,index) in itemList">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">{{item.title}}</span></td>
                                <td><span style="margin-left: 15px;font-size: 12px;">{{item.content}}</span></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin-top: 20px;">
                    <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">版本升级</span>
                    <div style="margin: 15px 10px;">
                        <table border="1" style="width: 100%;">
                            <tr style="height: 35px;">
                                <td style="width: 25%;background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">固件升级包:</span></td>
                                <td>
                                    <Upload
                                            :before-upload="handleUpload"
                                            :action="url" style="margin:15px 0 0 15px;">
                                        <Button style="float: left;" icon="ios-cloud-upload-outline">点击选择文件</Button>
                                        <div style="float: left;margin: 6px 0 0 20px;" v-if="file !== null">Upload file: {{ file.name }}
                                        </div>
                                    </Upload>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div>
                    <Button type="primary" style="margin: 10px 50%;" :loading="loading" @click="upload">升级</Button>
                </div>
                <div style="display:flex;">
                    <Pies style="width:50%;height:300px;" id="1"></Pies>
                    
                        <table border="1" style="width: 50%;height:300px;">
                            <thead>
                                <tr style="background-color: #eee;">
                                    <span style="margin-left:15%;font-weight:bold;">通道 C<驱动 A> 40条</span>
                                    <CheckboxGroup style="float:right;margin-right:15%;" v-model="fruit">
                                        <Checkbox label="一般"></Checkbox>
                                        <Checkbox label="严重"></Checkbox>
                                    </CheckboxGroup>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="height: 35px;" :key="index" v-for="(item,index) in itemList">
                                    <td style="text-align:center;"><span style="font-size: 12px;">{{index+1+'. '}} {{item.title}}</span></td>
                                </tr>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import Pies from "@/components/up/pie.vue";
    export default {
        inject: ["reload"],
        name: "StrategyMonitoring",
        components: {
            jk_tabs: JkTabs,
            Pies
        },
        data(){
            return {
                itemList: [
                    {title: "系统名称:",content: null},
                    {title: "当前版本:",content: null},
                    {title: "发布时间:",content: null},
                    {title: "版本描述:",content: null},
                    {title: "系统名称:",content: null},
                    {title: "当前版本:",content: null},
                    {title: "发布时间:",content: null},
                    {title: "版本描述:",content: null},
                    {title: "系统名称:",content: null},
                    {title: "当前版本:",content: null},
                    {title: "发布时间:",content: null},
                    {title: "版本描述:",content: null},
                    {title: "系统名称:",content: null},
                    {title: "当前版本:",content: null},
                    {title: "发布时间:",content: null},
                    {title: "版本描述:",content: null},
                ],
                data: null,
                url: '',
                file: null,
                loading: false,
                links: [
                    {name: "监控统计", to: "/strategy/monitoring"}
                ]
            }
        },
        created() {
            // var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
            // this.showData();
        },
        mounted: function() {

        },
        methods: {
            showData() {
                this.$https.fetchGet(this.$api.software.software.url).then((resp) => {
                    // this.data = resp.data.data;
                    this.itemList[0].content = resp.data.data.programName;
                    this.itemList[1].content = resp.data.data.version;
                    this.itemList[2].content = this.$util.time_stamp2time_date(resp.data.data.startUptime).format("yyyy-MM-dd hh:mm:ss");
                    this.itemList[3].content = resp.data.data.descriptions;
                }).catch(err => {
                    console.log(err)
                })
            },
        }
    }
</script>

<style scoped>
        table tbody {
            display: block;
            height: 258.5px;
            overflow-y: scroll;
        }
 
        table thead,
        tbody tr {
            display: table;
            width: 100%;
            table-layout: fixed;
            height: 35px;
            line-height: 35px;
        }
 
        table thead th {
            background: #ccc;
        }
</style>