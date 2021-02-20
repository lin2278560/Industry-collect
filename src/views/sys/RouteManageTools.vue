<template>
    <div>
        <ButtonGroup size="small">
            <template v-if="row.mgType==1 || row.mgType==0 ">
                <Button @click="updateClick">
                    <Icon size="16" type="md-clipboard"/>
                    修改
                </Button>
                <Button @click="del">
                    <Icon style="font-weight: bold" size="16" type="ios-close-circle-outline"/>
                    删除
                </Button>
            </template>
        </ButtonGroup>


        <Modal v-model="modal.show" title="修改路由">
            <Spin size="large" fix v-if="modal.spinShow">数据加载中</Spin>
            <Form ref="formInline" :model="modal.formInline" :rules="modal.ruleInline" :label-width="100">
                <FormItem prop="ipVersion" label="网络版本">
                    <RadioGroup v-model="modal.formInline.ipVersion">
                        <Radio label="IPV4">IPV4</Radio>
                        <Radio label="IPV4" disabled>IPV6</Radio>
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

    export default {
        components: {},
        props: {
            row: Object
        },
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
                    spinShow: false,
                    formInline: {
                        ipVersion: "",
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
                                let ver = (this.modal.formInline.ipVersion.toLowerCase() == "ipv4") ? true : false;
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
            }
        },
        mounted() {
            this.initAttr();
        },
        computed: {},
        methods: {
            initAttr() {
                console.log(this.row);
                let row = this.row;
                let form = this.modal.formInline;
                for (let key in form) {
                    if (row.hasOwnProperty(key) && row[key]) {
                        form[key] = row[key];
                    }
                }
            },
            updateClick() {
                this.modal.show = true;
                this.modal.spinShow = true;
                this.$https.fetchGet(this.$api.system.inf.showNetInterface.url).then((resp) => {
                    let data = resp.data.data;
                    data.forEach(inf => {
                        this.netInfs.push(inf.name);
                    });
                    this.modal.spinShow = false;
                }).catch(function (error) {
                    console.log(error);
                });
            },


            handleSubmit(name, form) {
                this.$refs[name].validate((valid) => {
                    if (!valid)
                        return;
                    let parm = {oldRoute: this.row, route: form};
                    this.$https.fetchPut(this.$api.system.inf.updateRoute.url, parm).then((resp) => {
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
            del() {
                this.$Modal.confirm({
                    title: '删除路由',
                    content: '<p>当前操作将会导致该路由信息被删除，请确认删除</p>',
                    loading: true,
                    onOk: () => {
                        this.$https.fetchDelete(this.$api.system.inf.delRoute.url, this.row).then((resp) => {
                            this.$Modal.remove();
                            let code = resp.data.code;
                            let title = resp.data.title;
                            let describe = resp.data.describe;
                            if (code == 200) {
                                this.$Notice.success({title: title, duration: 1});
                            } else
                                this.$Notice.error({title: title, desc: describe});

                        })
                    }
                });

            }
        }
    };
</script>

