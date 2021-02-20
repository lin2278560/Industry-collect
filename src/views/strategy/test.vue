<template>
    <div style="min-width:200px;height: 850px;float: left;border: 1px solid rgba(0,0,0,.2);box-shadow: 2px 3px 5px rgba(0,0,0,.3);border-radius: 4px;margin: 15px 0 0 20px;background-color: #faf8f7;        overflow:auto;">
        <div class="treesclass">
            <my-tree :data="theData" :name="menuName" :loading="loading" @getSubMenu="getSubMenu"></my-tree>
        </div>
        <ul class="dropdown-menu" id="msgRightMenu">
            <li><a id="adddepart" style="text-align:center;font-size: 12px;" @click="addChannel">新建通道...</a></li>
<!--            <li><a href="#" style="text-align:center;font-size: 12px;">复制其他通道对象</a></li>-->
        </ul>
        <ul class="dropdown-menu" id="msgRightMenu1">
            <li><a style="text-align:center;font-size: 12px;" @click="addDrive">新建驱动...</a><!--// @click="addDepart" --></li>
            <li><a style="text-align:center;font-size: 12px;" @click="delChannel">删除通道...</a><!--// @click="addDepart" --></li>
        </ul>
        <ul class="dropdown-menu" id="msgRightMenu2">
            <li><a style="text-align:center;font-size: 12px;" @click="delDrive">删除驱动...</a><!--// @click="addDepart" --></li>
        </ul>

        <Modal
                title="通道"
                v-model="modal11" @on-ok="okAddChannel"
                class-name="vertical-center-modal" width="600" :styles="{top: '25%'}">
            <div style="width: 100%;height: 150px;">
            <div style="border:1px solid #666;width:100%;position:relative;float: left;margin: 10px 0;">
                <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">基本信息</span>
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
                <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">通道配置</span>
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
                class-name="vertical-center-modal" width="600" :styles="{top: '25%'}">
            <div style="width: 100%;height: 200px;">
                <div style="width: 36%;height: 200px;border: 1px solid rgba(0,0,0,.2);box-shadow: 2px 3px 5px rgba(0,0,0,.3);border-radius: 4px;float: left;overflow:auto;">
                    <Tree :data="data1" @on-select-change="selectChange"></Tree>
                </div>
                <div style="width: 50%;margin-left: 50px;float: left;">
                    <div style="margin-bottom: 10px;">
                        <span style="margin-right: 15px;font-size: 12px;">分类:</span>
                        <Input v-model="driver.form.classify" style="width: 170px;" disabled />
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="margin-right: 15px;font-size: 12px;">名称:</span>
                        <Input v-model="driver.form.name" style="width: 170px;" disabled />
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="margin-right: 15px;font-size: 12px;">厂家:</span>
                        <Input v-model="driver.form.manufacturer" style="width: 170px;" disabled />
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="margin-right: 15px;font-size: 12px;">描述:</span>
                        <Input v-model="driver.form.driveType" style="width: 170px;" disabled />
                    </div>
                </div>
            </div>
        </Modal>

        <Modal
                title="驱动信息"
                v-model="modal14.show" @on-ok="okAddDrive"
                class-name="vertical-center-modal" width="900" :styles="{top: '10%'}">
            <contentTabs :links="links"></contentTabs>
