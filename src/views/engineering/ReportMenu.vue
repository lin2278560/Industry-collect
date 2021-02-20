<template>
    <div style="min-width: 200px;height: 770px;float: left;border: 1px solid rgba(0,0,0,.2);box-shadow: 2px 3px 5px rgba(0,0,0,.3);border-radius: 4px;margin: 15px 0 0 20px;background-color: #fff;overflow:auto;">
        <div class="treesclass">
            <my-tree :data="theData" :name="menuName" :loading="loading" @getSubMenu="getSubMenu"></my-tree>
        </div>
        <ul class="dropdown-menu" id="msgRightMenu">
            <li><a id="adddepart" style="text-align:center;font-size: 12px;" @click="addChannel">新建通道...</a></li>
<!--            <li><a href="#" style="text-align:center;font-size: 12px;">复制其他通道对象</a></li>-->
        </ul>
        <ul class="dropdown-menu" id="msgRightMenu1">
            <li><a style="text-align:center;font-size: 12px;" @click="addDrive">新建驱动...</a></li>
            <li><a style="text-align:center;font-size: 12px;" @click="delChannel">删除通道...</a></li>
        </ul>
        <ul class="dropdown-menu" id="msgRightMenu2">
            <li><a style="text-align:center;font-size: 12px;" @click="delDrive">删除驱动...</a></li>
        </ul>

        <Modal
                title="通道"
                v-model="modal11" @on-ok="okAddChannel"
                class-name="vertical-center-modal" width="600" :styles="{top: '25%'}">
            <div style="width: 100%;height: 150px;">
            <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                <span style="background:#fff; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">基本信息</span>
                <div style="margin: 15px 10px;">
                    <div style="float: left;margin-bottom: 10px;width: 200px;text-align: right;">
                        <span style="margin-right: 15px;font-size: 12px;">名称:</span>
                        <Input v-model="channel.form.name" style="width: 130px;" />
                        <span style="color: red;margin-left: 5px;">*</span>
                    </div>
                    <div style="float: left;margin-left: 10px;width: 200px;text-align: right;">
                        <span style="margin-right: 15px;font-size: 12px;">描述:</span>
                        <Input v-model="channel.form.remark" style="width: 130px;" />
                    </div>
                </div>
            </div>
            <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                <span style="background:#fff; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">通道配置</span>
                <div style="margin: 15px 10px;">
                    <div style="float: left;margin-bottom: 10px;width: 190px;text-align: right;">
                        <span style="margin-right: 15px;font-size: 12px;">名称:</span>
                        <Input v-model="driver.form.name" style="width: 130px;" disabled />
                    </div>
                    <div style="float: left;margin-left: 10px;width: 285px;text-align: right;">
                        <span style="margin-right: 15px;font-size: 12px;">描述:</span>
                        <Input v-model="channel.form.driveType" style="width: 130px;margin-right: 10px;" disabled />
                        <Button size="small" @click="addPlatForm">选择协议</Button>
                    </div>
                </div>
            </div>
            </div>
            <div slot="footer">
                <Button type="text" size="large" @click="modal11 = false">取消</Button>
                <Button type="primary" size="large" @click="okAddChannel">确定</Button>
            </div>
        </Modal>

        <Modal
                title="请选择协议"
                v-model="modal12" @on-ok="okDriver"
                class-name="vertical-center-modal" width="900" :styles="{top: '15%'}">
            <div style="width: 100%;height: 350px;">
                <div style="width: 36%;margin-left: 50px;height: 350px;border: 1px solid rgba(0,0,0,.2);box-shadow: 2px 3px 5px rgba(0,0,0,.3);border-radius: 4px;float: left;overflow:auto;">
                    <Tree :data="data1" @on-select-change="selectChange"></Tree>
                </div>
                <div style="width: 30%;margin-left: 50px;float: left;">
                    <div style="margin-bottom: 20px;">
                        <span style="margin-right: 15px;font-size: 12px;">分类:</span>
                        <Input v-model="driver.form.classify" style="width: 170px;" disabled />
                    </div>
                    <div style="margin-bottom: 20px;">
                        <span style="margin-right: 15px;font-size: 12px;">名称:</span>
                        <Input v-model="driver.form.name" style="width: 170px;" disabled />
                    </div>
                    <div style="margin-bottom: 20px;">
                        <span style="margin-right: 15px;font-size: 12px;">厂家:</span>
                        <Input v-model="driver.form.manufacturer" style="width: 170px;" disabled />
                    </div>
                    <div style="margin-bottom: 20px;">
                        <span style="margin-right: 15px;font-size: 12px;">描述:</span>
                        <Input v-model="driver.form.driveType" style="width: 170px;" disabled />
                    </div>
                </div>
            </div>
        </Modal>

        <Modal
                title="驱动信息"
                v-model="modal13.show" @on-ok="okAddDrive"
                class-name="vertical-center-modal" width="900">
            <contentTabs :links="links"></contentTabs>

            <div v-if="modal13.driveType == 'OPC_UA_SERVER'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">OPC UA连接信息</span>
                <div style="margin: 15px 10px;">
                    <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;" :key="index" v-for="(d,index) in modal13.params">
                        <span style="margin-right: 20px;font-size: 12px;">{{d.name}}:</span>
                        <Input v-model="d.val" style="width: 130px;" />
