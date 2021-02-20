<template>
    <div>
        <Tabs type="card" value="">
            <TabPane :key="i" v-for="(f,i) in flows" :label="f.id" :name="f.id">
                <vBaseChart :opt="f" style="height:280px;margin-top:12px;"/>
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
            // flow: {type: Array}
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
                console.log(nv)
                for (let key in nv) {
                    let flow = nv[key];

                    let name = flow.name;
                    let displayName = flow.displayName;
                    let time = this.$util.time_stamp2time_date(flow.time).format("hh:mm:ss");
                    let recvSpeed = flow.recvSpeed*1024;
                    let sendSpeed = flow.sendSpeed*1024;

                    if (oFlow.hasOwnProperty(name)) {//有
                        let times = oFlow[name].option.xAxis.data;
                        let recvs = oFlow[name].option.series[0].data;
                        let sends = oFlow[name].option.series[1].data;
                        if (times.length >= 20) {
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
                        // title: {
                        //     text: '网络流量情况',
                        //     subtext: id+':'+displayName,
                        //     textStyle: {
                        //         fontSize: 14
                        //     },
                        //     top: 0
                        // },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['接收速率', '发送速率'],
                            left: 10
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
                                        v = (v / KB).toFixed(2) + "/KB";
                                    else if (v >= MB && v < GB)
                                        v = (v / MB).toFixed(2) + "/MB";
                                    else if (v >= GB && v < TB)
                                        v = (v / GB).toFixed(2) + "/GB";
                                    else if (v >= TB)
                                        v = (v / TB).toFixed(2) + "/TB";
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
                    // console.log(nv[0].name)
                    // let nnv = []
                    // for(let i in nv){
                    //     if(nv[i].name == "eth0"){
                    //         nnv.push(nv[i])
                    //     }
                    // }
                    // for(let i in nv){
                    //     if(nv[i].name == "eth1"){
                    //         nnv.push(nv[i])
                    //     }
                    // }
                    // for(let i in nv){
                    //     if(nv[i].name == "eth2"){
                    //         nnv.push(nv[i])
                    //     }
                    // }
                    // for(let i in nv){
                    //     if(nv[i].name == "eth3"){
                    //         nnv.push(nv[i])
                    //     }
                    // }
                    // for(let i in nv){
                    //     if(nv[i].name == "eth4"){
                    //         nnv.push(nv[i])
                    //     }
                    // }
                    // for(let i in nv){
                    //     if(nv[i].name == "ifb0"){
                    //         nnv.push(nv[i])
                    //     }
                    // }
                    // for(let i in nnv){
                    //     nnv[i].name = "eth"+ i
                    // }
                    // for(let i in nv){
                    //     nnv.push(nv[i])
                    // }
                    // console.log(nv,"nnv")
                    // nv = nnv
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
