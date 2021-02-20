<template>
    <div class="container-fluid" style="min-width:0;flex:1;">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs v-if="!loginType" :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <jk_tabsbtn v-if="loginType" :links="links" style="float: left;font-size: 14px;"></jk_tabsbtn>
                    <Button type="primary" v-if="loginType" style="float: right;" @click="addNode('add')">新建节点</Button>
                    <Button v-if="loginType" style="float: right;margin-right: 10px;" icon="ios-cloud-download-outline" @click="downloadNode">下载模板</Button>
                    <Button v-if="loginType" style="float: right;margin-right: 10px;" icon="ios-cloud-upload-outline" @click="uploadNode">导入模板</Button>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 715px;overflow: auto;">
<!--                <div style="float: left;margin-bottom: 10px;">-->
<!--                    <Button style="margin-right: 10px;" size="small" @click="selectAll">全选</Button>-->
<!--                    <Button size="small" @click="Inverse">反选</Button>-->
<!--                </div>-->
                <div style="float: left;margin-bottom: 10px;">
                    <Tag v-if="loginType" style="margin-left:5px;" color="success" type="dot">成功数：{{ statistical.normal }}</Tag>
                    <Tag v-if="loginType" color="warning" style="margin-left:5px;" type="dot">警告数：{{ statistical.warn }}</Tag>
                    <Tag v-if="loginType" color="error" style="margin-left:5px;" type="dot">失败数：{{ statistical.abnormal }}</Tag>
                </div>
                <div style="width: 100%;float: left;">
                    
                    <Table :loading="tableloading" ref="selection" @on-selection-change="changeChose" border :columns="columns1" :data="data1">
    <!--                    <template slot-scope="{ row, index }" slot="state">-->
    <!--                        <Tag v-if="row.base.enable" type="dot" color="success" />-->
    <!--                        <Tag v-else type="dot" color="error" />-->
    <!--&lt;!&ndash;                        <i-Switch v-model="row.base.enable" disabled></i-Switch>&ndash;&gt;-->
    <!--                    </template>-->
                        <template slot-scope="{ row }" slot="action">
                            <!-- <div style="display:flex;width:100%"> -->
                            <!-- <Button type="info" size="small" style="margin-right:3px;" @click="showNode(row.base.uuid)">详情</Button>
                            <Button type="primary" v-if="loginType" size="small" style="margin-right:3px;" @click="updateNode(row.base.uuid,'update')">修改</Button>
                            <Button type="error" v-if="loginType" size="small" style="margin-right:3px;" @click="delNode(row.base.uuid)">删除</Button> -->
                            <div style="display:flex;justify-content: space-around;">
                                <div v-if="loginType" style="margin:0 2px;cursor:pointer" @click="showNode(row.base.uuid)">
                                    <!-- <Icon size="24" type="md-search" /> -->
                                    <img src="../../assets/images/detail3.png" width="21px" height="20px" alt="">
                                </div>
                                
                                <div v-if="loginType" style="margin:0 2px;cursor:pointer" @click="delNode(row.base.uuid)">
                                    <!-- <Icon size="24" type="md-trash" /> -->
                                    <img src="../../assets/images/delete3.png" width="21px" height="18.5px" alt="">
                                </div>
                                <div v-if="loginType" style="margin:0 2px;cursor:pointer;margin-left:4px;" @click="updateNode(row.base.uuid,'update')">
                                    <!-- <Icon size="24" type="md-build" /> -->
                                    <img src="../../assets/images/update3.png" width="21px" height="18.5px" alt="">
                                </div>
                            </div>
                            <!-- </div> -->
                            
                        </template>
                    </Table>
                    
                    <Button size="small" style="margin-top:5px" @click="batchDel" v-if="loginType">批量删除</Button>
                    <div class="foot">
                        <span class="desc" style="font-size: 13px;">查询{{total}}条，当前第{{node.find.page}}页</span>
                        <Page class="btn" @on-change="pageChange" :current="node.find.page" :total="total" :page-size="node.find.size" simple/>
                    </div>
                </div>
            </div>
        </div>

        <Modal
                title="节点信息" :scrollable="true"
                v-model="modal11.show" @on-ok="okAddNode"
                class-name="vertical-center-modal" width="900" :styles="{top: '20px'}">
            <input hidden v-model="modal11.state" />
            <contentTabs :links="NodeInfo"></contentTabs>
            <modbusTabs v-if="item.driveType == 'MOD_BUS_ASCII' || item.driveType == 'MOD_BUS_ASCII_SLAVE' || item.driveType == 'MOD_BUS_RTU' || item.driveType == 'MOD_BUS_RTU_SLAVE' || item.driveType == 'MOD_BUS_TCP' || item.driveType == 'MOD_BUS_TCP_SLAVE'" :links="ModbusInfo"></modbusTabs>
            <numberFormatTabs :links="numberFormatInfo"></numberFormatTabs>
            <!-- <newContentTabs :links="NewNodeInfo"></newContentTabs> -->
            <div slot="footer">
                <Button type="text" size="large" @click="modal11.show = false">取消</Button>
                <Button type="primary" size="large" @click="okAddNode">确定</Button>
            </div>
        </Modal>

        <Modal
                title="上传节点" :scrollable="true"
                v-model="modal12.show" @on-ok="upload" :loading="modal12.loading"
                ok-text="上传" class-name="vertical-center-modal" width="400" :styles="{top: '20px'}">
            <Upload
                    :before-upload="handleUpload"
                    :action="modal12.url">
                <Button style="float: left;" icon="ios-cloud-upload-outline">点击选择文件</Button>
                <div style="float: left;margin: 6px 0 0 20px;" v-if="modal12.file !== null">上传文件 &nbsp;:&nbsp; {{ modal12.file.name }}
                </div>
            </Upload>
            <div>
                <span style="margin-right: 10px;">选择操作:</span>
                <Select v-model="modal12.append" style="width:100px;">
                    <Option :value='1'>覆盖</Option>
                    <Option :value='0'>追加</Option>
                </Select>
            </div>
        </Modal>

        <Modal
                title="节点详情"
                v-model="modal14.show"  :loading="modal14.loading" 
                class-name="vertical-center-modal" width="1000"
                :styles="{top: '20px'}">

                <div @click="modal14.show=false">
                    <detailTabs :links="NodeInfo"></detailTabs>
                <showModbusTabs v-if="item.driveType == 'MOD_BUS_ASCII' || item.driveType == 'MOD_BUS_ASCII_SLAVE' || item.driveType == 'MOD_BUS_RTU' || item.driveType == 'MOD_BUS_RTU_SLAVE' || item.driveType == 'MOD_BUS_TCP' || item.driveType == 'MOD_BUS_TCP_SLAVE'" :links="ModbusInfo"></showModbusTabs>
                <numberFormatTabs :links="numberFormatInfo"></numberFormatTabs>
                </div>
                <div slot="footer">
                    <Button type="error" style="background-color:#faf8f7;border-color:white" size="small" >&nbsp;</Button>
                </div>
                
        </Modal>
    </div>
</template>

