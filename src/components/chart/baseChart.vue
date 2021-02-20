<template>

  <div class="pie" :id="opt.id"></div>

</template>
<script>

  export default {
    data(){
      return {
        chart: null
      }
    },
    props: {
      opt: {
        id: {type: String},//图表ID，声明请唯一
        show: {default: false},//true加载数据显示/false显示加载中
        option: {type: Object},//chart参数
        refresh: Number
      }
    },
    mounted(){
      this.initChart();
    },
    methods: {
      initChart(){
        if (this.chart == null) {
          this.chart = this.$echarts.init(document.getElementById(this.opt.id));
          this.$emit('getChart',this.chart);
        }
        if (this.opt.show) {
          this.chart.hideLoading();
          this.chart.setOption(this.opt.option);
        } else {
          this.chart.showLoading({text: "数据加载中"});
        }
      },
      refresh(){

        if (this.opt.show) {
          this.chart.hideLoading();
          this.chart.setOption(this.opt.option);
        } else
          this.chart.showLoading({text: "数据加载中"});


      }
    },
    watch: {
      'opt.refresh'(v, ov){
        this.refresh();
      }
    }
  }


</script>
<style scoped>
  .pie {
    height: 100%;
    width: 100%;
  }

</style>
