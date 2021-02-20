<template>
    <div class="container-fluid" style="float: left;width: 100%;">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs v-if="!loginType" :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <jk_tabsbtn v-if="loginType" :links="links" style="float: left;font-size: 14px;"></jk_tabsbtn>
                    <Button v-if="loginType" type="primary" style="float: right" @click="updateChannel">保存</Button>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 695px;overflow: auto;">
                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                    <span style="background:#fff; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">基本信息</span>
                    <div style="margin: 15px 10px;">
                        <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                            <span style="margin-right: 15px;font-size: 12px;">名称:</span>
                            <Input v-model="channel.form.name" style="width: 130px;" disabled />
                        </div>
                        <div v-if="loginType" style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                            <span style="margin-right: 15px;font-size: 12px;">描述:</span>
                            <Input v-model="channel.form.remark" style="width: 130px;" />
                        </div>
                        <div v-if="!loginType" style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                            <span style="margin-right: 15px;font-size: 12px;">描述:</span>
                            <Input disabled="disabled" v-model="channel.form.remark" style="width: 130px;" />
                        </div>
                    </div>
                </div>
                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                    <span style="background:#fff; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">通道配置</span>
                    <div style="margin: 15px 10px;">
                        <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                            <span style="margin-right: 15px;font-size: 12px;">厂家:</span>
                            <Input v-model="channel.form.manufacturer" style="width: 130px;" disabled />
                        </div>
                        <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                            <span style="margin-right: 15px;font-size: 12px;">规约:</span>
                            <Input v-model="channel.form.driveType" style="width: 130px;" disabled />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabsbtn from "@/components/JkTabsBtn.vue";
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "ChannelConfig",
        inject: ["reload"],
        components: {
            jk_tabs: JkTabs,jk_tabsbtn: JkTabsbtn
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
                        driveType: null
                    },
                    updateForm: {
                        uuid: null,
                        remark: null
                    }
                },
                loginType: null,//系统类型
                links: [
                    {name: "通道配置", to: "/engineering/collectionService/channelConfig"}
                ],
                children: [
                    {title: 'Modbus-TCP', driveType: 'MOD_BUS_TCP'},
                    {title: 'Modbus-TCP从站推送', driveType: 'MOD_BUS_TCP_SLAVE'},
                    {title: 'Modbus-RTU', driveType: 'MOD_BUS_RTU'},
                    {title: 'Modbus-RTU从站推送', driveType: 'MOD_BUS_RTU_SLAVE'},
                    {title: 'Modbus-ASCII', driveType: 'MOD_BUS_ASCII'},
                    {title: 'Modbus-ASCII从站推送', driveType: 'MOD_BUS_ASCII_SLAVE'},
                    {title: 'OPC-DA', driveType: 'OPC_DA'},
                    {title: 'OPC-DA客户端', driveType: 'OPC_DA_HTTP'},
                    {title: 'OPC-UA', driveType: 'OPC_UA'}
                ]
            }
        },
        created() {

        },
        mounted() {
            this.$storage.getStorage("loginType") == "true" ? this.loginType = true : this.loginType = false;
            this.showData();
        },
        methods: {
            showData(){
                this.item = JSON.parse(this.$storage.getStorage("getItem"));
                this.$https.fetchGet(this.$api.collect.channelInfo.url).then((resp) => {
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
                this.$https.fetchPut(this.$api.collect.channelInfo.url, this.channel.updateForm).then((resp) => {
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
</style>