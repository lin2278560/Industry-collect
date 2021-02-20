<template>
    <div class="page-view">
        <div class="content">
            <h2 class="title">运行信息</h2>

            <Row :gutter="16">
                <Col span="9">
                    <div class="box">
                        <h4>cpu整体使用情况</h4>
                        <vBaseChart :opt="cpu" style="height:220px;"></vBaseChart>
                    </div>

                </Col>
                <Col span="9">
                    <div class="box">
                        <h4>内存整体使用情况</h4>
                        <vBaseChart :opt="mem" style="height:220px;"></vBaseChart>
                    </div>
                </Col>
                <Col span="6">
                    <div class="box">
                        <h4>系统运行信息</h4>
                        <List style="padding:12px;height:220px;">
                            <ListItem><strong>运行时长:</strong><span>{{sys.runTime}}</span></ListItem>
                            <ListItem><strong>默认网关:</strong><span>{{sys.gateway}}</span></ListItem>
                            <ListItem><strong>首选DNS:</strong><span v-if="sys.dns.length>=1">{{sys.dns[0]}}</span>
                            </ListItem>

                        </List>
                    </div>
                </Col>
            </Row>
            <Row :gutter="16" style="margin-top: 1em">
                <Col span="24">
                    <div class="box">
                        <Flow :flow="flowOpt"/>
                    </div>
                </Col>
                <!--<Col span="9">
                    <div class="box">
                        <h4>系统基本信息</h4>
                        <List style="padding:12px; min-height:250px;">
                            <ListItem><strong>主板:</strong><span>{{hard.baseboard}}</span></ListItem>
                            <ListItem><strong>cpu:</strong><span>{{hard.cpu}}</span></ListItem>
                            <ListItem><strong>磁盘:</strong>
                                <ol style="margin-left: 20px">
                                    <li v-for="disk in hard.disk"><span>{{disk}}</span></li>
                                </ol>
                            </ListItem>
                        </List>
                    </div>
                </Col>-->
            </Row>
        </div>
    </div>
