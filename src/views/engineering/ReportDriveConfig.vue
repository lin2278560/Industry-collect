<template>
    <div class="container-fluid" style="float: left;width:100%;">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header" :class="loginType?'pad5':''" style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <Button type="primary" v-if="loginType" style="float: right;padding-bottom:5px;" @click="updateDrive">保存</Button>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 715px;overflow: auto;">
                <contentTabs :links="driverInfo"></contentTabs>
                
                <div v-if="loginType">
                    <div v-if="channel.form.driveType == 'OPC_UA_SERVER'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">OPC UA连接信息</span>
                        <div style="margin: 15px 10px;">
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;" :key="index" v-for="(d,index) in uaServer.params">
                                <span style="margin-right: 15px;font-size: 12px;">{{d.name}}:</span>
                                <Input v-model="d.val" style="width: 130px;" />
                            </div>

                            <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">NODE节点</span>
                                <div style="margin: 15px 0 0 10px;float: left;width: 60%;" v-for="(d,index) in uaServer.nodes_list" :key="index">
                                    <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">NODE名称:</span>
                                        <Input v-model="d.nameVal" style="width: 130px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">NODE标识:</span>
                                        <Input v-model="d.sqlStrVal" style="width: 130px;margin-right: 10px;" />
                                    </div>
                                    <Button v-if="index == 0" size="small" :disabled="add_nodes_disabled" @click="add_nodes">+</Button>
                                    <Button v-if="index > 0" size="small" @click="del_nodes(index)">-</Button>
                                </div>
                            </div>

                            <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">用户</span>
                                <div style="margin: 15px 0 0 10px;float: left;width: 60%;" v-for="(d,index) in uaServer.users_list" :key="index">
                                    <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">用户名:</span>
                                        <Input v-model="d.nameVal" style="width: 130px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">密码:</span>
                                        <Input type="password" v-model="d.passwordVal" style="width: 130px;margin-right: 10px;" />
                                    </div>
                                    <Button v-if="index == 0" size="small" :disabled="add_users_disabled" @click="add_users">+</Button>
                                    <Button v-if="index > 0" size="small" @click="del_users(index)">-</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="channel.form.driveType == 'MQTT_CLIENT'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">发布信息配置</span>
                        <div style="margin: 15px 0 0 10px;float: left;" v-for="(d,index) in drive.params" :key="index">
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">发布名称:</span>
                                <Input v-model="d.nameVal" style="width: 130px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">发布ID:</span>
                                <Input v-model="d.topicIdVal" style="width: 130px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">发布标题:</span>
                                <Input v-model="d.topicVal" style="width: 130px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">消息质量:</span>
                                <Select v-model="d.qosVal" style="width:130px;text-align:left;">
                                    <Option :value="parseInt('0')">最多一次,有可能重复或丢失</Option>
                                    <Option :value="parseInt('1')">至少一次,有可能重复</Option>
                                    <Option :value="parseInt('2')">只有一次,确保消息只到达一次</Option>
                                </Select>
                            </div>
                            <Button style="float: left;margin-left: 10px;" v-if="index == 0" size="small" :disabled="add_mqtt_disabled" @click="add_params">+</Button>
                            <Button style="float: left;margin-left: 10px;" v-if="index > 0" size="small" @click="del_params(index)">-</Button>
                        </div>
                    </div>

                    <div v-if="channel.form.driveType == 'OPC_UA_UPLOAD'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">名称空间编号</span>
                        <div style="margin: 15px 0 0 10px;float: left;">
                            <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                                <Input v-model="drive.val.nameSpaceIndex" disabled style="width: 130px;" />
                            </div>
                        </div>
                    </div>
                    

                    <div v-if="channel.form.driveType == 'SOCKET_CLIENT'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;display:flex;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">SOCKET驱动信息</span>
                        <div style="margin: 15px 7px;">
                            <div style="float: left;margin-bottom: 10px;width: 260px;padding-right:5px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">告警上报频率/秒:</span>
                                <Input v-model="drive.val.alarmRate" style="width: 130px;margin-right:0px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 260px;padding-right:5px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">指标上报频率/秒:</span>
                                <Input v-model="drive.val.quotaRate" style="width: 130px;margin-right:0px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 260px;padding-right:5px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">上报格式类型:</span>
                                <Select v-model="drive.val.reportType" style="width:130px;margin-right:0px;text-align:left;">
                                    <Option value="WH" key="WH">危化</Option>
                                    <Option value="AGY" key="AGY">安工院</Option>
                                </Select>
                            </div>

                            <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">上报IP信息</span>
                                <div style="margin: 15px 0 0 -5px;float: left;" v-for="(d,index) in drive.params" :key="index">
                                    <div style="float: left;margin-bottom: 10px;width: 260px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">上报地址:</span>
                                        <Input v-model="d.reportIpVal" style="width: 130px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 260px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">向量IV:</span>
                                        <Input v-model="d.cipherIvVal" style="width: 130px;margin-right:-2px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 255px;padding-right:5px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">加密密钥:</span>
                                        <Input v-model="d.cipherCodeVal" style="width: 130px;margin-right:-7px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 260px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">加密类型:</span>
                                        <Select v-model="d.encryptionTypeVal" style="width:130px;text-align:left;">
                                            <Option value="AES128" key="AES128">AES128</Option>
                                            <Option value="AES256" key="AES256">AES256</Option>
                                        </Select>
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 260px;text-align: right;">
                                        <Button style="float: left;margin-left: 80px;" v-if="index == 0" @click="add_params">+</Button>
                                        <Button style="float: left;margin-left: 80px;" v-if="index > 0" @click="del_params(index)">-</Button>
                                        <Button v-if="!loginType" style="float: left;margin-left: 10px;" type="warning" :loading="loading" @click="is_Connect(index)">连接测试</Button>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button v-if="!loginType && channel.form.driveType == 'OPC_UA_UPLOAD' || !loginType && channel.form.driveType == 'OPC_DA_UPLOAD' || !loginType && channel.form.driveType == 'MQTT_CLIENT' || !loginType && channel.form.driveType == 'SQL'" size="small" type="warning" :loading="loading" style="float: left;margin-bottom: 20px;" @click="is_Connect">连接测试</Button>
                </div>

                <div v-if="!loginType">
                    <div v-if="channel.form.driveType == 'OPC_UA_SERVER'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">OPC UA连接信息</span>
                        <div style="margin: 15px 10px;">
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;" :key="index" v-for="(d,index) in uaServer.params">
                                <span style="margin-right: 15px;font-size: 12px;">{{d.name}}:</span>
                                <Input disabled v-model="d.val" style="width: 130px;" />
                            </div>

                            <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">NODE节点</span>
                                <div style="margin: 15px 0 0 10px;float: left;width: 60%;" v-for="(d,index) in uaServer.nodes_list" :key="index">
                                    <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">NODE名称:</span>
                                        <Input disabled v-model="d.nameVal" style="width: 130px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">NODE标识:</span>
                                        <Input disabled v-model="d.sqlStrVal" style="width: 130px;margin-right: 10px;" />
                                    </div>
                                    <!-- <Button v-if="index == 0" size="small" :disabled="add_nodes_disabled" @click="add_nodes">+</Button>
                                    <Button v-if="index > 0" size="small" @click="del_nodes(index)">-</Button> -->
                                </div>
                            </div>

                            <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">用户</span>
                                <div style="margin: 15px 0 0 10px;float: left;width: 60%;" v-for="(d,index) in uaServer.users_list" :key="index">
                                    <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">用户名:</span>
                                        <Input disabled v-model="d.nameVal" style="width: 130px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">密码:</span>
                                        <Input disabled type="password" v-model="d.passwordVal" style="width: 130px;margin-right: 10px;" />
                                    </div>
                                    <!-- <Button v-if="index == 0" size="small" :disabled="add_users_disabled" @click="add_users">+</Button>
                                    <Button v-if="index > 0" size="small" @click="del_users(index)">-</Button> -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="channel.form.driveType == 'MQTT_CLIENT'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">发布信息配置</span>
                        <div style="margin: 15px 0 0 10px;float: left;" v-for="(d,index) in drive.params" :key="index">
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">发布名称:</span>
                                <Input disabled v-model="d.nameVal" style="width: 130px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">发布ID:</span>
                                <Input disabled v-model="d.topicIdVal" style="width: 130px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">发布标题:</span>
                                <Input disabled v-model="d.topicVal" style="width: 130px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 265px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">消息质量:</span>
                                <Select disabled v-model="d.qosVal" style="width:130px">
                                    <Option :value="parseInt('0')">最多一次,有可能重复或丢失</Option>
                                    <Option :value="parseInt('1')">至少一次,有可能重复</Option>
                                    <Option :value="parseInt('2')">只有一次,确保消息只到达一次</Option>
                                </Select>
                            </div>
                            <!-- <Button style="float: left;margin-left: 10px;" v-if="index == 0" size="small" :disabled="add_mqtt_disabled" @click="add_params">+</Button>
                            <Button style="float: left;margin-left: 10px;" v-if="index > 0" size="small" @click="del_params(index)">-</Button> -->
                        </div>
                    </div>

                    <div v-if="channel.form.driveType == 'OPC_UA_UPLOAD'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">名称空间编号</span>
                        <div style="margin: 15px 0 0 10px;float: left;">
                            <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                                <Input disabled v-model="drive.val.nameSpaceIndex" style="width: 130px;" />
                            </div>
                        </div>
                    </div>

                    <div v-if="channel.form.driveType == 'SOCKET_CLIENT'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;display:flex;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">SOCKET驱动信息</span>
                        <div style="margin: 15px 7px;">
                            <div style="float: left;margin-bottom: 10px;width: 260px;padding-right:5px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">告警上报频率/秒:</span>
                                <Input disabled v-model="drive.val.alarmRate" style="width: 130px;margin-right:0px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 260px;padding-right:5px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">指标上报频率/秒:</span>
                                <Input disabled v-model="drive.val.quotaRate" style="width: 130px;margin-right:0px;" />
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 260px;padding-right:5px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">上报格式类型:</span>
                                <Select disabled v-model="drive.val.reportType" style="width:130px;margin-right:0px;text-align:left;">
                                    <Option value="WH" key="WH">危化</Option>
                                    <Option value="AGY" key="AGY">安工院</Option>
                                </Select>
                            </div>

                            <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">上报IP信息</span>
                                <div style="margin: 15px 0 0 -5px;float: left;" v-for="(d,index) in drive.params" :key="index">
                                    <div style="float: left;margin-bottom: 10px;width: 260px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">上报地址:</span>
                                        <Input disabled v-model="d.reportIpVal" style="width: 130px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 260px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">向量IV:</span>
                                        <Input disabled v-model="d.cipherIvVal" style="width: 130px;margin-right:-2px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 255px;padding-right:5px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">加密密钥:</span>
                                        <Input disabled v-model="d.cipherCodeVal" style="width: 130px;margin-right:-7px;" />
                                    </div>
                                    <div style="float: left;margin-bottom: 10px;width: 260px;text-align: right;">
                                        <span style="margin-right: 15px;font-size: 12px;">加密类型:</span>
                                        <Select disabled v-model="d.encryptionTypeVal" style="width:130px;text-align:left;">
                                            <Option value="AES128" key="AES128">AES128</Option>
                                            <Option value="AES256" key="AES256">AES256</Option>
                                        </Select>
                                    </div>
                                    <!-- <div style="float: left;margin-bottom: 10px;width: 260px;text-align: right;">
                                        <Button style="float: left;margin-left: 80px;" v-if="index == 0" @click="add_params">+</Button>
                                        <Button style="float: left;margin-left: 80px;" v-if="index > 0" @click="del_params(index)">-</Button>
                                        <Button v-if="!loginType" style="float: left;margin-left: 10px;" type="warning" :loading="loading" @click="is_Connect(index)">连接测试</Button>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button v-if="!loginType && channel.form.driveType == 'OPC_UA_UPLOAD' || !loginType && channel.form.driveType == 'OPC_DA_UPLOAD' || !loginType && channel.form.driveType == 'MQTT_CLIENT' || !loginType && channel.form.driveType == 'SQL'" size="small" type="warning" :loading="loading" style="float: left;margin-bottom: 20px;" @click="is_Connect">连接测试</Button>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    // import contentTabs from "./ResortContentTabs";
    import contentTabs from "./ContentTabs";
    export default {
        name: "ReportDriveConfig",
        inject: ["reload"],
        components: {
            jk_tabs: JkTabs,contentTabs
        },
        data(){
            return {
                driveUUID: null,
                loading: false,
                driverInfo: [],
                item: {},
                url: null,
                updateurl: null,
                driveType: null,
                channel: {
                    form: {
                        uuid: null,
                        name: null,
                        remark: null,
                        manufacturer: null,
                        driveType: null
                    }
                },
                drive: {
                    form: {},
                    val: {nameSpaceIndex: null,alarmRate: null,quotaRate: null,reportType: null},
                    params: [],
                    nodes_list: [],
                    users_list: []
                },
                uaServer: {
                    params: [],
                    nodes_list: [],
                    users_list: []
                },
                loginType: null,//系统类型
                add_users_disabled: false,//禁用添加用户按钮
                add_nodes_disabled: false,//禁用添加NODE按钮
                add_mqtt_disabled: false,//禁用添加mqtt按钮
                links: [
                    {name: "驱动配置", to: "/engineering/reportingService/driveConfig"},
                    {name: "节点配置", to: "/engineering/reportingService/nodeConfig"},
                    
                ]
            }
        },
        created: function() {
            // this.showIpAddr();

        },
        mounted: function() {
            this.$storage.getStorage("loginType") == "true" ? this.loginType = true : this.loginType = false;
            this.showData();
            //判断udp通道还是mysql
            if(this.loginType){
                this.channelType()
            }else{
                this.links.push({name: "业务数据", to: "/engineering/reportingService/busData"})
            }  
        },
        methods: {
            channelType(){
                this.$https.fetchGet(this.$api.globalChannel.url).then((resp) => {
                    if(resp.data.code == 200){
                        if(resp.data.data){
                            this.links.push({name: "业务数据", to: "/engineering/reportingService/busData"})
                        } 
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            showData(){
                this.item = JSON.parse(this.$storage.getStorage("getItem"));
                this.channel.form.driveType = this.item['driveType'];
                //采集系统时input框能正常输入
                if(this.loginType == true){
                    this.driverInfo = [
                        {title: "基本信息", data: "base", child: [
                                {name: "驱动名称", input: true, data: "name"},
                                {name: "描述", input: true, data: "remark"},
                                {name: "状态", swith: true, data: "enable"},
                            ]}
                    ];
                    if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT" || this.item.driveType == "OPC_DA_UPLOAD" || this.item.driveType == "OPC_UA_UPLOAD" || this.item.driveType == "SQL") {
                        this.driverInfo.push(
                            {title: "配置信息", data: "loopUpload", child: [
                                    {name: "上报间隔", input: true, data: "uploadInterval"}
                                ]}
                        )
                    }
                    this.drive.form = {
                        base: {uuid: null, enable: false, name: null, remark: null},
                        driveType: null,
                        loopUpload: {uploadInterval: 5}
                    };


                    if(this.channel.form.driveType == "OPC_UA_SERVER") {
                        this.url = this.$api.upload.drive.uaServer.url;
                    }else if(this.channel.form.driveType == "OPC_UA_UPLOAD") {
                        this.url = this.$api.upload.drive.uaUpload.url;
                        this.driverInfo.push(
                            {title: "OPC UA连接信息", data: "params", child: [
                                    {name: "用户名", input: true, data: "user"},{name: "密码", pwd: true, data: "password"},{name: "url", input: true, data: "url"},
                                    {name: "安全模式", select: true, data: "securitypolicy", cityList: [
                                            {name: 'basic128rsa15',val: 'basic128rsa15'},{name: 'basic256',val: 'basic256'},{name: 'basic256sha256',val: 'basic256sha256'},{name: 'aes128_sha256_rsaOaep',val: 'aes128_sha256_rsaOaep'},
                                            {name: 'aes256_sha256_rsapss',val: 'aes256_sha256_rsapss'},{name: 'none',val: 'none'},]}
                                ]}
                        );
                        this.drive.form.params = {password: null, securitypolicy: null, url: null, user: null};
                    }else if(this.channel.form.driveType == "OPC_DA_UPLOAD") {
                        this.url = this.$api.upload.drive.daUpload.url;
                        this.driverInfo.push(
                            {title: "OPC DA连接信息", data: "params", child: [
                                {name: "连接类型", select: true, data: "conntype", val: 2, cityList: [
                                {name: '服务名称',val: 2},{name: 'CLSID',val: 1}]},
                                {name: "服务器名称", input: true, sign: false, data: "progid", val: ''},
                                {name: "服务器IP地址", input: true, sign: true, data: "host", val: ''},
                                {name: "服务器用户名", input: true, sign: false, data: "user", val: ''},
                                {name: "服务器密码", pwd: true, sign: false, data: "password", val: ''},
                                {name: "超时时间(毫秒)", input: true, sign: true, data: "timeout", val: ''},
                            ]}
                        );
                        this.drive.form.params = {password: null,progid: null,host: null,user: null,timeout: null,conntype: null,};
                    }else if(this.channel.form.driveType == "SOCKET_CLIENT") {
                        this.url = this.$api.upload.drive.socket.url;
                        this.driverInfo.push(
                            {title: "SOCKET基本配置", data: "config", child: [
                                    {name: "APP ID", input: true, data: "appId"},{name: "SERVICE ID", input: true, data: "serviceId"},{name: "网关ID", input: true, data: "gatewayId"},
                                    {name: "企业编码", input: true, data: "enterpriseId"}
                                ]}
                        );
                        this.drive.form.config = {appId: null, enterpriseId: null, gatewayId: null, serviceId: null};


                    }else if(this.channel.form.driveType == "MQTT_CLIENT") {
                        this.url = this.$api.upload.drive.mqtt.url;
                        this.driverInfo.push(
                            {title: "MQTT连接信息", data: "params", child: [
                                    {name: "上报IP地址", input: true, data: "host"},{name: "端口", input: true, data: "port"}, {name: "用户名", input: true, data: "userName"},
                                    {name: "密码", pwd: true, data: "password"}, {name: "客户端ID", input: true, data: "clientId"},
                                ]},
                        );
                        this.drive.form.params = {clientId: null,host: null,password: null,port: null,userName: null};
                    }else if(this.channel.form.driveType == "SQL") {
                        this.url = this.$api.upload.drive.sql.url;
                        this.driverInfo.push(
                            {title: "SQL连接信息", data: "params", child: [
                                    {name: "数据库名", input: true, data: "dbName"},{name: "IP", input: true, data: "host"},{name: "端口", input: true, data: "port"},
                                    {name: "用户名", input: true, data: "username"},{name: "密码", pwd: true, data: "password"},
                                    {name: "SQL驱动类型", select: true, data: "type", cityList: [{name: 'MySQL',val: 'MySQL'},{name: 'SQLSERVER',val: 'SQLSERVER'},{name: 'ORACLE',val: 'ORACLE'}]},
                                ]}
                        );
                        this.drive.form.params = {dbName: null,host: null,password: null,port: null,type: null,username: null};
                    }
                }
                //上报系统时input框变为disabled
                 else if(this.loginType == false){
                    this.driverInfo = [
                        {title: "基本信息", data: "base", child: [
                                {name: "名称", input: true,disabled:true, data: "name"},
                                {name: "描述", input: true,disabled:true, data: "remark"},
                                {name: "状态", swith: true,disabled:true, data: "enable"},
                            ]}
                    ];
                    if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT" || this.item.driveType == "OPC_UA_UPLOAD" || this.item.driveType == "OPC_DA_UPLOAD" || this.item.driveType == "SQL") {
                        this.driverInfo.push(
                            {title: "配置信息", data: "loopUpload", child: [
                                    {name: "上报间隔", input: true,disabled:true, data: "uploadInterval"}
                                ]}
                        )
                    }
                    this.drive.form = {
                        base: {uuid: null, enable: false, name: null, remark: null},
                        driveType: null,
                        loopUpload: {uploadInterval: 5}
                    };


                    if(this.channel.form.driveType == "OPC_UA_SERVER") {
                        this.url = this.$api.upload.drive.uaServer.url;
                    }else if(this.channel.form.driveType == "OPC_UA_UPLOAD") {
                        this.url = this.$api.upload.drive.uaUpload.url;
                        this.driverInfo.push(
                            {title: "OPC UA连接信息", data: "params", child: [
                                    {name: "用户名", input: true,disabled:true, data: "user"},{name: "密码", pwd: true,disabled:true, data: "password"},{name: "url", input: true,disabled:true, data: "url"},
                                    {name: "安全模式", select: true,disabled:true, data: "securitypolicy", cityList: [
                                            {name: 'basic128rsa15',val: 'basic128rsa15'},{name: 'basic256',val: 'basic256'},{name: 'basic256sha256',val: 'basic256sha256'},{name: 'aes128_sha256_rsaOaep',val: 'aes128_sha256_rsaOaep'},
                                            {name: 'aes256_sha256_rsapss',val: 'aes256_sha256_rsapss'},{name: 'none',val: 'none'},]}
                                ]}
                        );
                        this.drive.form.params = {password: null, securitypolicy: null, url: null, user: null};
                    }else if(this.channel.form.driveType == "SOCKET_CLIENT") {
                        this.url = this.$api.upload.drive.socket.url;
                        this.driverInfo.push(
                            {title: "SOCKET基本配置", data: "config", child: [
                                    {name: "APP ID", input: true,disabled:true, data: "appId"},{name: "SERVICE ID", input: true,disabled:true, data: "serviceId"},{name: "网关ID", input: true,disabled:true, data: "gatewayId"},
                                    {name: "企业编码", input: true,disabled:true, data: "enterpriseId"}
                                ]}
                        );
                        this.drive.form.config = {appId: null, enterpriseId: null, gatewayId: null, serviceId: null};

                    }else if(this.channel.form.driveType == "OPC_DA_UPLOAD") {
                        this.url = this.$api.upload.drive.daUpload.url;
                        this.driverInfo.push(
                            {title: "OPC DA连接信息", data: "params", child: [
                                {name: "连接类型", select: true, disabled:true, data: "conntype", val: 2, cityList: [
                                {name: '服务名称',val: 2},{name: 'CLSID',val: 1}]},
                                {name: "服务器名称", input: true, sign: false, disabled:true, data: "progid", val: ''},
                                {name: "服务器IP地址", input: true, sign: true, disabled:true, data: "host", val: ''},
                                {name: "服务器用户名", input: true, sign: false, disabled:true, data: "user", val: ''},
                                {name: "服务器密码", pwd: true, sign: false, disabled:true, data: "password", val: ''},
                                {name: "超时时间(毫秒)", input: true, sign: true, disabled:true, data: "timeout", val: ''},
                            ]}
                        );
                        this.drive.form.params = {password: null,progid: null,host: null,user: null,timeout: null,conntype: null,};
                    }else if(this.channel.form.driveType == "MQTT_CLIENT") {
                        this.url = this.$api.upload.drive.mqtt.url;
                        this.driverInfo.push(
                            {title: "MQTT连接信息", data: "params", child: [
                                    {name: "上报IP地址", input: true,disabled:true, data: "host"},{name: "端口", input: true,disabled:true, data: "port"}, {name: "用户名", input: true,disabled:true, data: "userName"},
                                    {name: "密码", pwd: true,disabled:true, data: "password"}, {name: "客户端ID", input: true,disabled:true, data: "clientId"},
                                ]},
                        );
                        this.drive.form.params = {clientId: null,host: null,password: null,port: null,userName: null};
                    }else if(this.channel.form.driveType == "SQL") {
                        this.url = this.$api.upload.drive.sql.url;
                        this.driverInfo.push(
                            {title: "SQL连接信息", data: "params", child: [
                                    {name: "数据库名", input: true,disabled:true, data: "dbName"},{name: "IP", input: true,disabled:true, data: "host"},{name: "端口", input: true,disabled:true, data: "port"},
                                    {name: "用户名", input: true,disabled:true, data: "username"},{name: "密码", pwd: true,disabled:true, data: "password"},
                                    {name: "SQL驱动类型", select: true,disabled:true, data: "type", cityList: [{name: 'MySQL',val: 'MySQL'},{name: 'SQLSERVER',val: 'SQLSERVER'},{name: 'ORACLE',val: 'ORACLE'}]},
                                ]}
                        );
                        this.drive.form.params = {dbName: null,host: null,password: null,port: null,type: null,username: null};
                    }
                }

                

                this.$https.fetchGet(this.url+"/drive/"+this.item['uuid']).then((resp) => {
                    // for(let i in this.driverInfo) {
                    //     let driverData = this.driverInfo[i].data;
                    //     for(let j in this.driverInfo[i].child) {
                    //         let name = this.driverInfo[i].child[j].data;
                    //         // this.$set(this.driverInfo[i].child[j],'val',resp.data.data[driverData][name]);
                    //         if(this.driverInfo[i].child[j].arr) {
                    //             for(let z in this.driverInfo[i].child[j].child) {
                    //                 var name1 = this.driverInfo[i].child[j].child[z].data;
                    //                 if(this.driverInfo[i].child[j].child[z].arr) {
                    //                     for(let x in this.driverInfo[i].child[j].child[z].child) {
                    //                         var name2 = this.driverInfo[i].child[j].child[z].child[x].data;
                    //                         this.$set(this.driverInfo[i].child[j].child[z].child[x],'val',resp.data.data[driverData][name][name1][name2]);
                    //                     }
                    //                 }else {
                    //                     this.$set(this.driverInfo[i].child[j].child[z],'val',resp.data.data[driverData][name][name1]);
                    //                 }
                    //             }
                    //         }else {
                    //             this.$set(this.driverInfo[i].child[j],'val',resp.data.data[driverData][name]);
                    //         }
                    //     }
                    for(let i in this.driverInfo) {
                        let driverData = this.driverInfo[i].data;
                        for(let j in this.driverInfo[i].child) {
                            let name = this.driverInfo[i].child[j].data;
                            this.$set(this.driverInfo[i].child[j],'val',resp.data.data[driverData][name]);
                        }
                    }
                    if(this.channel.form.driveType == "OPC_UA_SERVER") {
                        this.uaServer.params.push({name: "服务浏览路径",local: "discovery",val: resp.data.data.params["discovery"]},{name: "HTTP端口",local: "httpPort",val: resp.data.data.params["httpPort"]},
                            {name: "服务路径",local: "path",val: resp.data.data.params["path"]},{name: "根节点",local: "rootNode",val: resp.data.data.params["rootNode"]},{name: "TCP端口",local: "tcpPort",val: resp.data.data.params["tcpPort"]});
                        for(let i in resp.data.data.params.nodes){
                            this.uaServer.nodes_list.push({nameVal: resp.data.data.params.nodes[i].name,sqlStrVal: resp.data.data.params.nodes[i].sqlStr});
                        }
                        for(let i in resp.data.data.params.users){
                            this.uaServer.users_list.push({nameVal: resp.data.data.params.users[i].name,passwordVal: resp.data.data.params.users[i].password});
                        }
                    }
                    if(this.channel.form.driveType == "OPC_UA_UPLOAD") {
                        this.drive.val.nameSpaceIndex = resp.data.data.nameSpaceIndex;
                    }
                    if(this.channel.form.driveType == "SOCKET_CLIENT") {
                        this.drive.val.alarmRate = resp.data.data.alarmRate;
                        this.drive.val.quotaRate = resp.data.data.quotaRate;
                        this.drive.val.reportType = resp.data.data.reportType;
                        for(let i in resp.data.data.ipMap){
                            this.drive.params.push({cipherCodeVal: resp.data.data.ipMap[i].cipherCode,cipherIvVal: resp.data.data.ipMap[i].cipherIv,encryptionTypeVal: resp.data.data.ipMap[i].encryptionType,reportIpVal: resp.data.data.ipMap[i].reportIp});
                        }
                    }
                    if(this.channel.form.driveType == "MQTT_CLIENT") {
                        for(let i in resp.data.data.topics){
                            this.drive.params.push({nameVal: resp.data.data.topics[i].name,qosVal: resp.data.data.topics[i].qos,topicVal: resp.data.data.topics[i].topic,topicIdVal: resp.data.data.topics[i].topicId});
                        }
                    }
                    //console.log(this.driverInfo[2].child);
                }).catch(err => {
                    console.log(err)
                })
            },
            updateDrive() {
                for(let i in this.driverInfo) {
                    let driverData = this.driverInfo[i].data;
                    for(let j in this.driverInfo[i].child) {
                        let name = this.driverInfo[i].child[j].data;
                        this.drive.form[driverData][name] = this.driverInfo[i].child[j].val;
                    }
                }
                console.log(this.driverInfo,'driverInfo')
                this.drive.form.base.uuid = this.item['uuid'];
                this.drive.form.driveType = this.item['driveType'];

                let status = this.checkDrive();
                let status1 = null;

                if(this.channel.form.driveType == "OPC_UA_SERVER") {
                    let nodes = {};
                    let users = {};

                    for(let i in this.uaServer.nodes_list) {
                        nodes[i] = {name: null, sqlStr: null};
                    }
                    for(let i in this.uaServer.users_list) {
                        users[i] = {name: null, password: null};
                    }
                    this.drive.form.params = {discovery: null, httpPort: null, path: null, rootNode: null, tcpPort: null, nodes, users};
                    for(let i in this.uaServer.params) {
                        let local = this.uaServer.params[i].local;
                        this.drive.form.params[local] = this.uaServer.params[i].val;
                    }
                    for(let i in this.uaServer.nodes_list) {
                        this.drive.form.params.nodes[i].name = this.uaServer.nodes_list[i].nameVal;
                        this.drive.form.params.nodes[i].sqlStr = this.uaServer.nodes_list[i].sqlStrVal;
                    }
                    let str = {};
                    //判断用户名是否同名
                    for(let i in this.uaServer.users_list) {
                        for(let j = this.uaServer.users_list.length-1;j > i ; j--) {
                            if(this.uaServer.users_list[i].nameVal == this.uaServer.users_list[j].nameVal) {
                                this.$Message.error({content: '用户名存在同名', duration: 3}); status1 = true;
                                return
                            }
                        }
                    }
                    for(let i in this.uaServer.users_list) {
                        this.drive.form.params.users[i].name = this.uaServer.users_list[i].nameVal;
                        this.drive.form.params.users[i].password = this.uaServer.users_list[i].passwordVal;
                        let name = this.drive.form.params.users[i].name;
                        str[name] = this.drive.form.params.users[i];
                    }
                    this.drive.form.params.users = str;
                    status1 = this.checkServerDrive();

                }else if(this.channel.form.driveType == "OPC_UA_UPLOAD") {
                    this.drive.form.nameSpaceIndex = this.drive.val.nameSpaceIndex;
                    // this.drive.form.params = {password: null,securitypolicy: null,url: null,user: null};

                    status1 = this.checkUploadDrive();

                }else if(this.channel.form.driveType == "OPC_DA_UPLOAD") {
                    // this.drive.form.params = {password: null,securitypolicy: null,url: null,user: null};

                    status1 = this.checkUAUploadDrive();
                }else if(this.channel.form.driveType == "SOCKET_CLIENT") {
                    let ipMap = {};
                    for(let i in this.drive.params) {
                        ipMap[i] = {cipherCode: null,cipherIv: null,encryptionType: null,reportIp: null};
                    }
                    this.drive.form.alarmRate = this.drive.val.alarmRate;
                    // this.drive.form.config = {appId: null,enterpriseId: null,gatewayId: null,serviceId: null};
                    this.drive.form.ipMap = ipMap;
                    this.drive.form.quotaRate = this.drive.val.quotaRate;
                    this.drive.form.reportType = this.drive.val.reportType;
                    for(let i in this.drive.params) {
                        this.drive.form.ipMap[i].cipherCode = this.drive.params[i].cipherCodeVal;
                        this.drive.form.ipMap[i].cipherIv = this.drive.params[i].cipherIvVal;
                        this.drive.form.ipMap[i].encryptionType = this.drive.params[i].encryptionTypeVal;
                        this.drive.form.ipMap[i].reportIp = this.drive.params[i].reportIpVal;
                    }

                    status1 = this.checkSocketDrive();

                }else if(this.channel.form.driveType == "MQTT_CLIENT") {
                    let topics = {};
                    for(let i in this.drive.params) {
                        topics[i] = {name: null,qos: null,topic: null,topicId: null};
                    }

                    // this.drive.form.params = {clientId: null,host: null,password: null,userName: null};
                    this.drive.form.topics = topics;
                    for(let i in this.drive.params) {
                        this.drive.form.topics[i].name = this.drive.params[i].nameVal;
                        this.drive.form.topics[i].qos = this.drive.params[i].qosVal;
                        this.drive.form.topics[i].topic = this.drive.params[i].topicVal;
                        this.drive.form.topics[i].topicId = this.drive.params[i].topicIdVal;
                    }

                    status1 = this.checkMqttDrive();
                }else if(this.channel.form.driveType == 'SQL') {
                    status1 = this.checkSQLDrive();

                }
                if(status == false && status1 == false) {
                    this.$https.fetchPost(this.url+"/updateDrive", this.drive.form).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '驱动配置成功', desc: "正在刷新界面", duration: 2.5});
                            this.reload();
                        } else
                            this.$Notice.error({title: '驱动配置失败', desc: resp.data.describe, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 2.5});
                        console.log(err)
                    });
                }

                // this.$https.fetchPost(this.url+"/updateDrive", this.drive.form).then((resp) => {
                //     if (resp.data.code == 200) {
                //         this.$Notice.success({title: '驱动配置成功', desc: "正在刷新界面", duration: 2.5});
                //         this.reload();
                //     } else
                //         this.$Notice.error({title: '驱动配置失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                // }).catch(err => {
                //     this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                //     console.log(err)
                // });
            },
            is_Connect(index) {
                this.loading = true;
                let data = null;
                if(this.channel.form.driveType == "OPC_UA_UPLOAD") {
                    data = {password: this.driverInfo[2].child[1].val,securitypolicy: this.driverInfo[2].child[3].val,url: this.driverInfo[2].child[2].val,
                        user: this.driverInfo[2].child[0].val}
                }else if(this.channel.form.driveType == "OPC_DA_UPLOAD") {
                    data = {password: this.driverInfo[2].child[4].val,timeout: this.driverInfo[2].child[5].val,host: this.driverInfo[2].child[2].val,
                        user: this.driverInfo[2].child[3].val,progid: this.driverInfo[2].child[1].val,conntype: this.driverInfo[2].child[0].val}
                }else if(this.channel.form.driveType == "SOCKET_CLIENT") {
                    data = {ipPort: this.drive.params[index].reportIpVal}
                }else if(this.channel.form.driveType == "MQTT_CLIENT") {
                    data = {clientId: this.driverInfo[2].child[4].val,host: this.driverInfo[2].child[0].val,password: this.driverInfo[2].child[3].val,
                        port: this.driverInfo[2].child[1].val, userName: this.driverInfo[2].child[2].val}
                }else if(this.channel.form.driveType == "SQL") {
                    data = {dbName: this.driverInfo[2].child[0].val, host: this.driverInfo[2].child[1].val, password: this.driverInfo[2].child[4].val,
                        port: this.driverInfo[2].child[2].val, type: this.driverInfo[2].child[5].val, username: this.driverInfo[2].child[3].val}
                }
                this.$https.fetchPost(this.url+"/isConnect", data).then((resp) => {
                    if (resp.data.data) {
                        this.$Notice.success({title: '连接成功', desc: "请进行下一步...", duration: 2.5});
                        this.loading = false;
                    } else
                        this.$Notice.error({title: '连接失败', desc: "请重新填写...", duration: 2.5});
                    this.loading = false;
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', duration: 2.5});
                    this.loading = false;
                    console.log(err)
                });
            },
            add_nodes() {
                if(this.uaServer.nodes_list.length >= 5) this.add_nodes_disabled = true;
                else this.uaServer.nodes_list.push({});
                // this.uaServer.nodes_list.push({});
            },
            del_nodes(index) {
                this.add_nodes_disabled = false;
                this.uaServer.nodes_list.splice(index,1);
            },
            add_users() {
                if(this.uaServer.users_list.length >= 3) this.add_users_disabled = true;
                else this.uaServer.users_list.push({});
                // this.uaServer.users_list.push({});
            },
            del_users(index) {
                this.add_users_disabled = false;
                this.uaServer.users_list.splice(index,1);
            },
            add_params() {
                if(this.drive.params.length >= 10) this.add_mqtt_disabled = true;
                else this.drive.params.push({});
                // this.drive.params.push({});
            },
            del_params(index) {
                this.add_mqtt_disabled = false;
                this.drive.params.splice(index,1);
            },
            checkDrive() {
                let status = false;
                if(this.drive.form.base.name === '' || this.drive.form.loopUpload.uploadInterval === '') {this.$Message.error({content: '请填写驱动名称或者间隔时间...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{0,2}$/.test(this.drive.form.loopUpload.uploadInterval)) {this.$Message.error({content: '间隔时间填写1-999之间的数字...', duration: 3});    status = true;}
                else if(!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.drive.form.base.name)) {this.$Message.error({content: '驱动名称不允许特殊符号...', duration: 3});    status = true;}
                return status;
            },
            checkUploadDrive() {
                let status = false;
                if(this.drive.form.params.password === '' || this.drive.form.params.user === '' || this.drive.form.params.url === '' || this.drive.form.nameSpaceIndex === '') {this.$Message.error({content: '请填写用户名、密码、URL、名称空间编号...', duration: 3});    status = true;}

                else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.drive.form.params.user)) {this.$Message.error({content: '用户名填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.drive.form.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                return status;
            },
            checkUAUploadDrive(){
                let status = false;
                
                // if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,50}$/.test(this.drive.form.params.progid)) {this.$Message.error({content: '服务器名称填写50位以内英文、数字或中文...', duration: 3});    status = true;}
                if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.drive.form.params.host)) {this.$Message.error({content: '服务器IP地址请填写正确的IP格式...', duration: 3});    status = true;}
                // else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.drive.form.params.user)) {this.$Message.error({content: '服务器用户名填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                // else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.drive.form.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{0,7}$/.test(this.drive.form.params.timeout)) {this.$Message.error({content: '超时时间填写1-99999999之间的数字...', duration: 3});    status = true;}
                return status;
            },
            checkServerDrive() {
                let status = false;
                if(this.drive.form.params.discovery === '' || this.drive.form.params.httpPort === '' || this.drive.form.params.path === '' || this.drive.form.params.rootNode === '' || this.drive.form.params.tcpPort === '') {
                    this.$Message.error({content: '请填写HTTP端口、TCP端口、服务路径、服务浏览路径、根节点...', duration: 3});    status = true;
                }
                else if(!/^[1-9]\d{0,5}$/.test(this.drive.form.params.httpPort) || !/^[1-9]\d{0,5}$/.test(this.drive.form.params.tcpPort)) {this.$Message.error({content: 'HTTP端口、TCP端口填写5位以内的数字,不能为0...', duration: 3});    status = true;}
                else if(!/^[A-Za-z1-9]{0,18}$/.test(this.drive.form.params.path) || !/^[A-Za-z1-9]{0,18}$/.test(this.drive.form.params.rootNode)) {this.$Message.error({content: '服务路径、根路径填写18位以内的数字与英文,不能为0...', duration: 3});    status = true;}
                else if(!/^[A-Za-z1-9/]{0,24}$/.test(this.drive.form.params.discovery)) {this.$Message.error({content: '服务浏览路径填写24位以内的数字与英文,不能为0...', duration: 3});    status = true;}

                for(let i in this.drive.form.params.nodes) {
                    if(this.drive.form.params.nodes[i].name === '' || this.drive.form.params.nodes[i].sqlStr === '') {
                        this.$Message.error({content: '请填写NODE名称、发布标识...', duration: 3});    status = true;
                    }else if(!/^[1-9a-zA-Z]{0,18}$/.test(this.drive.form.params.nodes[i].name) || !/^[1-9a-zA-Z]{0,18}$/.test(this.drive.form.params.nodes[i].sqlStr)) {this.$Message.error({content: 'NODE名称、发布标识填写18位以内英文、数字,不能为0...', duration: 3});    status = true;}

                }
                let arr = Object.keys(this.drive.form.params.nodes);
                //判断node是否有重名
                for(let i in this.drive.form.params.nodes) {
                    for(let j = arr.length-1;j > i ; j--) {
                        if(this.drive.form.params.nodes[i].name == this.drive.form.params.nodes[j].name || this.drive.form.params.nodes[i].sqlStr == this.drive.form.params.nodes[j].sqlStr) {
                            this.$Message.error({content: 'NODE名称、发布标识存在同名', duration: 3});    status = true;
                        }
                    }
                }
                for(let i in this.drive.form.params.users) {
                    if(this.drive.form.params.users[i].name === '' || this.drive.form.params.users[i].password === '') {
                        this.$Message.error({content: '请填写用户名、密码...', duration: 3});    status = true;
                    }else if(!/^[\da-zA-Z_]{0,30}$/.test(this.drive.form.params.users[i].name)) {this.$Message.error({content: '用户名填写30位以内英文、数字...', duration: 3});    status = true;}
                    else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.drive.form.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                }
                return status;
            },
            checkSocketDrive() {
                let status = false;
                if(this.drive.form.config.appId === '' || this.drive.form.config.enterpriseId === '' || this.drive.form.config.gatewayId === '' || this.drive.form.config.serviceId === ''
                    || this.drive.form.alarmRate === '' || this.drive.form.quotaRate === '') {
                    this.$Message.error({content: '请填写APP ID、企业编码、网关ID、SERVICE ID、告警频率、指标频率...', duration: 3});    status = true;
                }
                else if(!/^[1-9]\d{0,3}$/.test(this.drive.form.alarmRate) || !/^[1-9]\d{0,3}$/.test(this.drive.form.quotaRate)) {this.$Message.error({content: '告警频率、指标频率填写3位以内的数字,不能为0...', duration: 3});    status = true;}

                for(let i in this.drive.form.ipMap) {
                    if(this.drive.form.ipMap[i].cipherCode === '' || this.drive.form.ipMap[i].cipherIv === '' || this.drive.form.ipMap[i].encryptionType === '' || this.drive.form.ipMap[i].reportIp === '') {
                        this.$Message.error({content: '请填写加密密钥、向量IV、加密类型、上报地址...', duration: 3});    status = true;
                    }
                    else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.drive.form.ipMap[i].reportIp)) {this.$Message.error({content: '上报地址请填写正确的 IP:端口 格式...', duration: 3});    status = true;}
                }
                return status;
            },
            checkMqttDrive() {
                let status = false;
                if(this.drive.form.params.clientId === '' || this.drive.form.params.host === '' || this.drive.form.params.password === '' || this.drive.form.params.userName === '' || this.drive.form.params.port === '') {
                    this.$Message.error({content: '请填写客户端ID、上报IP地址、用户名、密码、端口...', duration: 3});    status = true;
                }
                else if(!/^[\da-zA-Z_]{0,30}$/.test(this.drive.form.params.userName) || !/^[\da-zA-Z_]{0,30}$/.test(this.drive.form.params.clientId)) {this.$Message.error({content: '客户端ID、用户名填写30位以内英文、数字...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.drive.form.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                // else if(!/^([1-9]|[1-5]\d{4}|6[1-4]\d{3}|65[1-4]\d{2}|655[1-2]\d|6553[1-5])$/.test(this.drive.form.params.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                else if(!/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.drive.form.params.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}

                else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.drive.form.params.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}

                for(let i in this.drive.form.topics) {
                    if(this.drive.form.topics[i].name === '' || this.drive.form.topics[i].topic === '' || this.drive.form.topics[i].topicId === '') {
                        this.$Message.error({content: '请填写名称、发布标题、ID...', duration: 3});    status = true;
                    }else if(!/^[\da-zA-Z]{0,30}$/.test(this.drive.form.topics[i].name) || !/^[\da-zA-Z]{0,30}$/.test(this.drive.form.topics[i].topicId)) {this.$Message.error({content: '名称、ID填写30位以内英文、数字...', duration: 3});    status = true;}
                }
                return status;
            },
            checkSQLDrive() {
                let status = false;
                if(this.drive.form.params.dbName === '' || this.drive.form.params.host === '' || this.drive.form.params.password === '' || this.drive.form.params.username === '' || this.drive.form.params.port === '') {
                    this.$Message.error({content: '请填写数据库名、IP、密码、端口、用户名...', duration: 3});    status = true;
                }
                else if(!/^[\da-zA-Z_./!@#$%^&*[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘]{0,30}$/.test(this.drive.form.params.username)) {this.$Message.error({content: '用户名填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.drive.form.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.drive.form.params.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.drive.form.params.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}
                return status;
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