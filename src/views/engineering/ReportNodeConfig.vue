<template>
    <div class="container-fluid" style="min-width:0;flex:1;">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header" :class="loginType?'pad5':''" style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <Button type="primary" v-if="loginType" style="float: right;" :loading="updateLoading" @click="updateNode">保存配置</Button>
                    <Button v-if="loginType" style="float: right;margin-right: 10px;" icon="ios-cloud-download-outline" @click="downloadNode">下载模板</Button>
                    <Button v-if="loginType" style="float: right;margin-right: 10px;" icon="ios-cloud-upload-outline" @click="uploadNode">上传节点</Button>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 715px;overflow: auto;">
                <div style="float: left;margin-bottom: 10px;">
                    <Button style="margin-right: 10px;" size="small" @click="selectAll">全选</Button>
                    <Button style="margin-right: 10px;" size="small" @click="Inverse">反选</Button>
                    <Button style="margin-right: 10px;" v-if="item.driveType == 'OPC_DA_UPLOAD'?true:false" size="small" icon="ios-cloud-download-outline" type="primary" @click="cvsExport">CSV导出</Button>
                </div>
                <div v-if="item.driveType == 'OPC_UA_SERVER' || item.driveType == 'MQTT_CLIENT'" style="float: right;margin-bottom: 10px;">
                    <span style="font-size: 12px;margin-right: 10px;" v-if="item.driveType == 'OPC_UA_SERVER'">选择节点标识:</span>
                    <span style="font-size: 12px;margin-right: 10px;" v-if="item.driveType == 'MQTT_CLIENT'">选择主题标识:</span>
                    <Select size="small" v-model="node.find.sign" style="width:70px;" @on-change="switchSign">
                        <Option v-for="item in node.signList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </div>
                <div style="width: 100%;float: left;">
                    <Table size="small" border :columns="columns1" :data="data1">
                        <template slot-scope="{ row }" slot="action">
                            <Checkbox v-model="row.isSelect" @on-change="handleSelectionChange(row, row.isSelect)" />
                        </template>
                    </Table>
                    <!-- <div slot="loading">
                            <div style="height: 10px; width: 200px">
                            <Row>
                                <Col class="demo-spin-col" span="8">
                                    <Spin fix>
                                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </Col>
                            </Row>
                            </div>
                        </div> -->
                    <div class="foot">
                        <span class="desc" style="font-size: 13px;">查询{{total}}条，当前第{{node.find.nodePage}}页</span>
                        <Page class="btn" @on-change="pageChange" :current="node.find.nodePage" :total="total" :page-size="node.find.nodeSize" show-elevator/>
                    </div>
                </div>
            </div>
        </div>

        <Modal
                title="下载节点"
                v-model="modal11.show" @on-ok="download"
                class-name="vertical-center-modal" width="800" :styles="{top: '25%'}">
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox
                        :indeterminate="indeterminate"
                        :value="checkAll"
                        @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="checkAllGroup.list" @on-change="checkAllGroupChange">
                <Checkbox v-for="(item , index) in driveTypeList" :label="item" :key="index"></Checkbox>
            </CheckboxGroup>
        </Modal>

        <Modal
                title="上传节点"
                v-model="modal12.show" @on-ok="upload" :loading="modal12.loading"
                ok-text="上传" class-name="vertical-center-modal" width="400" :styles="{top: '25%'}">
            <Upload
                    :before-upload="handleUpload"
                    :action="modal12.url">
                <Button style="float: left;" icon="ios-cloud-upload-outline">点击选择文件</Button>
                <div style="float: left;margin-top: 6px;" v-if="modal12.file !== null"><span style="margin-left: 10px;">上传文件&nbsp;:&nbsp; {{ modal12.file.name }}</span></div>
            </Upload>
            <!-- <Progress style="margin-left:15px;" v-if="progressshow" :percent="percent" :stroke-width="5" /> -->
            <div v-if="item.driveType == 'OPC_UA_SERVER' || item.driveType == 'MQTT_CLIENT'">
                <span v-if="item.driveType == 'OPC_UA_SERVER'" style="margin-right: 10px;">选择节点标识:</span>
                <span v-if="item.driveType == 'MQTT_CLIENT'" style="margin-right: 10px;">选择主题标识:</span>
                <Select v-model="node.find.sign" style="width:100px;" @on-change="switchSign">
                    <Option v-for="item in node.signList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </div>
        </Modal>


    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import contentTabs from "./ContentTabs";
    import {formatDate} from "@/util/date";
    export default {
        name: "NodeConfig",
        inject: ["reload"],
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                percent:0,
                progressshow:true,
                columns1: [
                    {title: '勾选', slot: 'action', width: 160, align: 'center'},
                    // {
                    //     // fixed: "left",
                    //     slot: 'action',
                    //     type: 'selection',
                    //     width: 160,
                    //     align: 'center'
                    // },
                    {title: 'uuid', key: 'itemUuid', align: 'center'},
                    {title: '节点名', key: 'itemName', align: 'center'}
                ],
                data1: [],
                total: 0,
                page: {
                    form: {
                        page: 1,
                        size: 10,
                    }
                },
                indeterminate: true,
                checkAll: false,
                checkAllGroup: {
                    list: []
                },
                driveTypeList: ['MOD_BUS_TCP', 'MOD_BUS_TCP_SLAVE', 'MOD_BUS_RTU', 'MOD_BUS_RTU_SLAVE', 'MOD_BUS_ASCII', 'MOD_BUS_ASCII_SLAVE', 'OPC_DA', 'OPC_DA_HTTP', 'OPC_UA' ],
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
                    updateData: {
                        // driveUuid: null,
                        // nameMap: null
                    },
                    listData: {
                        driveUuid: null,
                        sign: null
                    },
                    find: {
                        // sign: null,
                        nodePage: 1,
                        nodeSize: 10
                    },
                    driveType: null,
                    signList: null,
                    url: null,
                    busDataUrl: null
                },
                modal11: {
                    show: false,
                    state: null,
                },
                NodeInfo: [],
                // uploadNode: null,
                // uploadData: {driveUuid: null},
                modal12: {
                    show: false,
                    url: '',
                    file: null,
                    loading: true
                },
                nameMap: {},
                // mapData: [],
                mapData:{},//自定义字段提交保存数据的map
                m : null,
                n: null,
                updateLoading: false,
                selectAllState: false,//全选状态
                inverseState: false,//反选状态
                selectArr: [],//选中数组存储
                loginType: null,//系统类型
                item: {},
                url: null,
                driveType: null,
                links: [
                    {name: "驱动配置", to: "/engineering/reportingService/driveConfig"},
                    {name: "节点配置", to: "/engineering/reportingService/nodeConfig"},
                ]
            }
        },
        created: function() {

        },
        mounted: function() {
            this.showData();
            this.$storage.getStorage("loginType") == "true" ? this.loginType = true : this.loginType = false;
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

                if(this.item.driveType == "OPC_UA_SERVER") {
                    this.node.url = this.$api.upload.item.uaServer.url;
                    this.node.busDataUrl = this.node.url+"/findOpcUaServerNode?driveUuid="+this.item.uuid;
                }else if(this.item.driveType == "OPC_UA_UPLOAD") {
                    this.node.url = this.$api.upload.item.uaUpload.url;
                }else if(this.item.driveType == "OPC_DA_UPLOAD") {
                    this.node.url = this.$api.upload.item.daUpload.url;
                }else if(this.item.driveType == "SOCKET_CLIENT") {
                    this.node.url = this.$api.upload.item.socket.url;
                }else if(this.item.driveType == "MQTT_CLIENT") {
                    this.node.url = this.$api.upload.item.mqtt.url;
                    this.node.busDataUrl = this.node.url+"/findMqttTopic?driveUuid="+this.item.uuid;
                }else if(this.item.driveType == "SQL") {
                    this.node.url = this.$api.upload.item.sql.url;
                }

                this.node.find.driveUuid = this.item.uuid;
                if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT") {
                    this.$https.fetchPost(this.node.busDataUrl).then((resp) => {
                        this.node.signList = resp.data.data;
                        this.node.find.sign = resp.data.data[0];

                        this.findNodeConfigByPage();
                        this.findNodeConfig();

                    }).catch(err => {
                        console.log(err)
                    });
                }else {
                    this.findNodeConfigByPage();
                    this.findNodeConfig();
                }
            },
            findNodeConfig() {
                this.$https.fetchPost(this.node.url+"/findDriveItemList?driveUuid="+this.item.uuid+"&sign="+this.node.find.sign).then((resp) => {
                    this.m =  new Map();
                    for(let i in resp.data.data){
                        // this.m.set(resp.data.data[i],{"itemUuid": resp.data.data[i]});
                        if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT") {
                            this.m.set(resp.data.data[i],{"itemUuid": resp.data.data[i]});
                        }else {
                            this.m.set(resp.data.data[i].uuid, resp.data.data[i].name);
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            findNodeConfigByPage() {
                this.$https.fetchPost(this.node.url+"/findItemByPage", this.node.find).then((resp) => {
                    this.total = resp.data.data.count;
                    this.data1 = resp.data.data.items;
                    if(this.selectAllState) {
                        for(let i in this.data1) {
                            this.data1[i].isSelect = true;
                        }
                    }else if(this.inverseState) {
                        for(let j in this.data1) {
                            let z = 0;
                            for(let i in this.selectArr) {
                                if(this.data1[j].itemUuid == this.selectArr[i]) {
                                    z++;break;
                                }
                            }
                            z == 0 ? this.data1[j].isSelect = true : this.data1[j].isSelect = false;
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            switchSign(sign) {
                this.node.find.sign = sign;
                this.findNodeConfigByPage();
                this.findNodeConfig();
            },
            formatDate(time) {
                var date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            },
            pageChange(page){
                // console.log(page)
                this.node.find.nodePage = page;
                // this.showData();
                this.findNodeConfigByPage();
            },
            downloadNode() {
                this.modal11.show = !this.modal11.show;
            },
            download() {
                this.$https.getAxios().post(this.node.url+"/exportUaUploadExcel", this.checkAllGroup, {responseType: 'blob'}).then((resp) => {
                    let headers = resp.headers;
                    // let filename = headers["content-disposition"];
                    // let filename = "excel.xlsx";
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
                    this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                    console.log(err)
                })
            },
            uploadNode() {
                this.modal12.show = !this.modal12.show;
            },
            handleUpload (file) {
                this.modal12.file = file;
                let suffix = file.name.match(/.xlsx$/)
                if(suffix != undefined && suffix!=""){  
                    this.modal12.file = file;
                } else {  
                    this.$Notice.error({title: '上传失败', desc: "文件格式不正确...", duration: 3});
                    this.modal12.file = null
                }
                let flag = file.name.match(/^node/)
                if(flag != undefined && flag!=""){  
                    this.modal12.file = file;
                } else {  
                    this.$Notice.error({title: '上传失败', desc: "文件命名不正确...", duration: 3});
                    this.modal12.file = null
                }  
                return false;
            },
            upload () {
                if(this.modal12.file == null) {
                    this.$Notice.error({title: '未选择文件', desc: "请重新选择文件...", duration: 3});
                    this.modal12.loading = false;
                }else {
    //                 let config = {  
    //                     headers: {'Content-Type': 'multipart/form-data'},
    //                     timeout: 3 * 60 * 1000,
    //                     onUploadProgress: progressEvent => {
    //                         let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
    //                         this.percent = complete
    //                     }
    //                 }
                    let formData = new FormData();
                    formData.append('excelFile', this.modal12.file);
                    this.$https.fetchPost(this.node.url + "/importUaUploadExcel?driveUuid=" + this.item.uuid + "&sign=" + this.node.find.sign, formData).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '上传节点成功', desc: "正在刷新界面", duration: 2.5});
                            this.reload();
                        } else {
                            this.$Notice.error({title: '上传节点失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                        }
                        this.modal12.loading = false;
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        this.modal12.loading = false;
                        console.log(err)
                    });
                }
            },
            handleSelectionChange(val,isSelect) {
                // this.inverseState = false;
                // this.selectAllState = false;
                if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT") {

                    if(isSelect) {
                        this.m.set(val.itemUuid,{"itemUuid": val.itemUuid});
                    }else {
                        this.m.delete(val.itemUuid);
                    }
                }else {
                    if(isSelect) {
                        // let uuid = val.itemUuid;
                        this.m.set(val.itemUuid, val.itemName);
                    }else {
                        this.m.delete(val.itemUuid);
                    }
                }
            },
            updateNode() {
                this.updateLoading = true;
                if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT") {
                    let sign = this.node.find.sign;
                    this.nameMap[sign] = [...this.m.values()];

                    this.node.updateData.driveUuid = this.item.uuid;
                    this.node.updateData.nameMap = this.nameMap;
                }else {
                    let testData = {};
                    let base = {};
                    this.m.forEach(function(value,index){
                        testData[index] = value;
                    })
                    base.driveUuid = this.item.uuid;
                    base.itemMap = testData;
                    this.node.updateData.base = base;
                }


                this.$https.fetchPost(this.node.url+"/updateItems", this.node.updateData).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '节点修改成功', desc: "正在刷新界面", duration: 2.5});
                        this.updateLoading = false;
                        this.reload();
                    } else{
                        this.$Notice.error({title: '节点修改失败', desc: "错误：" + resp.data.describe, duration: 2.5});
                        this.updateLoading = false;
                    }   
                }).catch(err => {
                    this.updateLoading = false;
                    this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                    console.log(err)
                })
            },
            async findDriveAllItemList() {
                let res =  await this.$https.fetchPost(this.node.url+"/findDriveAllItemList?driveUuid="+this.item.uuid+"&sign="+this.node.find.sign);
                let n =  new Map();
                for(let i in res.data.data){
                    if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT") {
                        n.set(res.data.data[i],{"itemUuid": res.data.data[i]});
                    }else {
                        n.set(res.data.data[i].uuid, res.data.data[i].name);
                    }
                }
                return n;
            },
            selectAll() {
                this.selectAllState = true;
                this.inverseState = false;
                this.findDriveAllItemList().then((resp) => {
                    this.m = resp;
                    for(let i in this.data1) {
                        this.data1[i].isSelect = true;
                    }
                });
            },
            Inverse() {
                this.selectAllState = false;
                this.inverseState = true;
                let arr = [];
                this.findDriveAllItemList().then((resp) => {
                    this.m.forEach(function(value,index){
                        resp.delete(index);
                        arr.push(index);
                    });
                    this.m = resp;
                    this.selectArr = arr;
                    for(let j in this.data1) {
                        let z = 0;
                        for(let i in this.selectArr) {
                            if(this.data1[j].itemUuid == this.selectArr[i]) {
                                z++;break;
                            }
                        }
                        z == 0 ? this.data1[j].isSelect = true : this.data1[j].isSelect = false;
                    }
                });
            },
            cvsExport(){
                // this.updateLoading = true;
                // if(this.item.driveType == "OPC_UA_SERVER" || this.item.driveType == "MQTT_CLIENT") {
                //     let sign = this.node.find.sign;
                //     this.nameMap[sign] = [...this.m.values()];

                //     this.node.updateData.driveUuid = this.item.uuid;
                //     this.node.updateData.nameMap = this.nameMap;
                // }else {
                console.log(this.m,'m')
                if(!this.m.size){
                    this.$Notice.error({title: '导出失败', desc: "请勾选节点", duration: 5});
                    return;
                }
                if(this.m.size>10000){
                    this.$Notice.error({title: '导出失败', desc: "最多只能导出9999个节点", duration: 5});
                    return;
                }
                let testData = {nodes : []};
                this.m.forEach(function(value,index){
                    testData.nodes.push(index)
                })
                // }
                console.log(testData,'testData')
                this.$https.fetchPost(this.$api.upload.item.daUploadCVS.url, testData,{responseType: 'blob'}).then((resp) => {
                    let headers = resp.headers;
                    // let filename = headers["content-disposition"];
                    // let filename = "excel.xlsx";
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
                    this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                    console.log(err)
                })
            },
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup.list = ['MOD_BUS_TCP', 'MOD_BUS_TCP_SLAVE', 'MOD_BUS_RTU', 'MOD_BUS_RTU_SLAVE', 'MOD_BUS_ASCII', 'MOD_BUS_ASCII_SLAVE', 'OPC_DA', 'OPC_DA_HTTP', 'OPC_UA' ];
                } else {
                    this.checkAllGroup.list = [];
                }
            },
            checkAllGroupChange (data) {
                if (data.length === 9) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
            }
        }
    }
</script>

<style scoped lang="less">
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

    .foot {
        padding: 16px 0;
    }

    .desc {
        display: inline-block;
        vertical-align: middle;
    }

    .btn {
        // display: inline-block;
        vertical-align: middle;
        float: right
    }
    /deep/.pad5{
        padding-bottom: 5px;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }  

</style>