<!--                        <span style="color: red;margin-left: 5px;">*</span>-->
                    </div>

                    <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">NODE节点</span>
                        <div style="margin: 15px 0 0 10px;float: left;" v-for="(d,index) in modal13.nodes_list" :key="index">
                            <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                                <span style="margin-right: 20px;font-size: 12px;">NODE名称:</span>
                                <Input v-model="d.nameVal" style="width: 130px;" />
                                <span style="color: red;margin-left: 5px;">*</span>
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                                <span style="margin-right: 20px;font-size: 12px;">NODE标识:</span>
                                <Input v-model="d.sqlStrVal" style="width: 100px;" />
                                <span style="color: red;margin-left: 5px;">*</span>
                            </div>
                            <Button style="float: left;margin-left: 10px;" v-if="index == 0" size="small" :disabled="add_nodes_disabled" @click="add_nodes">+</Button>
                            <Button style="float: left;margin-left: 10px;" v-if="index > 0" size="small" @click="del_nodes(index)">-</Button>
                        </div>
                    </div>

                    <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">用户</span>
                        <div style="margin: 15px 0 0 10px;float: left;" v-for="(d,index) in modal13.users_list" :key="index">
                            <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                                <span style="margin-right: 20px;font-size: 12px;">用户名:</span>
                                <Input v-model="d.nameVal" style="width: 130px;" />
                                <span style="color: red;margin-left: 5px;">*</span>
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                                <span style="margin-right: 20px;font-size: 12px;">密码:</span>
                                <Input type="password" v-model="d.passwordVal" style="width: 130px;" />
                                <span style="color: red;margin-left: 5px;">*</span>
                            </div>
                            <Button style="float: left;margin-left: 10px;" v-if="index == 0" size="small" :disabled="add_users_disabled" @click="add_users">+</Button>
                            <Button style="float: left;margin-left: 10px;" v-if="index > 0" size="small" @click="del_users(index)">-</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modal13.driveType == 'MQTT_CLIENT'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">发布消息配置</span>
                <div style="margin: 15px 0 0 10px;float: left;" v-for="(d,index) in modal13.params" :key="index">
                    <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                        <span style="margin-right: 20px;font-size: 12px;">发布名称:</span>
                        <Input v-model="d.nameVal" style="width: 130px;" />
                        <span style="color: red;margin-left: 5px;">*</span>
                    </div>
                    <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                        <span style="margin-right: 20px;font-size: 12px;">发布ID:</span>
                        <Input v-model="d.topicIdVal" style="width: 130px;" />
                        <span style="color: red;margin-left: 5px;">*</span>
                    </div>
                    <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                        <span style="margin-right: 20px;font-size: 12px;">发布标题:</span>
                        <Input v-model="d.topicVal" style="width: 130px;" />
                        <span style="color: red;margin-left: 5px;">*</span>
                    </div>
                    <Button style="float: left;margin-left: 10px;" v-if="index == 0" size="small" :disabled="add_mqtt_disabled" @click="add_params">+</Button>
                    <Button style="float: left;margin-left: 10px;" v-if="index > 0" size="small" @click="del_params(index)">-</Button>
                    <div style="float: left;margin-bottom: 10px;width: 250px;text-align: right;">
                        <span style="margin-right: 20px;font-size: 12px;">消息质量:</span>
                        <!--                        <Input v-model="d.qosVal" style="width: 150px;margin-right: 10px;" />-->
                        <Select v-model="d.qosVal" style="width:130px">
                            <Option value="0" key="0">最多一次,有可能重复或丢失</Option>
                            <Option value="1" key="1">至少一次,有可能重复</Option>
                            <Option value="2" key="2">只有一次,确保消息只到达一次</Option>
                        </Select>
<!--                        <span style="color: red;margin-left: 5px;">*</span>-->
                    </div>
                </div>
            </div>

            <div v-if="modal13.driveType == 'OPC_UA_UPLOAD'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">名称空间编号</span>
                <div style="margin: 15px 0 0 10px;float: left;">
                    <div style="float: left;margin: 0 0 10px 10px;">
<!--                        <span style="margin-right: 15px;font-size: 12px;">nameSpaceIndex:</span>-->
                        <Input v-model="modal13.val.nameSpaceIndex" disabled style="width: 130px;margin-left: 36px;" />
<!--                        <span style="color: red;margin-left: 5px;">*</span>-->
                    </div>
                </div>
            </div>

            <div v-if="modal13.driveType == 'SOCKET_CLIENT'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">SOCKET驱动信息</span>
                <div style="margin: 15px 10px;">
                    <div style="float: left;margin-bottom: 10px;width: 255px;text-align: right;margin-left:3px;">
                        <span style="margin-right: 15px;font-size: 12px;">告警上报频率/秒:</span>
                        <Input v-model="modal13.val.alarmRate" style="width: 130px;margin-right:10px;" />
                       <span style="color: red;margin-left: 10px;">&nbsp;</span>
                    </div>
                    <div style="float: left;margin-bottom: 10px;width: 255px;text-align: right;margin-left:6px;">
                        <span style="margin-right: 15px;font-size: 12px;">指标上报频率/秒:</span>
                        <Input v-model="modal13.val.quotaRate" style="width: 130px;margin-right:8px;" />
                       <span style="color: red;margin-left: 10px;">&nbsp;</span>
                    </div>
                    <div style="float: left;margin-bottom: 10px;width: 255px;text-align: right;margin-left:6px;">
                        <span style="margin-right: 15px;font-size: 12px;">上报格式类型:</span>
                        <Select v-model="modal13.val.reportType" style="width:130px;margin-right:0px;">
                            <Option value="WH" key="WH">危化</Option>
                            <Option value="AGY" key="AGY">安工院</Option>
                        </Select>
                       <span style="color: red;margin-left: 5px;">&nbsp;</span>
                    </div>

                    <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">
                        <span style="background:#fff; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">上报IP信息</span>
                        <div style="margin: 15px 0 0 27px;float: left;" v-for="(d,index) in modal13.params" :key="index">
                            <div style="float: left;margin-bottom: 10px;width: 230px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">上报地址:</span>
                                <Input v-model="d.reportIpVal" style="width: 130px;" />
                                <span style="color: red;margin-left: 5px;">*</span>
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 230px;text-align: right;margin-left:32px;">
                                <span style="margin-right: 15px;font-size: 12px;">向量IV:</span>
                                <Input v-model="d.cipherIvVal" style="width: 130px;" />
                                <span style="color: red;margin-left: 5px;">*</span>
                            </div>
                            <div style="float: left;margin-bottom: 10px;width: 230px;text-align: right;margin-left:30px;">
                                <span style="margin-right: 15px;font-size: 12px;">加密密钥:</span>
                                <Input v-model="d.cipherCodeVal" style="width: 130px;" />
                                <span style="color: red;margin-left: 5px;">*</span>
                            </div>
