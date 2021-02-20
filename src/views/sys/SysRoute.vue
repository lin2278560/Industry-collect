<template>
    <div class="container-fluid">
        <div class="row box margin-x clear-margin padding-x">
            <div class="modal-header " style="border-bottom: 1px solid #a9a9a9;">
                <blockquote style="padding: 0; margin: 0; border: none;color: #000;">
                    <jk_tabs :links="links" style="float: left;font-size: 14px;"></jk_tabs>
                    <route_add style="float: right"></route_add>
                </blockquote>
            </div>
            <div class="modal-body" style="height: 800px;overflow: auto;">
                <Table size="small" border :columns="columns1" :data="data1">
                    <template slot-scope="{ row, index }" slot="state">
                        <!--                        <strong>{{ row.name }}</strong>-->
                        <Button :icon="data1[index].iconName" size="small" style="margin: auto" @click="updateState(index)">
                                <span :style="{'color':data1[index].color}">
                                    {{ row.state }}
                                </span>
                        </Button>
                    </template>
                    <template slot-scope="{ index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="updateRoute(index)">修改</Button>
                        <Button type="error" size="small" @click="deleteRoute(index)">删除</Button>
                    </template>
                </Table>
            </div>
        </div>

<!--        <Drawer title="静态路由" v-model="modal.show" width="1000">-->
<!--            <Form ref="info_form" :rules="modal.ruleInline" :model="modal.form"-->
<!--                  :label-width="150">-->
<!--                <FormItem label="状态" prop="state" style="margin-bottom: 0px;">-->
<!--                    <RadioGroup v-model="modal.state">-->
<!--                        <Radio label="禁用"></Radio>-->
<!--                        <Radio label="启用"></Radio>-->
<!--                    </RadioGroup>-->
<!--                </FormItem>-->
<!--                <FormItem prop="ipVersion" label="网络版本">-->
<!--                    <RadioGroup v-model="modal.form.ipVersion">-->
<!--                        <Radio label="IPV4">IPV4</Radio>-->
<!--                    </RadioGroup>-->
<!--                </FormItem>-->
<!--                <FormItem prop="destination" label="ip地址">-->
<!--                    <Input type="text" v-model="modal.form.destination" placeholder="192.168.1.1"/>-->
<!--                </FormItem>-->
<!--                <FormItem prop="genmask" label="掩码/前缀">-->
<!--                    <Input type="text" v-model="modal.form.genmask" placeholder="255.255.255.0"/>-->
<!--                </FormItem>-->
<!--                <FormItem prop="gateway" label="网关">-->
<!--                    <Input type="text" v-model="modal.form.gateway" placeholder="192.168.1.254"/>-->
<!--                </FormItem>-->
<!--                <FormItem prop="iface" label="网络接口">-->
<!--                    <Select v-model="modal.form.iface">-->
<!--                        <Option v-for="netInf in netInfs" :value="netInf">{{netInf}}</Option>-->
<!--                    </Select>-->
<!--                </FormItem>-->
<!--                <FormItem>-->
<!--                    <Button type="primary" @click="addForm">确认</Button>-->
<!--                    <Button style="margin-left: 8px" @click="restForm">重置</Button>-->
<!--                </FormItem>-->
<!--            </Form>-->
<!--        </Drawer>-->

        <Modal v-model="modal.show" title="静态路由" width="600" :styles="{top: '25%'}">
            <Form ref="info_form" :rules="modal.ruleInline" :model="modal.form"
                  :label-width="150">
                <FormItem label="状态" prop="state" style="margin-bottom: 0px;">
                    <RadioGroup v-model="modal.state">
                        <Radio label="禁用"></Radio>
                        <Radio label="启用"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="ipVersion" label="网络版本">
                    <RadioGroup v-model="modal.form.ipVersion">
                        <Radio label="IPV4">IPV4</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="destination" label="ip地址">
                    <Input type="text" v-model="modal.form.destination" placeholder="192.168.1.1"/>
                </FormItem>
                <FormItem prop="genmask" label="掩码/前缀">
                    <Input type="text" v-model="modal.form.genmask" placeholder="255.255.255.0"/>
                </FormItem>
                <FormItem prop="gateway" label="网关">
                    <Input type="text" v-model="modal.form.gateway" placeholder="192.168.1.254"/>
                </FormItem>
                <FormItem prop="iface" label="网络接口">
                    <Select v-model="modal.form.iface">
                        <Option :key="index" v-for="(netInf,index) in netInfs" :value="netInf">{{netInf}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="modal.show = false">取消</Button>
                <Button type="primary" size="large" @click="addForm">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import JkTabs from "@/components/JkTabs.vue";
    import route_add from "./SysRouteAdd";
    export default {
        name: "NetworkRoute",
        components: {
            jk_tabs: JkTabs,route_add
        },
        data(){
            const validatorIp = (ver4, ver6) => {
                return (rule, value, callback) => {
                    let ipv6 = /^(([\da-fA-F]{1,4}):){8}$/;
                    let ipv4 = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.){4}$/;
                    let ipver = this.modal.form.ipVersion;
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
                columns1: [
                    {title: '序号', width: 70, type: 'index', align: 'center'},
                    {
                        title: '运行状态', key: 'state', align: 'center', width: 100,
                        render: (h, params) => {
                            let state = params.row.state;
                            // let text = params.row.state ? '是' : '否';
                            let color = params.row.state ? 'success' : 'error';
                            let desc = params.row.desc;
                            if (state) {
                                return h("Tag", {props: {type: "dot", color: color}})
                            } else {
                                return h(
                                    "Tooltip",
                                    {props: {content: desc, maxWidth: "200"}},
                                    [h("Tag", {props: {type: "dot", color: color}})]
                                )
                            }
                        }
                    },
                    {title: '所属网卡', key: 'iface', align: 'center', sortable: true, width: 150},
                    {title: '版本', width: 70, key: 'ipVersion', align: 'center'},
                    {title: '目标', key: 'destination', align: 'center'},
                    {title: '掩码/前缀', key: 'genmask', align: 'center'},
                    {title: '网关', key: 'gateway', align: 'center'},
                    {
                        title: '管理类型', key: 'mgType', align: 'center', width: 100,
                        render: (h, params) => {
                            let key = params.row.mgType;
                            let map = {
                                0: ["默认", "default", "该类型地址不属于本软件系统管理,为操作系统上的IP"],
                                1: ["受管", "primary", "该类型属于软件系统管理IP,软件将会同步操作系统保证有该IP地址"],
                                2: ["禁用", "error", "该类型当前系统不能添加,修改,删除"],
                            };
                            let text = map.hasOwnProperty(key) ? map[key][0] : "未知";
                            let color = map.hasOwnProperty(key) ? map[key][1] : "warning";
                            let desc = map.hasOwnProperty(key) ? map[key][2] : "未知类型,存在请联系管理员";
                            return h(
                                "Tooltip",
                                {props: {placement: "right", content: desc, maxWidth: "600"}},
                                [h("Tag", {props: {color: color}}, text)]
                            )

                        }
                    },
                    {title: '操作', slot: 'action', width: 150, align: 'center'}
                ],
                data1:[],
                modal: {
                    show: false,
                    state: "",
                    form: {
                        ipVersion: "IPV4",
                        destination: "",
                        gateway: "",
                        genmask: "",
                        iface: "",
                        state: ""
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
                                let ver = (this.modal.form.ipVersion.toLowerCase() == "ipv4") ? true : false;
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
                row: null,
                links: [
                    {name: "IP管理", to: "/sys/interface"},
                    {name: "路由管理", to: "/sys/route"}
                ],
            }
        },
        mounted: function() {
            this.showNetInterface();
        },
        methods: {
            showNetInterface() {
                this.$https.fetchGet(this.$api.system.inf.route.url, {ipVersion: "All"}).then((resp) => {
                    this.data1 = resp.data.data;
                })
            },
            deleteRoute(index) {
                this.$Modal.confirm({
                    title: '删除路由',
                    content: '<p>当前操作将会导致该静态路由被删除，请确认删除</p>',
                    loading: true,
                    onOk: () => {
                        this.$https.fetchDelete(this.$api.system.inf.route.url, this.data1[index]).then((resp) => {
                            if (resp.data.code == 200) {
                                location.reload();
                            } else {
                                this.$Modal.remove();
                                this.$Message.info('路由配置删除失败');
                            }
                        }).catch(err => {
                            this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                            console.log(err)
                        })
                    }
                });
            },
            updateRoute(index) {
                this.modal.show = true;
                this.$https.fetchGet(this.$api.system.inf.showNetInterface.url).then((resp) => {
                    let data = resp.data.data;
                    this.netInfs = [];
                    data.forEach(inf => {
                        this.netInfs.push(inf.name);
                    });
                }).catch(function (error) {
                    console.log(error);
                });

                this.modal.form.ipVersion = this.data1[index]["ipVersion"];
                this.modal.form.destination = this.data1[index]["destination"];
                this.modal.form.gateway = this.data1[index]["gateway"];
                this.modal.form.genmask = this.data1[index]["genmask"];
                this.modal.form.iface = this.data1[index]["iface"];
                this.data1[index]["state"] ? this.modal.state = "启用" : this.modal.state = "禁用";

                this.row = this.data1[index];
            },
            restForm() {
                this.$refs['info_form'].resetFields();
            },
            addForm() {
                this.$refs['info_form'].validate((valid) => {
                    if (!valid)
                        return;

                    this.modal.state == "禁用" ? this.modal.form.state = false : this.modal.form.state = true;
                    let parm = {oldRoute: this.row, route: this.modal.form};
                    this.$https.fetchPut(this.$api.system.inf.route.url, parm).then((resp) => {
                        if (resp.data.code == 200) {
                            this.$Notice.success({title: '路由配置修改成功', desc: "正在刷新界面", duration: 2.5});
                            location.reload();
                        } else
                            this.$Notice.error({title: '路由配置修改失败', desc: "错误代码：" + resp.data.describe, duration: 2.5});
                    }).catch(err => {
                        this.$Notice.error({title: '请求失败', desc: err, duration: 2.5});
                        console.log(err)
                    });
                });
            },

        }
    }
</script>

<style scoped lang="less">

</style>