export default {
    title: "内部链路",
    columns: [
        {type: 'selection', width: 60, align: 'center'},
        {type: 'index', width: 60, align: 'center'},
        {sortable: true, title: '平台标识', key: 'name',},
        {sortable: true, title: '链路名称', key: 'number'},
        {sortable: true, title: '接入对象', key: 'ipv4'},
        {sortable: true, title: '业务操作方式', key: 'name'},
        {sortable: true, title: '链路宽带', key: 'name'},
        {sortable: true, title: '防火墙', key: 'date'},
        {sortable: true, title: '可信边界网关', key: 'cname'},
        {sortable: true, title: 'VPN网关', key: 'phone'},
        {
            title: '操作',
            width: 170,
            render: (h, params) => {
                return h("ButtonGroup", [
                    h("Button", {props: {type: 'info', size: 'small', ghost: true}, style: {marginRight: "5px"}}, "详情"),
                    h("Button", {
                        props: {type: 'warning', size: 'small', ghost: true}, style: {marginRight: "5px"}
                    }, "修改"),
                    h("Button", {
                        props: {type: 'error', size: 'small', ghost: true},
                        style: {marginRight: "5px"}
                    }, "删除"),
                ]);
            }
        },
    ],
    url: "http://localhost:8013/devinfo",
    formDynamic: {
        form: {
            time: {
                search: false,
                show: false,
                value: '',
                type: 'date',
                label: '时间',
                rules: {
                    required: true, validator: (rule, value, callback) => {
                        if (!(value instanceof Array) || value.length !== 2) {
                            callback(new Error('请使用控件进行操作'));
                        } else if (!(value[0] instanceof Date && value[1] instanceof Date)) {
                            callback(new Error('不能为空'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'
                },
                desc: '请选择时间限制',
            },
            name: {
                search: false,
                show: false,
                type: 'str',
                label: '名称',
                rules: {
                    required: true, message: "not be empty", trigger: "blur"
                }
                ,
                desc: '请选择时间限制',
                value: ''
            },
            port: {
                search: false,
                show: false,
                type: 'str',
                label: '端口',
                rules: {
                    required: true, message: "not be empty", trigger: "blur"
                }
                ,
                desc: '请选择时间限制',
                value: ''
            },
        },
        submit: 0
    }
};