<template>
    <div>
        <Button icon="md-add-circle" type="primary" @click="showAddDrawer">
            新增
        </Button>
        <Modal title="新增数据源对象"  v-model="platForm.show" width="650">
            <Form ref="plat_form" :rules="platForm.rules" :model="platForm.form"
                  :label-width="90">
                <FormItem label="对象名" prop="sourceName" style="margin-bottom: 15px;">
                    <Input v-model="platForm.form.sourceName"/>
                </FormItem>
                <FormItem label="对象内容" prop="sourceContent" style="margin-bottom: 15px;">
                    <Poptip trigger="hover" :content="platForm.form.sourceContent">
                        <Input disabled style="width:426px;margin-right:20px;" v-model="platForm.form.sourceContent"/>
                    </Poptip>
                    <Button @click="modal1 = true">选取驱动</Button>
                </FormItem>
                <FormItem label="备注" prop="backup" style="margin-bottom: 15px;">
                    <Input v-model="platForm.form.backup"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="platForm.show = false">取消</Button>
                <Button type="primary" size="large" :loading="btnloading" @click="submit">确定</Button>
            </div>
        </Modal>
        <Modal title="选择驱动" @on-ok="submitdriver" v-model="modal1" width="350">
            <Tree ref="tree" :data="theData" multiple show-checkbox></Tree>
        </Modal>
    </div>
</template>

<script>
import Utils from '../../../components/test.js';
    export default {
        inject: ["reload"],
        name: "StrategyDataSourceAdd",
        components: {
        },
        data() {
            return {
                btnloading:false,
                uuidList:[],
                modal1: false,
                theData: [],
                loading: false,
                title: "title", // 显示菜单名称的属性
                platForm: {
                    show: false,
                    form: {
                        backup:'',
                        driveList:[],
                        sourceName:'',
                        sourceContent:'',
                    },
                    rules:{
                        sourceName:{ required: true, message: '不能为空', trigger: 'blur' },
                        sourceContent:{ required: true, message: '不能为空', trigger: 'blur' },
                    }
                },
                
            }
        },
        computed: {},
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
            submitdriver(){
                //获取tree组件的选中子节点
                let arr = this.$refs.tree.getCheckedNodes()
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
                    let data = [{id: "1", title: "全选", menuCode: "10", expand: true ,children: []}];
                    for(let i in resp.data.data) {
                        data[0].children.push({id: "2",title: resp.data.data[i].name,uuid: resp.data.data[i].uuid,driveType: resp.data.data[i].driveType,children: [],remark: resp.data.data[i].remark});
                    }
                    this.findDrive(data).then((resp) => {
                        this.theData = resp;
                        console.log(this.theData,"theData")
                    });
                });
            },
            showAddDrawer() {
                this.platForm.show = true;
            },

            submit() {
                this.$refs['plat_form'].validate((valid) => {
                    if (!valid)
                        return;
                    this.btnloading = true
                    this.platForm.form.driveList = this.uuidList
                    console.log(this.platForm.form)
                this.$https.fetchPost(this.$api.strategy.addStrategyDataSource.url,this.platForm.form).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '数据源对象添加成功', desc: "正在刷新界面", duration: 2.5});
                        this.btnloading = false
                        setTimeout(() => {
                            this.reload();
                        }, 250);
                    } else{
                        this.btnloading = false
                        this.$Notice.error({title: '数据源对象添加失败', desc: "错误：" + resp.data.describe, duration: 5});
                    }  
                    }).catch(err => {
                        this.btnloading = false
                        this.$Notice.error({title: '请求失败', desc: err, duration: 5});
                        console.log(err)
                    })
                });
            },
            restPlatForm() {
                this.$refs['plat_form'].resetFields();
            }
        }
    };
</script>
<style scoped lang="less">
/deep/ .ivu-input[disabled], fieldset[disabled] .ivu-input {
    background-color: #ffffff;
    opacity: 1;
    cursor: not-allowed;
    color: #ccc;
}
</style>