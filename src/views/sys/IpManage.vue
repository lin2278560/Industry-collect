<template>
    <div>
        <SimpleTable v-bind="mgTable"/>
    </div>
</template>
<script>
    // @ is an alias to /src
    import SimpleTable from "@/components/table/SimpleTable.vue";
    import IpManageAdd from "./IpManageAdd";
    import IpManageTools from "./IpManageTools";

    export default {
        components: {
            SimpleTable
        },
        data() {
            return {
                mgTable: {
                    title: "管理IP列表",
                    columns: [
                        {title: '序号', width: 70, type: 'index', align: 'center'},

                        {
                            title: '管理类型', key: 'mgType',
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
                        {
                            title: '是否运行', key: 'state',
                            render: (h, params) => {
                                let state = params.row.state;
                                let text = params.row.state ? '是' : '否';
                                let color = params.row.state ? 'primary' : 'error';
                                let desc = params.row.desc;
                                if (state) {
                                    return h("Tag", {props: {type: "dot", color: color}}, text)
                                } else {
                                    return h(
                                        "Tooltip",
                                        {props: {content: desc, maxWidth: "200"}},
                                        [h("Tag", {props: {type: "dot", color: color}}, text)]
                                    )
                                }
                            }
                        },

                        {title: '所属网卡', key: 'iface',},
                        {title: 'ip', key: 'ip'},
                        {title: '掩码/前缀', key: 'genmask'},
                        {title: '版本', key: 'ipVersion'},
                        {title: '备注', key: 'remark'},
                        {
                            title: '操作', width: 220,
                            render: (h, params) => h(IpManageTools, {props: params})
                        },
                    ],
                    //url: this.$api.system.inf.showPageIps.url,
                    render: (h, params) => h(IpManageAdd),
                    cache: []
                },
            };
        },
        mounted() {
            this.showNetInterface();
        },
        methods: {
            showNetInterface() {
                this.$https.fetchGet(this.$api.system.inf.ip.url, {ipVersion: "All"}).then((resp) => {
                    let data = resp.data.data;
                    this.mgTable.cache = data;
                })
            },
        }
    };
</script>
<style scoped lang="less">

</style>