</template>
<script>
    // @ is an alias to /src

    import vBaseChart from "@/components/chart/baseChart.vue";
    import Flow from "./Flow";

    export default {
        components: {
            vBaseChart, Flow
        },
        data() {
            return {
                cpu: {
                    id: "cpu",
                    show: true,
                    option: {
                        visualMap: {
                            show: false,
                            type: 'continuous',
                            seriesIndex: 0,
                            min: 0,
                            max: 100
                        },
                        tooltip: {trigger: 'axis'},
                        grid: {
                            bottom: '30px',
                            left: '30px',
                            top: '20px',
                        },
                        xAxis: {
                            data: []
                        },
                        yAxis: {
                            splitLine: {show: false}, min: 0, max: 100
                        },
                        series: {
                            type: 'line',
                            showSymbol: false,
                            symbolSize: 8,
                            symbol: 'circle',
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值',},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            data: []
                        }
                    },
                    refresh: 0,
                },
                mem: {
                    id: "mem",
                    show: true,
                    option: {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            bottom: '30px',
                            left: '30px',
                            top: '20px',
                        },
                        xAxis: {type: 'category', data: ['内存使用率']},

                        yAxis: {
                            type: 'value', min: 0, max: 100,
                        },
                        series: [
                            {
                                name: '已使用',
                                type: 'bar',
                                data: [0]
                            },
                            {
                                name: '未使用',
                                type: 'bar',
                                data: [0]
                            }
                        ]
                    },
                    refresh: 0,
                },
                flow: {
                    id: "flow",
                    show: true,
                    option: {
                        title: {
                            text: '网络流量情况',
                            textStyle: {
                                fontSize: 14
                            },
                            top: 0
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['上行流量', '下行流量']
                        },
                        grid: {
                            bottom: '30px',
                            left: '30px',
                            top: '30px',
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                name: '上行流量',
                                smooth: true,
                                type: 'line',
                                data: [120, 132, 101, 134, 90, 230, 210]
                            },
                            {
                                name: '下行流量',
                                smooth: true,
                                type: 'line',
                                data: [220, 182, 191, 234, 290, 330, 310]
                            },
                        ]
                    },
                    refresh: 0,
                },

                "hard": {
                    "disk": [],
                    "baseboard": null,
                    "cpu": null
                },
                "sys": {
                    "dns": [],
                    "runTime": null,
                    "gateway": null
                },

                flowOpt: {},
                webSocket: null,
            };
        },
        mounted() {
            this.connWebSocket();
        },
        methods: {
            connWebSocket() {


                let baseUrl = this.$https.getAxios().defaults.baseURL;
                // let prefix = "manager/sys/run";
                let prefix = "collect/runner";
                let url;
                if (baseUrl.indexOf("https://") >= 0)
                    url = baseUrl.replace("https://", "wss://") + "/" + prefix;
                else
                    url = baseUrl.replace("http://", "ws://") + "/" + prefix;




               /*  let url;
                 if (document.location.protocol == "http:") {
                     url = "ws://" + window.location.host + "/" + this.$api.run.conn_websocket.url;
                 } else {
                     url = "wss://" + window.location.host + "/" + this.$api.run.conn_websocket.url;
                 }*/


                let webSocket = new WebSocket(url);

                webSocket.onmessage = this.$options.methods.handleMsg.bind(this);
                webSocket.onopen = (e) => {console.log("建立连接", e);this.send()};
                webSocket.onerror = (e) => console.log("连接异常", e);
                webSocket.onclose = (e) => console.log("连接关闭", e);

                this.webSocket = webSocket;
            },
            closeWebSocket() {
                if (this.webSocket != null)
                    this.webSocket.close();
            },
            handleMsg(e) {
                let data = JSON.parse(e.data);
                console.log(data);
                if (data.hard)
                    this.hard = data.hard;
                if (data.sys) {
                    data.sys.runTime = this.getDuration(data.sys.runTime);
                    this.sys = data.sys;
                }
                if (data.mem) {
                    let total = data.mem[0];
                    let unUse = data.mem[1];
                    let use = total - unUse;
                    //已使用
                    this.mem.option.series[0].data = [parseInt((use / total) * 100)];
                    //未使用
                    this.mem.option.series[1].data = [parseInt((unUse / total) * 100)]
                    this.mem.refresh = new Date();
                }
                if (data.cpu) {

                    let time = this.$util.time_stamp2time_date(data.cpu[0]).format("hh:mm:ss");
                    let cpu = data.cpu[1];


                    let times = this.cpu.option.xAxis.data;
                    let cpus = this.cpu.option.series.data;

                    if (times.length >= 10) {
                        times.shift();
                        cpus.shift();
                    }
                    times.push(time);
                    cpus.push(cpu);
                    this.cpu.refresh = new Date();
                }
                if (JSON.parse(data).netIfs) {
                    // this.flowOpt = data.flow;
                    this.flowOpt = JSON.parse(data).netIfs;

                }
            },
            send() {
                let data = {
                    instruct: 'MONITOR_COLLECT_DEV',
                    // param: this.value
                };
                console.log(data);

                this.webSocket.send(JSON.stringify(data));
            },


            getDuration(my_time) {
                var days = my_time / 1000 / 60 / 60 / 24;
                var daysRound = Math.floor(days);
                var hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
                var hoursRound = Math.floor(hours);
                var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
                var minutesRound = Math.floor(minutes);
                var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
                //console.log(my_time);
                //console.log('转换时间:', daysRound + '天', hoursRound + '时', minutesRound + '分', seconds + '秒');
                //var time = hoursRound + ':' + minutesRound + ':' + seconds;
                var time = daysRound + '天' + hoursRound + '时' + minutesRound + '分' + seconds + '秒'
                return time;
            }
        },
        beforeDestroy() {
            this.closeWebSocket();
        }
    };
</script>
<style scoped lang="less">

    @deep: ~'>>>';
    h2.title {
        padding: 12px 0;
        font-weight: normal;
    }

    strong {
        margin-right: 10px;
    }

</style>
