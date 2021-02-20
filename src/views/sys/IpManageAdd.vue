<template>
    <div>
        <Button style="float: right;margin-right: 20px" @click="showNetInterface" type="primary">新增ip</Button>

        <Modal v-model="modal.show" title="添加IP">
            <Form ref="formInline" :model="modal.formInline" :rules="modal.ruleInline" :label-width="100">
                <FormItem prop="ipVersion" label="网络版本">
                    <RadioGroup v-model="modal.formInline.ipVersion">
                        <Radio label="IPV4">IPV4</Radio>
                        <Radio disabled label="IPV6">IPV6</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="ip" label="ip地址">
                    <Input type="text" v-model="modal.formInline.ip" placeholder="192.168.1.1"/>
                </FormItem>
                <FormItem prop="genmask" label="掩码/前缀">
                    <Input type="text" v-model="modal.formInline.genmask" placeholder="255.255.255.0"/>
                </FormItem>
                <FormItem prop="iface" label="网络接口">
                    <Select v-model="modal.formInline.iface">
                        <Option v-for="netInf in netInfs" :value="netInf">{{netInf}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="remark" label="备注">
                    <Input type="textarea" v-model="modal.formInline.remark" placeholder="192.168.1.254"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit('formInline',modal.formInline)">添加</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    // @ is an alias to /src
    export default {
        components: {},
        data() {
            const validatorIp = (ver4, ver6) => {
                return (rule, value, callback) => {
                    let ipv6 = /^(([\da-fA-F]{1,4}):){8}$/;
                    let ipv4 = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.){4}$/;
                    let ipver = this.modal.formInline.ipVersion;
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

                modal: {
                    show: false,
                    formInline: {
                        ipVersion: "IPV4",
                        ip: "",
                        genmask: "",
                        remark: "",
                        iface: "",
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
                                let ver = (this.modal.formInline.ipVersion == "IPV4") ? true : false;
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
            };
        },
        mounted() {

        },
        methods: {
            showNetInterface() {
                this.modal.show = true;
                this.$https.fetchGet(this.$api.system.inf.showNetInterface.url).then((resp) => {
                    let data = resp.data.data;
                    data.forEach(inf => {
                        this.netInfs.push(inf.name);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            handleSubmit(name, form) {
                this.$refs[name].validate((valid) => {
                    if (!valid)
                        return;

                    this.$https.fetchPost(this.$api.system.inf.addIp.url, form).then((resp) => {
                        let code = resp.data.code;
                        let title = resp.data.title;
                        let describe = resp.data.describe;
                        if (code == 200) {
                            this.$Notice.success({title: title, duration: 1});
                        } else
                            this.$Notice.error({title: title, desc: describe});

                    })

                })
            },
        }
    };
</script>
<style scoped lang="less">

</style>
