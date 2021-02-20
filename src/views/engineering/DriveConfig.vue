<template>
    <div class="container-fluid" style="float: left;width: 100%;">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs v-if="!loginType" :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <jk_tabsbtn v-if="loginType" :links="links" style="float: left;font-size: 14px;"></jk_tabsbtn>
                    <Button v-if="loginType"  type="warning" size="small" style="float: right;margin-left: 5px;margin-top: 6px;" :loading="loading" @click="is_Connect">连接测试</Button>
                    <Button v-if="loginType" type="primary" size="small" style="float: right;margin-top: 6px;" @click="updateDrive">保存</Button>
                    <Button v-if="channel.form.driveType == 'OPC_DA_HTTP'" size="small" style="float: right;margin: 6px 5px 0 0;" icon="ios-cloud-download-outline" @click="downloadDaHttpClient">桥接客户端下载</Button>
                    <Tag v-if="loginType" style="float: right;margin-top: 6px;margin-right: 5px" type="border" :color="driveState.color">{{driveState.name}}</Tag>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 715px;">
                <contentTabs :links="driverInfo"></contentTabs>
                <!-- <Button v-if="loginType" size="small" type="warning" :loading="loading" @click="is_Connect">连接测试</Button> -->
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabsbtn from "@/components/JkTabsBtn.vue";
    import JkTabs from "@/components/JkTabs.vue";
    import contentTabs from "./ContentTabs";
    import Utils from '../../components/test.js';
    export default {
        name: "DriveConfig",
        inject: ["reload"],
        components: {
            jk_tabs: JkTabs,jk_tabsbtn: JkTabsbtn,contentTabs
        },
        data(){
            return {
                driveUUID: null,
                loading: false,
                driverInfo: [],
                item: {},
                url: null,
                driveType: null,
                driveState: {
                    color: null,
                    name: null,
                },
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
                    form: {}
                },
                loginType: null,//系统类型
                links: [
                    {name: "驱动配置", to: "/engineering/collectionService/driveConfig"},
                    {name: "节点配置", to: "/engineering/collectionService/nodeConfig"}
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
                this.channel.form.driveType = this.item['driveType'];
                console.log(this.channel.form.driveType)
                if(this.loginType == false){
                        {
                            this.driverInfo = [
                            {title: "基本信息", data: "base", child: [
                                    {name: "驱动名称", input: true, disabled: true, data: "name"},
                                    {name: "描述", input: true,disabled: true, data: "remark"},
                                    // {name: "采集间隔(秒)", input: true,disabled: true, data: "collectInterval"},
                                    {name: "状态", swith: true,disabled: true, data: "enable"},
                                    // {name: "debug模式", swith: true,disabled: true, data: "debug"},
                                    
                                ]},
                            {title: "Debug模式", data: "debug", child: [
                                    {name: "状态", swith: true,disabled: true, data: "debug"},
                                ]},
                            {title: "配置信息", data: "loopCollect", child: [
                                    {name: "采集间隔(秒)", input: true,disabled: true, data: "collectInterval"},
                                ]}
                        ];
                        this.drive.form = {
                            base: {uuid: null, enable: false, remark: null},
                            debug: null,
                            loopCollect: {collectInterval: null}
                        };
                        if(this.item.driveType == "HJ") {
                            this.driverInfo.push(
                                {title: "设备名称", data: "name", child: [
                                        {name: '名称', input: true,disabled: true, data: "name", val: ''},
                                    ]}
                            );
                            this.drive.form.name = null;
                        }
                        if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "CJ" || this.item.driveType == "DL") {
                            this.driverInfo.push(
                                {title: "串口配置", data: "serialPars", child: [
                                        {name: "波特率", input: true,disabled: true, data: "baudRate"},{name: "数据位", input: true,disabled: true, data: "dataBits"},
                                        {name: "串口", input_select: true,disabled: true, data: "device", val: 'ttyUSB0', options: ['ttyUSB0','ttyUSB1','ttyUSB2','ttyUSB3','ttyUSB4',
                                                'ttyUSB5','ttyUSB6','ttyUSB7','ttyUSB8','ttyUSB9']},
                                        {name: "校验方式", select: true,disabled: true, data: "parity", cityList: [
                                                {name: 'none',val: 0},{name: 'odd',val: 1},{name: 'even',val: 2},{name: 'mark',val: 3},{name: 'space',val: 4}]},
                                        {name: "停止数据位", input: true,disabled: true, data: "stopBits"},{name: "超时时间(毫秒)", input: true,disabled: true, data: "timeOut"},
                                    ]}
                            );
                            this.drive.form.serialPars = {baudRate: null, dataBits: null, device: null, parity: null, stopBits: null, timeOut: null}
                        }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                            this.driverInfo.push(
                                {title: "串口配置", data: "serialPars", child: [
                                        {name: "波特率", input: true,disabled: true, data: "baudRate"},{name: "数据位", input: true,disabled: true, data: "dataBits"},
                                        {name: "串口", input_select: true,disabled: true, data: "device", val: 'ttyUSB0', options: ['ttyUSB0','ttyUSB1','ttyUSB2','ttyUSB3','ttyUSB4',
                                                'ttyUSB5','ttyUSB6','ttyUSB7','ttyUSB8','ttyUSB9']},
                                        {name: "校验方式", select: true,disabled: true, data: "parity", cityList: [
                                                {name: 'none',val: 0},{name: 'odd',val: 1},{name: 'even',val: 2},{name: 'mark',val: 3},{name: 'space',val: 4}]},
                                        {name: "停止数据位", input: true,disabled: true, data: "stopBits"},{name: "超时时间(毫秒)", input: true,disabled: true, data: "timeOut"},
                                    ]},
                                {title: "从站配置", data: "slaveParameters", child: [
                                        {name: "启始数据位", input: true,disabled: true, data: "offset"},{name: "数据位数量", input: true,disabled: true, data: "size"},{name: "从站ID", input: true,disabled: true, data: "slaveId"}
                                    ]}
                            );
                            this.drive.form.serialPars = {baudRate: null, dataBits: null, device: null, parity: null, stopBits: null, timeOut: null};
                            this.drive.form.slaveParameters = {offset: null, size: null, slaveId: null};
                        }else if(this.item.driveType == "MOD_BUS_TCP" || this.item.driveType == "HJ") {
                            this.driverInfo.push(
                                {title: "TCP数量", data: "tcpPars", child: [
                                        {name: "IP地址", input: true,disabled: true, data: "host"},
                                        {name: "端口", input: true,disabled: true, data: "port"},{name: "是否长连接", swith: true,disabled: true, data: "keepAlive"},
                                        {name: "超时时间(毫秒)", input: true,disabled: true, data: "timeOut"}
                                    ]},
                            );
                            this.drive.form.tcpPars = {charset: 'UTF-8', host: null, keepAlive: null, port: null, timeOut: null};
                        }else if(this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                            this.url = this.$api.collect.drive.url + '/modbustcpslave';
                            this.driverInfo.push(
                                {title: "从站配置", data: "slaveParameters", child: [
                                        {name: "启始数据位", input: true,disabled: true, data: "offset"},{name: "数据位数量", input: true,disabled: true, data: "size"},{name: "从站ID", input: true,disabled: true, data: "slaveId"}
                                    ]},
                                {title: "TCP数量", data: "tcpPars", child: [
                                        // {name: "IP地址", input: true,disabled: true, data: "host"},
                                        {name: "端口", input: true,disabled: true, data: "port"},
                                        {name: "超时时间(毫秒)", input: true,disabled: true, data: "timeOut"},
                                        {name: "是否长连接", swith: true,disabled: true, data: "keepAlive"},
                                    ]},
                            );
                            this.drive.form.slaveParameters = {offset: null, size: null, slaveId: null};
                            this.drive.form.tcpPars = {charset: 'UTF-8', host: null, keepAlive: null, port: null, timeOut: null};
                        }else if(this.item.driveType == "OPC_DA") {
                            this.url = this.$api.collect.drive.url + '/opcda';
                            this.driverInfo.push(
                                {title: "OpcDa配置", data: "opcDaParams", child: [
                                        {name: "IP地址", input: true,disabled: true, data: "host"},{name: "域名称", input: true,disabled: true, data: "domain"},{name: "系统用户名", input: true,disabled: true, data: "user"},{name: "系统密码", pwd: true,disabled: true, data: "password"},
                                        {name: "程序ID", input: true,disabled: true, data: "progid"},
                                        // {name: "连接类型", input: true,disabled: true, data: "conntype"},
                                        {name: "连接类型", select: true,disabled: true, data: "conntype", val: 'CLSID', cityList: [
                                                {name: 'CLSID',val: 2},{name: '程序名',val: 1}]},

                                        {name: "时间间隔(毫秒)", input: true,disabled: true, data: "period"}, {name: "超时时间(毫秒)", input: true,disabled: true, data: "timeout"}
                                    ]},
                            );
                            this.drive.form.opcDaParams = {conntype: null, domain: null, host: null, password: null, period: null, progid: null, timeout: null, user: null};
                        }else if(this.item.driveType == "OPC_DA_HTTP") {
                            this.url = this.$api.collect.drive.url + '/opcdahttp';
                            this.driverInfo.push(
                                {title: "OpcDaHttp配置", data: "opcDaHttpParams", child: [
                                        {name: "URL", input: true,disabled: true, data: "url"},{name: "程序ID", input: true,disabled: true, data: "progid"},{name: "时间间隔(毫秒)", input: true,disabled: true, data: "period"},{name: "组名", input: true,disabled: true, data: "groupName"},
                                        {name: "用户名", input: true,disabled: true, data: "user"}, {name: "密码", pwd: true,disabled: true, data: "password"}
                                    ]},
                            );
                            this.drive.form.opcDaHttpParams = {groupName: null, password: null, period: null, progid: null, url: null, user: null};
                        }else if(this.item.driveType == "OPC_UA") {
                            this.url = this.$api.collect.drive.url + '/opcua';
                            this.driverInfo.push(
                                {title: "OpcUa配置", data: "opcUaConnParams", child: [
                                        {name: "URL", input: true,disabled: true, data: "url"},{name: "用户名", input: true,disabled: true, data: "user"},{name: "密码", pwd: true,disabled: true, data: "password"},
                                        {name: "安全模式", select: true,disabled: true, data: "securitypolicy", cityList: [
                                                {name: 'basic256',val: 'basic256'},{name: 'basic128rsa15',val: 'basic128rsa15'},{name: 'basic256sha256',val: 'basic256sha256'},{name: 'aes128_sha256_rsaOaep',val: 'aes128_sha256_rsaOaep'},
                                                {name: 'aes256_sha256_rsapss',val: 'aes256_sha256_rsapss'},{name: 'none',val: 'none'}]}
                                    ]},
                            );
                            this.drive.form.opcUaConnParams = {password: null, securitypolicy: null, url: null, user: null};
                        }else if(this.item.driveType == "MQTT_SERVER") {
                            this.url = this.$api.collect.drive.url + '/mqttserver';
                            this.driverInfo.push(
                                {title: "mqttServer配置", data: "mqttServerParams", child: [
                                        {name: "IP地址", input: true,disabled: true, data: "host", val: ''},{name: "用户名", input: true,disabled: true, data: "username", val: ''},{name: "密码", pwd: true,disabled: true, data: "password", val: ''},
                                        {name: "端口", input: true,disabled: true, data: "port", val: ''},
                                        {name: "客户访问策略", select: true,disabled: true, data: "clientAuth", val: 0, cityList: [
                                                {name: 'none',val: 0},{name: 'request',val: 1},{name: 'required',val: 2}]}
                                    ]},
                            );
                            this.drive.form.mqttServerParams = {host: null, username: null, password: null, port: null, clientAuth: null};
                        }
                        if(this.item.driveType == "MOD_BUS_RTU") {
                            this.url = this.$api.collect.drive.url + '/modbusrtu';
                        }else if(this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                            this.url = this.$api.collect.drive.url + '/modbusrtuslave';
                        }else if(this.item.driveType == "MOD_BUS_ASCII") {
                            this.url = this.$api.collect.drive.url + '/modbusascii';
                        }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE") {
                            this.url = this.$api.collect.drive.url + '/modbusasciislave';
                        }else if(this.item.driveType == "CJ") {
                            this.url = this.$api.collect.drive.url + '/cj';
                        }else if(this.item.driveType == "DL") {
                            this.url = this.$api.collect.drive.url + '/dl';
                        }else if(this.item.driveType == "HJ") {
                            this.url = this.$api.collect.drive.url + '/hj';
                        }else if(this.item.driveType == "MOD_BUS_TCP") {
                            this.url = this.$api.collect.drive.url + '/modbustcp';
                        }
                    }
                }else if(this.loginType == true){
                        this.driverInfo = [
                        {title: "基本信息", data: "base", child: [
                                {name: "名称", input: true,disabled: true, data: "name"},
                                {name: "描述", input: true, data: "remark"},
                                // {name: "采集间隔(秒)", input: true, data: "collectInterval"},
                                {name: "状态", swith: true, data: "enable"},
                                // {name: "debug模式", swith: true, data: "debug"},
                                
                            ]},
                        {title: "Debug模式", data: "debug", child: [
                                {name: "状态", swith: true, data: "debug"},
                            ]},
                        {title: "配置信息", data: "loopCollect", child: [
                                {name: "采集间隔(秒)", input: true, data: "collectInterval"},
                            ]}
                    ];
                    this.drive.form = {
                        base: {uuid: null, enable: false, remark: null},
                        debug: null,
                        loopCollect: {collectInterval: null}
                    };
                    if(this.item.driveType == "HJ") {
                        this.driverInfo.push(
                            {title: "设备名称", data: "name", child: [
                                    {name: '名称', input: true, data: "name", val: ''},
                                ]}
                        );
                        this.drive.form.name = null;
                    }
                    if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "CJ" || this.item.driveType == "DL") {
                        this.driverInfo.push(
                            {title: "串口配置", data: "serialPars", child: [
                                    {name: "波特率", input: true, data: "baudRate"},{name: "数据位", input: true, data: "dataBits"},
                                    {name: "串口", input_select: true, data: "device", val: 'ttyUSB0', options: ['ttyUSB0','ttyUSB1','ttyUSB2','ttyUSB3','ttyUSB4',
                                            'ttyUSB5','ttyUSB6','ttyUSB7','ttyUSB8','ttyUSB9']},
                                    {name: "校验方式", select: true, data: "parity", cityList: [
                                            {name: 'none',val: 0},{name: 'odd',val: 1},{name: 'even',val: 2},{name: 'mark',val: 3},{name: 'space',val: 4}]},
                                    {name: "停止数据位", input: true, data: "stopBits"},{name: "超时时间(毫秒)", input: true, data: "timeOut"},
                                ]}
                        );
                        this.drive.form.serialPars = {baudRate: null, dataBits: null, device: null, parity: null, stopBits: null, timeOut: null}
                    }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                        this.driverInfo.push(
                            {title: "串口配置", data: "serialPars", child: [
                                    {name: "波特率", input: true, data: "baudRate"},{name: "数据位", input: true, data: "dataBits"},
                                    {name: "串口", input_select: true, data: "device", val: 'ttyUSB0', options: ['ttyUSB0','ttyUSB1','ttyUSB2','ttyUSB3','ttyUSB4',
                                            'ttyUSB5','ttyUSB6','ttyUSB7','ttyUSB8','ttyUSB9']},
                                    {name: "校验方式", select: true, data: "parity", cityList: [
                                            {name: 'none',val: 0},{name: 'odd',val: 1},{name: 'even',val: 2},{name: 'mark',val: 3},{name: 'space',val: 4}]},
                                    {name: "停止数据位", input: true, data: "stopBits"},{name: "超时时间(毫秒)", input: true, data: "timeOut"},
                                ]},
                            {title: "从站配置", data: "slaveParameters", child: [
                                    {name: "启始数据位", input: true, data: "offset"},{name: "数据位数量", input: true, data: "size"},{name: "从站ID", input: true, data: "slaveId"}
                                ]}
                        );
                        this.drive.form.serialPars = {baudRate: null, dataBits: null, device: null, parity: null, stopBits: null, timeOut: null};
                        this.drive.form.slaveParameters = {offset: null, size: null, slaveId: null};
                    }else if(this.item.driveType == "MOD_BUS_TCP" || this.item.driveType == "HJ") {
                        this.driverInfo.push(
                            {title: "TCP数量", data: "tcpPars", child: [
                                    {name: "IP地址", input: true, data: "host"},{name: "端口", input: true, data: "port"},{name: "是否长连接", swith: true, data: "keepAlive"},
                                    {name: "超时时间(毫秒)", input: true, data: "timeOut"}
                                ]},
                        );
                        this.drive.form.tcpPars = {charset: 'UTF-8', host: null, keepAlive: null, port: null, timeOut: null};
                    }else if(this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                        this.url = this.$api.collect.drive.url + '/modbustcpslave';
                        this.driverInfo.push(
                            {title: "从站配置", data: "slaveParameters", child: [
                                    {name: "启始数据位", input: true, data: "offset"},{name: "数据位数量", input: true, data: "size"},{name: "从站ID", input: true, data: "slaveId"}
                                ]},
                            {title: "TCP数量", data: "tcpPars", child: [
                                    // {name: "IP地址", input: true, data: "host"},
                                    {name: "端口", input: true, data: "port"},{name: "是否长连接", swith: true, data: "keepAlive"},
                                    {name: "超时时间(毫秒)", input: true, data: "timeOut"}
                                ]},
                        );
                        this.drive.form.slaveParameters = {offset: null, size: null, slaveId: null};
                        this.drive.form.tcpPars = {charset: 'UTF-8', host: null, keepAlive: null, port: null, timeOut: null};
                    }else if(this.item.driveType == "OPC_DA") {
                        this.url = this.$api.collect.drive.url + '/opcda';
                        this.driverInfo.push(
                            {title: "OpcDa配置", data: "opcDaParams", child: [
                                    {name: "IP地址", input: true, data: "host"},{name: "域名称", input: true, data: "domain"},{name: "系统用户名", input: true, data: "user"},{name: "系统密码", pwd: true, data: "password"},
                                    {name: "程序ID", input: true, data: "progid"},
                                    // {name: "连接类型", input: true, data: "conntype"},
                                    {name: "连接类型", select: true, data: "conntype", val: 'CLSID', cityList: [
                                            {name: 'CLSID',val: 2},{name: '程序名',val: 1}]},

                                    {name: "时间间隔(毫秒)", input: true, data: "period"}, {name: "超时时间(毫秒)", input: true, data: "timeout"}
                                ]},
                        );
                        this.drive.form.opcDaParams = {conntype: null, domain: null, host: null, password: null, period: null, progid: null, timeout: null, user: null};
                    }else if(this.item.driveType == "OPC_DA_HTTP") {
                        this.url = this.$api.collect.drive.url + '/opcdahttp';
                        this.driverInfo.push(
                            {title: "OpcDaHttp配置", data: "opcDaHttpParams", child: [
                                    {name: "URL", input: true, data: "url"},{name: "程序ID", input: true, data: "progid"},{name: "时间间隔(毫秒)", input: true, data: "period"},{name: "组名", input: true, data: "groupName"},
                                    {name: "用户名", input: true, data: "user"}, {name: "密码", pwd: true, data: "password"}
                                ]},
                        );
                        this.drive.form.opcDaHttpParams = {groupName: null, password: null, period: null, progid: null, url: null, user: null};
                    }else if(this.item.driveType == "OPC_UA") {
                        this.url = this.$api.collect.drive.url + '/opcua';
                        this.driverInfo.push(
                            {title: "OpcUa配置", data: "opcUaConnParams", child: [
                                    {name: "URL", input: true, data: "url"},{name: "用户名", input: true, data: "user"},{name: "密码", pwd: true, data: "password"},
                                    {name: "安全模式", select: true, data: "securitypolicy", cityList: [
                                            {name: 'basic128rsa15',val: 'basic128rsa15'},{name: 'basic256',val: 'basic256'},{name: 'basic256sha256',val: 'basic256sha256'},{name: 'aes128_sha256_rsaOaep',val: 'aes128_sha256_rsaOaep'},
                                            {name: 'aes256_sha256_rsapss',val: 'aes256_sha256_rsapss'},{name: 'none',val: 'none'},]}
                                ]},
                        );
                        this.drive.form.opcUaConnParams = {password: null, securitypolicy: null, url: null, user: null};
                    }else if(this.item.driveType == "MQTT_SERVER") {
                        this.url = this.$api.collect.drive.url + '/mqttserver';
                        this.driverInfo.push(
                            {title: "mqttServer配置", data: "mqttServerParams", child: [
                                    {name: "IP地址", input: true, data: "host", val: ''},{name: "用户名", input: true, data: "username", val: ''},{name: "密码", pwd: true, data: "password", val: ''},
                                    {name: "端口", input: true, data: "port", val: ''},
                                    {name: "客户访问策略", select: true, data: "clientAuth", val: 0, cityList: [
                                            {name: 'none',val: 0},{name: 'request',val: 1},{name: 'required',val: 2}]}
                                ]},
                        );
                        this.drive.form.mqttServerParams = {host: null, username: null, password: null, port: null, clientAuth: null};
                    }
                    if(this.item.driveType == "MOD_BUS_RTU") {
                        this.url = this.$api.collect.drive.url + '/modbusrtu';
                    }else if(this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                        this.url = this.$api.collect.drive.url + '/modbusrtuslave';
                    }else if(this.item.driveType == "MOD_BUS_ASCII") {
                        this.url = this.$api.collect.drive.url + '/modbusascii';
                    }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE") {
                        this.url = this.$api.collect.drive.url + '/modbusasciislave';
                    }else if(this.item.driveType == "CJ") {
                        this.url = this.$api.collect.drive.url + '/cj';
                    }else if(this.item.driveType == "DL") {
                        this.url = this.$api.collect.drive.url + '/dl';
                    }else if(this.item.driveType == "HJ") {
                        this.url = this.$api.collect.drive.url + '/hj';
                    }else if(this.item.driveType == "MOD_BUS_TCP") {
                        this.url = this.$api.collect.drive.url + '/modbustcp';
                    }
                }
                

                this.$https.fetchGet(this.url+"/"+this.item['uuid']).then((resp) => {
                    for(let i in this.driverInfo) {
                        let driverData = this.driverInfo[i].data;
                        if(driverData == "debug") {
                            this.$set(this.driverInfo[1].child[0],'val',resp.data.data[driverData]);
                        }else if(this.item.driveType == "HJ" && driverData == "name") {
                            this.$set(this.driverInfo[3].child[0],'val',resp.data.data['name']);
                        }else {
                            for(let j in this.driverInfo[i].child) {
                                let name = this.driverInfo[i].child[j].data;
                                this.$set(this.driverInfo[i].child[j],'val',resp.data.data[driverData][name]);
                            }
                        }
                        // if(this.item.driveType == "HJ") {this.$set(this.driverInfo[3].child[0],'val',resp.data.data['name']);}
                    }
                    if(resp.data.data.driveState == null){
                        this.driveState.name = "未创建驱动";
                        this.driveState.color = "red";
                    }else if(resp.data.data.driveState == "NoConnection"){
                        this.driveState.name = "未连接";
                        this.driveState.color = "primary";
                    }else if(resp.data.data.driveState == "ConnectionIng"){
                        this.driveState.name = "连接中";
                        this.driveState.color = "warning";
                    }else if(resp.data.data.driveState == "Connected"){
                        this.driveState.name = "已连接";
                        this.driveState.color = "success";
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            updateDrive() {
                for(let i in this.driverInfo) {
                    let driverData = this.driverInfo[i].data;
                    if(driverData == "debug") {
                        this.drive.form[driverData] = this.driverInfo[1].child[0].val;
                    }else if(driverData == "name" && this.item.driveType == "HJ") {
                        this.drive.form.name = this.driverInfo[3].child[0].val;
                    }else {
                        for(let j in this.driverInfo[i].child) {
                            let name = this.driverInfo[i].child[j].data;
                            this.drive.form[driverData][name] = this.driverInfo[i].child[j].val;
                        }
                    }
                }
                this.drive.form.base.uuid = this.item['uuid'];
                let status = this.checkDrive();

                if(status == false && !this.check()) {
                    this.$https.fetchPut(this.url, this.drive.form).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '驱动配置成功', desc: "正在刷新界面", duration: 2.5});
                            Utils.$emit('menuShowData','msg');
                            this.reload();
                        } else
                            this.$Notice.error({title: '驱动配置失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 2.5});
                        console.log(err)
                    });
                }
                //console.log(this.drive.form);
                // this.$https.fetchPut(this.url, this.drive.form).then((resp) => {
                //     if (resp.data.code == 200) {
                //         this.$Notice.success({title: '驱动配置成功', desc: "正在刷新界面", duration: 2.5});
                //         Utils.$emit('menuShowData','msg');
                //         this.reload();
                //     } else
                //         this.$Notice.error({title: '驱动配置失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                // }).catch(err => {
                //     this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                //     console.log(err)
                // });
            },
            is_Connect() {
                if(!this.check()) {
                    this.loading = true;
                    let data = null;
                    if(this.item.driveType == "OPC_UA") {
                        data = {opcUaConnParams: {password: this.driverInfo[3].child[2].val,securitypolicy: this.driverInfo[3].child[3].val,url: this.driverInfo[3].child[0].val,user: this.driverInfo[3].child[1].val}};
                    }else if(this.item.driveType == "OPC_DA_HTTP") {
                        data = {opcDaHttpParams: {groupName: this.driverInfo[3].child[3].val, password: this.driverInfo[3].child[5].val, period: this.driverInfo[3].child[2].val, progid: this.driverInfo[3].child[1].val, url: this.driverInfo[3].child[0].val, user: this.driverInfo[3].child[4].val}};
                    }else if(this.item.driveType == "OPC_DA") {
                        data = {opcDaParams: {conntype: this.driverInfo[3].child[5].val, domain: this.driverInfo[3].child[1].val, host: this.driverInfo[3].child[0].val, password: this.driverInfo[3].child[3].val, period: this.driverInfo[3].child[6].val, progid: this.driverInfo[3].child[4].val, timeout: this.driverInfo[3].child[7].val, user: this.driverInfo[3].child[2].val}};
                    }else if(this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                        data = {slaveParameters: {offset: this.driverInfo[3].child[0].val, size: this.driverInfo[3].child[1].val, slaveId: this.driverInfo[3].child[2].val},tcpPars: {charset: 'UTF-8', host: this.driverInfo[4].child[0].val, keepAlive: this.driverInfo[4].child[2].val, port: this.driverInfo[4].child[1].val, timeOut: this.driverInfo[4].child[3].val}};
                    }else if(this.item.driveType == "MOD_BUS_TCP") {
                        data = {tcpPars: {charset: 'UTF-8', host: this.driverInfo[3].child[0].val, keepAlive: this.driverInfo[3].child[2].val, port: this.driverInfo[3].child[1].val, timeOut: this.driverInfo[3].child[3].val}};
                    }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                        data = {serialPars: {baudRate: this.driverInfo[3].child[0].val, dataBits: this.driverInfo[3].child[1].val, device: this.driverInfo[3].child[2].val, parity: this.driverInfo[3].child[3].val, stopBits: this.driverInfo[3].child[4].val, timeOut: this.driverInfo[3].child[5].val},
                            slaveParameters: {offset: this.driverInfo[4].child[0].val, size: this.driverInfo[4].child[1].val, slaveId: this.driverInfo[4].child[2].val}};
                    }else if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "CJ" || this.item.driveType == "DL") {
                        data = {serialPars: {baudRate: this.driverInfo[3].child[0].val, dataBits: this.driverInfo[3].child[1].val, device: this.driverInfo[3].child[2].val, parity: this.driverInfo[3].child[3].val, stopBits: this.driverInfo[3].child[4].val, timeOut: this.driverInfo[3].child[5].val}};
                    }else if(this.item.driveType == "HJ") {
                        data = {name: this.driverInfo[3].child[0].val,tcpPars: {charset: 'UTF-8', host: this.driverInfo[4].child[0].val, keepAlive: this.driverInfo[4].child[2].val, port: this.driverInfo[4].child[1].val, timeOut: this.driverInfo[4].child[3].val}};
                    }else if(this.item.driveType == "MQTT_SERVER") {
                        data = {mqttServerParams: {clientAuth: this.driverInfo[3].child[4].val, host: this.driverInfo[3].child[0].val, password: this.driverInfo[3].child[2].val, port: this.driverInfo[3].child[3].val, username: this.driverInfo[3].child[1].val}};
                    }
                    this.$https.fetchPost(this.url+"/actions/testconn", data).then((resp) => {
                        if (resp.data.code == 200) {
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
                }
            },
            downloadDaHttpClient() {
                this.$https.getAxios().post(this.$api.collect.opcDaHttpClient.url,{},{responseType: 'blob'}).then((resp) => {
                    let headers = resp.headers;
                    let index = headers["content-disposition"].indexOf("=");
                    let filename = headers["content-disposition"].substr(index + 1,headers["content-disposition"].length);
                    let contentType = headers['content-type'];
                    const blob = new Blob([resp.data], {type: contentType});
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = (e) => {
                        const a = document.createElement('a');
                        a.download = filename;
                        a.style.display = 'none';
                        a.href = e.target.result;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', duration: 2.5});
                    console.log(err)
                })
            },
            check() {
                for(let i in this.driverInfo) {
                    let driverData = this.driverInfo[i].data;
                    if(driverData == "debug") {
                        this.drive.form[driverData] = this.driverInfo[1].child[0].val;
                    }else if(driverData == "name" && this.item.driveType == "HJ") {
                        this.drive.form.name = this.driverInfo[3].child[0].val;
                    }else {
                        for(let j in this.driverInfo[i].child) {
                            let name = this.driverInfo[i].child[j].data;
                            this.drive.form[driverData][name] = this.driverInfo[i].child[j].val;
                        }
                    }
                }

                let status = null;
                if(this.channel.form.driveType == "MOD_BUS_ASCII" || this.channel.form.driveType == "MOD_BUS_RTU" || this.item.driveType == "CJ" || this.item.driveType == "DL") {
                    status = this.checkMdbRtuOrMdbAsciiDrive();
                }else if(this.channel.form.driveType == "MOD_BUS_ASCII_SLAVE" || this.channel.form.driveType == "MOD_BUS_RTU_SLAVE") {
                    status = this.checkMdbRtuOrMdbAsciiDrive();
                    status == false ? status = this.checkSlaveDrive() : true;
                }else if(this.channel.form.driveType == "MOD_BUS_TCP") {
                    status = this.checkMdbTcpDrive();
                }else if(this.item.driveType == "HJ") {
                    status = this.checkMdbTcpDrive();
                    status == false ? status = this.checkHJDrive() : true;
                }else if(this.channel.form.driveType == "MOD_BUS_TCP_SLAVE") {
                    status = this.checkMdbTcpDrive();
                    status == false ? status = this.checkSlaveDrive() : true;
                }else if(this.channel.form.driveType == "OPC_DA") {
                    status = this.checkDaDrive();
                }else if(this.channel.form.driveType == "OPC_DA_HTTP") {
                    status = this.checkDaHttpDrive();
                }else if(this.channel.form.driveType == "OPC_UA") {
                    status = this.checkUaDrive();
                }else if(this.item.driveType == "MQTT_SERVER") {
                    status = this.checkMQTTDrive();
                }
                return status;
            },
            checkDrive() {
                let status = false;
                if(this.drive.form.base.name === '' || this.drive.form.loopCollect.collectInterval === '') {this.$Message.error({content: '请填写驱动名称或者间隔时间...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{0,2}$/.test(this.drive.form.loopCollect.collectInterval)) {this.$Message.error({content: '间隔时间填写1-999之间的数字...', duration: 3});    status = true;}
                else if(!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.drive.form.base.name)) {this.$Message.error({content: '驱动名称不允许特殊符号...', duration: 3});    status = true;}
                return status;
            },
            checkUaDrive() {
                let status = false;
                if(this.drive.form.opcUaConnParams.password === '' || this.drive.form.opcUaConnParams.securitypolicy === '' || this.drive.form.opcUaConnParams.url === '' || this.drive.form.opcUaConnParams.user === '') {
                    this.$Message.error({content: '请填写URL、用户名、密码、安全模式...', duration: 3});    status = true;
                }
                else if(!/^opc.tcp:\/\/((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.drive.form.opcUaConnParams.url)) {this.$Message.error({content: 'URL请填写正确的 opc.tcp://IP:端口 格式...', duration: 3});    status = true;}
                else if(!/^[a-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.drive.form.opcUaConnParams.user)) {this.$Message.error({content: '用户名填写30位以内英文或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.drive.form.opcUaConnParams.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                return status;
            },
            checkDaDrive() {
                let status = false;
                if(this.drive.form.opcDaParams.host === '' || this.drive.form.opcDaParams.password === ''
                    || this.drive.form.opcDaParams.period === '' || this.drive.form.opcDaParams.progid === '' || this.drive.form.opcDaParams.timeout === '' || this.drive.form.opcDaParams.user === '') {
                    this.$Message.error({content: '请填写IP地址、系统用户名、系统密码、时间间隔、程序ID、超时时间...', duration: 3});    status = true;
                }
                // else if(!/^[\da-zA-Z\u4e00-\u9fa5!@#$%^&*]{0,128}$/.test(this.drive.form.opcDaParams.domain)) {this.$Message.error({content: '域名称填写128位以内英文、中文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.drive.form.opcDaParams.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.drive.form.opcDaParams.user)) {this.$Message.error({content: '用户名填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.drive.form.opcDaParams.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{3,}$/.test(this.drive.form.opcDaParams.timeout) || !/^[1-9]\d{3,}$/.test(this.drive.form.opcDaParams.period)) {this.$Message.error({content: '超时时间或时间间隔填写>=1000...', duration: 3});    status = true;}
                return status;
            },
            checkDaHttpDrive() {
                let status = false;
                if(this.drive.form.opcDaHttpParams.groupName === '' || this.drive.form.opcDaHttpParams.password === '' || this.drive.form.opcDaHttpParams.period === '' || this.drive.form.opcDaHttpParams.progid === ''
                    || this.drive.form.opcDaHttpParams.url === '' || this.drive.form.opcDaHttpParams.user === '') {
                    this.$Message.error({content: '请填写URL、程序ID、时间间隔、组名、用户名、密码...', duration: 3});    status = true;
                }
                else if(!/^http:\/\/((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.drive.form.opcDaHttpParams.url)) {this.$Message.error({content: 'URL请填写正确的 http://IP:端口 格式...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z\u4e00-\u9fa5!@#$%^&*]{0,30}$/.test(this.drive.form.opcDaHttpParams.groupName)) {this.$Message.error({content: '组名填写30位以内英文、中文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.drive.form.opcDaHttpParams.user)) {this.$Message.error({content: '用户名填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.drive.form.opcDaHttpParams.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{3,}$/.test(this.drive.form.opcDaHttpParams.period)) {this.$Message.error({content: '时间间隔填写>=1000...', duration: 3});    status = true;}
                return status;
            },
            checkMdbTcpDrive() {
                let status = false;
                if( this.drive.form.tcpPars.port === ''
                    || this.drive.form.tcpPars.timeOut === '') {
                    this.$Message.error({content: '请填写端口、超时时间...', duration: 3});    status = true;
                }
                // else if(!/^[\da-zA-Z\u4e00-\u9fa5!@#$%^&*]{0,30}$/.test(this.modal14.data.tcpPars.groupName)) {this.$Message.error({content: '组名填写30位英文、中文、数字或特殊字符...', duration: 3});    status = true;}
                //lzj
                // else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.drive.form.tcpPars.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}
                // else if(!/^([1-9]|[0-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(this.drive.form.tcpPars.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                else if(!/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.drive.form.tcpPars.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{3,}$/.test(this.drive.form.tcpPars.timeOut)) {this.$Message.error({content: '超时时间填写>=1000...', duration: 3});    status = true;}
                return status;
            },
            checkHJDrive() {
                let status = false;
                if(this.drive.form.name === '') {this.$Message.error({content: '请填写设备名称...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.drive.form.name)) {this.$Message.error({content: '设备名称填写30位以内英文、数字或中文...', duration: 3});    status = true;}
                return status;
            },
            checkMdbRtuOrMdbAsciiDrive() {
                let status = false;
                if(this.drive.form.serialPars.baudRate === '' || this.drive.form.serialPars.dataBits === '' || this.drive.form.serialPars.device === '' || this.drive.form.serialPars.parity === ''
                    || this.drive.form.serialPars.stopBits === '' || this.drive.form.serialPars.timeOut === '') {
                    this.$Message.error({content: '请填写波特率、数据位、串口、校验方式、停止数据位、超时时间...', duration: 3});    status = true;
                }
                else if(!/^\d{0,6}$/.test(this.drive.form.serialPars.baudRate)) {this.$Message.error({content: '波特率填写6位以内数字...', duration: 3});    status = true;}
                else if(!/^\d{0,4}$/.test(this.drive.form.serialPars.dataBits) || !/^\d{0,4}$/.test(this.drive.form.serialPars.stopBits)) {this.$Message.error({content: '数据位或停止位填写4位以内数字...', duration: 3});    status = true;}
                else if(!/^[1-9]\d{3,}$/.test(this.drive.form.serialPars.timeOut)) {this.$Message.error({content: '超时时间填写>=1000...', duration: 3});    status = true;}
                return status;
            },
            checkSlaveDrive() {
                let status = false;
                if(this.drive.form.slaveParameters.offset === '' || this.drive.form.slaveParameters.size === '' || this.drive.form.slaveParameters.slaveId === '') {
                    this.$Message.error({content: '请填写起始数据位、数据位数量、从站ID...', duration: 3});    status = true;
                }
                else if(!/^\d{0,5}$/.test(this.drive.form.slaveParameters.offset) || !/^\d{0,5}$/.test(this.drive.form.slaveParameters.size) || !/^\d{0,5}$/.test(this.drive.form.slaveParameters.slaveId)) {this.$Message.error({content: '从起始数据位、数据点数量、从站ID填写5位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkMQTTDrive() {
                let status = false;
                if(this.drive.form.mqttServerParams.host === '' || this.drive.form.mqttServerParams.username === '' || this.drive.form.mqttServerParams.password === '' || this.drive.form.mqttServerParams.port === '') {
                    this.$Message.error({content: '请填写IP地址、端口、用户名、密码...', duration: 3});    status = true;
                }
                else if(!/^((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(this.drive.form.mqttServerParams.host)) {this.$Message.error({content: '请填写正确的IP格式...', duration: 3});    status = true;}
                else if(!/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/.test(this.drive.form.mqttServerParams.port)) {this.$Message.error({content: '请正确填写端口号(1-65535)...', duration: 3});    status = true;}
                else if(!/^[a-zA-Z\u4e00-\u9fa5_]{0,30}$/.test(this.drive.form.mqttServerParams.username)) {this.$Message.error({content: '用户名填写30位以内英文或中文...', duration: 3});    status = true;}
                else if(!/^[\da-zA-Z!@#$%^&*]{0,30}$/.test(this.drive.form.mqttServerParams.password)) {this.$Message.error({content: '密码填写30位以内英文、数字或特殊字符...', duration: 3});    status = true;}
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
</style>
<style>
.ivu-input[disabled], fieldset[disabled] .ivu-input {
    background-color: #efefef !important;
    opacity: 1;
    cursor: not-allowed;
    color: black;
}
</style>