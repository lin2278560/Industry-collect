<template>
    <div>
        <Button style="float: right;margin-right: 20px" @click="showNetInfterace" type="primary">新增路由</Button>
        <Modal v-model="modal.show" title="添加路由">
            <Form ref="formInline" :model="modal.formInline" :rules="modal.ruleInline" :label-width="100">
                <FormItem prop="ipVersion" label="网络版本">
                    <RadioGroup v-model="modal.formInline.ipVersion">
                        <Radio label="IPV4">IPV4</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="destination" label="ip地址">
                    <Input type="text" v-model="modal.formInline.destination" placeholder="192.168.1.1"/>
                </FormItem>
                <FormItem prop="genmask" label="掩码/前缀">
                    <Input type="text" v-model="modal.formInline.genmask" placeholder="255.255.255.0"/>
                </FormItem>
                <FormItem prop="gateway" label="网关">
                    <Input type="text" v-model="modal.formInline.gateway" placeholder="192.168.1.254"/>
                </FormItem>
                <FormItem prop="iface" label="网络接口">
                    <Select v-model="modal.formInline.iface">
                        <Option v-for="netInf in netInfs" :value="netInf">{{netInf}}</Option>
                    </Select>
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
                        destination: "",
                        gateway: "",
                        genmask: "",
                        iface: "",
                    },
                    ruleInline: {
                        ipVersion: {required: true, trigger: 'change', message: '请选择网络版本'},
                        destination: {
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
                        gateway: {
                            required: true,
                            trigger: 'change',
                            validator: validatorIp("请输入合法的ipv4网关", "请输入合法的ipv6网关")
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
            handleSubmit(name, form) {
                this.$refs[name].validate((valid) => {
                    //this.$Message.success('Success!');
                    if (!valid)
                        return;
                    this.$https.fetchPost(this.$api.system.inf.addRoute.url, form).then((resp) => {
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
            showNetInfterace() {
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
        }
    };
</script>
<style scoped lang="less">
</style>
