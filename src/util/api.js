let api_cfg = {
    network: {
        showDevAndMac: { url: "ip/findMac", remark: "获取MAC地址列表" },
        showIPAddr: { url: "ip/findIP", remark: "获取接口列表" },
        addIpaddr: { url: "ip/addIP", remark: "添加接口地址" },
        updateIpaddr: { url: "ip/updateIP", remark: "修改接口地址" },
        delIpaddr: { url: "ip/delIP", remark: "删除接口地址" },
        startIpaddr: { url: "ip/startIP", remark: "启用接口" },
        stopIpaddr: { url: "ip/stopIP", remark: "禁用接口" },
        showIfconfig: { url: "ip/findDev", remark: "获取网口列表" }
    },
    route: {
        showRoute: { url: "route/findRoute", remark: "获取路由列表" },
        addRoute: { url: "route/addRoute", remark: "添加路由配置" },
        updateRoute: { url: "route/updateRoute", remark: "修改路由配置" },
        delRoute: { url: "route/delRoute", remark: "删除路由配置" },
        startRoute: { url: "route/startRoutes", remark: "启用路由" },
        stopRoute: { url: "route/stopRoutes", remark: "禁用路由" }
    },
    gateway: {
        showGateway: { url: "gateway/findGateWay", remark: "获取网关列表" },
        addGateway: { url: "gateway/addGateWay", remark: "添加网关配置" },
        updateGateway: { url: "gateway/updateGateWay", remark: "修改网关配置" },
        delGateway: { url: "gateway/delGateWay", remark: "修改网关配置" },
        startGateway: { url: "gateway/startGateWay", remark: "启用网关" },
        stopGateway: { url: "gateway/stopGateWay", remark: "禁用网关" }
    },
    // user: {
    //     showUser: {url: "user/findUser", remark: "获取用户信息列表"},
    //     delUser: {url: "user/delUser", remark: "删除用户信息"},
    //     addUser: {url: "user/addUser", remark: "添加用户信息"},
    //     updateUser: {url: "user/updateUser", remark: "修改用户信息"},
    //     showPWD: {url: "user/findPassWord", remark: "获取密码长度信息"},
    //     updatePWD: {url: "user/updatePassWord", remark: "修改密码长度信息"},
    //     showGroup: {url: "group/findGroup", remark: "获取用户角色列表"},
    //
    //     checkCode: {url: "captcha/checkCode", remark: "验证码接口"},
    //     login: {url: "login/login", remark: "登录接口"},
    //     session: {url: "login/session", remark: "会话接口"},
    //     cleanSession: {url: "login/cleanSession", remark: "关闭会话接口"},
    // },
    data: {
        addSyncTask: { url: "sync/addSyncTask", remark: "业务注册" },
        syncTaskInfo: { url: "sync/findSyncTaskInfo", remark: "业务与服务列表" },
        updateSyncTask: { url: "sync/updateSyncTask", remark: "修改业务信息" },
        delSyncTask: { url: "sync/delSyncTask", remark: "删除业务信息" },

        addFileTask: { url: "filetask/addFileTask", remark: "添加文件同步服务" },
        updateFileTask: { url: "filetask/updateFileTask", remark: "修改文件同步服务" },
        delFileTask: { url: "filetask/delFileTask", remark: "删除文件同步服务" },
        startFileTask: { url: "filetask/startFileTask", remark: "启动文件同步服务" },
        stopFileTask: { url: "filetask/stopFileTask", remark: "禁用文件同步服务" },
    },
    log: {
        // operationLog: {url: "log/findOperationLog", remark: ""},
        // channelLog: {url: "log/findChannelLog", remark: ""},
        // fileOperStatus: {url: "log/findFileOperStatus", remark: ""},
        userLog: { url: "log/user_log", remark: "查询系统操作日志" },
        upgrade: { url: "log/upgrade_log", remark: "查询系统升级日志" },
        engineeredExport: { url: "log/engineered_export_log", remark: "查询工程导出日志" },
        dn_engineeredExport: { url: "log/dn_engineered_export_log", remark: "下载工程备份" },
        licenseRegister: { url: "log/license_register_log", remark: "查询license注册日志" },
        collect: {
            comm: { url: "log/collect/communication_log", remark: "采集通讯日志" },
            sys: { url: "log/collect/system_run_log", remark: "采集系统运行日志" },
        },
        upload: {
            comm: { url: "log/upload/communication_log", remark: "上报通讯日志" },
            comm_detail: { url: "log/upload/communication_detail_log", remark: "上报通讯日志详情" },

            sys: { url: "log/upload/system_run_log", remark: "上报系统运行日志" },

            mailSendLog: { url: "log/collect/mailSendLog", remark: "邮箱告警日志" },
            strategyAlarmLog: { url: "log/collect/strategyAlarmLog", remark: "上报策略日志详情" },
        },
    },
    software: {
        software: { url: "software/software", remark: "查看软件信息" }
    },
    global: { url: "global/systemType", remark: "查看系统类型" },
    globalChannel: {
        url: "global/channelType",
        remark: "查看系统同步通道类型",
    },
    system: {
        inf: {
            showNetInterface: { url: "net/ifaces", remark: "查看所有网络接口" },
            ip: { url: "net/ips", remark: "管理IP" },
            route: { url: "net/routes", remark: "管理路由" }
        },
        license: {
            show: { url: "license/license", remark: "查看license信息" },
            register: { url: "license/license/actions/register", remark: "注册license" },
            view_license: { url: "license/license/actions/view_license", remark: "查看上传license信息" },
        },
        date: {
            find: { url: "date/actions/find", remark: "查看时间" },
            update: { url: "date/actions/update", remark: "修改时间" }
        },
        drive: { url: "collect/drive/dev", remark: "查询dev驱动" }
    },

    user: {
        captcha: { url: "security/captcha", remark: "获取用户登录验证码" },
        user_cfg: { url: "security/user_cfg", remark: "获取用户管理" },
        login: { url: "security/user/login", remark: "登录接口" },
        logout: { url: "security/user/logout", remark: "退出接口" },
        currentuser: { url: 'security/user/actions/currentuser', remark: '查询当前登录用户' },

        role: { url: "security/userRole", remark: "用户角色" },
        user: { url: "security/user", remark: "用户信息" }
    },
    count: {
        upload: { url: "upload/count/count/getUploadCountList", remark: "查询上报驱动统计信息" },
        collect: { url: "count/collect/countInfo", remark: "查询采集驱动统计信息" }
    },


    collect: {
        channelInfo: { url: "collect/channel", remark: "" },

        drive: { url: "collect/drive" },
        driveModbusascii: { url: "collect/drive/modbusascii" },
        driveModbusasciislave: { url: "collect/drive/modbusasciislave" },
        driveModbusrtu: { url: "collect/drive/modbusrtu" },
        driveModbusrtuslave: { url: "collect/drive/modbusrtuslave" },
        driveModbustcp: { url: "collect/drive/modbustcp" },
        driveModbustcpslave: { url: "collect/drive/modbustcpslave" },
        driveOpcda: { url: "collect/drive/opcda" },
        driveOpcdahttp: { url: "collect/drive/opcdahttp" },
        driveOpcua: { url: "collect/drive/opcua" },

        findDriveList: { url: "collect/drive/findDriveList" },

        opcDaHttpClient: { url: '/collect/drive/opcdahttpclient', remark: '下载OpcDaHttp客户端程序' },

        item: { url: "collect/item" },
        itemModbusascii: { url: "collect/item/modbusascii" },
        itemModbusasciislave: { url: "collect/item/modbusasciislave" },
        itemModbusrtu: { url: "collect/item/modbusrtu" },
        itemModbusrtuslave: { url: "collect/item/modbusasciislave" },
        itemModbustcp: { url: "collect/item/modbustcp" },
        itemModbustcpslave: { url: "collect/item/modbustcpslave" },
        itemOpcda: { url: "collect/item/opcda" },
        itemOpcdahttp: { url: "collect/item/opcdahttp" },
        itemOpcua: { url: "collect/item/opcua" },

        engineered: {
            export: { url: "collect/engineered/actions/export", remark: "工程导出" },
            synch: { url: "collect/engineered/actions/synch", remark: "一键同步" },
        },

        count: { url: "count/collect/countInfo", remark: "查询采集驱动统计信息" }
    },
    upload: {
        channelInfo: { url: "upload/channel/findBaseChannelList", remark: "查询所有上报通道信息" },
        addChannel: { url: "upload/channel/addBaseChannel", remark: "添加上报基础通道" },
        delChannel: { url: "upload/channel/deleteBaseChannel", remark: "删除上报基础通道" },
        updateChannel: { url: "upload/channel/uploadBaseChannel", remark: "修改上报基础通道" },

        drive: {
            mqtt: { url: "upload/drive/mqtt", remark: "MQTT驱动" },
            socket: { url: "upload/drive/socket", remark: "Socket驱动" },
            uaServer: { url: "upload/drive/ua_server", remark: "OPC UA Server驱动" },
            uaUpload: { url: "upload/drive/ua_upload", remark: "OPC UA UPLOAD驱动" },
            daUpload: { url: "upload/drive/da_upload", remark: "OPC DA UPLOAD驱动" },
            sql: { url: "upload/drive/sql", remark: "SQL驱动" }
        },
        // mqtt: {url: "upload/drive/mqtt", remark: "查询与删除MQTT驱动"},
        // addMqtt: {url: "upload/drive/mqtt/addDrive", remark: "添加MQTT驱动"},
        // updateMqtt: {url: "upload/drive/mqtt/updateDrive", remark: "修改MQTT驱动"},
        // mqttInfo: {url: "upload/drive/mqtt/drive", remark: "查询MQTT驱动详细信息"},
        //
        // socket: {url: "upload/drive/socket", remark: "查询与删除Socket驱动"},
        // addSocket: {url: "upload/drive/socket/addDrive", remark: "添加Socket驱动"},
        // updateSocket: {url: "upload/drive/socket/updateDrive", remark: "修改Socket驱动"},
        // socketInfo: {url: "upload/drive/socket/drive", remark: "查询Socket驱动详细信息"},
        //
        // uaServer: {url: "upload/drive/ua_server", remark: "查询与删除OPC UA Server驱动"},
        // addUaServer: {url: "upload/drive/ua_server/addDrive", remark: "添加OPC UA Server驱动"},
        // updateUaServer: {url: "upload/drive/ua_server/updateDrive", remark: "修改OPC UA Server驱动"},
        // uaServerInfo: {url: "upload/drive/ua_server/drive", remark: "查询OPC UA Server驱动详细信息"},
        //
        // uaUpload: {url: "upload/drive/ua_upload", remark: "查询与删除OPC UA UPLOAD驱动"},
        // addUaUpload: {url: "upload/drive/ua_upload/addDrive", remark: "添加OPC UA UPLOAD驱动"},
        // updateUaUpload: {url: "upload/drive/ua_upload/updateDrive", remark: "修改OPC UA UPLOAD驱动"},
        // uaUploadInfo: {url: "upload/drive/ua_upload/drive", remark: "查询OPC UA UPLOAD驱动详细信息"},

        item: {
            // uaServer: {url: "upload/item/ua_server/findItemByPage", remark: "分页查询OPC UA SERVER发布节点"},
            // uaServerList: {url: "upload/item/ua_server/findDriveItemList", remark: "查询OPC UA SERVER所有节点"},
            // uaServerNode: {url: "upload/item/ua_server/findOpcUaServerNode", remark: "查询OPC UA SERVER所有node"},
            // updateUaServer: {url: "upload/item/ua_server/updateItems", remark: "修改OPC UA SERVER上报节点"},
            // uaServerExport: {url: "upload/item/ua_server/exportUaUploadExcel", remark: "采集节点导出"},
            // uaServerImport: {url: "upload/item/ua_server/importUaUploadExcel", remark: "OPC UA SERVER上报节点导入"},
            uaServer: { url: "upload/item/ua_server", remark: "OPC UA SERVER节点" },
            mqtt: { url: "upload/item/mqtt", remark: "MQTT节点" },
            uaUpload: { url: "upload/item/ua_upload", remark: "OPC UA UPLOAD节点" },
            socket: { url: "upload/item/socket", remark: "Socket节点" },
            sql: { url: "upload/item/sql", remark: "SQL节点" },
            daUpload: { url: "upload/item/da_upload", remark: "OPC DA UPLOAD节点" },
            daUploadCVS: { url: "upload/item/da_upload/exportCvs", remark: "OPC DA UPLOAD cvs导出" },
        },
        count: { url: "upload/count/count/getUploadCountList", remark: "查询上报驱动统计信息" }
    },
    strategy: {
        thresholdInfo: { url: "/upload/devThreshold/thresholdInfo", remark: "查询设备阈值告警信息" },
        updateThresholdInfo: { url: "/upload/devThreshold/updateThresholdInfo", remark: "修改设备阈值告警信息" },

        mailInfo: { url: "/upload/mail/mailInfo", remark: "查询邮箱配置信息" },
        updateMailInfo: { url: "/upload/mail/updateMailInfo", remark: "修改邮箱配置信息" },
        testMailInfo: { url: "/upload/mail/testMailInfo", remark: "邮箱通讯测试" },

        //策略管理
        addStrategyCfg: { url: "/upload/strategy/addStrategyCfg", remark: "添加策略" },
        batchStartStrategy: { url: "/upload/strategy/batchStartStrategy", remark: "批量启动策略" },
        batchStopStrategy: { url: "/upload/strategy/batchStopStrategy", remark: "批量停止策略" },
        countStrategyInfo: { url: "/upload/strategy/countStrategyInfo", remark: "查看策略监控统计信息" },
        changeStrategyCheckUser: { url: "/upload/strategy/changeStrategyCheckUser", remark: "切换模式身份验证" },
        strategyAlarmCount: { url: "/upload/strategy/strategyAlarmCount", remark: "查看策略监控统计信息" },
        deleteStrategy: { url: "/upload/strategy/deleteStrategy", remark: "删除策略" },
        findById: { url: "/upload/strategy/findById", remark: "findStrategyByUuid" },
        findStrategyAlarmLog: { url: "/upload/strategy/findStrategyAlarmLog", remark: "统计告警右侧表格详细信息" },
        findStrategyByPage: { url: "/upload/strategy/findStrategyByPage", remark: "分页查询策略列表" },
        strategyInfo: { url: "/upload/strategy/strategyInfo", remark: "查询策略应用模式" },
        updateStrategyCfg: { url: "/upload/strategy/updateStrategyCfg", remark: "修改策略" },
        updateStrategyInfo: { url: "/upload/strategy/updateStrategyInfo", remark: "修改策略应用模式" },

        //数据源对象
        addStrategyDataSource: { url: "/upload/strategyDataSource/addStrategyDataSource", remark: "添加数据源对象" },
        deleteStrategyDataSource: { url: "/upload/strategyDataSource/deleteStrategyDataSource", remark: "删除策略数据源" },
        DataSourcefindById: { url: "/upload/strategyDataSource/findById", remark: "" },
        findStrategyDataSourceAll: { url: "/upload/strategyDataSource/findStrategyDataSourceAll", remark: "批量删除数据源对象" },
        findStrategyDataSourceByPage: { url: "/upload/strategyDataSource/findStrategyDataSourceByPage", remark: "分页查询策略数据源列表" },
        updateStrategyDataSource: { url: "/upload/strategyDataSource/updateStrategyDataSource", remark: "修改策略数据源" },

        //采集，上报系统警告
        collectSystemAlarmCount: { url: "/upload/count/collectSystemAlarmCount", remark: "采集系统告警统计" },
        getUploadCountList: { url: "/upload/count/count/getUploadCountList", remark: "查询上报驱动统计信息" },
        findCollectAlarmLog: { url: "/upload/count/findCollectAlarmLog", remark: "获取采集系统告警日志" },
        findUploadAlarmLog: { url: "/upload/count/findUploadAlarmLog", remark: "获取上报系统告警日志" },
        operationIsReport: { url: "/upload/count/operationIsReport", remark: "操作驱动上报总开关" },
        uploadSystemAlarmCount: { url: "/upload/count/uploadSystemAlarmCount", remark: "上报系统告警统计" },
    }





};

export default api_cfg;