<!--                            <Button style="float: left;margin-left: 30px;" size="small" type="warning" :loading="loading" @click="is_Connect(index)">连接测试</Button>-->
                            <Button style="float: left;margin-left: 10px;margin-top:2px:" v-if="index == 0"  @click="add_params">+</Button>
                            <Button style="float: left;margin-left: 10px;margin-top:2px:" v-if="index > 0"  @click="del_params(index)">-</Button>
                            <div style="float: left;margin-bottom: 10px;width: 230px;text-align: right;">
                                <span style="margin-right: 15px;font-size: 12px;">加密类型:</span>
                                <Select v-model="d.encryptionTypeVal" style="width:130px">
                                    <Option value="AES128" key="AES128">AES128</Option>
                                    <Option value="AES256" key="AES256">AES256</Option>
                                </Select>
                                <span style="color: red;margin-left: 5px;">&nbsp;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
<!--            <Button v-if="modal13.driveType == 'OPC_UA_UPLOAD' || modal13.driveType == 'MQTT_CLIENT' || modal13.driveType == 'SQL'" size="small" type="warning" :loading="loading" @click="is_Connect">连接测试</Button>-->
            <div slot="footer">
                <Button type="text" size="large" @click="modal13.show = false">取消</Button>
                <Button type="primary" size="large" @click="okAddDrive">确定</Button>
            </div>
        </Modal>

<!--        <Modal-->
<!--                title="驱动信息"-->
<!--                v-model="modal14.show" @on-ok="okAddDrive"-->
<!--                class-name="vertical-center-modal" width="600">-->
<!--            <contentTabs :links="links"></contentTabs>-->
<!--        </Modal>-->

    </div>
