<template>
    <div class="container-fluid" style="float: left;width: 100%;">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header" :class="loginType?'pad5':''" style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <!--                    <interface_add style="float: right;"></interface_add>-->
                    <Button v-if="loginType" type="primary" style="float: right;padding-bottom:5px;" @click="updateChannel">保存</Button>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 715px;overflow: auto;">
                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                    <span style="background:#fff; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">基本信息</span>
                    <div style="margin: 15px 10px;display:flex;flex-wrap: wrap;align-items: center;">
                        <div style="width: 250px;text-align: right;margin-bottom:15px;">
                            <span style="margin-right: 15px;font-size: 12px;">名称:</span>
                            <Input v-model="channel.form.name" style="width: 150px;color:black" disabled />
                        </div>
                        <div v-if="loginType" style="width: 250px;text-align: right;margin-bottom:15px;">
                            <span style="margin-right: 15px;font-size: 12px;">描述:</span>
                            <Input v-model="channel.form.remark" style="width: 150px;color:black" />
                        </div>
                        <div v-if="!loginType" style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                            <span style="margin-right: 15px;font-size: 12px;">描述:</span>
                            <Input disabled="disabled" v-model="channel.form.remark" style="width: 130px;" />
                        </div>
                        <div style="margin: 5px 0 10px 0;width: 250px;text-align: right;margin-bottom:15px;">
                            <span style="margin-right: 15px;font-size: 12px;">状态:</span>
                            <i-Switch size="large" v-model="channel.form.enable" style="margin-right: 90px;">
                                <span slot="open">开启</span>
                                <span slot="close">关闭</span>
                            </i-Switch>
                        </div>
                    </div>
                </div>
                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                    <span style="background:#fff; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">通道配置</span>
                    <div style="margin: 15px 10px;display:flex;flex-wrap: wrap;align-items: center">
                        <div style="width: 250px;text-align: right;margin-bottom:15px;">
                            <span style="margin-right: 15px;font-size: 12px;">厂家:</span>
                            <Input v-model="channel.form.manufacturer" style="width: 150px;color:black" disabled />
                        </div>
                        <div style="width: 250px;text-align: right;margin-bottom:15px;">
                            <span style="margin-right: 15px;font-size: 12px;">规约:</span>
                            <Input v-model="channel.form.driveType" style="width: 150px;color:black" disabled />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "ChannelConfig",
        inject: ["reload"],
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                driveUUID: null,
                driverInfo: [],
                channel: {
                    form: {
                        uuid: null,
                        name: null,
                        remark: null,
                        manufacturer: null,
                        driveType: null,
                        enable: null
                    },
                    updateForm: {
                        uuid: null,
                        remark: null,
                        enable: null
                    }
                },
                loginType: null,//系统类型
                links: [
                    {name: "通道配置", to: "/engineering/reportingService/channelConfig"}
                ],
                children: [
                    {title: 'OPC-DA-UPLOAD', expand: true, driveType: 'OPC_DA_UPLOAD'},
                    {title: 'OPC-UA-UPLOAD', expand: true, driveType: 'OPC_UA_UPLOAD'},
                    {title: 'OPC-UA-SERVER', expand: true, driveType: 'OPC_UA_SERVER'},
                    {title: 'SOCKET', expand: true, driveType: 'SOCKET_CLIENT'},
                    {title: 'MQTT', expand: true, driveType: 'MQTT_CLIENT'},
                    {title: 'SQL', expand: true, driveType: 'SQL'}
                ]
            }
        },
        created: function() {
            // this.showIpAddr();

        },
        mounted: function() {
            this.showData();
            this.$storage.getStorage("loginType") == "true" ? this.loginType = true : this.loginType = false;
        },
        methods: {
            showData(){
                this.item = JSON.parse(this.$storage.getStorage("getItem"));
                // this.channel.form.driveType = this.item.driveType;
                // this.channel.form.uuid = this.item.uuid;
                // this.channel.form.name = this.item.menuName;
                // this.channel.form.remark = this.item.remark;
                // this.channel.form.enable = this.item.enable;
                // for(let i in this.children) {
                //     if(this.channel.form.driveType == this.children[i].driveType){
                //         this.channel.form.manufacturer = this.children[i].title;
                //         // this.channel.form.driveType = this.children[i].driveType;
                //     }
                // }
                this.$https.fetchGet(this.$api.upload.channelInfo.url).then((resp) => {
                    for(let i in resp.data.data) {
                        if(resp.data.data[i].uuid == this.item.uuid) {
                            this.channel.form.driveType = resp.data.data[i].driveType;
                            this.channel.form.uuid = resp.data.data[i].uuid;
                            this.channel.form.name = resp.data.data[i].name;
                            this.channel.form.remark = resp.data.data[i].remark;
                            this.channel.form.enable = resp.data.data[i].enable;
                        }
                    }

                    for(let i in this.children) {
                        if(this.channel.form.driveType == this.children[i].driveType){
                            this.channel.form.manufacturer = this.children[i].title;
                            // this.channel.form.driveType = this.children[i].driveType;
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            updateChannel() {
                this.channel.updateForm.uuid = this.channel.form.uuid;
                this.channel.updateForm.remark = this.channel.form.remark;
                this.channel.updateForm.enable = this.channel.form.enable;
                this.$https.fetchPost(this.$api.upload.updateChannel.url, this.channel.updateForm).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '通道配置成功', desc: "正在刷新界面", duration: 2.5});
                        this.reload();
                    } else
                        this.$Notice.error({title: '通道配置失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                    console.log(err)
                });
            }
        }
    }
</script>

<style scoped>
    .ivu-table {
        font-size: 8px !important;
    }

    .ivu-table-header thead tr th {
        padding: 0px !important;
        height: 26px;
        line-height: 26px;
    }

    .ivu-table-fixed-header thead tr th {
        padding: 0px !important;
        height: 26px;
        line-height: 26px;
        font-size: 12px;
    }

    .ivu-table-fixed-right-header {
        height: 29px !important;
    }

    .ivu-table-cell {
        white-space: nowrap !important;
        padding-left: 8px !important;
        padding-right: 8px !important;
    }

    .ivu-table td, .ivu-table th {
        height: 26px;
        line-height: 26px;
    }
    .pad5{
        padding-bottom: 5px;
    }
</style>