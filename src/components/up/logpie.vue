<template>

    <div class="pie" :id="id" style="width: 100%"/>

</template>
<script>

    export default {
        name: "Pie",
        props: {
            id: String,
            dataArr: Object,
            warning:String,
        },
        mounted(){
            // this.chart(this.dataArr);
        },
        data(){
            return {
                data: null,
                url: '',
                file: null,
                loading: false,
                legendData:[],
                seriesData:[],
                DriveLogData:[],
                driveWarningTitle:'',
            }
        },
        methods: {
            //饼状图渲染
            chart(dataArr){
                let pie = this.$echarts.init(document.getElementById(this.id))
                pie.clear()
                // 绘制图表
                let option = {
                    //标题设置
                    title: {
                        text: '拦截统计图',
                        subtext: '点击饼图模块查看拦截详情',
                        // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                        x: 'center',
                        // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                        y: 10,
                        // itemGap设置主副标题纵向间隔，单位px，默认为10，
                        // itemGap: 30,
                        // backgroundColor: '#EEE',
                        // 主标题文本样式设置
                        textStyle: {
                            fontSize: 16,
                            fontWeight: 'bolder',
                            color: '#000080',
                        },
                        // 副标题文本样式设置
                        subtextStyle: {
                            fontSize: 12,
                            color: '#8B2323'
                        }
                    },
                    //设置canvas内部表格的内距
                    grid:{
                            x:50,
                            y:0,
                            // top:'55%',
                            // bottom:'5%',
                            // left:'5%',
                            // right:'5%',
                            x2:50,
                            y2:60,
                            borderWidth:10
                    },
                    //图例设置
                    legend: {
                        // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
                        orient: 'horizontal',
                        // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                        x: 'center',
                        // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                        y: 'bottom',
                        itemWidth: 24,   // 设置图例图形的宽
                        itemHeight: 18,  // 设置图例图形的高
                        textStyle: {
                            color: '#666'  // 图例文字颜色
                        },
                        // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
                        itemGap: 30,
                        // backgroundColor: '#eee',  // 设置整个图例区域背景颜色
                        data: ['北京','上海','广州','深圳','郑州']
                        // data:[]
                    },
                    //值域设置
                     series: [
                        {
                        name: '拦截条数',
                        type: 'pie',
                        radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
                        // radius: ['30%', '60%'],  // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
                        center: ['50%', '40%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
                        data: [
                            {value:335, name:'北京'},
                            {value:310, name:'上海'},
                            {value:234, name:'广州'},
                            {value:135, name:'深圳'},
                            {value:148, name:'郑州'}
                        ],
                        // itemStyle 设置饼状图扇形区域样式
                        itemStyle: {
                            // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
                            // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
                            emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(30, 144, 255，0.5)'
                            }
                        },
                        // 设置值域的那指向线
                        labelLine: {
                            normal: {
                                show : true
                                // show: true ,  // show设置线是否显示，默认为true，可选值：true ¦ false
                            }
                        },
                        // 设置值域的标签
                        label: {
                            normal: {
                                position: 'inner',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                                // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                                // {a}指series.name  {b}指series.data的name
                                // {c}指series.data的value  {d}%指这一部分占总数的百分比
                                formatter: '{c}'
                            }
                        }
                        }
                    ],
                    //暂无数据
                    noDataLoadingOption:{
                        effect:"bubble",
                        text:"暂无数据",
                        effectOption:{
                            effect:{
                                n:0
                            }
                        },
                        textStyle:{
                            fontSize:32,
                            fontWeight:'bold'
                        }
                    },
                    //提示框设置
                    tooltip: {
                        // trigger 设置触发类型，默认数据触发，可选值：'item' ¦ 'axis'
                        trigger: 'item',
                        showDelay: 20,   // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                        hideDelay: 20,   // 隐藏延迟，单位ms
                        backgroundColor: '#575d6a',  // 提示框背景颜色
                        textStyle: {
                        fontSize: '16px',
                        color: 'white'  // 设置文本颜色 默认#FFF
                        },
                        // formatter设置提示框显示内容
                        // {a}指series.name  {b}指series.data的name
                        // {c}指series.data的value  {d}%指这一部分占总数的百分比
                        formatter: '{a} <br/>{b} : {c}个 ({d}%)'
                    },
                    //默认色版
                    color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#C0FF3E','#418bca','#5db85b','#efad4f','#da5350','#677ce7'],
                    //整个图形背景颜色设置
                    // backgroundColor: '#faf8f7',
                    backgroundColor: '#fff',
                }
                let checkObj = function() {
                for(var key in dataArr) {
                    return false;
                }
                    return true;
                }
                console.log(dataArr,"dataArr")
                if(checkObj()){
                    option.title= {
                        subtext: '',
                        extStyle: {
                            color: "grey",
                            fontSize: 20
                        },
                        text: "暂无数据",
                        left: "center",
                        top: "center"
                        }
                }
                this.legendData = []
                this.seriesData = []
                for(let i in dataArr){
                    let cname = ''
                    if(i=='cpuWarnCount'){
                        cname = 'CPU预警'
                    }else if(i=='cpuRiskCount'){
                        cname = 'CPU风险'
                    }
                    else if(i=='memWarnCount'){
                        cname = '内存预警'
                    }
                    else if(i=='memRiskCount'){
                        cname = '内存风险'
                    }
                    else if(i=='diskWarnCount'){
                        cname = '磁盘预警'
                    }
                    else if(i=='diskRiskCount'){
                        cname = '磁盘风险'
                    }
                    else if(i=='upFlowWarnCount'){
                        cname = '上行流量预警'
                    }
                    else if(i=='upFlowRiskCount'){
                        cname = '上行流量风险'
                    }
                    else if(i=='downFlowWarnCount'){
                        cname = '下行流量预警'
                    }
                    else if(i=='downFlowRiskCount'){
                        cname = '下行流量风险'
                    }
                    if(cname != ''){
                        this.legendData.push(cname)
                        let obj={value:'',name:'',cname:'',uuid:''}
                        obj.value = dataArr[i]
                        obj.cname = i   //属性名
                        obj.name = cname   //中文名
                        this.seriesData.push(obj)
                    }                   
                }
                option.legend.data = this.legendData
                option.series[0].data = this.seriesData
                console.log(option)
                pie.setOption(option);
                pie.off('click')
                var that = this
                pie.on('click', function (params) {
                    console.log(params,"parmas")
                    that.driveWarningTitle = params.name
                    that.$emit('sendDriveLogData',params.name,params.data.cname)
                })
            },
            //条状图渲染
            barchart(dataArr){
                
                let bar = this.$echarts.init(document.getElementById(this.id))
                bar.clear()
                // 绘制图表
                let option = {
                    title: {
                        text: '拦截统计图',
                        subtext: '点击柱状图模块查看拦截详情',
                        // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                        x: 'center',
                        // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                        y: 10,
                        // itemGap设置主副标题纵向间隔，单位px，默认为10，
                        // itemGap: 30,
                        // backgroundColor: '#EEE',
                        // 主标题文本样式设置
                        textStyle: {
                            fontSize: 16,
                            fontWeight: 'bolder',
                            color: '#000080',
                        },
                        // 副标题文本样式设置
                        subtextStyle: {
                            fontSize: 12,
                            color: '#8B2323'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // Use axis to trigger tooltip
                            type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                    },
                    legend: {
                        data: ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine'],
                        orient: 'vertical',  //垂直显示
                        y: 'center',    //延Y轴居中
                        x: 'right', //居右显示
                        selectedMode: 'single', 
                        padding:-0.5 //调节legend的位置
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
                    },
                    series: [
                        {
                            name: '预警拦截数',
                            type: 'bar',
                            stack: 'total',
                            color:"#f8ac59",
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 132 ,145 ,198 ,147],
                        },
                        {
                            name: '风险拦截数',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            color:"#ed5565",
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 302 , 322 , 342, 334],
                        },
                    ]
                }
                let checkObj = function() {
                for(var key in dataArr) {
                    return false;
                }
                    return true;
                }
                console.log(dataArr,"dataArr")
                if(checkObj()){
                    option.title= {
                        subtext: '',
                        extStyle: {
                            color: "grey",
                            fontSize: 20
                        },
                        text: "暂无数据",
                        left: "center",
                        top: "center"
                        }
                }
                this.legendData = []
                this.seriesData = []
                
                for(let i in dataArr){
                    let cname = ''
                    if(i=='cpuWarnCount'){
                        option.series[0].data[0] = dataArr[i]
                    }else if(i=='cpuRiskCount'){
                        option.series[1].data[0] = dataArr[i]
                    }
                    else if(i=='memWarnCount'){
                        option.series[0].data[1] = dataArr[i]
                    }
                    else if(i=='memRiskCount'){
                        option.series[1].data[1] = dataArr[i]
                    }
                    else if(i=='diskWarnCount'){
                        option.series[0].data[2] = dataArr[i]
                    }
                    else if(i=='diskRiskCount'){
                        option.series[1].data[2] = dataArr[i]
                    }
                    else if(i=='upFlowWarnCount'){
                        option.series[0].data[3] = dataArr[i]
                    }
                    else if(i=='upFlowRiskCount'){
                        option.series[1].data[3] = dataArr[i]
                    }
                    else if(i=='downFlowWarnCount'){
                        option.series[0].data[4] = dataArr[i]
                    }
                    else if(i=='downFlowRiskCount'){
                        option.series[1].data[4] = dataArr[i]
                    }
                    if(cname != ''){
                        // this.legendData.push(cname)
                    }                   
                }
                option.legend.data = ['预警值','风险值']
                option.yAxis.data = ['CPU拦截统计数','内存拦截统计数','磁盘拦截统计数','上行流量统计数','下行流量拦截统计数',]
                // option.series[0].data = this.seriesData
                console.log(option)
                bar.setOption(option);
                bar.off('click')
                var that = this
                bar.on('click', function (params) {
                    console.log(params,"parmas")
                    let name = ''
                    let cname = ''
                    if(params.dataIndex=='0' && params.seriesIndex=='0'){
                        name = 'cpuWarnCount'
                        cname = 'CPU预警'
                    }else if(params.dataIndex=='0' && params.seriesIndex=='1'){
                        name = 'cpuRiskCount'
                        cname = 'CPU风险'
                    }
                    else if(params.dataIndex=='1' && params.seriesIndex=='0'){
                        name = 'memWarnCount'
                        cname = '内存预警'
                    }
                    else if(params.dataIndex=='1' && params.seriesIndex=='1'){
                        name = 'memRiskCount'
                        cname = '内存风险'
                    }
                    else if(params.dataIndex=='2' && params.seriesIndex=='0'){
                        name = 'diskWarnCount'
                        cname = '磁盘预警'
                    }
                    else if(params.dataIndex=='2' && params.seriesIndex=='1'){
                        name = 'diskRiskCount'
                        cname = '磁盘风险'
                    }
                    else if(params.dataIndex=='3' && params.seriesIndex=='0'){
                        name = 'upFlowWarnCount'
                        cname = '上行流量预警'
                    }
                    else if(params.dataIndex=='3' && params.seriesIndex=='1'){
                        name = 'upFlowRiskCount'
                        cname = '上行流量风险'
                    }
                    else if(params.dataIndex=='4' && params.seriesIndex=='0'){
                        name = 'downFlowWarnCount'
                        cname = '下行流量预警'
                    }
                    else if(params.dataIndex=='4' && params.seriesIndex=='1'){
                        name = 'downFlowRiskCount'
                        cname = '下行流量风险'
                    }
                    that.driveWarningTitle = name
                    that.$emit('sendDriveLogData',cname,name)
                })
            },
            // eConsole(param) {
            // 　　//alert(option.series[0].data.length);
            // 　　//alert(option.series[0].data[i]);
            // 　　//param.dataIndex 获取当前点击索引，
            // 　　//alert(param.dataIndex);
            // 　　clickFunc(param.dataIndex);//执行点击效果
            // }, 
        },
        // watch: {
        //     doublePieName: { // 监听数据的变化
        //     handler:function(val){
        //         this.data.forEach(item=>{
        //         if(item.name===val.pieName){
        //             item.selected = true
        //             this.ringData = val.data
        //         }else if(val.seriesName.indexOf(this.id)!==-1){
        //             item.selected = false
        //         }
        //         })
        //     },
        //     deep:true
        //     }
        // },
    }


</script>
<style scoped>
    .pie {
        height: 100%;
        width: 100%;
    }

</style>