</template>
<script>
    import myTree from "./treeMenu";
    import contentTabs from "./ContentTabs";
    export default {
        name: "ReportMenu",
        inject: ["reload"],
        components: {
            myTree,contentTabs
        },
        data() {
            return {
                theData: [],
                data: [],
                menuName: "menuName", // 显示菜单名称的属性
                item: {},
                switch1: false,
                loading: false,
                modal11: false,
                modal12: false,
                // modal14: false,
                test1: false,
                channel: {
                    form: {
                        name: null,
                        remark: null,
                        name: null,
                        driveType: null,
                        // statute: null
                    }
                },
                driver: {
                    form: {
                        classify: null,
                        driveType: null,
                        manufacturer: null
                        // statute: null
                    }
                },
                modal13: {
                    show: false,
                    url: null,
                    driveType: null,
                    data: {},
                    params: [],
                    nodes_list: [],
                    users_list: [],
                    val: {nameSpaceIndex: 2,alarmRate: 3,quotaRate: 3,reportType: 'WH'}
                },
                modal14: {
                    show: false,
                    url: null,
                    data: {}
                },
                driveUrl: null,
                add_users_disabled: false,//禁用添加用户按钮
                add_nodes_disabled: false,//禁用添加NODE按钮
                add_mqtt_disabled: false,//禁用添加mqtt按钮
            links: [
                    {title: "基本配置", child: [{name: "名称", input: true, swith: false, val: "test"},{name: "是否开启", input: false, swith: true, val: "test1"}]},
                    {title: "通道配置", child: [{name: "名称", input: true, swith: false, val: "test3"}]}
                ],
                data1: [
                    {
                        title: '行业标准',
                        expand: false,
                        children: [
                            {title: 'OPC-DA-UPLOAD', expand: true, driveType: 'OPC_DA_UPLOAD', manufacturer: '通用协议'},
                            {title: 'OPC-UA-UPLOAD', expand: true, driveType: 'OPC_UA_UPLOAD', manufacturer: '通用协议'},
                            {title: 'OPC-UA-SERVER', expand: true, driveType: 'OPC_UA_SERVER', manufacturer: '通用协议'},
                            {title: 'SOCKET', expand: true, driveType: 'SOCKET_CLIENT', manufacturer: '通用协议'},
                            {title: 'MQTT', expand: true, driveType: 'MQTT_CLIENT', manufacturer: 'IBM'},
                            {title: 'SQL', expand: true, driveType: 'SQL', manufacturer: '通用协议'}
                        ]
                    }
                ]
            };
        },
        created() {
            this.showData();
        },
        mounted() {

        },
        methods: {
            //获取到 树体传来的数据
            getSubMenu(item, index) {
                if(JSON.stringify(item) != undefined) {
                    this.item = item;
                }
            },
            async findChannel() {
                let res =  await this.$https.fetchGet(this.$api.upload.channelInfo.url);
                return res;
            },
            async findDrive(data) {
                let arr = data;

                for(let i in arr[0].children) {
                    let driveType = arr[0].children[i].driveType;
                    if(driveType == "OPC_UA_SERVER") {
                        this.driveUrl = this.$api.upload.drive.uaServer.url
                    }else if(driveType == "OPC_UA_UPLOAD") {
                        this.driveUrl = this.$api.upload.drive.uaUpload.url;
                    }else if(driveType == "OPC_DA_UPLOAD") {
                        this.driveUrl = this.$api.upload.drive.daUpload.url;
                    }else if(driveType == "SOCKET_CLIENT") {
                        this.driveUrl = this.$api.upload.drive.socket.url;
                    }else if(driveType == "MQTT_CLIENT") {
                        this.driveUrl = this.$api.upload.drive.mqtt.url;
                    }else if(driveType == "SQL") {
                        this.driveUrl = this.$api.upload.drive.sql.url;
                    }
                    let resp =  await this.$https.fetchGet(this.driveUrl+"/findDrive/"+arr[0].children[i].uuid)

                    for(let j in resp.data.data) {
                        arr[0].children[i].children.push({id: "30",menuName: resp.data.data[j].name,uuid: resp.data.data[j].uuid,remark: resp.data.data[j].remark,enable: resp.data.data[j].enable,driveType: driveType});
                    }
                }
                return arr;
            },
            showData(){
                this.findChannel().then((resp) => {
                    let data = [{id: "10", menuName: "转发服务", menuCode: "20", children: []}];
                    for(let i in resp.data.data) {
                        data[0].children.push({id: "20",menuName: resp.data.data[i].name,uuid: resp.data.data[i].uuid,driveType: resp.data.data[i].driveType,children: [],remark: resp.data.data[i].remark,enable: resp.data.data[i].enable});
                    }
                    this.findDrive(data).then((resp) => {
                        this.theData = resp;
                    });
                });
            },
            addChannel() {
                this.modal11 = !this.modal11;
                var index = this.theData[0].children.length + 1;
                this.channel.form.name = "通道C"+index;
                // this.channel.form.desc = "描述";
            },
            addPlatForm() {
                this.modal12 = !this.modal12;
            },
            //编写link，使用link分发选择dom元素，生成各个驱动配置中动态的配置参数
            addDrive() {
                if(this.item.driveType == 'OPC_UA_SERVER' && this.item.children.length > 0 || this.item.driveType == 'SOCKET_CLIENT' && this.item.children.length > 0) {
                    this.$Notice.error({title: '驱动配置失败', desc: "该协议只能添加一个驱动配置信息", duration: 3});
                }else {
                    this.modal13.show = !this.modal13.show;
                }

                this.links = [
                    {title: "基本信息", data: "base", child: [
                            {name: "名称", input: true, sign: true, data: "name", val: ''},
                            {name: "描述", input: true, data: "remark", val: ''},
                            {name: "状态", swith: true, data: "enable", val: true},
                        ]}
                ];
                if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT" || this.item.driveType == "OPC_UA_UPLOAD" || this.item.driveType == "OPC_DA_UPLOAD" || this.item.driveType == "SQL") {
                    this.links.push(
                        {title: "配置信息", data: "loopUpload", child: [
                                {name: "上报间隔(秒)", input: true, data: "uploadInterval", val: '5'}
                            ]}
                    )
                }
                this.modal13.data = {
                    base: {channelUuid: null, enable: false, name: null, remark: null},
                    driveType: null,
                    loopUpload: {uploadInterval: 5}
                };
                this.modal13.data.base.channelUuid = this.item.uuid;
                this.modal13.data.driveType = this.item.driveType;
                this.modal13.driveType = this.item.driveType;
                if(this.item.driveType == "OPC_UA_SERVER") {
                    this.modal13.url = this.$api.upload.drive.uaServer.url;
                    this.modal13.params = [];
                    this.modal13.nodes_list = [];
                    this.modal13.users_list = [];
                    this.modal13.params.push({name: "服务浏览路径", local: "discovery", val: "/visec/descovery"},{name: "HTTP端口", local: "httpPort", val: "8443"},{name: "服务路径", local: "path", val: "visec"}, {name: "根节点", local: "rootNode", val: "visecnode"},{name: "TCP端口", local: "tcpPort", val:"12686"});
                    this.modal13.nodes_list.push({nameVal: '',sqlStrVal: ''});
                    this.modal13.users_list.push({nameVal: '',passwordVal: ''});
                }else if(this.item.driveType == "MQTT_CLIENT") {
                    this.modal13.url = this.$api.upload.drive.mqtt.url;
                    this.links.push(
                        {title: "MQTT连接信息", data: "params", child: [
                                {name: "上报IP地址", input: true, sign: true, data: "host", val: ''},{name: "端口", input: true, sign: true, data: "port", val: ''},{name: "用户名", input: true, sign: true, data: "userName", val: ''},
                                {name: "密码", pwd: true, sign: true, data: "password", val: ''},{name: "客户端ID", input: true, sign: true, data: "clientId", val: ''},
                            ]},
                    );
                    this.modal13.params = [];
                    this.modal13.params.push({nameVal: '',qosVal: '0',topicVal: '',topicIdVal: ''});
                    this.modal13.data.params = {clientId: null,host: null,password: null,port: null,userName: null};
                }else if(this.item.driveType == "OPC_UA_UPLOAD") {
                    this.modal13.url = this.$api.upload.drive.uaUpload.url;
                    this.links.push(
                        {title: "OPC UA连接信息", data: "params", child: [
                                {name: "用户名", input: true, sign: true, data: "user", val: ''},{name: "密码", pwd: true, sign: true, data: "password", val: ''},{name: "url", input: true, sign: true, data: "url", val: 'opc.tcp://'},
                                {name: "安全模式", select: true, data: "securitypolicy", val: 'none', cityList: [
                                        {name: 'none',val: 'none'},{name: 'basic128rsa15',val: 'basic128rsa15'},{name: 'basic256',val: 'basic256'},{name: 'basic256sha256',val: 'basic256sha256'},{name: 'aes128_sha256_rsaOaep',val: 'aes128_sha256_rsaOaep'},
                                        {name: 'aes256_sha256_rsapss',val: 'aes256_sha256_rsapss'}]}

                            ]}
                    );
                    this.modal13.data.params = {password: null,securitypolicy: null,url: null,user: null};
                }else if(this.item.driveType == "OPC_DA_UPLOAD") {
                    this.modal13.url = this.$api.upload.drive.daUpload.url;
                    this.links.push(
                        {title: "OPC DA连接信息", data: "params", child: [
                            {name: "连接类型", select: true, data: "conntype", val: 2, cityList: [
                            {name: '服务名称',val: 2},{name: 'CLSID',val: 1}]},
                            {name: "服务器名称", input: true, sign: false, data: "progid", val: ''},
                            {name: "服务器IP地址", input: true, sign: true, data: "host", val: ''},
                            {name: "服务器用户名", input: true, sign: false, data: "user", val: ''},
                            {name: "服务器密码", pwd: true, sign: false, data: "password", val: ''},
                            {name: "超时时间(毫秒)", input: true, sign: true, data: "timeout", val: '3000'},
                        ]}
                    );
                    this.modal13.data.params = {password: null,progid: null,host: null,user: null,timeout: null,conntype: null,};
                }else if(this.item.driveType == "SOCKET_CLIENT") {
                    this.modal13.url = this.$api.upload.drive.socket.url;
                    this.links.push(
                        {title: "SOCKET基本配置", data: "config", child: [
                                {name: "APP ID", input: true, sign: true, data: "appId", val: ''},{name: "SERVICE ID", input: true, sign: true, data: "serviceId", val: ''},
                                {name: "网关ID", input: true, sign: true, data: "gatewayId", val: ''},{name: "企业编码", input: true, sign: true, data: "enterpriseId", val: ''}

                            ]}
                    );
                    this.modal13.params = [];
                    this.modal13.params.push({cipherCodeVal: '',cipherIvVal: '',encryptionTypeVal: 'AES128',reportIpVal: ''});
                    this.modal13.data.config = {appId: null,enterpriseId: null,gatewayId: null,serviceId: null};
                }else if(this.item.driveType == "SQL") {
                    this.modal13.url = this.$api.upload.drive.sql.url;
                    this.links.push(
                        {title: "SQL连接信息", data: "params", child: [
                                {name: "数据库名", input: true, sign: true, data: "dbName", val: ''},{name: "IP", input: true, sign: true, data: "host", val: ''},{name: "端口", input: true, sign: true, data: "port", val: ''},
                                {name: "用户名", input: true, sign: true, data: "username", val: ''},{name: "密码", pwd: true, sign: true, data: "password", val: ''},
                                {name: "SQL驱动类型", select: true, data: "type", val: 'MySQL', cityList: [{name: 'MySQL',val: 'MySQL'},{name: 'SQLSERVER',val: 'SQLSERVER'},{name: 'ORACLE',val: 'ORACLE'}]}
                            ]}
                    );
                    this.modal13.data.params = {dbName: null,host: null,password: null,port: null,type: null,username: null};
                }
            },
            add_nodes() {
                if(this.modal13.nodes_list.length >= 10) this.add_nodes_disabled = true;
                else this.modal13.nodes_list.push({});
            },
            del_nodes(index) {
                this.add_nodes_disabled = false;
                this.modal13.nodes_list.splice(index,1);
            },
            add_users() {
                if(this.modal13.users_list.length >= 5) this.add_users_disabled = true;
                else this.modal13.users_list.push({});
            },
            del_users(index) {
                this.add_users_disabled = false;
                this.modal13.users_list.splice(index,1);
            },
            add_params() {
                if(this.modal13.params.length >= 10) this.add_mqtt_disabled = true;
                else this.modal13.params.push({});
            },
            del_params(index) {
                this.add_mqtt_disabled = false;
                this.modal13.params.splice(index,1);
            },
            selectChange (selectedList) {
                const node = selectedList[selectedList.length - 1] // 获取当前点击的节点
                this.driver.form.driveType = node.driveType;
                this.driver.form.name = node.title;

                this.driver.form.manufacturer = node.manufacturer;
                if(node.nodeKey >= 1 && node.nodeKey <= 18) {
                    this.driver.form.classify = "行业标准";
                }else if(node.nodeKey >= 20) {
                    this.driver.form.classify = "PLC系列";
                }else if(node.nodeKey == 0 || node.nodeKey == 19) {
                    this.driver.form.classify = null;
                    this.driver.form.driveType = null;
                    this.driver.form.manufacturer = null;
                }
            },
            okDriver() {
                this.channel.form.driveType = this.driver.form.driveType;
            },
            okAddChannel() {
                let num = 0;
                for(let i in this.theData[0].children) {
                    if(this.channel.form.driveType == 'OPC_UA_SERVER' && this.theData[0].children[i].driveType == this.channel.form.driveType || this.channel.form.driveType == 'SOCKET_CLIENT' && this.theData[0].children[i].driveType == this.channel.form.driveType) {
                        this.$Notice.error({title: '通道配置失败', desc: "该协议只能添加一个通道配置信息", duration: 3});
                        num ++;
                        break;
                    }
                }
                let status = this.checkChannel();
                if(status == false && num == 0) {
                    this.modal11 = false;
                    this.$https.fetchPost(this.$api.upload.addChannel.url, this.channel.form).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '通道配置成功', desc: "正在刷新界面", duration: 3});
                            this.showData();
                            this.reload();
                        } else
                            this.$Notice.error({title: '通道配置失败', desc: resp.data.describe, duration: 3});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 3});
                        console.log(err)
                    });
                }
                // if(num == 0) {
                //     this.$https.fetchPost(this.$api.upload.addChannel.url, this.channel.form).then((resp) => {
                //         if (resp.data.code == 200) {
                //             this.$Notice.success({title: '通道配置成功', desc: "正在刷新界面", duration: 3});
                //             this.showData();
                //         } else
                //             this.$Notice.error({title: '通道配置失败', desc: "错误代码：" + resp.data.describe, duration: 3});
                //     }).catch(err => {
                //         this.$Notice.error({title: '请求失败', desc: err, duration: 3});
                //         console.log(err)
                //     });
                // }
            },
            delChannel() {
                this.$https.fetchPost(this.$api.upload.delChannel.url+"/"+this.item.uuid).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '通道删除成功', desc: "正在刷新界面", duration: 3});
                        this.showData();
                        this.reload();
                        this.$router.push({ path: "/engineering/reportingService" });
                    } else
                        this.$Notice.error({title: '通道删除失败', desc: resp.data.describe, duration: 3});
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', duration: 3});
                    console.log(err)
                });
            },
            // okAddDrive() {
            //     console.log(this.links);
            //     for(let i in this.links) {
            //         for(let j in this.links[i].child) {
            //             var data = this.links[i].data;
            //             var name = this.links[i].child[j].data;
            //             if(name == "enable" && this.links[i].child[j].val == null) {
            //                 this.links[i].child[j].val = false;
            //             }
            //             if(this.links[i].child[j].arr) {
            //                 for(let z in this.links[i].child[j].child) {
            //                     var name1 = this.links[i].child[j].child[z].data;
            //                     if(this.links[i].child[j].child[z].arr) {
            //                         for(let x in this.links[i].child[j].child[z].child) {
            //                             var name2 = this.links[i].child[j].child[z].child[x].data;
            //                             this.modal14.data[data][name][name1][name2] = this.links[i].child[j].child[z].child[x].val;
            //                         }
            //                     }else {
            //                         this.modal14.data[data][name][name1] = this.links[i].child[j].child[z].val;
            //                     }
            //                 }
            //             }else {
            //                 this.modal14.data[data][name] = this.links[i].child[j].val;
            //             }
            //         }
            //     }
            //     this.modal14.data.base.channelUuid = this.item.uuid;
            //     this.modal14.data.driveType = this.item.driveType;
            //     console.log(this.modal14.data);
            //     this.$https.fetchPost(this.modal14.url, this.modal14.data).then((resp) => {
            //         if (resp.data.code == 200) {
            //             this.$Notice.success({title: '驱动配置成功', desc: "正在刷新界面", duration: 2.5});
            //             // this.$storage.setStorage("getChannelUUID", this.item.uuid);
            //             // this.$storage.setStorage("getDrveName", this.modal14.data.base.name);
            //             // location.reload();
            //             this.showData();
            //         } else
            //             this.$Notice.error({title: '驱动配置失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
            //     }).catch(err => {
            //         this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
            //         console.log(err)
            //     });
            // },
            delDrive() {
                this.$https.fetchDelete(this.driveUrl+"/"+this.item.uuid).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '驱动删除成功', desc: "正在刷新界面", duration: 2.5});
                        // location.reload();
                        this.showData();
                        this.$router.push({ path: "/engineering/reportingService" });
                    } else
                        this.$Notice.error({title: '驱动删除失败', desc: resp.data.describe, duration: 2.5});
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', duration: 2.5});
                    console.log(err)
                });
            },
            //新建驱动提交信息
            okAddDrive() {
                for(let i in this.links) {
                    for(let j in this.links[i].child) {
                        let data = this.links[i].data;
                        let name = this.links[i].child[j].data;
                        this.modal13.data[data][name] = this.links[i].child[j].val;
                    }
                }

                let status = this.checkDrive();
                let status1 = null;

                if(this.modal13.driveType == "OPC_UA_SERVER") {
                    let nodes = {};
                    let users = {};

                    for(let i in this.modal13.nodes_list) {
                        nodes[i] = {name: '', sqlStr: ''};
                    }
                    for(let i in this.modal13.users_list) {
                        users[i] = {name: '', password: ''};
                    }
                    this.modal13.data.params = {discovery: null, httpPort: null, path: null, rootNode: null, tcpPort: null, nodes , users};

                    for(let i in this.modal13.params) {
                        let local = this.modal13.params[i].local;
                        this.modal13.data.params[local] = this.modal13.params[i].val;
                    }
                    for(let i in this.modal13.nodes_list) {
                        this.modal13.data.params.nodes[i].name = this.modal13.nodes_list[i].nameVal;
                        this.modal13.data.params.nodes[i].sqlStr = this.modal13.nodes_list[i].sqlStrVal;
                    }
                    let str = {};
                    for(let i in this.modal13.users_list) {
                        this.modal13.data.params.users[i].name = this.modal13.users_list[i].nameVal;
                        this.modal13.data.params.users[i].password = this.modal13.users_list[i].passwordVal;
                        let name = this.modal13.data.params.users[i].name;
                        str[name] = this.modal13.data.params.users[i];
                    }
                    this.modal13.data.params.users = str;

                    status1 = this.checkServerDrive();


                }else if(this.modal13.driveType == "OPC_UA_UPLOAD") {
                    this.modal13.data.nameSpaceIndex = this.modal13.val.nameSpaceIndex;

                    status1 = this.checkUploadDrive();


                }else if(this.modal13.driveType == "OPC_DA_UPLOAD") {

                    status1 = this.checkDaUploadDrive();


                }else if(this.modal13.driveType == "SOCKET_CLIENT") {
                    let ipMap = {};
                    for(let i in this.modal13.params) {
                        ipMap[i] = {cipherCode: '',cipherIv: '',encryptionType: 'AES128',reportIp: ''};
                    }
                    this.modal13.data.alarmRate = this.modal13.val.alarmRate;
                    this.modal13.data.ipMap = ipMap;
                    this.modal13.data.quotaRate = this.modal13.val.quotaRate;
                    this.modal13.data.reportType = this.modal13.val.reportType;
                    for(let i in this.modal13.params) {
                        this.modal13.data.ipMap[i].cipherCode = this.modal13.params[i].cipherCodeVal;
                        this.modal13.data.ipMap[i].cipherIv = this.modal13.params[i].cipherIvVal;
                        this.modal13.data.ipMap[i].encryptionType = this.modal13.params[i].encryptionTypeVal;
                        this.modal13.data.ipMap[i].reportIp = this.modal13.params[i].reportIpVal;
                    }

                    status1 = this.checkSocketDrive();


                }else if(this.modal13.driveType == "MQTT_CLIENT") {
                    let topics = {};
                    for(let i in this.modal13.params) {
                        topics[i] = {name: '',qos: '',topic: '',topicId: ''};
                    }
                    this.modal13.data.topics = topics;
                    for(let i in this.modal13.params) {
                        this.modal13.data.topics[i].name = this.modal13.params[i].nameVal;
                        this.modal13.data.topics[i].qos = this.modal13.params[i].qosVal;
                        this.modal13.data.topics[i].topic = this.modal13.params[i].topicVal;
                        this.modal13.data.topics[i].topicId = this.modal13.params[i].topicIdVal;
                    }

                    status1 = this.checkMqttDrive();

                }else if(this.modal13.driveType == 'SQL') {
                    status1 = this.checkSQLDrive();

                }
                if(status == false && status1 == false) {
                    this.modal13.show = false;
                    this.$https.fetchPost(this.modal13.url+"/addDrive", this.modal13.data).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '驱动配置成功', desc: "正在刷新界面", duration: 2.5});
                            this.showData();
                        } else
                            this.$Notice.error({title: '驱动配置失败', desc: resp.data.describe, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 2.5});
                        console.log(err)
                    });
                }
                // this.$https.fetchPost(this.modal13.url+"/addDrive", this.modal13.data).then((resp) => {
                //     if (resp.data.code == 200) {
                //         this.$Notice.success({title: '驱动配置成功', desc: "正在刷新界面", duration: 2.5});
                //         this.showData();
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
                if(this.modal13.driveType == "OPC_UA_UPLOAD") {
                    data = {password: this.links[2].child[1].val,securitypolicy: this.links[2].child[3].val,url: this.links[2].child[2].val,
                        user: this.links[2].child[0].val}
                }else if(this.modal13.driveType == "OPC_UA_UPLOAD") {
                    data = {password: this.links[2].child[1].val,securitypolicy: this.links[2].child[3].val,url: this.links[2].child[2].val,
                        user: this.links[2].child[0].val}
                }else if(this.modal13.driveType == "SOCKET_CLIENT") {
                    data = {ipPort: this.modal13.params[index].reportIpVal}
                }else if(this.modal13.driveType == "MQTT_CLIENT") {
                    data = {clientId: this.links[2].child[4].val, host: this.links[2].child[0].val, password: this.links[2].child[3].val,
                        port: this.links[2].child[1].val, userName: this.links[2].child[2].val}
                }else if(this.modal13.driveType == "SQL") {
                    data = {dbName: this.links[2].child[0].val, host: this.links[2].child[1].val, password: this.links[2].child[4].val,
                        port: this.links[2].child[2].val, type: this.links[2].child[5].val, username: this.links[2].child[3].val}
                }
                this.$https.fetchPost(this.modal13.url+"/isConnect", data).then((resp) => {
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
            checkChannel() {
                let status = false;
                if(this.channel.form.name == null || this.channel.form.driveType == null) {this.$Message.error({content: '请填写通道名称或者通道驱动...', duration: 3});    status = true;}
                return status;
            },
            checkDrive() {
                let status = false;
                if(this.modal13.data.base.name === '' || this.modal13.data.loopUpload.uploadInterval === '') {this.$Message.error({content: '请填写驱动名称或者间隔时间...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{0,2}$/.test(this.modal13.data.loopUpload.uploadInterval)) {this.$Message.error({content: '间隔时间填写1-999之间的数字...', duration: 3});    status = true;}
                else if(!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.modal13.data.base.name)) {this.$Message.error({content: '驱动名称不允许特殊符号...', duration: 3});    status = true;}
                return status;
            },
            //检查DaUpload驱动参数
            checkDaUploadDrive() {
                let status = false;
                
                // if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,50}$/.test(this.modal13.data.params.progid)) {this.$Message.error({content: '服务器名称填写50位以内英文、数字或中文...', duration: 3});    status = true;}
                if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.modal13.data.params.host)) {this.$Message.error({content: '服务器IP地址请填写正确的IP格式...', duration: 3});    status = true;}
                // else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.modal13.data.params.user)) {this.$Message.error({content: '服务器用户名填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                // else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.modal13.data.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{0,7}$/.test(this.modal13.data.params.timeout)) {this.$Message.error({content: '超时时间填写1-99999999之间的数字...', duration: 3});    status = true;}
                return status;
            },
            checkUploadDrive() {
                let status = false;
                if(this.modal13.data.params.password === '' || this.modal13.data.params.user === '' || this.modal13.data.params.url === '' || this.modal13.data.nameSpaceIndex === '') {this.$Message.error({content: '请填写用户名、密码、URL、名称空间编号...', duration: 3});    status = true;}

                else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.modal13.data.params.user)) {this.$Message.error({content: '用户名填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.modal13.data.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                return status;
            },
            checkServerDrive() {
                let status = false;
                if(this.modal13.data.params.discovery === '' || this.modal13.data.params.httpPort === '' || this.modal13.data.params.path === '' || this.modal13.data.params.rootNode === '' || this.modal13.data.params.tcpPort === '') {
                    this.$Message.error({content: '请填写HTTP端口、TCP端口、服务路径、服务浏览路径、根节点...', duration: 3});    status = true;
                }else if(!/^[1-9]\d{0,5}$/.test(this.modal13.data.params.httpPort) || !/^[1-9]\d{0,5}$/.test(this.modal13.data.params.tcpPort)) {this.$Message.error({content: 'HTTP端口、TCP端口填写5位以内的数字,不能为0...', duration: 3});    status = true;}
                else if(!/^[A-Za-z1-9]{0,18}$/.test(this.modal13.data.params.path) || !/^[A-Za-z1-9]{0,18}$/.test(this.modal13.data.params.rootNode)) {this.$Message.error({content: '服务路径、根路径填写18位以内的数字与英文,不能为0...', duration: 3});    status = true;}
                else if(!/^[A-Za-z1-9/]{0,24}$/.test(this.modal13.data.params.discovery)) {this.$Message.error({content: '服务浏览路径填写24位以内的数字与英文,不能为0...', duration: 3});    status = true;}

                for(let i in this.modal13.data.params.nodes) {
                    if(this.modal13.data.params.nodes[i].name === '' || this.modal13.data.params.nodes[i].sqlStr === '') {
                        this.$Message.error({content: '请填写NODE名称、发布标识...', duration: 3});    status = true;
                    }else if(!/^[1-9a-zA-Z]{0,18}$/.test(this.modal13.data.params.nodes[i].name) || !/^[1-9a-zA-Z]{0,18}$/.test(this.modal13.data.params.nodes[i].sqlStr)) {this.$Message.error({content: 'NODE名称、发布标识填写18位以内英文、数字,不能为0...', duration: 3});    status = true;}

                }
                for(let i in this.modal13.data.params.users) {
                    if(this.modal13.data.params.users[i].name === '' || this.modal13.data.params.users[i].password === '') {
                        this.$Message.error({content: '请填写用户名、密码...', duration: 3});    status = true;
                    }else if(!/^[\da-zA-Z_]{0,30}$/.test(this.modal13.data.params.users[i].name)) {this.$Message.error({content: '用户名填写30位以内英文、数字...', duration: 3});    status = true;}
                    else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.modal13.data.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                }
                return status;
            },
            checkSocketDrive() {
                let status = false;
                if(this.modal13.data.config.appId === '' || this.modal13.data.config.enterpriseId === '' || this.modal13.data.config.gatewayId === '' || this.modal13.data.config.serviceId === ''
                    || this.modal13.data.alarmRate === '' || this.modal13.data.quotaRate === '') {
                    this.$Message.error({content: '请填写APP ID、企业编码、网关ID、SERVICE ID、告警频率、指标频率...', duration: 3});    status = true;
                }
                else if(!/^[1-9]\d{0,3}$/.test(this.modal13.data.alarmRate) || !/^[1-9]\d{0,3}$/.test(this.modal13.data.quotaRate)) {this.$Message.error({content: '告警频率、指标频率填写3位以内的数字,不能为0...', duration: 3});    status = true;}

                for(let i in this.modal13.data.ipMap) {
                    if(this.modal13.data.ipMap[i].cipherCode === '' || this.modal13.data.ipMap[i].cipherIv === '' || this.modal13.data.ipMap[i].encryptionType === '' || this.modal13.data.ipMap[i].reportIp === '') {
                        this.$Message.error({content: '请填写加密密钥、向量IV、加密类型、上报地址...', duration: 3});    status = true;
                    }
                    else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.modal13.data.ipMap[i].reportIp)) {this.$Message.error({content: '上报地址请填写正确的 IP:端口 格式...', duration: 3});    status = true;}
                }
                return status;
            },
            checkMqttDrive() {
                let status = false;
                if(this.modal13.data.params.clientId === '' || this.modal13.data.params.host === '' || this.modal13.data.params.password === '' || this.modal13.data.params.userName === '' || this.modal13.data.params.port === '') {
                    this.$Message.error({content: '请填写客户端ID、上报IP地址、用户名、密码、端口...', duration: 3});    status = true;
                }
                else if(!/^[\da-zA-Z_]{0,30}$/.test(this.modal13.data.params.userName) || !/^[\da-zA-Z_]{0,30}$/.test(this.modal13.data.params.clientId)) {this.$Message.error({content: '客户端ID、用户名填写18位以内英文、数字...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.modal13.data.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                // else if(!/^([1-9]|[1-5]\d{4}|6[1-4]\d{3}|65[1-4]\d{2}|655[1-2]\d|6553[1-5])$/.test(this.modal13.data.params.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                else if(!/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.modal13.data.params.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                // /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/;
                // /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/


                else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.modal13.data.params.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}

                // for(let i in this.modal13.data.topics) {
                //     if(this.modal13.data.topics[i].name === '' || this.modal13.data.topics[i].topic === '' || this.modal13.data.topics[i].topicId === '') {
                //         this.$Message.error({content: '请填写名称、发布标题、ID...', duration: 3});    status = true;
                //     }else if(!/^[\da-zA-Z]{0,30}$/.test(this.modal13.data.topics[i].name) || !/^[\da-zA-Z]{0,30}$/.test(this.modal13.data.topics[i].topicId)) {this.$Message.error({content: '名称、ID填写30位以内英文、数字...', duration: 3});    status = true;}
                // }
                return status;
            },
            checkSQLDrive() {
                let status = false;
                if(this.modal13.data.params.dbName === '' || this.modal13.data.params.host === '' || this.modal13.data.params.password === '' || this.modal13.data.params.username === '' || this.modal13.data.params.port === '') {
                    this.$Message.error({content: '请填写数据库名、IP、密码、端口、用户名...', duration: 3});    status = true;
                }
                else if(!/^[\da-zA-Z_./!@#$%^&*[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘]{0,30}$/.test(this.modal13.data.params.username)) {this.$Message.error({content: '用户名填写30位以内英文、数字或特殊字符......', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.modal13.data.params.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.modal13.data.params.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.modal13.data.params.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}
                return status;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/deep/ .ivu-tree-title {
            display: inline-block;
            margin: 0;
            padding: 0 4px;
            border-radius: 3px;
            cursor: pointer;
            vertical-align: top;
            color: #515a6e;
            -webkit-transition: all .2s ease-in-out;
            transition: all .2s ease-in-out;
            font-size: 13px;
        }
      /deep/ .ivu-tree-arrow i {
                -webkit-transition: all .2s ease-in-out;
                transition: all .2s ease-in-out;
                font-size: 22px;
                vertical-align: middle;
            }  
         /deep/ .ivu-tree-arrow {
                cursor: pointer;
                width: 17px;
                text-align: center;
                display: inline-block;
            }  
</style>
