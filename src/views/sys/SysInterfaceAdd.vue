<template>
    <div>
        <Button type="primary" @click="showAddDrawer">
            新增
        </Button>
<!--        <Drawer title="接口" v-model="platForm.show" width="700" style="background-color: #faf8f7">-->
<!--            <Form ref="plat_form" :rules="platForm.ruleInline" :model="platForm.form"-->
<!--                  :label-width="150">-->
<!--                <FormItem label="状态" prop="status" style="margin-bottom: 0px;">-->
<!--                    <RadioGroup v-model="platForm.state">-->
<!--                        <Radio label="禁用"></Radio>-->
<!--                        <Radio label="启用"></Radio>-->
<!--                    </RadioGroup>-->
<!--                </FormItem>-->
<!--                <FormItem prop="ipVersion" label="网络版本">-->
<!--                    <RadioGroup v-model="platForm.form.ipVersion">-->
<!--                        <Radio label="IPV4">IPV4</Radio>-->
<!--                        <Radio label="IPV6">IPV6</Radio>-->
<!--                    </RadioGroup>-->
<!--                </FormItem>-->
<!--                <FormItem prop="ip" label="ip地址">-->
<!--                    <Input type="text" v-model="platForm.form.ip" placeholder="192.168.1.1"/>-->
<!--                </FormItem>-->
<!--                <FormItem prop="genmask" label="掩码/前缀">-->
<!--                    <Input type="text" v-model="platForm.form.genmask" placeholder="255.255.255.0"/>-->
<!--                </FormItem>-->
<!--                <FormItem prop="iface" label="网络接口">-->
<!--                    <Select v-model="platForm.form.iface">-->
<!--                        <Option v-for="netInf in netInfs" :value="netInf">{{netInf}}</Option>-->
<!--                    </Select>-->
<!--                </FormItem>-->
<!--                <FormItem prop="remark" label="备注">-->
<!--                    <Input type="textarea" v-model="platForm.form.remark" placeholder="192.168.1.254"/>-->
<!--                </FormItem>-->
<!--                <FormItem>-->
<!--&lt;!&ndash;                    <Button type="primary" @click="addPlatForm">确认</Button>&ndash;&gt;-->
<!--                    <Button type="primary" @click="addTest">确认</Button>-->
<!--                    <Button style="margin-left: 8px" @click="restPlatForm">重置</Button>-->
<!--                </FormItem>-->
<!--            </Form>-->
<!--        </Drawer>-->

        <Modal v-model="platForm.show" title="接口" width="600" :styles="{top: '25%'}">
            <Form ref="plat_form" :rules="platForm.ruleInline" :model="platForm.form"
                  :label-width="150">
                <FormItem label="状态" prop="status" style="margin-bottom: 0px;">
                    <RadioGroup v-model="platForm.state">
                        <Radio label="禁用"></Radio>
                        <Radio label="启用"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="ipVersion" label="网络版本">
                    <RadioGroup v-model="platForm.form.ipVersion">
                        <Radio label="IPV4">IPV4</Radio>
                        <Radio label="IPV6">IPV6</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="ip" label="ip地址">
                    <Input type="text" v-model="platForm.form.ip" placeholder="192.168.1.1"/>
                </FormItem>
                <FormItem prop="genmask" label="掩码/前缀">
                    <Input type="text" v-model="platForm.form.genmask" placeholder="255.255.255.0"/>
                </FormItem>
                <FormItem prop="iface" label="网络接口">
                    <Select v-model="platForm.form.iface">
                        <Option v-for="(netInf,i) in netInfs" :key="i" :value="netInf">{{netInf}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="remark" label="备注">
                    <Input type="textarea" v-model="platForm.form.remark" placeholder="192.168.1.254"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="platForm.show = false">取消</Button>
                <Button type="primary" size="large" @click="addTest">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "NetworkInterfaceAdd",
        components: {},
        data() {
            const validatorIp = (ver4, ver6) => {
                return (rule, value, callback) => {
                    let ipv6 = /^(([\da-fA-F]{1,4}):){8}$/;
                    let ipv4 = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.){4}$/;
                    let ipver = this.platForm.form.ipVersion;
                    let ipRegx = (ipver == "IPV6") ? ipv6 : ipv4;
                    let message = (ipver == "IPV6") ? ver6 : ver4;
                    value += (ipver == "IPV6") ? ":" : ".";
                    if (ipRegx.test(value))
                        callback();
                    else
                        callback(new Error(message));
                }
            };
            return {
                platForm: {
                    show: false,
                    state: "禁用",
                    form: {
                        ipVersion: "IPV4",
                        ip: "",
                        genmask: "",
                        remark: "",
                        iface: "",
                        state: ""
                    },
                    ruleInline: {
                        ipVersion: {required: true, trigger: 'change', message: '请选择网络版本'},
                        ip: {
                            required: true,
                            trigger: 'change',
                            validator: validatorIp("请输入合法的ipv4地址", "请输入合法的ipv6地址")
                        },
                        genmask: {
                            required: true,
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                let ver = (this.platForm.form.ipVersion == "IPV4") ? true : false;
                                if (ver) {//ipv4
                                    let ipv4 = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.){4}$/;
                                    if (ipv4.test(value + "."))
                                        callback();
                                    else
                                        callback(new Error('请输入合法的ipv4子网掩码'));
                                } else {//ipv6
                                    let regx = /^[0-9]*$/;
                                    if (regx.test(value) && value > 0 && value < 129) {
                                        callback();
                                    } else
                                        callback(new Error('请输入合法的ipv6前缀，0~129之间的数字'));
                                }
                            },
                        },
                        remark: {
                            trigger: 'change',
                            max: 20,
                            message: '请输入0~20的字符串',
                        },
                        iface: {required: true, message: '请选择要设置网络接口', trigger: 'change'},
                    }
                },
                netInfs: [],
            }
        },
        computed: {},
        mounted: function() {

        },
        methods: {
            showNetInterface() {
                // this.modal.show = true;
                this.$https.fetchGet(this.$api.system.inf.showNetInterface.url).then((resp) => {
                    let data = resp.data.data;
                    data.forEach(inf => {
                        this.netInfs.push(inf.name);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            addTest(){
                this.$refs['plat_form'].validate((valid) => {
                    if (!valid)
                        return;

                    // if(this.platForm.form.state == "禁用"){
                    //     this.platForm.form.state = "disable";
                    // }else{
                    //     this.platForm.form.state = "enable";
                    // }
                    this.platForm.state == "禁用" ? this.platForm.form.state = false : this.platForm.form.state = true;

                    this.$https.fetchPost(this.$api.system.inf.ip.url, this.platForm.form).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '接口添加成功', desc: "正在刷新界面", duration: 2.5});
                            location.reload();
                        } else
                            this.$Notice.error({title: '接口添加失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        console.log(err)
                    })
                });
            },
            showAddDrawer() {

                this.showNetInterface();
                this.platForm.show = true;
            },

            addPlatForm() {

            },
            restPlatForm() {
                this.$refs['plat_form'].resetFields();
            }
        }
    };
</script>
<style scoped lang="less">
    @deep: ~'>>>';
    @{deep} .ivu-drawer-content {
        background: #faf8f7;
    }

</style>