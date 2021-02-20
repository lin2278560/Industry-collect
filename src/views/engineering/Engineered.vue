<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                </blockquote>
            </div>
            <div class="modal-body">
                <table border="1" style="width: 100%;">
                    <tr style="height: 40px;">
                        <td style="width: 25%;background-color: #eee;margin-left: 70%;"><Icon style="float: right;margin-right: 15px;" type="ios-home-outline" /></td>
                        <td><Button type="primary" style="margin-left: 15px;" @click="downloadNode">导出</Button></td>
                    </tr>
                </table>

                <Table size="small" border :loading="loading" :columns="columns" :data="data" style="margin-top: 30px;">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="downloadEngineered(row.uuid)">下载工程备份</Button>
                    </template>
                </Table>
                <div class="foot">
                    <span class="desc" style="font-size: 13px;">查询{{total}}条，当前第{{page.form.page}}页</span>
                    <Page class="btn" @on-change="pageChange" :current="page.form.page" :total="total" show-elevator :page-size="page.form.size" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "Engineered",
        components: {
            jk_tabs: JkTabs
        },
        data(){
            return {
                columns: [
                    {title: '序号', width: 70, align: 'center', render: (h, params) => {return h("span", params.index + 1);}},
                    // {title: '日志类型', key: '', align: 'center'},
                    {title: '状态', align: 'center', render: (h, params) => {return h('p', params.row.state ? '成功' : '失败');}},
                    {title: '访问时间', align: 'center', render: (h, params) => {let data = this.$util.time_stamp2time_date(params.row.createTime);
                            return h('p', data.format("yyyy-MM-dd hh:mm:ss"));}},
                    {title: '操作', slot: 'action', width: 160, align: 'center'}
                ],
                loading: false,
                data: [],
                total: 0,
                page: {
                    form: {
                        page: 1,
                        size: 10,
                        sorts: [{filed: "createTime", order: true}]
                    }
                },

                links: [
                    {name: "工程导出", to: "/engineering/engineered"},
                    
                ]
            }
        },
        mounted: function() {
            if(this.$storage.getStorage("loginType") == "true" ){
                this.links.push({name: "配置同步", to: "/engineering/engineeredSynch"})
            }
            this.showData();
        },
        methods: {
            showData() {
                this.$https.fetchPost(this.$api.log.engineeredExport.url, this.page.form).then((resp) => {
                    this.data = resp.data.data.data;
                    this.total = resp.data.data.count;
                }).catch(err => {
                    console.log(err)
                })
            },
            pageChange(page){
                // console.log(page)
                this.page.form.page = page;
                this.showData();
            },
            downloadEngineered(uuid) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否下载工程备份</p>',
                    onOk: () => {
                        this.$https.getAxios().post(this.$api.log.dn_engineeredExport.url+'/'+uuid,{},{responseType: 'blob'}).then((resp) => {
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
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        console.log(err)
                    })
                    }
                });
                
            },
            downloadNode() {
                this.$https.getAxios().post(this.$api.collect.engineered.export.url,{},{responseType: 'blob'}).then((resp) => {
                    let headers = resp.headers;
                    let index = headers["content-disposition"].indexOf("=");
                    let filename = headers["content-disposition"].substr(index + 1,headers["content-disposition"].length);
                    //let contentType = headers['content-type'];
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
                    this.showData();
                }).catch(err => {
                    this.$Notice.error({title: '请求失败', desc: err, duration: 3});
                    console.log(err)
                })
            },
        }
    }
</script>

<style scoped>
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