<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;padding-bottom:5px;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
                <datasourceadd style="float: right;"></datasourceadd>
            </div>
            <div class="modal-body">                
                <div style="width:100%;position:relative;float: left;margin:20px 0;">
                    <div>
                        <Table border size="small" :columns="columns1" :data="data1">
                            <template slot-scope="{ row,index }" slot="drive">
                                <div>
                                    <!-- <Tooltip placement="top" :content="row.sourceContent"> -->
                                        <!-- <span style="whiteSpace:normal;">{{spliceSourceContent}}</span> -->
                                        <span>{{row.sourceContent}}</span>
                                    <!-- </Tooltip> -->
                                    <Icon style="float:right;font-size:18px;cursor:pointer;" @click="edit(index)" type="ios-arrow-dropdown-circle" />
                                </div>
                            </template>
                            <template slot-scope="{ row, index }" slot="action">
                                <!-- <Button type="error" size="small" @click="deleteSource(row.uuid,index)">删除</Button> -->
                                <Tooltip placement="top" content="删除">
                                    <div style="margin:0 2px;cursor:pointer" @click="deleteSource(row.uuid,index)">
                                        <!-- <Icon size="24" type="md-trash" /> -->
                                        <img src="../../../assets/images/delete3.png" width="21px" height="18.5px" alt="">
                                    </div>
                                </Tooltip>
                                <Tooltip placement="top" content="修改">
                                    <div style="margin:0 2px;cursor:pointer;margin-left:4px;" @click="edit(index)">
                                        <img src="../../../assets/images/update3.png" width="21px" height="18.5px" alt="">
                                    </div>
                                </Tooltip>
                            </template>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
        <Modal title="修改驱动" v-model="modal1" width="400">
            <div style="margin-bottom:12px;">备注 :<Input v-model="backup" style="width: 80%;margin-left: 10px;" /></div>
            <Tree ref="tree" :data="theData" multiple show-checkbox></Tree>
            <div slot="footer">
                <Button type="text" size="large" @click="modal1= false">取消</Button>
                <Button type="primary" size="large" @click="submitdriver">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import myTree from "./StrategyTreeMenu";
    import Utils from '../../../components/test.js';
    import JkTabs from "@/components/JkTabs.vue";
    import datasourceadd from "./StrategyDataSourceAdd";
    export default {
        inject: ["reload"],
        name: "StrategyDataSource",
        components: {
            jk_tabs: JkTabs,datasourceadd   
        },
        data(){
            return {
                backup:'',
                //修改时树组件回参所使用的索引
                extendDataIndex:0,
                uuidList:[],
                modal1: false,
                theData: [],
                loading: false,
                columns1: [
                    {title: '序号', key: 'id', align: 'center',width: 60,
                    render: (h, params) => {
                            return h('span', params.index +1);
                        }
                    },
                    {title: '资源名', align: 'center', key: 'sourceName'},
                    {title: '对象内容', align: 'center',slot:'drive',},
                    {title: '备注', align: 'center',width: 150, key: 'backup'},
                    {title: '操作', slot: 'action', width: 100, align: 'center'}
                ],
                action:false,//启用邮件服务按钮值
                data1:[],
                indeterminate: false,
                checkAll: false,
                checkAllGroup: [],
                //表单
                platForm:{
                    show:false,
                    form:{
                        backup:'',
                        driveList:[],
                        sourceName:'',
                        sourceContent:'',
                        uuid:'',
                    }
                },
                //账号
                userform: {
                    show: false,
                    form: {
                        username:'',
                        sourceContent:'',
                        text:'',
                    },
                    rules:{
                        sourceName:{ required: true, message: '不能为空', trigger: 'blur' },
                        sourceContent:{ required: true, message: '不能为空', trigger: 'blur' },
                    }
                },
                links: [
                    {name: "策略管理", to: "/strategy/strategylist"},
                    {name: "数据源对象", to: "/strategy/datasource"}
                ],
            }
        },
        created() {
            this.showData();
            this.getsourceinfo();
        },
        mounted() {
            // this.data1 = [{username:"test1",text:'beizhu',sourceContent:"333"}]
            var that = this;
            Utils.$on('menuShowData', function (msg) {
                // console.log(msg);
                that.showData();
            })
        },
        methods: {
            updateNode(){
                
            },
            edit(index){
                this.modal1 = true
                this.platForm.form = this.data1[index]
                this.backup = this.data1[index].backup
                this.theData = this.cleanData(this.theData)
                this.theData = this.extendData(this.theData,index)
            },
            cleanData(dataArr){
                dataArr.forEach( (item,value) => {
                    this.$set(item,'checked',false)
                    if(item.children && item.children.length >0 ){
                        this.cleanData.call(this, item.children)
                    }
                })
                return dataArr
            },
            extendData(dataArr,index){
                this.extendDataIndex = index
                dataArr.forEach( (item,value) => {
                    // console.log(this.extendDataIndex)
                        for(let j in this.data1[this.extendDataIndex].driveList){
                            if(item.uuid){
                                if(item.uuid == this.data1[this.extendDataIndex].driveList[j].uuid){
                                    console.log(item.title)
                                    this.$set(item,'checked',true)
                                } 
                                // else{
                                //     this.$set(item,'checked',false)
                                // }
                            }
                        }
                    
                    if(item.children && item.children.length >0 ){
                        this.extendData.call(this, item.children,this.extendDataIndex)
                    }
                })
                return dataArr
            },
            submitdriver(){
                //获取tree组件的选中子节点
                let arr = this.$refs.tree.getCheckedNodes()
                if(arr.length<=0){
                    this.$Notice.warning({title: '修改失败', desc: '请选择节点', duration: 5});
                    return
                }
                //筛选无children的子节点
                for(let i in arr){
                    if(arr[i].children){
                        arr.splice(i,1)
                    }
                }
                for(let i in arr){
                    if(arr[i].children){
                        arr.splice(i,1)
                    }
                }
                //装进uuid
                this.uuidList = []
                console.log(arr)
                for(let i in arr){
                    this.uuidList.push(arr[i].uuid)
                }
                console.log(this.uuidList)
                let newarr = []
                for(let i = 0; i<arr.length; i++){
                    if(!newarr[arr[i].driveType]){
                        newarr[arr[i].driveType] = arr[i].title
                        // newarr[arr[i].driveType].push(arr[i].title)
                    }else{
                        newarr[arr[i].driveType] = newarr[arr[i].driveType] +','+ arr[i].title
                    }    
                }
                //拼接数组
                let string = ''
                for(let i in newarr){
                    if(string == ''){
                        string = i+'<'+ newarr[i] +'>,'
                    }else{
                        string = string+i+'<'+ newarr[i] +'>,'
                    }
                    
                }
                this.platForm.form.sourceContent = string.slice(0,-1)
                this.submit()
            },
            getsourceinfo(){
                this.$https.fetchGet(this.$api.strategy.findStrategyDataSourceAll.url).then((resp) => {
                    if (resp.data.code == 200) {
                        this.data1= resp.data.data
                        // for(let i in this.data1){
                        //     // if(this.data1[i].sourceContent !=null){
                        //         if(this.data1[i].sourceContent.length>35){
                        //             this.spliceSourceContent = this.data1[i].sourceContent.slice(0,30)+'...'  //进行数字截取
                        //         }else{
                        //             this.spliceSourceContent = this.data1[i].sourceContent
                        //         }
                        //     // }
                        //     console.log(this.spliceSourceContent)
                        // }
                    } else
                        this.$Notice.error({title: '数据源对象添加失败', desc: "错误：" + resp.data.describe, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
            },
            showAddDrawer() {
                this.platForm.show = true;
            },
            submit() {
                this.platForm.form.backup = this.backup
                this.platForm.form.driveList = this.uuidList
                console.log(this.platForm.form)
                this.$https.fetchPost(this.$api.strategy.updateStrategyDataSource.url,this.platForm.form).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '数据源对象修改成功', desc: "正在刷新界面", duration: 2.5});
                        setTimeout(() => {
                            this.reload();
                        }, 250);
                    } else
                        this.$Notice.error({title: '数据源对象修改失败', desc: "错误：" + resp.data.describe, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })

            },
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
                        arr[0].children[i].children.push({id: "3",title: resp.data.data[j].name,uuid: resp.data.data[j].uuid,remark: resp.data.data[j].remark,enable: resp.data.data[j].enable,driveType: driveType});
                    }
                }
                return arr;
            },
            showData(){
                this.findChannel().then((resp) => {
                    let data = [{id: "1", title: "采集服务", menuCode: "10",expand:true , children: []}];
                    for(let i in resp.data.data) {
                        data[0].children.push({id: "2",title: resp.data.data[i].name,uuid: resp.data.data[i].uuid,driveType: resp.data.data[i].driveType,children: [],remark: resp.data.data[i].remark});
                    }
                    this.findDrive(data).then((resp) => {
                        this.theData = resp;
                        console.log(this.theData,"theData")
                    });
                });
            },
            //修改邮件提交表单
            addPlatForm(){
                this.$refs['plat_form'].validate((valid) => {
                    if (!valid)
                        return;
                this.$https.fetchPost(this.$api.mail.updateMailUser.url,this.userform.form).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '邮件账号修改成功', desc: "正在刷新界面", duration: 2.5});
                        setTimeout(() => {
                            this.reload();
                        }, 250);
                    } else
                        this.$Notice.error({title: '邮件账号修改失败', desc: "错误：" + resp.data.describe, duration: 5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
                });
            },
            restPlatForm() {
                this.$refs['plat_form'].resetFields();
            },
            //删除邮件
            deleteSource(index,i) {
                console.log(index)
                this.$Modal.confirm({
                    title: '删除数据源对象',
                    content: '<p>当前操作将会导致该配置被删除，请确认删除</p>',
                    onOk: () => {
                        this.$https.fetchPost(this.$api.strategy.deleteStrategyDataSource.url +'/'+ index).then((resp) => {
                            if (resp.data.code == 200) {
                                this.$Notice.success({title: '数据源对象删除成功', desc: "正在刷新页面", duration: 2.5});
                                setTimeout(() => {
                                    this.reload();
                                    this.$Modal.remove();
                                }, 250);
                            } else {
                                this.$Modal.remove();
                                this.$Notice.error({title: '数据源对象删除失败', desc: "错误：" + resp.data.describe, duration: 5});
                            }
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                            console.log(err)
                        })
                    }
                });
            },

            getinfo(){
                this.$https.fetchGet(this.$api.mail.getMailServerMessage.url).then((resp) => {
                if (resp.data.code == 200) {
                    console.log(resp.data.data,"邮件数据")
                    this.platForm.form = resp.data.data
                    if(resp.data.data.users){
                        this.data1 = resp.data.data.users
                    }
                    if (this.platForm.form.action==0) {
                        this.action = true
                    }else{
                        this.action = false
                    }
                } else
                    this.$Notice.error({title: '获取数据失败', desc:  resp.data.describe, duration: 5});
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                    console.log(err)
                })
            },

        }
    }
</script>

<style scoped>
</style>