<script>
    import JkTabsbtn from "@/components/JkTabsBtn.vue";
    import JkTabs from "@/components/JkTabs.vue";
    import contentTabs from "./ContentTabs";
    import detailTabs from "./DetailTabs";
    import modbusTabs from "./ModbusTabs";
    import numberFormatTabs from "./NumberFormatTabs";
    import newContentTabs from "./NewContentTabs";
    // import updateModbusTabs from "./UpdateModbusTabs";
    import showModbusTabs from "./ShowInfoModbusTabs";
    import {formatDate} from "@/util/date";
    import axios from 'axios'
    export default {
        name: "NodeConfig",
        inject: ["reload"],
        components: {
            jk_tabs: JkTabs,jk_tabsbtn: JkTabsbtn, contentTabs, modbusTabs, numberFormatTabs,detailTabs,showModbusTabs,
        },
        data(){
            return {
                //收录是否连接websocket，如果连接得话翻页不添加加载中动画
                connWebSocketSatuts:false,
                // temp:[{item:1}],
                tableloading: false,
                statistical:{
                    abnormal: 0,
                    normal: 0,
                    warn: 0,
                },
                shownumberFormatTabs:true,
                keeplinks:[],
                footer_hide:false,
                keeppagechangecolumns:[],
                columns1: [
                    {
                        // fixed: "left",
                        title:"",
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {title: '名称', minWidth: 150,align: 'center', render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                                    domProps: {title: params.row.dataItem.name}},
                                    params.row.dataItem.name == undefined?"无":params.row.dataItem.name)])}},
                    // {title: '节点名', align: 'center', 
                    // // fixed: "left",
                    //  minWidth: 150, render: (h, params) => {return h('span', params.row.base.name);}},
                    // // {title: '是否运行', key: 'state', fixed: "left", align: 'center', width: 100, render: (h, params) => {return h("i-Switch", {props: {disabled: true, value: params.row.base.enable}})}},
                    {
                        title: '状态', key: 'state', 
                        // fixed: "left", 
                        align: 'center', width: 95,sortable: true,
                        render: (h, params) => {
                            let state = params.row.base.enable;
                            // let text = params.row.state ? '是' : '否';
                            let color = params.row.base.enable ? 'success' : 'error';
                            if (state) {
                                // return h('div', {
                                //         style: {
                                //             minWidth: '35px',
                                //             color:"green",
                                //         }
                                //     }, "运行中"
                                // )
                                return h("Tag", {style: {paddingLeft: '18px',border:"none !important"},props: {type: "dot", color: "success"}},)
                                // render: (h, params) => {
                                //     return h('img', {
                                //         style: {//设置样式
                                //             'width': '80px',
                                //             'height': '80px',
                                //             'border-radius': '5%'
                                //         },
                                //         attrs: {//设置属性
                                //             src: 
                                //         }
                                //     });
                                // }
                            } else {
                                // return h('div', {
                                //         style: {
                                //             minWidth: '35px',
                                //             color:"red",
                                //         }
                                //     }, "禁用"
                                // )
                                return h("Tag", {style: {paddingLeft: '18px',border:"none !important"},props: {type: "dot", color: "error"}},)
                            }
                        }
                    },
                    // {title: '高报', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.base.highAlarm);}},
                    // {title: '高高报', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.base.hhighAlarm);}},
                    // {title: '低报', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.base.lowAlarm);}},
                    // {title: '低低报', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.base.llowAlarm);}},
                    {title: '指标编码', align: 'center', width: 140, render: (h, params) => {return h('span', params.row.base.indexCode);}},
                    // {title: '小位数', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.numberFormat != null ? params.row.numberFormat.decimal : '');}},
                    // {title: '格式化表达式', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.numberFormat != null ? params.row.numberFormat.exp : '');}},
                    // {title: '格式化方式', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.numberFormat != null ? params.row.numberFormat.formatEnum : '');}},
                    
                    {title: '创建时间', align: 'center', width: 180, render: (h, params) => {let data = this.$util.time_stamp2time_date(params.row.base.createTime);
                            return h('span', data.format("yyyy-MM-dd hh:mm:ss"));}},
                    
                ],
                columns2: [],
                data1: [],
                data2: [],
                uuid: null,
                total: 0,
                page: {
                    form: {
                        page: 1,
                        size: 10,
                    }
                },
                updateData: [],
                node: {
                    data: {
                        base: {
                            driveUuid: null,
                            enable: false,
                            highAlarm: null,
                            hhighAlarm: null,
                            lowAlarm: null,
                            llowAlarm: null,
                            indexCode: null,
                            name: null
                        },
                        numberFormat: {
                            decimal: null,
                            exp: null,
                            formatEnum: null
                        },
                        // uaDataItem: {
                        //     name: null,
                        //     nameSpaceIndex: null,
                        //     type: null
                        // }
                    },
                    find: {
                        page: 1,
                        size: 10,
                        sorts: [{filed: "name", order: true}]
                    },
                    url: null
                },
                modal11: {
                    show: false,
                    state: null,
                },
                NodeInfo: [],
                ModbusInfo: [],
                numberFormatInfo: [],
                updateModbusInfo: [],
                delArr: [],//批量删除数组
                // uploadNode: null,
                // uploadData: {driveUuid: null},
                modal12: {
                    show: false,
                    url: '',
                    file: null,
                    append: 1,
                    loading: true
                },
                modal13: false,
                uuidList: [],
                loginType: null,//系统类型

                //节点详情
                modal14: {
                    show: false,
                    url: '',
                    file: null,
                    append: 1,
                    loading: true
                },



                item: {},
                url: null,
                driveType: null,

                links: [
                    {name: "驱动配置", to: "/engineering/collectionService/driveConfig"},
                    {name: "节点配置", to: "/engineering/collectionService/nodeConfig"}
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
                ],
                NewNodeInfo:[],
            }
        },
        // watch: {
        //     tableloadingshow: {
        //         handler(newName, oldName) {
        //             setTimeout(() => {
        //                 this.tableloading = false
        //             }, 250);
        //         },
        //         // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
        //         // immediate: true
        //     }
        // },
        created: function() {

        },
        mounted: function() {
            if(this.$storage.getStorage("loginType") == "true") {this.loginType = true;} else {this.loginType = false; this.columns1.splice(4, 1);}
            this.showData();
            if(this.loginType == true){
                this.columns1.push(
                {title: '操作', slot: 'action',
                 fixed: "right",
                width: 100, align: 'center'},)
            }
            this.keeppagechangecolumns = JSON.parse(JSON.stringify(this.columns1))
            // else if(this.loginType == false){
            //     this.columns1.push(
            //     {title: '操作', slot: 'action',
            //      fixed: "right",
            //     width: 80, align: 'center'},)
            // }
            // if(this.loginType == true){
            //     setTimeout(() => {
            //     // this.tableloading = false
            // }, 2500);
            // }else{
            //     // this.tableloading = false
            // }
            
        },
        methods: {
            showData(){
                this.item = JSON.parse(this.$storage.getStorage("getItem"));

                if(this.item.driveType == "CJ" || this.item.driveType == "DL" || this.item.driveType == "HJ" || this.item.driveType == "MQTT_SERVER") {
                    this.columns1.splice(3, 1);
                }

                if(this.item.driveType == "MOD_BUS_ASCII") {
                    this.node.url = this.$api.collect.itemModbusascii.url;
                }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE") {
                    this.node.url = this.$api.collect.itemModbusasciislave.url;
                }else if(this.item.driveType == "MOD_BUS_RTU") {
                    this.node.url = this.$api.collect.itemModbusrtu.url;
                }else if(this.item.driveType == "MOD_BUS_RTU_SLAVE") {
                    this.node.url = this.$api.collect.itemModbusrtuslave.url;
                }else if(this.item.driveType == "MOD_BUS_TCP") {
                    this.node.url = this.$api.collect.itemModbustcp.url;
                }else if (this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                    this.node.url = this.$api.collect.itemModbustcpslave.url;
                }else if(this.item.driveType == "OPC_UA") {
                    this.node.url = this.$api.collect.itemOpcua.url;
                    this.columns1.push(
                        // {title: '数据点名称',  width: 150, align: 'center', render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                        //             domProps: {title: params.row.dataItem.name}}, params.row.dataItem.name)])}},
                        // {title: '命名空间下标', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.dataItem.nameSpaceIndex);}},
                        // {title: '数据点类型', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.dataItem.type);}},
                    );
                    if(this.loginType == false){
                        this.columns1.push(
                            // {title: '数据点名称',  width: 150, align: 'center', render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                            //             domProps: {title: params.row.dataItem.name}}, params.row.dataItem.name)])}},
                            // {title: '命名空间下标', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.dataItem.nameSpaceIndex);}},
                            // {title: '数据点类型', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.dataItem.type);}},
                        );
                    }
                }else if(this.item.driveType == "OPC_DA_HTTP") {
                    this.node.url = this.$api.collect.itemOpcdahttp.url;
                }else if(this.item.driveType == "OPC_DA") {
                    this.node.url = this.$api.collect.itemOpcda.url;
                }else if(this.item.driveType == "CJ") {
                    this.node.url = this.$api.collect.item.url + '/cj';
                    this.columns1.push(
                        {title: '计算仪表地址', align: 'center', width: 200, render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                                domProps: {title: params.row.address}}, params.row.address)])}},
                        {title: '仪表类型', align: 'center', width: 195, render: (h, params) => {let data = null; if(params.row.deviceType == 10) data = '冷水水表'; else if(params.row.deviceType == 11) data = '生活热水水表';
                            else if(params.row.deviceType == 12) data = '直饮水水表'; else if(params.row.deviceType == 13) data = '中水水表'; else if(params.row.deviceType == 20) data = '热量表(记热)'; else if(params.row.deviceType == 21) data = '热量表(记冷)';
                            else if(params.row.deviceType == 30) data = '燃气表'; else if(params.row.deviceType == 40) data = '电度表'; return h('span', data);}},
                        {title: '计算精度', align: 'center', width: 180, render: (h, params) => {return h('span', params.row.precisionIndex);}},
                    );
                }else if(this.item.driveType == "DL") {
                    this.node.url = this.$api.collect.item.url + '/dl';
                    this.columns1.push(
                        {title: '电表地址', align: 'center', width: 200, render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                                domProps: {title: params.row.address}}, params.row.address)])}},
                        {title: '数据标识', align: 'center', width: 195, render: (h, params) => {return h('span', params.row.dataArea);}},
                        {title: '计算精度', align: 'center', width: 180, render: (h, params) => {return h('span', params.row.precisionIndex);}},
                    );
                }else if(this.item.driveType == "HJ") {
                    this.node.url = this.$api.collect.item.url + '/hj';
                    this.columns1.push(
                        {title: '数据点名', align: 'center', render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                                domProps: {title: params.row.name}}, params.row.name)])}},
                    );
                }else if(this.item.driveType == "MQTT_SERVER") {
                    this.node.url = this.$api.collect.item.url + '/mqttserver';
                    this.columns1.push(
                        {title: '节点名', align: 'center', 
                        minWidth: 150, render: (h, params) => {return h('span', params.row.base.name);}},
                        {title: '客户端ID', align: 'center', render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                                domProps: {title: params.row.clientId}}, params.row.clientId)])}},
                    );
                }

                if(this.item.driveType == "MOD_BUS_ASCII"  || this.item.driveType == "MOD_BUS_RTU"  || this.item.driveType == "MOD_BUS_TCP") {
                    if(this.loginType == false){
                        this.columns1.push(
                            {title: '数据点起始位', align: 'center', width: 130, render: (h, params) => {return h('span', params.row.dataItem.offset);}},
                            {title: '数据位数量', align: 'center', width: 110, render: (h, params) => {return h('span', params.row.dataItem.quantity);}},
                            {title: '从站ID', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.dataItem.slaveid);}},
                            // {title: '类型', align: 'center', width: 100, render: (h, params) => {return h('span', params.row.dataItem.type);}},
                        )
                    }
                    this.columns1.push(
                        // {title: '字节码类型', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.dataItem.bytesType);}},
                        // {title: '功能码', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.dataItem.fncode);}},
                        // {title: '名称', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.dataItem.name);}},
                        // {title: '采集时间', align: 'center', width: 180, render: (h, params) => {return h('span', params.row.webSocket != undefined ? this.$util.time_stamp2time_date(params.row.webSocket.dataTimestamp).format("MM-dd hh:mm:ss.SSS") : '');}},
                        // {title: '数据质量', align: 'center', width: 120, render: (h, params) => { let dataQuality = null; let data = null; params.row.webSocket != undefined ? dataQuality = params.row.webSocket.dataQuality : dataQuality = '';  if(dataQuality == 192) {data = '良好'} else if(dataQuality == 64) {data = '警告'} else {data = '异常'};
                        //  return h('Tooltip', {props: {placement: "right", content: dataQuality, maxWidth: "600"}}, data);}},
                        // {title: '数据点起始位', align: 'center', width: 130, render: (h, params) => {return h('span', params.row.dataItem.offset);}},
                        // {title: '数据位数量', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.dataItem.quantity);}},
                        // {title: '从站ID', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.dataItem.slaveid);}},
                        // {title: '类型', align: 'center', width: 100, render: (h, params) => {return h('span', params.row.dataItem.type);}},
                        // {title: 'CT运算/初级值', align: 'center', width: 120, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.ct != null) ? params.row.numberOperation.ct.primary : '');}},
                        // {title: 'CT运算/priority', align: 'center', width: 130, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.ct != null) ? params.row.numberOperation.ct.priority : '');}},
                        // {title: 'PT运算/初级值', align: 'center', width: 120, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.pt != null) ? params.row.numberOperation.pt.primary : '');}},
                        // {title: 'PT运算/priority', align: 'center', width: 130, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.pt != null) ? params.row.numberOperation.pt.priority : '');}},
                        // {title: '超出量程', align: 'center', width: 120, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.rc != null) ? params.row.numberOperation.rc.defValue : '');}},
                        // {title: '转换最大值', align: 'center', width: 120, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.rc != null) ? params.row.numberOperation.rc.maxChange : '');}},
                        // {title: '量程最大值', align: 'center', width: 120, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.rc != null) ? params.row.numberOperation.rc.maxValue : '');}},
                        // {title: '转换最小值', align: 'center', width: 120, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.rc != null) ? params.row.numberOperation.rc.minChange : '');}},
                        // {title: '量程最小值', align: 'center', width: 120, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.rc != null) ? params.row.numberOperation.rc.minValue : '');}},
                        // {title: '量程/priority', align: 'center', width: 120, render: (h, params) => {return h('span', (params.row.numberOperation != null && params.row.numberOperation.rc != null) ? params.row.numberOperation.rc.priority : '');}},
                    );

                }else if(this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU_SLAVE" || this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                    if(this.loginType == false){
                        this.columns1.push(
                            {title: '数据点起始位', align: 'center', width: 130, render: (h, params) => {return h('span', params.row.dataItem.offset);}},
                            {title: '数据位数量', align: 'center', width: 110, render: (h, params) => {return h('span', params.row.dataItem.quantity);}},
                            // {title: '从站ID', align: 'center', width: 80, render: (h, params) => {return h('span', params.row.dataItem.slaveid);}},
                            // {title: '类型', align: 'center', width: 100, render: (h, params) => {return h('span', params.row.dataItem.type);}},
                        )
                    }
                }
                else if(this.item.driveType == "OPC_DA" || this.item.driveType == "OPC_DA_HTTP") {
                    this.columns1.push(
                        // {title: '数据点名称', align: 'center', width: 210, render: (h, params) => {return h('span', params.row.dataItem.name);}},
                        // {title: '数据点类型', align: 'center', width: 185, render: (h, params) => {return h('span', params.row.dataItem.type);}},
                    );
                }
                // this.uploadNode = this.node.url+"/actions/upexcel";

                // this.$https.fetchPost(this.node.url+"/"+this.item.uuid, this.node.find).then((resp) => {
                //     this.data1 = resp.data.data.data;
                //     this.total = resp.data.data.count;
                //     this.uuidList = [];
                //     for(let i in this.data1) {
                //         this.uuidList.push(this.data1[i].base.uuid);
                //     }
                //     this.connWebSocket();
                // }).catch(err => {
                //     console.log(err)
                // })
                this.findData();
            },
            findData() {
                //请求
                this.$https.fetchPost(this.node.url+"/"+this.item.uuid, this.node.find).then((resp) => {
                    
                    this.data1 = resp.data.data.data;
                    this.total = resp.data.data.count;
                    // console.log(this.columns1)
                    this.uuidList = [];
                    for(let i in this.data1) {
                        this.uuidList.push(this.data1[i].base.uuid);
                    }
                    // if(this.loginType == true){
                        //旧版socket连接
                        // this.webSocket.send()
                        this.connWebSocket();
                    // } else { 
                        
                    // }
                    
                }).catch(err => {
                    console.log(err)
                })
            },
            findPageChangeData() {
                if(this.connWebSocketSatuts){
                    this.tableloading = true
                }
                //请求
                this.$https.fetchPost(this.node.url+"/"+this.item.uuid, this.node.find).then((resp) => {
                    this.data1 = resp.data.data.data
                    // console.log(this.data1);
                    this.total = resp.data.data.count;
                    this.uuidList = [];
                    for(let i in this.data1) {
                        this.uuidList.push(this.data1[i].base.uuid);
                    }
                    this.send();
                    // this.columns1 = this.keeppagechangecolumns
                }).catch(err => {
                    console.log(err)
                })
            },
            // formatDate(time) {
            //     var date = new Date(time);
            //     return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            // },
            pageChange(page){
                // console.log(this.node.find)
                // this.tableloading = true
                this.node.find.page = page;
                this.findPageChangeData();
                // setTimeout(() => {
                //     this.tableloading = false
                // }, 3000);
            },
            addNode(state) {
                if(this.item.driveType == "CJ" || this.item.driveType == "DL" || this.item.driveType == "HJ" || this.item.driveType == "MQTT_SERVER") {
                    this.NodeInfo = [
                        {title: "基本信息", data: "base", child: [
                                {name: "节点名", input: true, sign: true, data: "name", val: ''},
                                {name: "状态", swith: true, data: "enable", val: true}
                            ]}
                    ];
                    if(state == "add") {
                        this.node.data = {base: {driveUuid: null, enable: false, name: null},};
                    }else if(state == "update") {
                        this.NodeInfo[0].child[0].disabled = true;
                        this.node.data = {base: {uuid: null, enable: false},};
                    }
                }else {
                    this.NodeInfo = [
                        {title: "基本信息", data: "base", child: [
                            {name: "节点名", input: true, sign: true, data: "name", val: ''},
                            {name: "指标编码", input: true, sign: true, data: "indexCode", val: ''},
                            {name: "高报", input: true, data: "highAlarm", val: '80'},
                            {name: "高高报", input: true, data: "hhighAlarm", val: '100'},
                            {name: "低报", input: true, data: "lowAlarm", val: '20'},
                            {name: "低低报", input: true, data: "llowAlarm", val: '0'},
                            {name: "状态", swith: true, data: "enable", val: true}
                        ]}
                    ];
                    //     this.NewNodeInfo[0] = {title: "详细信息", data: "base", child: [
                    //     {name: "高报", input: true, data: "highAlarm", val: '80'},
                    //     {name: "高高报", input: true, data: "hhighAlarm", val: '100'},
                    //     {name: "低报", input: true, data: "lowAlarm", val: '20'},
                    //     {name: "低低报", input: true, data: "llowAlarm", val: '0'},
                    // ]}
                    if(state == "add") {
                        this.node.data = {
                            base: {driveUuid: null, enable: false, name: null, indexCode: null, highAlarm: '80', hhighAlarm: '100', lowAlarm: '20', llowAlarm: '0'},
                        };
                    }else if(state == "update") {
                        this.NodeInfo[0].child[0].disabled = true;
                        this.node.data = {
                            base: {uuid: null, enable: false, name: null, indexCode: null, highAlarm: null, hhighAlarm: null, lowAlarm: null, llowAlarm: null},
                        };
                    }else if(state == "showinfo"){
                        this.NodeInfo[0].child[0].disabled = true;
                        this.node.data = {
                            base: {uuid: null, enable: false, name: null, indexCode: null, highAlarm: '80', hhighAlarm: '100', lowAlarm: '20', llowAlarm: '0'},
                        }
                        this.NodeInfo = [
                        {title: "基本信息", data: "base", child: [
                            {name: "节点名", input: true, sign: true, data: "name", val: ''},
                            {name: "指标编码", input: true, sign: true, data: "indexCode", val: ''},
                            {name: "高报", input: true, data: "highAlarm", val: '80'},
                            {name: "高高报", input: true, data: "hhighAlarm", val: '100'},
                            {name: "低报", input: true, data: "lowAlarm", val: '20'},
                            {name: "低低报", input: true, data: "llowAlarm", val: '0'},
                            {name: "状态", swith: true, data: "enable", val: true}
                        ]}
                    ];
                    }
                }





                if(this.item.driveType == "MOD_BUS_ASCII" ||  this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "MOD_BUS_TCP" ) {
                    this.NodeInfo.push(
                        {title: "modbus数据点信息", data: "dataItem", child: [
                                {name: "数据点名称", input: true, sign: true, data: "name", val: ''},
                                {name: "从站ID", input: true, data: "slaveid", val: '1'},
                                {name: "功能码", input: true, sign: true, data: "fncode", val: ''},
                                {name: "数据点起始位", input: true, data: "offset", val: '0'},
                                {name: "类型", select: true, data: "type", val: 'VShort', cityList: [{name: '整型(VInt)',val: 'VInt'},{name: '短整型(VShort)',val: 'VShort'},{name: '长整型(VLong)',val: 'VLong'},{name: '双精度浮点(VDouble)',val: 'VDouble'},{name: '单精度浮点(VFloat)',val: 'VFloat'},{name: '字符串(VString)',val: 'VString'},{name: '布尔值(VBoolean)',val: 'VBoolean'}]},
                                {name: "字节码类型", select: true, data: "bytesType", val: 1, cityList: [{name: 'Big-endian',val: 1},{name: 'Little-endian',val: 2},{name: 'Big-endian byte swap',val: 3},{name: 'Little-endian byte swap',val: 4}]},
                                {name: "数据位数量", input: true, data: "quantity", val: '1'},
                                // {name: "数据名称", input: true, sign: true, data: "name", val: ''},
                                // {name: "指标编码", input: true, sign: true, data: "indexCode", val: ''},
                        ]},   
                    );
                    this.ModbusInfo = [
                        {title: "数据运算", data: "numberOperation", arr: true, child: [], checkAllGroup: []}
                    ];
                    this.node.data.dataItem = {bytesType: null, fncode: null, name: null, offset: null, slaveid: null, type: null};
                    // this.node.data.numberOperation = {ct: {primary: null, priority: null}, hem: {ctPrimary: null, priority: null, ptPrimary: null},
                    //             lem: {ctPrimary: null, priority: null}, pt: {primary: null, priority: null}, rc: {defValue: null, maxChange: null, maxValue: null, minChange: null, minValue: null, priority: null}}
                }else if( this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU_SLAVE" || this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                    this.NodeInfo.push(
                        {title: "modbus数据点信息", data: "dataItem", child: [
                                {name: "数据点名称", input: true, sign: true, data: "name", val: ''},
                                // {name: "从站ID", input: true, data: "slaveid", val: '1'},
                                // {name: "功能码", input: true, sign: true, data: "fncode", val: ''},
                                {name: "数据点起始位", input: true, data: "offset", val: '0'},
                                {name: "类型", select: true, data: "type", val: 'VShort', cityList: [{name: '整型(VInt)',val: 'VInt'},{name: '短整型(VShort)',val: 'VShort'},{name: '长整型(VLong)',val: 'VLong'},{name: '双精度浮点(VDouble)',val: 'VDouble'},{name: '单精度浮点(VFloat)',val: 'VFloat'},{name: '字符串(VString)',val: 'VString'}]},
                                {name: "字节码类型", select: true, data: "bytesType", val: 1, cityList: [{name: 'Big-endian',val: 1},{name: 'Little-endian',val: 2},{name: 'Big-endian byte swap',val: 3},{name: 'Little-endian byte swap',val: 4}]},
                                {name: "数据位数量", input: true, data: "quantity", val: '1'},
                                // {name: "数据名称", input: true, sign: true, data: "name", val: ''},
                                // {name: "指标编码", input: true, sign: true, data: "indexCode", val: ''},
                        ]},   
                    );
                    this.ModbusInfo = [
                        {title: "数据运算", data: "numberOperation", arr: true, child: [], checkAllGroup: []}
                    ];
                    this.node.data.dataItem = {bytesType: null, fncode: null, name: null, offset: null, slaveid: 1, type: null,fncode:1};
                    // this.node.data.numberOperation = {ct: {primary: null, priority: null}, hem: {ctPrimary: null, priority: null, ptPrimary: null},
                    //             lem: {ctPrimary: null, priority: null}, pt: {primary: null, priority: null}, rc: {defValue: null, maxChange: null, maxValue: null, minChange: null, minValue: null, priority: null}}
                }
                else if(this.item.driveType == "OPC_DA" || this.item.driveType == "OPC_DA_HTTP") {
                    this.NodeInfo.push(
                        {title: "数据点信息", data: "dataItem", child: [
                                {name: "名称", input: true, sign: true, data: "name", val: ''},
                                {name: "类型", select: true, val: 'VShort', data: "type", cityList: [{name: '整型(VInt)',val: 'VInt'},{name: '短整型(VShort)',val: 'VShort'},{name: '长整型(VLong)',val: 'VLong'},{name: '双精度浮点(VDouble)',val: 'VDouble'},{name: '单精度浮点(VFloat)',val: 'VFloat'},{name: '字符串(VString)',val: 'VString'},{name: '布尔值(VBoolean)',val: 'VBoolean'}]}
                            ]}
                    );
                    this.node.data.dataItem = {name: null, type: null};

                }else if(this.item.driveType == "OPC_UA") {
                    this.NodeInfo.push(
                        {title: "Ua数据点信息", data: "dataItem", child: [
                                {name: "名称", input: true, sign: true, data: "name", val: ''},
                                // {name: "命名空间下标", input: true, data: "nameSpaceIndex", val: '2'},
                                {name: "类型", select: true, val: 'VShort', data: "type", cityList: [{name: '整型(VInt)',val: 'VInt'},{name: '短整型(VShort)',val: 'VShort'},{name: '长整型(VLong)',val: 'VLong'},{name: '双精度浮点(VDouble)',val: 'VDouble'},{name: '单精度浮点(VFloat)',val: 'VFloat'},{name: '字符串(VString)',val: 'VString'},{name: '布尔值(VBoolean)',val: 'VBoolean'}]}
                            ]}
                    );
                    this.node.data.dataItem = {name: null, nameSpaceIndex: null, type: null,nameSpaceIndex:'2'};
                }else if(this.item.driveType == "CJ") {
                    this.NodeInfo.push(
                        {title: "计算仪表地址", data: "address", child: [{name: '地址', input: true, sign: true, data: "address", val: ''},]},
                        {title: "仪表类型", data: "deviceType", child: [{name: '类型', select: true, sign: true, data: "deviceType", val: 10, cityList: [{name: '冷水水表',val: 10},{name: '生活热水水表',val: 11},{name: '直饮水水表',val: 12},{name: '中水水表',val: 13},{name: '热量表(记热)',val: 20},{name: '热量表(记冷)',val: 21},{name: '燃气表',val: 30},{name: '电度表',val: 40}]},]},
                        {title: "计算精度", data: "precisionIndex", child: [{name: '精度', input: true, sign: true, data: "precisionIndex", val: ''},]}
                    );
                    this.node.data.address = null;
                    this.node.data.deviceType = null;
                    this.node.data.precisionIndex = null;
                }else if(this.item.driveType == "DL") {
                    this.NodeInfo.push(
                        {title: "电表地址", data: "address", child: [{name: '地址', input: true, sign: true, data: "address", val: ''},]},
                        {title: "数据标识", data: "dataArea", child: [{name: '标识', input: true, sign: true, data: "dataArea", val: ''},]},
                        {title: "计算精度", data: "precisionIndex", child: [{name: '精度', input: true, sign: true, data: "precisionIndex", val: ''},]}
                    );
                    this.node.data.address = null;
                    this.node.data.dataArea = null;
                    this.node.data.precisionIndex = null;
                }else if(this.item.driveType == "HJ") {
                    this.NodeInfo.push(
                        {title: "数据点名", data: "name", child: [{name: '名称', input: true, sign: true, data: "name", val: ''},]},
                    );
                    this.node.data.name = null;
                }else if(this.item.driveType == "MQTT_SERVER") {
                    this.NodeInfo.push(
                        {title: "客户端id", data: "clientId", child: [{name: 'id', input: true, sign: true, data: "clientId", val: ''},]}
                    );
                    this.node.data.clientId = null;
                }

                if(this.item.driveType != "CJ" && this.item.driveType != "DL" && this.item.driveType != "HJ" && this.item.driveType != "MQTT_SERVER") {
                    this.numberFormatInfo = [
                        {title: "数据格式化", data: "numberFormat", child: [
                            {name: "格式化方式", select: true, data: "formatEnum", val: 'NONE', cityList: [{name: 'NONE (默认格式)',val: 'NONE'},{name: 'ABS (绝对值)',val: 'ABS'},{name: 'DECIMALS (保留小数位位数)',val: 'DECIMALS'},{name: 'EXP (自定义格式)',val: 'EXP'}]}
                        ]}
                    ];
                }
                // if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "MOD_BUS_RTU_SLAVE" || this.item.driveType == "MOD_BUS_TCP" || this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                //     this.NewNodeInfo[0] = {title: "详细信息", data: "base", child: [
                //         {name: "高报", input: true, data: "highAlarm", val: '80'},
                //         {name: "高高报", input: true, data: "hhighAlarm", val: '100'},
                //         {name: "低报", input: true, data: "lowAlarm", val: '20'},
                //         {name: "低低报", input: true, data: "llowAlarm", val: '0'},
                //     ]}
                // }
                this.modal11.show = !this.modal11.show;
                this.modal11.state = "add";
            },
            okAddNode() {
                console.log(this.NodeInfo,"this.nodeinfo")
                if(this.item.driveType != "CJ" && this.item.driveType != "DL" && this.item.driveType != "HJ" && this.item.driveType != "MQTT_SERVER") {
                    if(this.numberFormatInfo[0].child[0].val == "EXP") {
                        this.node.data.numberFormat = {exp: null, formatEnum: null};
                    }else if(this.numberFormatInfo[0].child[0].val == "DECIMALS") {
                        this.node.data.numberFormat = {decimal: null, formatEnum: null};
                    }else if(this.numberFormatInfo[0].child[0].val == "ABS") {
                        this.node.data.numberFormat = {formatEnum: null};
                    }

                    if(this.numberFormatInfo[0].child[0].val != null && this.numberFormatInfo[0].child[0].val != "NONE") {
                        for(let i in this.numberFormatInfo) {
                            let data = this.numberFormatInfo[i].data;
                            for(let j in this.numberFormatInfo[i].child) {
                                let name = this.numberFormatInfo[i].child[j].data;
                                this.node.data[data][name] = this.numberFormatInfo[i].child[j].val;
                            }
                        }
                    }
                }

                if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "MOD_BUS_RTU_SLAVE" || this.item.driveType == "MOD_BUS_TCP" || this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                    this.node.data.numberOperation = {};
                    for(let i in this.ModbusInfo[0].checkAllGroup) {
                        if(this.ModbusInfo[0].checkAllGroup[i] == "CT运算") {
                            this.node.data.numberOperation.ct = {primary: null, priority: i};
                        }else if(this.ModbusInfo[0].checkAllGroup[i] == "高压电表读数运算") {
                            this.node.data.numberOperation.hem = {ctPrimary: null, priority: i, ptPrimary: null};
                        }else if(this.ModbusInfo[0].checkAllGroup[i] == "电压电表读数运算") {
                            this.node.data.numberOperation.lem = {ctPrimary: null, priority: i};
                        }else if(this.ModbusInfo[0].checkAllGroup[i] == "PT运算") {
                            this.node.data.numberOperation.pt = {primary: null, priority: i};
                        }else if(this.ModbusInfo[0].checkAllGroup[i] == "量程转换") {
                            this.node.data.numberOperation.rc = {defValue: null, maxChange: null, maxValue: null, minChange: null, minValue: null, priority: i};
                        }
                    }

                }
                // Object.assign(this.updateModbusInfo,this.ModbusInfo);

                for(let i in this.NodeInfo) {
                    let data = this.NodeInfo[i].data;
                    // if(this.NodeInfo[i].arr) {
                    //     for(let j in this.NodeInfo[i].child) {
                    //         let name = this.NodeInfo[i].child[j].data;
                    //         for(let z in this.NodeInfo[i].child[j].child) {
                    //             let name1 = this.NodeInfo[i].child[j].child[z].data;
                    //             this.node.data[data][name][name1] = this.NodeInfo[i].child[j].child[z].val;
                    //         }
                    //     }
                    // }else {
                    if(this.item.driveType == "CJ" || this.item.driveType == "DL" || this.item.driveType == "HJ" || this.item.driveType == "MQTT_SERVER") {
                        this.node.data.base.name = this.NodeInfo[0].child[0].val;
                        this.node.data.base.enable = this.NodeInfo[0].child[1].val;
                    }
                    if(this.item.driveType == "CJ") {
                        this.node.data.address = this.NodeInfo[1].child[0].val;
                        this.node.data.deviceType = this.NodeInfo[2].child[0].val;
                        this.node.data.precisionIndex = this.NodeInfo[3].child[0].val;
                    }else if(this.item.driveType == "DL") {
                        this.node.data.address = this.NodeInfo[1].child[0].val;
                        this.node.data.dataArea = this.NodeInfo[2].child[0].val;
                        this.node.data.precisionIndex = this.NodeInfo[3].child[0].val;
                    }else if(this.item.driveType == "HJ") {
                        this.node.data.name = this.NodeInfo[1].child[0].val;
                    }else if(this.item.driveType == "MQTT_SERVER") {
                        this.node.data.clientId = this.NodeInfo[1].child[0].val;
                    }else {
                        for(let j in this.NodeInfo[i].child) {
                            let name = this.NodeInfo[i].child[j].data;
                            this.node.data[data][name] = this.NodeInfo[i].child[j].val;
                            // }
                        }
                    }
                }
                
                if(this.ModbusInfo.length != 0) {
                    for(let i in this.ModbusInfo) {
                        let data = this.ModbusInfo[i].data;
                        for(let j in this.ModbusInfo[i].child) {
                            let name = this.ModbusInfo[i].child[j].data;
                            for(let z in this.ModbusInfo[i].child[j].child) {
                                let name1 = this.ModbusInfo[i].child[j].child[z].data;
                                this.node.data[data][name][name1] = this.ModbusInfo[i].child[j].child[z].val;
                            }
                        }
                    }
                }
                // if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "MOD_BUS_RTU_SLAVE" || this.item.driveType == "MOD_BUS_TCP" || this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                //     console.log(this.node.data.base)
                //     console.log(this.NewNodeInfo[0].child)
                //     for(let i in this.NewNodeInfo[0].child){
                //         if(this.NewNodeInfo[0].child[i].data == "highAlarm"){
                //             this.node.data.base.highAlarm = this.NewNodeInfo[0].child[i].val
                //         }
                //         if(this.NewNodeInfo[0].child[i].data == "hhighAlarm"){
                //             this.node.data.base.hhighAlarm = this.NewNodeInfo[0].child[i].val
                //         }
                //         if(this.NewNodeInfo[0].child[i].data == "lowAlarm"){
                //             this.node.data.base.lowAlarm = this.NewNodeInfo[0].child[i].val
                //         }
                //         if(this.NewNodeInfo[0].child[i].data == "llowAlarm"){
                //             this.node.data.base.llowAlarm = this.NewNodeInfo[0].child[i].val
                //         }
                //     }
                // }
                let status = this.checkNode();
                let status1 = null;
                if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "MOD_BUS_RTU_SLAVE" || this.item.driveType == "MOD_BUS_TCP" || this.item.driveType == "MOD_BUS_TCP_SLAVE") {
                    status1 = this.checkMdbNode();
                    if(!status1 && this.node.data.numberOperation.lem != null) {
                        status1 = this.checkMdbLemNode();
                    }
                    if(!status1 && this.node.data.numberOperation.ct != null) {
                        status1 = this.checkMdbCtNode();
                    }
                    if(!status1 && this.node.data.numberOperation.hem != null) {
                        status1 = this.checkMdbHemNode();
                    }
                    if(!status1 && this.node.data.numberOperation.pt != null) {
                        status1 = this.checkMdbPtNode();
                    }
                    if(!status1 && this.node.data.numberOperation.rc != null) {
                        status1 = this.checkMdbRcNode();
                    }
                }else if(this.item.driveType == "OPC_DA" || this.item.driveType == "OPC_DA_HTTP") {
                    status1 = this.checkDaOrDaHttpNode();
                }else if(this.item.driveType == "OPC_UA") {
                    status1 = this.checkUaNode();
                }else if(this.item.driveType == "CJ") {
                    status1 = this.checkCJNode();
                }else if(this.item.driveType == "DL") {
                    status1 = this.checkDLNode();
                }else if(this.item.driveType == "HJ") {
                    status1 = this.checkHJNode();
                }else if(this.item.driveType == "MQTT_SERVER") {
                    status1 = this.checkMQTTNode();
                }
                if(status == false && status1 == false ) {
                    this.modal11.show = false;
                    let requestWay = null;
                    if(this.modal11.state == "add") {requestWay = "fetchPost", this.node.data.base.driveUuid = this.item.uuid;}
                    else {requestWay = "fetchPut", this.node.data.base.uuid = this.updateData.base.uuid;}
                    this.$https[requestWay](this.node.url, this.node.data).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '节点配置成功', desc: "正在刷新界面", duration: 2.5});
                            this.reload();
                        } else
                            this.$Notice.error({title: '节点配置失败', desc: resp.data.describe, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 2.5});
                        console.log(err)
                    });
                }

                // let requestWay = null;
                // if(this.modal11.state == "add") {requestWay = "fetchPost", this.node.data.base.driveUuid = this.item.uuid;}
                // else {requestWay = "fetchPut", this.node.data.base.uuid = this.updateData.base.uuid;}
                // this.$https[requestWay](this.node.url, this.node.data).then((resp) => {
                //     if (resp.data.code == 200) {
                //         this.$Notice.success({title: '节点配置成功', desc: "正在刷新界面", duration: 2.5});
                //         this.reload();
                //     } else
                //         this.$Notice.error({title: '节点配置失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                // }).catch(err => {
                //     this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                //     console.log(err)
                // });
            },
            showNode(uuid){
                // console.log(this.data1)
                this.updateNode(uuid,"showinfo")
                
                // this.numberFormatInfo[0].detailshow = true
                // console.log(this.ModbusInfo[0].child.length)
                // if(this.ModbusInfo[0].child.length == 0){
                //     console.log("1564654")
                //     this.item.driveType == null
                //     this.$set(this.item,"driveType",null)
                //     console.log(this.item.driveType)
                // }
                this.modal14.show = true
                this.modal11.show = false
                // console.log(this.NodeInfo[0].child[this.NodeInfo[0].child.length -1],"child")
                if(this.NodeInfo[0].child[this.NodeInfo[0].child.length -1].val == true){
                    this.NodeInfo[0].child[this.NodeInfo[0].child.length -1].val = "开启"
                }else if(this.NodeInfo[0].child[this.NodeInfo[0].child.length -1].val == false){
                    this.NodeInfo[0].child[this.NodeInfo[0].child.length -1].val = "关闭"
                }
                console.log(this.numberFormatInfo[0].child[0],"this.numberFormatInfo")
                if(this.numberFormatInfo[0].child[0].val == null){
                    this.numberFormatInfo[0].child[0].select = false
                    this.numberFormatInfo[0].child[0].val = "暂无配置"
                    console.log(this.numberFormatInfo[0].child[0].val)
                }
            },
            updateNode(uuid,state) {
                this.addNode(state);
                this.modal11.state = "update";
                Object.assign(this.keeplinks, this.links[0])
                for(let i in this.data1) {
                    if(this.data1[i].base.uuid == uuid){
                        this.updateData = this.data1[i];
                    }
                }

                if(this.item.driveType == "MOD_BUS_ASCII" || this.item.driveType == "MOD_BUS_ASCII_SLAVE" || this.item.driveType == "MOD_BUS_RTU" || this.item.driveType == "MOD_BUS_RTU_SLAVE" || this.item.driveType == "MOD_BUS_TCP" || this.item.driveType == "MOD_BUS_TCP_SLAVE") {

                    if (this.updateData.numberOperation != null && this.updateData.numberOperation.ct != null) {
                        this.ModbusInfo[0].checkAllGroup.push("CT运算");
                        this.ModbusInfo[0].child.push({title: "CT运算", data: "ct", child: [{name: "CT运算/初级值", input: true, data: "primary"}]},);
                    }
                    if (this.updateData.numberOperation != null && this.updateData.numberOperation.hem != null) {
                        this.ModbusInfo[0].checkAllGroup.push("高压电表读数运算");
                        this.ModbusInfo[0].child.push({title: "高压电表读数运算", data: "hem", child: [{name: "电流互感器初级值", input: true, data: "ctPrimary"}, {name: "电压互感器初级值", input: true, data: "ptPrimary"}]},);
                    }
                    if (this.updateData.numberOperation != null && this.updateData.numberOperation.lem != null) {
                        this.ModbusInfo[0].checkAllGroup.push("电压电表读数运算");
                        this.ModbusInfo[0].child.push({title: "电压电表读数运算", data: "lem", child: [{name: "电流互感器初级值", input: true, data: "ctPrimary"}]},);
                    }
                    if (this.updateData.numberOperation != null && this.updateData.numberOperation.pt != null) {
                        this.ModbusInfo[0].checkAllGroup.push("PT运算");
                        this.ModbusInfo[0].child.push({title: "PT运算", data: "pt", child: [{name: "初级值", input: true, data: "primary"}]},);
                    }
                    if (this.updateData.numberOperation != null && this.updateData.numberOperation.rc != null) {
                        this.ModbusInfo[0].checkAllGroup.push("量程转换");
                        this.ModbusInfo[0].child.push({title: "量程转换", data: "rc", child: [{name: "转换最小值", input: true, data: "minValue", val: ''},{name: "转换最大值", input: true, data: "maxValue", val: ''},{name: "量程最小值", input: true, data: "minChange", val: ''},{name: "量程最大值", input: true, data: "maxChange", val: ''},{name: "超出量程 默认值", input: true, data: "defValue", val: ''}]});
                    }
                }

                if(this.updateData.numberFormat != null && this.updateData.numberFormat.formatEnum == 'EXP') {
                    this.numberFormatInfo[0].child.push({name: "格式化表达式", input: true, data: "exp"});
                }
                else if(this.updateData.numberFormat != null && this.updateData.numberFormat.formatEnum == 'DECIMALS') {
                    this.numberFormatInfo[0].child.push({name: "小数位", input: true, data: "decimal"});
                }


                for(let i in this.NodeInfo) {
                    var data = this.NodeInfo[i].data;
                    if(data.indexOf("ataItem") > -1){
                        data = "dataItem";
                    }

                    // if(this.NodeInfo[i].arr) {
                    //     for(let j in this.NodeInfo[i].child) {
                    //         var name = this.NodeInfo[i].child[j].data;
                    //         for(let z in this.NodeInfo[i].child[j].child) {
                    //             var name1 = this.NodeInfo[i].child[j].child[z].data;
                    //             // this.node.data[data][name][name1] = this.NodeInfo[i].child[j].child[z].val;
                    //             this.$set(this.NodeInfo[i].child[j].child[z],'val',this.updateData[data][name][name1]);
                    //         }
                    //     }
                    // }else {
                    //     for(let j in this.NodeInfo[i].child) {
                    //         var name = this.NodeInfo[i].child[j].data;
                    //         this.$set(this.NodeInfo[i].child[j],'val',this.updateData[data][name]);
                    //     }
                    // }


                    if(this.item.driveType == "CJ" || this.item.driveType == "DL" || this.item.driveType == "HJ" || this.item.driveType == "MQTT_SERVER") {
                        // this.node.data.base.name = this.NodeInfo[0].child[0].val;
                        // this.node.data.base.enable = this.NodeInfo[0].child[1].val;

                        this.$set(this.NodeInfo[0].child[0],'val',this.updateData.base.name);
                        this.$set(this.NodeInfo[0].child[1],'val',this.updateData.base.enable);

                    }
                    if(this.item.driveType == "CJ") {
                        // this.node.data.address = this.NodeInfo[1].child[0].val;
                        // this.node.data.deviceType = this.NodeInfo[2].child[0].val;
                        // this.node.data.precisionIndex = this.NodeInfo[3].child[0].val;
                        this.$set(this.NodeInfo[1].child[0],'val',this.updateData.address);
                        this.$set(this.NodeInfo[2].child[0],'val',this.updateData.deviceType);
                        this.$set(this.NodeInfo[3].child[0],'val',this.updateData.precisionIndex);


                    }else if(this.item.driveType == "DL") {
                        // this.node.data.address = this.NodeInfo[1].child[0].val;
                        // this.node.data.dataArea = this.NodeInfo[2].child[0].val;
                        // this.node.data.precisionIndex = this.NodeInfo[3].child[0].val;

                        this.$set(this.NodeInfo[1].child[0],'val',this.updateData.address);
                        this.$set(this.NodeInfo[2].child[0],'val',this.updateData.dataArea);
                        this.$set(this.NodeInfo[3].child[0],'val',this.updateData.precisionIndex);
                    }else if(this.item.driveType == "HJ") {
                        // this.node.data.name = this.NodeInfo[1].child[0].val;
                        this.$set(this.NodeInfo[1].child[0],'val',this.updateData.name);

                    }else if(this.item.driveType == "MQTT_SERVER") {
                        // this.node.data.clientId = this.NodeInfo[1].child[0].val;
                        this.$set(this.NodeInfo[1].child[0],'val',this.updateData.clientId);

                    }else {
                        for(let j in this.NodeInfo[i].child) {
                            var name = this.NodeInfo[i].child[j].data;
                            this.$set(this.NodeInfo[i].child[j],'val',this.updateData[data][name]);
                        }
                    }
                }

                if(this.updateData.numberFormat != null) {
                    for (let i in this.numberFormatInfo) {
                        let data = this.numberFormatInfo[i].data;
                        for (let j in this.numberFormatInfo[i].child) {
                            let name = this.numberFormatInfo[i].child[j].data;
                            this.$set(this.numberFormatInfo[i].child[j], 'val', this.updateData[data][name]);
                        }
                    }
                }

                if(this.ModbusInfo.length != 0) {
                    for(let i in this.ModbusInfo) {
                        let data = this.ModbusInfo[i].data;
                        for(let j in this.ModbusInfo[i].child) {
                            let name = this.ModbusInfo[i].child[j].data;
                            for(let z in this.ModbusInfo[i].child[j].child) {
                                let name1 = this.ModbusInfo[i].child[j].child[z].data;
                                this.$set(this.ModbusInfo[i].child[j].child[z],'val',this.updateData[data][name][name1]);
                            }
                        }
                    }
                }
            },
            delNode(uuid) {
                // this.$Modal.confirm({
                //     title: "提示",
                //     content: '<div>确定要删除节点吗</div>',
                //     onOk: () => {
                            this.$https.fetchDelete(this.$api.collect.item.url+"/"+uuid).then((resp) => {
                                if (resp.data.code == 200) {
                                    this.$Notice.success({title: '节点删除成功', desc: "正在刷新界面", duration: 2.5});
                                    // location.reload();
                                    this.reload();
                                } else
                                    this.$Notice.error({title: '节点删除失败', desc: resp.data.describe, duration: 2.5});
                            }).catch(err => {
                                this.$Notice.error({title: '请求失败', duration: 2.5});
                                console.log(err)
                            });
                    //     }
                    // });
                
            },
            downloadNode() {
                // console.log(this.NodeInfo)
                this.$https.getAxios().get(this.node.url+"/actions/dnexcel",{responseType: 'blob'}).then((resp) => {
                    let headers = resp.headers;
                    let index = headers["content-disposition"].indexOf("=");
                    // let filename = headers["content-disposition"].substr(index + 1,headers["content-disposition"].length);
                    let filename = this.item.driveType
                    if(this.item.driveType == "MOD_BUS_TCP_SLAVE"){
                        filename = "MODBUS_TCP从站推送"
                    }
                    if(this.item.driveType == "MOD_BUS_RTU_SLAVE"){
                        filename = "MODBUS_RTU从站推送"
                    }
                    if(this.item.driveType == "MOD_BUS_ASCII_SLAVE"){
                        filename = "MODBUS_ASCII从站推送"
                    }
                    if(this.item.driveType == "MOD_BUS_TCP"){
                        filename = "MODBUS_TCP"
                    }
                    if(this.item.driveType == "MOD_BUS_RTU"){
                        filename = "MODBUS_RTU"
                    }
                    if(this.item.driveType == "MOD_BUS_ASCII"){
                        filename = "MODBUS_ASCII"
                    }
                    if(this.item.driveType == "OPC_DA_HTTP"){
                        filename = "OPC_DA桥接客户端"
                    }
                    if(this.item.driveType == "OPC_UA"){
                        filename = "OPC_UA"
                    }
                    let xlsx = ".xlsx"
                    filename = filename + xlsx
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
            uploadNode() {
                this.modal12.show = !this.modal12.show;
            },
            handleUpload (file) {
                this.modal12.file = file;
                let suffix = file.name.match(/.xlsx$/)
                // console.log(suffix)
                if(suffix != undefined && suffix!=""){  
                    this.modal12.file = file;
                } else {  
                    this.$Notice.error({title: '上传失败', desc: "文件格式不正确...", duration: 3});
                    this.modal12.file = null
                }
                return false;
            },
            upload () {
                if(this.modal12.file == null) {
                    this.$Notice.error({title: '未选择文件', desc: "请重新选择文件...", duration: 3});
                    this.modal12.loading = false;
                }else {
                    let formData = new FormData();
                    formData.append('excelFile', this.modal12.file);
                    let append = null;
                    this.modal12.append == 1 ? append = false : append = true;
                    formData.append('append', append);

                    this.$https.fetchPost(this.node.url + "/actions/upexcel/" + this.item.uuid, formData).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '上传节点成功', desc: "正在刷新界面", duration: 2.5});
                            this.reload();
                        } else {
                            this.$Notice.error({title: '上传节点失败', desc: resp.data.describe, duration: 2.5});
                        }
                        this.modal12.loading = false;
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 2.5});
                        this.modal12.loading = false;
                        console.log(err)
                    });
                }
            },

            connWebSocket() {
                
                let url = null;
                if(axios.defaults.baseURL == "/") {url = "wss://"+window.location.host+"/collect/runner";}
                else {
                    let str = axios.defaults.baseURL;
                    let index = str .lastIndexOf("/")
                    str =str .substring(index+1,str.length);
                    url = "wss://"+str+"/collect/runner";
                }
                let webSocket = new WebSocket(url);
                this.webSocket = webSocket;

                webSocket.onmessage = this.$options.methods.onmessage.bind(this);
                webSocket.onopen = (e) => {
                    // console.log("建立连接", e);
                    this.send();
                };
                webSocket.onerror = (e) => {
                    // console.log("连接异常", e);
                    // this.$Notice.error({title: '页面数据请求异常', desc: "请尝试刷新页面" , duration: 5});
                    };
                
                webSocket.onclose = (e) => {
                    // console.log("连接关闭", e)
                };
            },
            closeWebSocket() {
                if (this.webSocket != null)
                    this.webSocket.close();
            },
            onmessage(e) {
                
                let data = JSON.parse(e.data);
                // console.log(data,"data")
                
                if(this.loginType == true){
                    //获取socket中的成功失败节点数
                    this.statistical = data.statistical
                    data = data.itemList
                    this.columns1 = this.columns2;
                    for(let i in this.data1) {
                        for(let j in data) {
                            if(data[j].id == this.data1[i].base.uuid) {
                                this.$set(this.data1[i], 'webSocket', data[j]);
                            }
                        }
                        if(this.delArr.length != 0) {
                            let num = 0;
                            for(let j in this.delArr) {
                                if (this.delArr[j] == this.data1[i].base.uuid) {num++;}
                            }
                            if(num > 0) {this.$set(this.data1[i], '_checked', true);}
                            else {this.$set(this.data1[i], '_checked', false);}
                        }else {
                            this.$set(this.data1[i], '_checked', false);
                        }
                    }
                }else if(this.loginType == false){
                    this.columns1 = this.columns2;
                    for(let i in this.data1) {
                        for(let j in data) {
                            if(this.data1[i].base.enable == false){
                                continue
                            }
                            if(data[j].id == this.data1[i].base.uuid) {
                                this.$set(this.data1[i], 'webSocket', data[j]);
                            }
                        }
                        if(this.delArr.length != 0) {
                            let num = 0;
                            for(let j in this.delArr) {
                                if (this.delArr[j] == this.data1[i].base.uuid) {num++;}
                            }
                            if(num > 0) {this.$set(this.data1[i], '_checked', true);}
                            else {this.$set(this.data1[i], '_checked', false);}
                        }else {
                            this.$set(this.data1[i], '_checked', false);
                        }
                    }
                }
                // 防止翻页操作过快导致的叠加
                // this.cleartable()
                this.tableloading = false
                this.connWebSocketSatuts = true
                // console.log(this.data1)
            },
            send() {
                // console.log("send")
                let data = {
                    instruct: 'MONITOR_COLLECT_ITEM',
                    param: this.uuidList
                };
                
                this.webSocket.send(JSON.stringify(data));
                if(this.columns2.length == 8 || this.columns2.length == 7){
                    return
                }
                
                Object.assign(this.columns2,this.columns1);
                // this.columns2 = _.cloneDeep(this.columns1)
                
                this.columns2.push(
                    // render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                    // domProps: {title: params.row.dataItem.name}}, params.row.dataItem.name)])}},
                    {title: '质量', align: 'center', width: 115, sortable: true, render: (h, params) => 
                    {   
                        let dataQuality = null; let data = null; let tagColor = null; 
                        params.row.webSocket != undefined ? dataQuality = params.row.webSocket.dataQuality : dataQuality = ''; 
                        if(dataQuality == 192) {data = '良好',tagColor = 'green'}
                         else if(dataQuality == 64) {data = '警告',tagColor = "#ff9900"}
                        //  else if(dataQuality == '' || dataQuality == null || dataQuality == undefined){data = '',tagColor = 'red'}
                         else {data = '异常',tagColor = 'red'};
                         
                        return h("span", [ h('Tooltip', {style: { color: tagColor },props: {placement: "right", content: dataQuality, maxWidth: "600"}}, data)])
                        // return h("Tag", {props: {type: "dot", color: tagColor}},[ h('Tooltip', {props: {placement: "right", content: dataQuality, maxWidth: "600"}}, data)])
                        // return h("Tag", {props: {type: "dot", color: "success"}},data)
                        }
                    },
                    {title: '类型', align: 'center', width: 100, sortable: true, render: (h, params) => {return h('span', params.row.webSocket != undefined ? params.row.webSocket.dataType : '');}},
                    // { let dataQuality = null; let data = null;
                    // params.row.webSocket != undefined ? dataQuality = params.row.webSocket.dataQuality : dataQuality = ''; 
                    // if(dataQuality == 192) {data = '良好'} else if(dataQuality == 64) {data = '警告'} else {data = '异常'}; 
                    // return h('Tooltip', {props: {placement: "right", content: dataQuality, maxWidth: "600"}}, data);}},
                    // {title: '数据未处理的值', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.webSocket != undefined ? params.row.webSocket.dataValue : '');}},
                    // {title: '数据未处理的值', align: 'center', width: 150, render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
                    //     domProps: {title: params.row.webSocket.dataValue}}, params.row.webSocket != undefined ? params.row.webSocket.dataValue : '')]);}},

                    // {title: '数据处理后的值', align: 'center', width: 120, render: (h, params) => {return h('span', params.row.webSocket != undefined ? params.row.webSocket.dataHandle : '');}},
                    {title: '运算值', align: 'center', width: 135, sortable: true, render: (h, params) => {return h('div', [h('span', {style: {display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}},
                            // domProps: {title: params.row.webSocket.dataHandle}}, params.row.webSocket != undefined ? params.row.webSocket.dataHandle : '')]);}},
                            params.row.webSocket != undefined ? params.row.webSocket.dataHandle : '')]);}},
                    {title: '采集时间', align: 'center', width: 180, sortable: true, render: (h, params) => {return h('span', params.row.webSocket != undefined ? this.$util.time_stamp2time_date(params.row.webSocket.dataTimestamp).format("MM-dd hh:mm:ss.SSS") : '');}},
                    
                );
                // this.columns2.splice(3, 2);
                for(let i in this.columns2){
                    if(this.columns2[i].title == "指标编码"){
                        this.columns2.splice(i, 1);
                    }
                    // if(this.columns2[i].title == "操作"){
                    //     this.columns2.splice(i, 1);
                    // }
                    if(this.columns2[i].title == "创建时间"){
                        this.columns2.splice(i, 1);
                    }
                }
                // console.log(this.data1)
                
            },
            scrollBottom() {
                this.$nextTick(function () {
                    let div = document.getElementById('asd');
                    div.scrollTop = div.scrollHeight;
                })
            },

            changeChose(data){
                //选项发生变化的时候使用
                this.delArr = [];
                for(let i in data) {
                    this.delArr.push(data[i].base.uuid);
                }
            },
            batchDel() {
                if(this.delArr.length == 0) {
                    this.$Notice.error({title: '未勾选选项', desc: "请重新勾选...", duration: 3});
                }else {
                    let data = {driveUuid: this.item.uuid, itemUuids: this.delArr};
                    this.$https.fetchDelete(this.$api.collect.item.url + "/actions/batchdel", {data: data}).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '批量删除节点成功', desc: "正在刷新界面", duration: 2.5});
                            // location.reload();
                            this.reload();
                        } else
                            this.$Notice.error({title: '批量删除节点失败', desc: resp.data.describe, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', duration: 2.5});
                        console.log(err)
                    });
                }
            },
            cleartable() {
                let index = 0
                let index1 = 0
                let index2 = 0
                let index3 = 0
                for(let i = this.node.find.size - 1;i>=1;i--){
                    if(this.columns1[i].title == "质量"){
                        index++
                        if(index == 2){
                            this.columns1.splice(i, 1);
                        }
                    }
                    if(this.columns1[i].title == "类型"){
                        index1++
                        if(index1 == 2){
                            this.columns1.splice(i, 1);
                        }
                    }
                    if(this.columns1[i].title == "运算值"){
                        index2++
                        if(index2 == 2){
                            this.columns1.splice(i, 1);
                        }
                    }
                    if(this.columns1[i].title == "采集时间"){
                        index3++
                        if(index3 == 2){
                            this.columns1.splice(i, 1);
                        }
                    }
                }
            },

            checkNode() {
                let status = false;
                if(this.item.driveType == "CJ" || this.item.driveType == "DL" || this.item.driveType == "HJ" || this.item.driveType == "MQTT_SERVER") {
                }else {
                    if(this.node.data.base.name === '' || this.node.data.base.indexCode === '' || this.node.data.base.highAlarm === '' || this.node.data.base.hhighAlarm === ''
                        || this.node.data.base.lowAlarm === '' || this.node.data.base.llowAlarm === '') {this.$Message.error({content: '请填写节点名称、指标编码、高报、高高报、低报和低低报...', duration: 3});    status = true;}
                    else if(!/^\d+(\.\d{1,5})?$/.test(this.node.data.base.highAlarm) || !/^\d+(\.\d{1,5})?$/.test(this.node.data.base.hhighAlarm) || !/^\d+(\.\d{1,5})?$/.test(this.node.data.base.lowAlarm)
                        || !/^\d+(\.\d{1,5})?$/.test(this.node.data.base.llowAlarm)) {this.$Message.error({content: '高、低报和高高、低低报只允许填写数字,保留5位小数位...', duration: 3});    status = true;}
                }
                return status;
            },
            checkUaNode() {
                let status = false;
                if(this.node.data.dataItem.name === '' || this.node.data.dataItem.nameSpaceIndex === '') {
                    this.$Message.error({content: '请填写数据点名称、命名下标空间...', duration: 3});    status = true;
                }
                else if(!/^[1-9]{0,10}$/.test(this.node.data.dataItem.nameSpaceIndex)) {this.$Message.error({content: '命名下标空间只允许填写10位以内数字,不能为0...', duration: 3});    status = true;}
                return status;
            },
            checkDaOrDaHttpNode() {
                let status = false;
                if(this.node.data.dataItem.name === '') {this.$Message.error({content: '请填写数据点名称...', duration: 3});    status = true;}
                return status;
            },
            checkMdbNode() {
                let status = false;
                if(this.node.data.dataItem.fncode === '' || this.node.data.dataItem.name === '' || this.node.data.dataItem.offset === ''
                    || this.node.data.dataItem.quantity === '' || this.node.data.dataItem.slaveid === '') {
                    this.$Message.error({content: '请填写功能码、名称、起始位置、数量、从站ID...', duration: 3});    status = true;
                }
                else if(!/^[1-9]{0,10}$/.test(this.node.data.dataItem.slaveid) || !/^[1-9]{0,10}$/.test(this.node.data.dataItem.fncode)) {this.$Message.error({content: '从站ID、功能码填写10位以内数字,不能为0...', duration: 3});    status = true;}
                else if(!/^\d{0,10}$/.test(this.node.data.dataItem.offset) || !/^\d{0,10}$/.test(this.node.data.dataItem.quantity)) {this.$Message.error({content: '起始位、数量请填写0-10以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkMdbCtNode() {
                let status = false;
                if(this.node.data.numberOperation.ct.primary === '') {this.$Message.error({content: '请填写CT运算初级值...', duration: 3});    status = true;}
                else if(!/^\d{0,10}$/.test(this.node.data.numberOperation.ct.primary)) {this.$Message.error({content: 'CT运算初级值填写10位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkMdbHemNode() {
                let status = false;
                if(this.node.data.numberOperation.hem.ctPrimary === '' || this.node.data.numberOperation.hem.ptPrimary === '') {this.$Message.error({content: '请填写电流互感器初级值、电压互感器初级值...', duration: 3});    status = true;}
                else if(!/^\d{0,10}$/.test(this.node.data.numberOperation.hem.ctPrimary) || !/^\d{0,10}$/.test(this.node.data.numberOperation.hem.ptPrimary)) {this.$Message.error({content: '电流互感器初级值、电压互感器初级值填写10位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkMdbLemNode() {
                let status = false;
                if(this.node.data.numberOperation.lem.ctPrimary === '') {this.$Message.error({content: '请填写电流互感器初级值...', duration: 3});    status = true;}
                else if(!/^\d{0,10}$/.test(this.node.data.numberOperation.lem.ctPrimary)) {this.$Message.error({content: '电流互感器初级值填写10位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkMdbPtNode() {
                let status = false;
                if(this.node.data.numberOperation.pt.primary === '') {this.$Message.error({content: '请填写PT运算初级值...', duration: 3});    status = true;}
                else if(!/^\d{0,10}$/.test(this.node.data.numberOperation.pt.primary)) {this.$Message.error({content: 'PT运算初级值填写10位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkMdbRcNode() {
                let status = false;
                if(this.node.data.numberOperation.rc.defValue === '' || this.node.data.numberOperation.rc.maxChange === '' || this.node.data.numberOperation.rc.maxValue === '' || this.node.data.numberOperation.rc.minChange === ''
                    || this.node.data.numberOperation.rc.minValue === '') {this.$Message.error({content: '请填写超出量程、转换最大值、量程最大值、转换最小值、量程最小值...', duration: 3});    status = true;}
                else if(!/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.defValue) || !/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.maxChange) || !/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.maxValue)
                    || !/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.minChange) || !/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.minValue)) {this.$Message.error({content: '超出量程、转换最大值、量程最大值、转换最小值、量程最小值填写10位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkCJNode() {
                let status = false;
                if(this.node.data.address === '' || this.node.data.precisionIndex === '') {this.$Message.error({content: '请填写计算仪表地址、计算精度...', duration: 3});    status = true;}
                // else if(!/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.defValue) || !/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.maxChange)) {this.$Message.error({content: '超出量程、转换最大值、量程最大值、转换最小值、量程最小值填写10位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkDLNode() {
                let status = false;
                if(this.node.data.address === '' || this.node.data.dataArea === '' || this.node.data.precisionIndex === '') {this.$Message.error({content: '请填写电表地址、数据标识、计算精度...', duration: 3});    status = true;}
                // else if(!/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.defValue) || !/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.maxChange)) {this.$Message.error({content: '超出量程、转换最大值、量程最大值、转换最小值、量程最小值填写10位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkHJNode() {
                let status = false;
                if(this.node.data.name === '') {this.$Message.error({content: '请填写数据点名...', duration: 3});    status = true;}
                // else if(!/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.defValue) || !/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.maxChange)) {this.$Message.error({content: '超出量程、转换最大值、量程最大值、转换最小值、量程最小值填写10位以内数字...', duration: 3});    status = true;}
                return status;
            },
            checkMQTTNode() {
                let status = false;
                if(this.node.data.clientId === '') {this.$Message.error({content: '请填写客户端ID...', duration: 3});    status = true;}
                // else if(!/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.defValue) || !/^[\d-]{0,10}$/.test(this.node.data.numberOperation.rc.maxChange)) {this.$Message.error({content: '超出量程、转换最大值、量程最大值、转换最小值、量程最小值填写10位以内数字...', duration: 3});    status = true;}
                return status;
            }
        },
        beforeDestroy() {
            this.closeWebSocket();
        }
    }
</script>

<style scoped lang="less">
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 50;
        }
    }
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

    // .ivu-table-cell {
    //     white-space: nowrap !important;
    //     padding-left: 8px !important;
    //     padding-right: 8px !important;
    // }

    .ivu-table td, .ivu-table th {
        height: 26px;
        line-height: 26px;
    }

    .foot {
        padding: 16px 0;
    }

    .desc {
        display: inline-block;
        vertical-align: middle;
    }

    .btn {
        vertical-align: middle;
        float: right
    }
</style>
<style lang="less">
.vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 20px !important
        }
    }
.ivu-spin-fix {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
    width: 100%;
    height: 100%;
    background-color:white;
}
</style>