<!--            <div v-if="item.driveType == 'HJ'" style="border:1px solid #666;width:100%;position:relative;float: left;margin: 20px 0;">-->
<!--                <span style="background:#faf8f7; display:block; height:20px; width:120px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">设备名称</span>-->
<!--                <div style="margin: 15px 0 0 10px;float: left;">-->
<!--                    <div style="float: left;margin: 0 0 10px 10px;">-->
<!--                        <Input v-model="modal13.val.nameSpaceIndex" style="width: 130px;" />-->
<!--                        <span style="color: red;margin-left: 5px;">*</span>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
            <Button size="small" type="warning" :loading="loading" @click="is_Connect">连接测试</Button>
            <div slot="footer">
                <Button type="text" size="large" @click="modal14.show = false">取消</Button>
                <Button type="primary" size="large" @click="okAddDrive">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
    import myTree from "./treeMenu";
    import contentTabs from "./ContentTabs";
    import Utils from '../../components/test.js';
    export default {
        name: "test",
        inject: ["reload"],
        components: {
            myTree,contentTabs
        },
        data() {
            return {
                theData: [],
                menuName: "menuName", // 显示菜单名称的属性
                item: {},
                index: null,
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
                        driveType: null
                    }
                },
                driver: {
                    form: {
                        classify: null,
                        driveType: null,
                        name: null,
                        manufacturer: null
                        // statute: null
                    }
                },
                modal14: {
                    show: false,
                    url: null,
                    data: {
                        // base: {
                        //     channelUuid: null,
                        //     enable: false,
                        //     name: null,
                        //     remark: null
                        // },
                        // loopCollect: {
                        //     collectInterval: null,
                        // },
                        // serialPars: {
                        //     baudRate: null,
                        //     dataBits: null,
                        //     device: null,
                        //     parity: null,
                        //     stopBits: null,
                        //     timeOut: null
                        // }
                    }
                },
                links: [
                    {title: "基本配置", child: [{name: "名称", input: true, swith: false, val: "test"},{name: "是否开启", input: false, swith: true, val: "test1"}]},
                    {title: "通道配置", child: [{name: "名称", input: true, swith: false, val: "test3"}]}

                ],
                data1: [
                    {
                        title: '行业标准',
                        expand: false,
                        children: [
                            {title: 'CJ/T188-2018', expand: true, driveType: 'CJ', manufacturer: '城建188协议'},
                            {title: 'DL/T645-2007', expand: true, driveType: 'DL', manufacturer: '国标645协议'},
                            {title: 'HJ/T212-2017', expand: true, driveType: 'HJ', manufacturer: '环保212-2017协议'},
                            {title: 'DNP3.0', expand: true},
                            {title: 'IEC-101', expand: true},
                            {title: 'IEC-102', expand: true},
                            {title: 'IEC-103', expand: true},
                            {title: 'IEC-104', expand: true},
                            {title: 'Modbus-TCP', expand: true, driveType: 'MOD_BUS_TCP', manufacturer: '莫迪康'},
                            {title: 'Modbus-TCP从站推送', expand: true, driveType: 'MOD_BUS_TCP_SLAVE', manufacturer: '莫迪康'},
                            {title: 'Modbus-RTU', expand: true, driveType: 'MOD_BUS_RTU', manufacturer: '莫迪康'},
                            {title: 'Modbus-RTU从站推送', expand: true, driveType: 'MOD_BUS_RTU_SLAVE', manufacturer: '莫迪康'},
                            {title: 'Modbus-ASCII', expand: true, driveType: 'MOD_BUS_ASCII', manufacturer: '莫迪康'},
                            {title: 'Modbus-ASCII从站推送', expand: true, driveType: 'MOD_BUS_ASCII_SLAVE', manufacturer: '莫迪康'},
                            {title: 'OPC-DA', expand: true, driveType: 'OPC_DA', manufacturer: '通用协议'},
                            {title: 'OPC-DA桥接客户端', expand: true, driveType: 'OPC_DA_HTTP', manufacturer: '通用协议'},
                            {title: 'OPC-UA', expand: true, driveType: 'OPC_UA', manufacturer: '通用协议'},
                            {title: 'MQTT-SERVER', expand: true, driveType: 'MQTT_SERVER', manufacturer: 'IBM'}
                        ]
                    },
                    {
                        title: 'PLC系列',
                        expand: false,
                        children: [
                            {title: '和利时PLC', expand: true},
                            {title: '西门子S7-200', expand: true},
                            {title: '西门子S7-200-smart', expand: true},
                            {title: '西门子S7-300', expand: true},
                            {title: '西门子S7-400', expand: true},
                            {title: '西门子S7-1200', expand: true},
                            {title: 'OMRON欧姆龙HOST-LINK', expand: true},
                            {title: 'AB DF1串口协议', expand: true},
                            {title: 'AB-LOGIC-TCP', expand: true},
                            {title: 'AB ETHERENT/IP CIP协议', expand: true}
                        ]
                    }
                ]
            };
        },
        created() {
            this.showData();
        },
        mounted() {
            var that = this;
            Utils.$on('menuShowData', function (msg) {
                // console.log(msg);
                that.showData();
            })
        },
        methods: {
            //获取到 树体传来的数据
            getSubMenu(item, index) {
                if(JSON.stringify(item) != undefined) {
                    this.item = item;
                    this.index = index;
                }
            },
            async findChannel() {
                let res =  await this.$https.fetchGet(this.$api.collect.channelInfo.url);
                return res;
            },
            async findDrive(data) {
                let arr = data;
                for(let i in arr[0].children) {
                    let driveType = arr[0].children[i].driveType;
                    let resp =  await this.$https.fetchGet(this.$api.collect.drive.url+"/"+arr[0].children[i].uuid);
                    for(let j in resp.data.data) {
                        arr[0].children[i].children.push({id: "3",menuName: resp.data.data[j].name,uuid: resp.data.data[j].uuid,remark: resp.data.data[j].remark,enable: resp.data.data[j].enable,driveType: driveType});
                    }
                }
                return arr;
            },
            showData(){
                this.findChannel().then((resp) => {
                    let data = [{id: "1", menuName: "采集服务", menuCode: "10", children: []}];
                    for(let i in resp.data.data) {
                        data[0].children.push({id: "2",menuName: resp.data.data[i].name,uuid: resp.data.data[i].uuid,driveType: resp.data.data[i].driveType,children: [],remark: resp.data.data[i].remark});
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
            addDrive() {
                this.modal14.show = true;
                this.links = [
                    {title: "基本信息", data: "base", child: [
                            {name: "名称", input: true, sign: true, data: "name", val: ''},
                            {name: "描述", input: true, data: "remark", val: ''},
                            {name: "状态", swith: true, data: "enable", val: true},
                        ]},
                    {title: "Debug模式", data: "debug", child: [
                            {name: "状态", swith: true, data: "debug", val: false},
                        ]},
                    {title: "配置信息", data: "loopCollect", child: [
                            {name: "采集间隔(秒)", input: true, data: "collectInterval", val: '5'},
                        ]}
                ];
                this.modal14.data = {
                    base: {channelUuid: null, enable: false, name: null, remark: null},
                    debug: null,
                    loopCollect: {collectInterval: null},
                };
                if(this.item.driveType == "HJ") {
                    this.links.push(
                        {title: "设备名称", data: "name", child: [
                                {name: '名称', input: true, sign: true, data: "name", val: ''},
                            ]}
                    );
                    this.modal14.data.name = null;
                }
                if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "CJ" || this.item.driveType == "DL") {
                    this.links.push(
                        {title: "串口配置", data: "serialPars", child: [
                                {name: "波特率", input: true, data: "baudRate", val: '9600'},{name: "数据位", input: true, data: "dataBits", val: '8'},
                                // {name: "串口", input: true, sign: true, data: "device", val: ''},
                                {name: "串口", input_select: true, data: "device", val: 'ttyUSB0', options: ['ttyUSB0','ttyUSB1','ttyUSB2','ttyUSB3','ttyUSB4',
                                        'ttyUSB5','ttyUSB6','ttyUSB7','ttyUSB8','ttyUSB9']},
                                {name: "校验方式", select: true, data: "parity", val: 0, cityList: [
                                        {name: 'none',val: 0},{name: 'odd',val: 1},{name: 'even',val: 2},{name: 'mark',val: 3},{name: 'space',val: 4}]},
                                {name: "停止数据位", input: true, data: "stopBits", val: '0'},{name: "超时时间(毫秒)", input: true, data: "timeOut", val: '3000'},
                            ]}
                    );
                    this.modal14.data.serialPars = {baudRate: null, dataBits: null, device: null, parity: null, stopBits: null, timeOut: null};
                }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                    this.links.push(
                        {title: "串口配置", data: "serialPars", child: [
                                {name: "波特率", input: true, data: "baudRate", val: '9600'},{name: "数据位", input: true, data: "dataBits", val: '8'},
                                {name: "串口", input_select: true, data: "device", val: 'ttyUSB0', options: ['ttyUSB0','ttyUSB1','ttyUSB2','ttyUSB3','ttyUSB4',
                                        'ttyUSB5','ttyUSB6','ttyUSB7','ttyUSB8','ttyUSB9']},
                                {name: "校验方式", select: true, data: "parity", val: 0, cityList: [
                                        {name: 'none',val: 0},{name: 'odd',val: 1},{name: 'even',val: 2},{name: 'mark',val: 3},{name: 'space',val: 4}]},
                                {name: "停止数据位", input: true, data: "stopBits", val: '0'},{name: "超时时间(毫秒)", input: true, data: "timeOut", val: '3000'},
                            ]},
                        {title: "从站配置", data: "slaveParameters", child: [
                                {name: "启始数据位", input: true, data: "offset", val: '0'},{name: "数据位数量", input: true, data: "size", val: '1'},{name: "从站ID", input: true, sign: true, data: "slaveId", val: ''}
                            ]},
                    );
                    this.modal14.data.serialPars = {baudRate: null, dataBits: null, device: null, parity: null, stopBits: null, timeOut: null};
                    this.modal14.data.slaveParameters = {offset: null, size: null, slaveId: null};
                }else if(this.item.driveType == "MOD_BUS_TCP" || this.item.driveType == "HJ") {
                    this.links.push(
                        {title: "TCP数量", data: "tcpPars", child: [
                                {name: "IP地址", input: true, sign: true, data: "host", val: ''},{name: "端口", input: true, sign: true, data: "port", val: ''},{name: "是否长连接", swith: true, data: "keepAlive", val: false},
                                {name: "超时时间(毫秒)", input: true, data: "timeOut", val: '3000'}
                            ]},
                    );
                    this.modal14.data.tcpPars = {charset: 'UTF-8', host: null, keepAlive: null, port: null, timeOut: null};
                }else if(this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                    this.modal14.url = this.$api.collect.drive.url + '/modbustcpslave';
                    this.links.push(
                        {title: "从站配置", data: "slaveParameters", child: [
                                {name: "启始数据位", input: true, data: "offset", val: '0'},{name: "数据位数量", input: true, data: "size", val: '1'},{name: "从站ID", input: true, sign: true, data: "slaveId", val: ''}
                            ]},
                        {title: "TCP数量", data: "tcpPars", child: [
                                // {name: "IP地址", input: true, sign: true, data: "host", val: ''},
                                {name: "端口", input: true, sign: true, data: "port", val: ''},{name: "是否长连接", swith: true, data: "keepAlive", val: false},
                                {name: "超时时间(毫秒)", input: true, data: "timeOut", val: '3000'}
                            ]},
                    );
                    this.modal14.data.slaveParameters = {offset: null, size: null, slaveId: null};
                    this.modal14.data.tcpPars = {charset: 'UTF-8', host: null, keepAlive: null, port: null, timeOut: null};
                }else if(this.item.driveType == "OPC_DA") {
                    this.modal14.url = this.$api.collect.drive.url + '/opcda';
                    this.links.push(
                        {title: "OpcDa配置", data: "opcDaParams", child: [
                                {name: "IP地址", input: true, sign: true, data: "host", val: ''},{name: "域名称", input: true, data: "domain", val: ''},{name: "系统用户名", input: true, sign: true, data: "user", val: ''},{name: "系统密码", pwd: true, sign: true, data: "password", val: ''},
                                {name: "程序ID", input: true, sign: true, data: "progid", val: ''},
                                // {name: "连接类型", input: true, sign: true, data: "conntype", val: ''},
                                {name: "连接类型", select: true, data: "conntype", val: 2, cityList: [
                                        {name: 'CLSID',val: 2},{name: '程序名',val: 1}]},

                                {name: "时间间隔(毫秒)", input: true, data: "period", val: '3000'},{name: "超时时间(毫秒)", input: true, data: "timeout", val: '3000'},
                            ]},
                    );
                    this.modal14.data.opcDaParams = {conntype: null, domain: null, host: null, password: null, period: null, progid: null, timeout: null, user: null};
                }else if(this.item.driveType == "OPC_DA_HTTP") {
                    this.modal14.url = this.$api.collect.drive.url + '/opcdahttp';
                    this.links.push(
                        {title: "OpcDaHttp配置", data: "opcDaHttpParams", child: [
                                {name: "URL", input: true, sign: true, data: "url", val: 'http://'},{name: "程序ID", input: true, sign: true, data: "progid", val: ''},{name: "时间间隔(毫秒)", input: true, data: "period", val: '3000'},{name: "组名", input: true, sign: true, data: "groupName", val: ''},
                                {name: "用户名", input: true, data: "user", val: 'test'},{name: "密码", pwd: true, data: "password", val: '123456'}
                            ]},
                    );
                    this.modal14.data.opcDaHttpParams = {groupName: null, password: null, period: null, progid: null, url: null, user: null};
                }else if(this.item.driveType == "OPC_UA") {
                    this.modal14.url = this.$api.collect.drive.url + '/opcua';
                    this.links.push(
                        {title: "OpcUa配置", data: "opcUaConnParams", child: [
                                {name: "URL", input: true, sign: true, data: "url", val: 'opc.tcp://'},{name: "用户名", input: true, sign: true, data: "user", val: ''},{name: "密码", pwd: true, sign: true, data: "password", val: ''},
                                {name: "安全模式", select: true, data: "securitypolicy", val: 'basic128rsa15', cityList: [
                                        {name: 'basic128rsa15',val: 'basic128rsa15'},{name: 'basic256',val: 'basic256'},{name: 'basic256sha256',val: 'basic256sha256'},{name: 'aes128_sha256_rsaOaep',val: 'aes128_sha256_rsaOaep'},
                                        {name: 'aes256_sha256_rsapss',val: 'aes256_sha256_rsapss'},{name: 'none',val: 'none'},]}
                            ]},
                    );
                    this.modal14.data.opcUaConnParams = {password: null, securitypolicy: null, url: null, user: null};
                }else if(this.item.driveType == "MQTT_SERVER") {
                    this.modal14.url = this.$api.collect.drive.url + '/mqttserver';
                    this.links.push(
                        {title: "mqttServer配置", data: "mqttServerParams", child: [
                                {name: "IP地址", input: true, sign: true, data: "host", val: ''},{name: "用户名", input: true, sign: true, data: "username", val: ''},{name: "密码", pwd: true, sign: true, data: "password", val: ''},
                                {name: "端口", input: true, sign: true, data: "port", val: ''},
                                {name: "客户访问策略", select: true, data: "clientAuth", val: 0, cityList: [
                                        {name: 'none',val: 0},{name: 'request',val: 1},{name: 'required',val: 2}]}
                            ]},
                    );
                    this.modal14.data.mqttServerParams = {host: null, username: null, password: null, port: null, clientAuth: null};
                }
                if(this.item.driveType == "MOD_BUS_RTU") {
                    this.modal14.url = this.$api.collect.drive.url + '/modbusrtu';
                }else if(this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                    this.modal14.url = this.$api.collect.drive.url + '/modbusrtuslave';
                }else if(this.item.driveType == "MOD_BUS_ASCII") {
                    this.modal14.url = this.$api.collect.drive.url + '/modbusascii';
                }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE") {
                    this.modal14.url = this.$api.collect.drive.url + '/modbusasciislave';
                }else if(this.item.driveType == "CJ") {
                    this.modal14.url = this.$api.collect.drive.url + '/cj';
                }else if(this.item.driveType == "DL") {
                    this.modal14.url = this.$api.collect.drive.url + '/dl';
                }else if(this.item.driveType == "HJ") {
                    this.modal14.url = this.$api.collect.drive.url + '/hj';
                }else if(this.item.driveType == "MOD_BUS_TCP") {
                    this.modal14.url = this.$api.collect.drive.url + '/modbustcp';
                }
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
                let status = this.checkChannel();
                if(status == false) {
                    this.modal11 = false;
                    this.$https.fetchPost(this.$api.collect.channelInfo.url, this.channel.form).then((resp) => {
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
            },
            delChannel() {
                let state = null;
                let getName = null;
                for(let i in this.item.children) {
                    if(this.item.children[i].enable) {
                        getName = this.item.children[i].menuName;
                        state = true;
                        break;
                    }
                }
                if(state) {
                    this.$Notice.error({title: '驱动删除失败', desc: "关联驱动 [ "+getName+" ] 正在运行...", duration: 3});
                }else {
                    this.$https.fetchDelete(this.$api.collect.channelInfo.url+"/"+this.item.uuid).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '通道删除成功', desc: "正在刷新界面", duration: 3});
                            this.showData();
                            this.reload();
                            this.$router.push({ path: "/engineering/collectionService" });
                        } else
                            this.$Notice.error({title: '通道删除失败', desc: resp.data.describe, duration: 3});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 3});
                        console.log(err)
                    });
                }
            },
            okAddDrive() {
                for(let i in this.links) {
                    if(this.links[i].data == "debug") {
                        this.modal14.data['debug'] = this.links[1].child[0].val;
                    }else if(this.item.driveType == "HJ" && this.links[i].data == "name") {
                        this.modal14.data.name = this.links[3].child[0].val;
                    }else {
                        for(let j in this.links[i].child) {
                            var data = this.links[i].data;
                            var name = this.links[i].child[j].data;
                            // if(name == "enable" && this.links[i].child[j].val == null) {
                            //     this.links[i].child[j].val = false;
                            // }
                            this.modal14.data[data][name] = this.links[i].child[j].val;
                        }
                    }
                }

                this.modal14.data.base.channelUuid = this.item.uuid;
                let status = this.checkDrive();
                // let status1 = null;
                // if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "CJ" || this.item.driveType == "DL") {
                //     status1 = this.checkMdbRtuOrMdbAsciiDrive();
                // }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                //     status1 = this.checkMdbRtuOrMdbAsciiDrive();
                //     status1 == false ? status1 = this.checkSlaveDrive() : true;
                // }else if(this.item.driveType == "MOD_BUS_TCP") {
                //     status1 = this.checkMdbTcpDrive();
                // }else if(this.item.driveType == "HJ") {
                //     status1 = this.checkMdbTcpDrive();
                //     status1 == false ? status1 = this.checkHJDrive() : true;
                // }else if(this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                //     status1 = this.checkMdbTcpDrive();
                //     status1 == false ? status1 = this.checkSlaveDrive() : true;
                // }else if(this.item.driveType == "OPC_DA") {
                //     status1 = this.checkDaDrive();
                // }else if(this.item.driveType == "OPC_DA_HTTP") {
                //     status1 = this.checkDaHttpDrive();
                // }else if(this.item.driveType == "OPC_UA") {
                //     status1 = this.checkUaDrive();
                // }else if(this.item.driveType == "MQTT_SERVER") {
                //     status1 = this.checkMQTTDrive();
                // }
                if(status == false && !this.check()) {
                    this.modal14.show = false;
                    this.$https.fetchPost(this.modal14.url, this.modal14.data).then((resp) => {
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

                // this.$https.fetchPost(this.modal14.url, this.modal14.data).then((resp) => {
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
            delDrive() {
                if(this.item.enable) {
                    this.$Notice.error({title: '驱动删除失败', desc: "该驱动正在运行...", duration: 2.5});
                }else {
                    this.$https.fetchDelete(this.$api.collect.drive.url+"/"+this.item.uuid).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '驱动删除成功', desc: "正在刷新界面", duration: 2.5});
                            // location.reload();
                            this.showData();
                            this.$router.push({ path: "/engineering/collectionService" });
                        } else
                            this.$Notice.error({title: '驱动删除失败', desc: resp.data.describe, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 2.5});
                        console.log(err)
                    });
                }
            },
            is_Connect() {
                if(!this.check()) {
                    this.loading = true;
                    let data = null;
                    if(this.item.driveType == "OPC_UA") {
                        data = {opcUaConnParams: {password: this.links[3].child[2].val,securitypolicy: this.links[3].child[3].val,url: this.links[3].child[0].val,user: this.links[3].child[1].val}};
                    }else if(this.item.driveType == "OPC_DA_HTTP") {
                        data = {opcDaHttpParams: {groupName: this.links[3].child[3].val, password: this.links[3].child[5].val, period: this.links[3].child[2].val, progid: this.links[3].child[1].val, url: this.links[3].child[0].val, user: this.links[3].child[4].val}};
                    }else if(this.item.driveType == "OPC_DA") {
                        data = {opcDaParams: {conntype: this.links[3].child[5].val, domain: this.links[3].child[1].val, host: this.links[3].child[0].val, password: this.links[3].child[3].val, period: this.links[3].child[6].val, progid: this.links[3].child[4].val, timeout: this.links[3].child[7].val, user: this.links[3].child[2].val}};
                    }else if(this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                        data = {slaveParameters: {offset: this.links[3].child[0].val, size: this.links[3].child[1].val, slaveId: this.links[3].child[2].val},tcpPars: {charset: 'UTF-8', host: this.links[4].child[0].val, keepAlive: this.links[4].child[2].val, port: this.links[4].child[1].val, timeOut: this.links[4].child[3].val}};
                    }else if(this.item.driveType == "MOD_BUS_TCP") {
                        data = {tcpPars: {charset: 'UTF-8', host: this.links[3].child[0].val, keepAlive: this.links[3].child[2].val, port: this.links[3].child[1].val, timeOut: this.links[3].child[3].val}};
                    }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                        data = {serialPars: {baudRate: this.links[3].child[0].val, dataBits: this.links[3].child[1].val, device: this.links[3].child[2].val, parity: this.links[3].child[3].val, stopBits: this.links[3].child[4].val, timeOut: this.links[3].child[5].val},
                            slaveParameters: {offset: this.links[4].child[0].val, size: this.links[4].child[1].val, slaveId: this.links[4].child[2].val}};
                    }else if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "CJ" || this.item.driveType == "DL") {
                        data = {serialPars: {baudRate: this.links[3].child[0].val, dataBits: this.links[3].child[1].val, device: this.links[3].child[2].val, parity: this.links[3].child[3].val, stopBits: this.links[3].child[4].val, timeOut: this.links[3].child[5].val}};
                    }else if(this.item.driveType == "HJ") {
                        data = {name: this.links[3].child[0].val,tcpPars: {charset: 'UTF-8', host: this.links[4].child[0].val, keepAlive: this.links[4].child[2].val, port: this.links[4].child[1].val, timeOut: this.links[4].child[3].val}};
                    }else if(this.item.driveType == "MQTT_SERVER") {
                        data = {mqttServerParams: {clientAuth: this.links[3].child[4].val, host: this.links[3].child[0].val, password: this.links[3].child[2].val, port: this.links[3].child[3].val, username: this.links[3].child[1].val}};
                    }

                    this.$https.fetchPost(this.modal14.url+"/actions/testconn", data).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '连接成功', desc: "请进行下一步...", duration: 2.5});
                            this.loading = false;
                        } else
                            this.$Notice.error({title: '连接失败', desc: "请重新填写...", duration: 2.5});
                        this.loading = false;
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 2.5});
                        console.log(err)
                        this.loading = false;
                    });
                }
            },
            check() {
                for(let i in this.links) {
                    if(this.links[i].data == "debug") {
                        this.modal14.data['debug'] = this.links[1].child[0].val;
                    }else if(this.item.driveType == "HJ" && this.links[i].data == "name") {
                        this.modal14.data.name = this.links[3].child[0].val;
                    }else {
                        for(let j in this.links[i].child) {
                            var data = this.links[i].data;
                            var name = this.links[i].child[j].data;
                            this.modal14.data[data][name] = this.links[i].child[j].val;
                        }
                    }
                }

                let status = null;
                if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "CJ" || this.item.driveType == "DL") {
                    status = this.checkMdbRtuOrMdbAsciiDrive();
                }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                    status = this.checkMdbRtuOrMdbAsciiDrive();
                    status == false ? status = this.checkSlaveDrive() : true;
                }else if(this.item.driveType == "MOD_BUS_TCP") {
                    status = this.checkMdbTcpDrive();
                }else if(this.item.driveType == "HJ") {
                    status = this.checkMdbTcpDrive();
                    status == false ? status = this.checkHJDrive() : true;
                }else if(this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                    status = this.checkMdbTcpDrive();
                    status == false ? status = this.checkSlaveDrive() : true;
                }else if(this.item.driveType == "OPC_DA") {
                    status = this.checkDaDrive();
                }else if(this.item.driveType == "OPC_DA_HTTP") {
                    status = this.checkDaHttpDrive();
                }else if(this.item.driveType == "OPC_UA") {
                    status = this.checkUaDrive();
                }else if(this.item.driveType == "MQTT_SERVER") {
                    status = this.checkMQTTDrive();
                }
                return status;
            },
            checkChannel() {
                let status = false;
                if(this.channel.form.name == null || this.channel.form.driveType == null) {this.$Message.error({content: '请填写通道名称或者通道驱动...', duration: 3});    status = true;}
                return status;
            },
            checkDrive() {
                let status = false;
                if(this.modal14.data.base.name === '' || this.modal14.data.loopCollect.collectInterval === '') {this.$Message.error({content: '请填写驱动名称或者间隔时间...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{0,2}$/.test(this.modal14.data.loopCollect.collectInterval)) {this.$Message.error({content: '间隔时间填写1-999之间的数字...', duration: 3});    status = true;}
                else if(!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.modal14.data.base.name)) {this.$Message.error({content: '驱动名称不允许特殊符号...', duration: 3});    status = true;}
                return status;
            },
            checkUaDrive() {
                let status = false;
                if(this.modal14.data.opcUaConnParams.password === '' || this.modal14.data.opcUaConnParams.securitypolicy === '' || this.modal14.data.opcUaConnParams.url === '' || this.modal14.data.opcUaConnParams.user === '') {
                    this.$Message.error({content: '请填写URL、用户名、密码、安全模式...', duration: 3});    status = true;
                }
                else if(!/^opc.tcp:\/\/((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.modal14.data.opcUaConnParams.url)) {this.$Message.error({content: 'URL请填写正确的 opc.tcp://IP:端口 格式...', duration: 3});    status = true;}
                else if(!/^[a-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.modal14.data.opcUaConnParams.user)) {this.$Message.error({content: '用户名填写30位以内英文或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.modal14.data.opcUaConnParams.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                return status;
            },
            checkDaDrive() {
                let status = false;
                if(this.modal14.data.opcDaParams.host === '' || this.modal14.data.opcDaParams.password === ''
                    || this.modal14.data.opcDaParams.period === '' || this.modal14.data.opcDaParams.progid === '' || this.modal14.data.opcDaParams.timeout === '' || this.modal14.data.opcDaParams.user === '') {
                    this.$Message.error({content: '请填写IP地址、系统用户名、系统密码、时间间隔、程序ID、超时时间...', duration: 3});    status = true;
                }
                // else if(!/^[\da-zA-Z\u4e00-\u9fa5!@#$%^&*]{0,128}$/.test(this.modal14.data.opcDaParams.domain)) {this.$Message.error({content: '域名称填写128位以内英文、中文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.modal14.data.opcDaParams.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.modal14.data.opcDaParams.user)) {this.$Message.error({content: '用户名填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.modal14.data.opcDaParams.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{3,}$/.test(this.modal14.data.opcDaParams.timeout) || !/^[1-9]\d{3,}$/.test(this.modal14.data.opcDaParams.period)) {this.$Message.error({content: '超时时间或时间间隔填写>=1000...', duration: 3});    status = true;}
                return status;
            },
            checkDaHttpDrive() {
                let status = false;
                if(this.modal14.data.opcDaHttpParams.groupName === '' || this.modal14.data.opcDaHttpParams.password === '' || this.modal14.data.opcDaHttpParams.period === '' || this.modal14.data.opcDaHttpParams.progid === ''
                    || this.modal14.data.opcDaHttpParams.url === '' || this.modal14.data.opcDaHttpParams.user === '') {
                    this.$Message.error({content: '请填写URL、程序ID、时间间隔、组名、用户名、密码...', duration: 3});    status = true;
                }
                else if(!/^http:\/\/((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.modal14.data.opcDaHttpParams.url)) {this.$Message.error({content: 'URL请填写正确的 http://IP:端口 格式...', duration: 3});    status = true;}

                else if(!/^[\da-zA-Z\u4e00-\u9fa5!@#$%^&*]{0,30}$/.test(this.modal14.data.opcDaHttpParams.groupName)) {this.$Message.error({content: '组名填写30位以内英文、中文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.modal14.data.opcDaHttpParams.user)) {this.$Message.error({content: '用户名填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.modal14.data.opcDaHttpParams.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{3,}$/.test(this.modal14.data.opcDaHttpParams.period)) {this.$Message.error({content: '时间间隔填写>=1000...', duration: 3});    status = true;}
                return status;
            },
            checkMdbTcpDrive() {
                let status = false;
                if(this.modal14.data.tcpPars.port === ''
                    || this.modal14.data.tcpPars.timeOut === '') {
                    this.$Message.error({content: '请填写端口、超时时间...', duration: 3});    status = true;
                }
                // else if(!/^[\da-zA-Z\u4e00-\u9fa5!@#$%^&*]{0,30}$/.test(this.modal14.data.tcpPars.groupName)) {this.$Message.error({content: '组名填写30位英文、中文、数字或特殊字符...', duration: 3});    status = true;}
                // else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.modal14.data.tcpPars.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}
                else if(!/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.modal14.data.tcpPars.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{3,}$/.test(this.modal14.data.tcpPars.timeOut)) {this.$Message.error({content: '超时时间填写>=1000...', duration: 3});    status = true;}
                return status;
            },
            checkHJDrive() {
                let status = false;
                if(this.modal14.data.name === '') {this.$Message.error({content: '请填写设备名称...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.modal14.data.name)) {this.$Message.error({content: '设备名称填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                return status;
            },
            checkMdbRtuOrMdbAsciiDrive() {
                let status = false;
                if(this.modal14.data.serialPars.baudRate === '' || this.modal14.data.serialPars.dataBits === '' || this.modal14.data.serialPars.device === '' || this.modal14.data.serialPars.parity === ''
                    || this.modal14.data.serialPars.stopBits === '' || this.modal14.data.serialPars.timeOut === '') {
                    this.$Message.error({content: '请填写波特率、数据位、串口、校验方式、停止数据位、超时时间...', duration: 3});    status = true;
                }
                else if(!/^\d{0,6}$/.test(this.modal14.data.serialPars.baudRate)) {this.$Message.error({content: '波特率填写6位以内数字...', duration: 3});    status = true;}
                else if(!/^\d{0,4}$/.test(this.modal14.data.serialPars.dataBits) || !/^\d{0,4}$/.test(this.modal14.data.serialPars.stopBits)) {this.$Message.error({content: '数据位或停止位填写4位以内数字...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{3,}$/.test(this.modal14.data.serialPars.timeOut)) {this.$Message.error({content: '超时时间填写>=1000...', duration: 3});    status = true;}
                return status;
            },
            checkSlaveDrive() {
                let status = false;
                if(this.modal14.data.slaveParameters.offset === '' || this.modal14.data.slaveParameters.size === '' || this.modal14.data.slaveParameters.slaveId === '') {
                    this.$Message.error({content: '请填写起始数据位、数据位数量、从站ID...', duration: 3});    status = true;
                }
                else if(!/^\d{0,5}$/.test(this.modal14.data.slaveParameters.offset) || !/^\d{0,5}$/.test(this.modal14.data.slaveParameters.size) || !/^\d{0,5}$/.test(this.modal14.data.slaveParameters.slaveId)) {this.$Message.error({content: '从起始数据位、数据点数量、从站ID填写5位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkMQTTDrive() {
                let status = false;
                if(this.modal14.data.mqttServerParams.host === '' || this.modal14.data.mqttServerParams.username === '' || this.modal14.data.mqttServerParams.password === '' || this.modal14.data.mqttServerParams.port === '') {
                    this.$Message.error({content: '请填写IP地址、端口、用户名、密码...', duration: 3});    status = true;
                }
                else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.modal14.data.mqttServerParams.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}
                else if(!/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.modal14.data.mqttServerParams.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                else if(!/^[a-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.modal14.data.mqttServerParams.username)) {this.$Message.error({content: '用户名填写30位以内英文或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.modal14.data.mqttServerParams.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                return status;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
