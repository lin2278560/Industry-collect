<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body">
                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin-top: 20px;">
                    <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">当前版本信息</span>
                    <div style="margin: 15px 10px;">
                        <table border="1" style="width: 100%;">
                            <tr style="height: 35px;" :key="index" v-for="(item,index) in itemList">
                                <td style="width: 25%;background-color: #eee;margin-left: 70%;"><span style="float: right;margin-right: 15px;font-size: 12px;">{{item.title}}</span></td>
                                <td><span style="margin-left: 15px;font-size: 12px;">{{item.content}}</span></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div style="border:1px solid #666;width:100%;position:relative;float: left;margin-top: 20px;">
                    <span style="background:#faf8f7; display:block; height:20px; width:90px; position:absolute; left:10px; top:-10px; text-align:center;font-size: 12px;">版本升级</span>
                    <div style="margin: 15px 10px;">
                        <table border="1" style="width: 100%;">
                            <tr style="height: 35px;">
                                <td style="width: 25%;background-color: #eee;"><span style="float: right;margin-right: 15px;font-size: 12px;">固件升级包:</span></td>
                                <td>
                                    <Upload
                                            :before-upload="handleUpload"
                                            :action="url" style="margin:15px 0 0 15px;">
                                        <Button style="float: left;" icon="ios-cloud-upload-outline">点击选择文件</Button>
                                        <div style="float: left;margin: 6px 0 0 20px;" v-if="file !== null">Upload file: {{ file.name }}
                                        </div>
                                    </Upload>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div>
                    <Button type="primary" style="margin: 10px 50%;" :loading="loading" @click="upload">升级</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "SysUpdate",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                itemList: [
                    {title: "系统名称:",content: null},
                    {title: "当前版本:",content: null},
                    {title: "发布时间:",content: null},
                    {title: "版本描述:",content: null},
                ],
                data: null,
                url: '',
                file: null,
                loading: false,
                links: [
                    {name: "系统升级", to: "/sys/update"}
                ]
            }
        },
        created() {
            // var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
            this.showData();
        },
        mounted: function() {

        },
        methods: {
            showData() {
                this.$https.fetchGet(this.$api.software.software.url).then((resp) => {
                    // this.data = resp.data.data;
                    this.itemList[0].content = resp.data.data.programName;
                    this.itemList[1].content = resp.data.data.version;
                    // this.itemList[1].content = '3.0.3.1'
                    this.itemList[2].content = this.$util.time_stamp2time_date(resp.data.data.startUptime).format("yyyy-MM-dd hh:mm:ss");
                    this.itemList[3].content = resp.data.data.descriptions;
                    // this.itemList[3].content = 'V3.1版本';
                }).catch(err => {
                    console.log(err)
                })
            },
            handleUpload (file) {
                console.log(file)
                let suffix = file.name.match(/.zip$/)
                console.log(suffix)
                if(suffix != undefined && suffix!=""){  
                    this.file = file;
                } else {  
                    this.$Notice.error({title: '上传失败', desc: "文件格式不正确...", duration: 3});
                    this.file = null
                } 
                return false;
            },
            upload () {
                if(this.file == null) {
                    this.$Notice.error({title: '未选择文件', desc: "请重新选择文件...", duration: 3});
                }else {
                    
                    let formData = new FormData();
                    formData.append('file',this.file);
                    this.$Modal.confirm({
                    title: "提示",
                    content: '<div>确定要上传升级包吗</div><div style="color:red">注:3S后系统进行重启</div>',
                    onOk: () => {
                        this.loading = true;
                        this.$Loading.start();
                            this.$https.fetchPost(this.$api.software.software.url+"/actions/upgrade", formData).then((resp) => {
                                if (resp.data.code == 200) {
                                    this.$Notice.success({title: '上传升级包成功', desc: "3S后系统进行重启", duration: 3});
                                    // location.reload();
                                    this.$Loading.finish();
                                    this.$router.push({ path: "/login" });
                                } else {
                                    this.$Notice.error({title: '上传升级包失败', desc: resp.data.describe, duration: 3});
                                    this.$Loading.error();
                                    this.loading = false;
                                }
                            }).catch(err => {
                                this.$Notice.error({title: '请求失败', duration: 3});
                                this.$Loading.error();
                                this.loading = false;
                                console.log(err)
                            });
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>
</style>