<template>
    <div style="align-items:center;display:flex;justify-content:flex-start;">
        <Upload
                :before-upload="handleUpload"
                :action="url">
            <Button icon="ios-cloud-upload-outline">上传节点</Button>
        </Upload>
        <div v-if="uploadData.excelFile !== null">Upload file: {{ uploadData.excelFile.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button></div>
<!--        <Button style="float: right;margin-right: 10px;" size="small" @click="downloadNode">下载节点</Button>-->
    </div>
</template>

<script>
    export default {
        name: "upload",
        data () {
            return {
                // file: null,
                loadingStatus: false,
                uploadData: {excelFile: null},
                driveUuid: null,
                url: '',
                uploadFile: [],

        }
        },
        methods: {
            handleUpload (file) {
                console.log("进入handleUpload方法"+file);
                this.uploadData.excelFile = file;
                // this.uploadData.driveUuid = "ca1bcdb0-79a5-4b79-a46c-fe0e8a695976";
                // this.uploadFile.push(file);
                return false;
            },
            upload () {
                // this.url = this.$api.collect.itemOpcua.url+"/actions/upexcel?driveUuid=ca1bcdb0-79a5-4b79-a46c-fe0e8a695976";
                console.log("进入upload方法");
                this.loadingStatus = true;

                let formData = new FormData();
                formData.append('excelFile',this.uploadData.excelFile);

                this.$https.fetchPost(this.$api.collect.itemOpcua.url+"/actions/upexcel?driveUuid=ca1bcdb0-79a5-4b79-a46c-fe0e8a695976", formData).then((resp) => {
                    if (resp.data.code == 200) {
                        this.$Notice.success({title: '上传节点成功', desc: "正在刷新界面", duration: 2.5});
                        // location.reload();
                    } else
                        this.$Notice.error({title: '上传节点失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                    console.log(err)
                });
                // setTimeout(() => {
                //     this.file = null;
                //     this.loadingStatus = false;
                //     this.$Message.success('Success')
                // }, 1500);
            }
        }
    }
</script>

<style scoped>

</style>