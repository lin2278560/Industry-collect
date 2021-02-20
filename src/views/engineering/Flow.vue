<template>
    <div>
        <Tabs value="">
            <TabPane :key="i" v-for="(f,i) in flows" :label="f.id" :name="f.id">
                <vBaseChart :opt="f" style="height:300px;"/>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
    // @ is an alias to /src

    import vBaseChart from "@/components/chart/baseChart.vue";

    export default {
        components: {
            vBaseChart
        },
        props: {
            // flow: Object
            flow: Array
        },
        data() {
            return {
                init: true,
                flows: {}
            };
        },
        methods: {
            handleMsg(nv, oFlow) {
                for (let key in nv) {
                    let flow = nv[key];

                    let name = flow.name;
                    let displayName = flow.displayName;
                    let time = this.$util.time_stamp2time_date(flow.time).format("hh:mm:ss");
                    let recvSpeed = flow.recvSpeed;
                    let sendSpeed = flow.sendSpeed;

                    if (oFlow.hasOwnProperty(name)) {//有
                        let times = oFlow[name].option.xAxis.data;
                        let recvs = oFlow[name].option.series[0].data;
                        let sends = oFlow[name].option.series[1].data;
                        if (times.length >= 10) {
                            times.shift();
                            recvs.shift();
                            sends.shift();
                        } else {
                            times.push(time);
                            recvs.push(recvSpeed);
                            sends.push(sendSpeed);
                        }
                    } else {//没有
                        oFlow[name] = this.getDefFlow(name,displayName, time, recvSpeed, sendSpeed);
                    }
                    oFlow[name].show = true;
                    oFlow[name].refresh = new Date();
                }
            },
            getDefFlow(id,displayName, time, recvSpeed, sendSpeed) {
                return {
                    id: id,
                    show: false,
                    option: {
                        title: {
                            text: '网络流量情况',
                            subtext: id+':'+displayName,
                            textStyle: {
                                fontSize: 14
                            },
                            top: 0
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['接收速率', '发送速率']
                        },
                        grid: {
                            bottom: '30px',
                            left: '70px',
                            top: '54px',
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: [time]
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: function (v, i) {
                                    let KB = 1024;
                                    let MB = 1048576;
                                    let GB = 1073741824;
                                    let TB = 1099511627776;
                                    if (v < KB)
                                        v = v + "/B";
                                    else if (v >= KB && v < MB)
                                        v = parseInt(v / KB) + "/KB";
                                    else if (v >= MB && v < GB)
                                        v = parseInt(v / MB) + "/MB";
                                    else if (v >= GB && v < TB)
                                        v = parseInt(v / GB) + "/GB";
                                    else if (v >= TB)
                                        v = parseInt(v / TB) + "/TB";
                                    return v;
                                }
                            },
                        },
                        series: [
                            {
                                name: '接收速率',
                                smooth: true,
                                type: 'line',
                                data: [recvSpeed]
                            },
                            {
                                name: '发送速率',
                                smooth: true,
                                type: 'line',
                                data: [sendSpeed]
                            },
                        ]
                    },
                    refresh: 0,
                }
            }
        },
        watch: {
            "flow"(nv, ov) {
                let oFlow;
                if (this.init) {
                    oFlow = {};
                    this.handleMsg(nv, oFlow);
                    this.flows = oFlow;
                    this.init = false;
                } else {
                    oFlow = this.flows;
                    this.handleMsg(nv, oFlow);
                }


            }
        }
    };
</script>
<style scoped lang="less">

    @deep: ~'>>>';
    h2.title {
        padding: 12px 0;
        font-weight: normal;
    }

</style>
