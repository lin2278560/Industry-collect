<template>
    <div class="nav">
<!--        <div style="width: 200px;height: 900px;float: left;border: 1px solid #999;margin: 15px 0 0 20px;">-->
<!--            <Tree :data="data1"></Tree>-->
<!--        </div>-->
        <!-- <transition name="fade" mode="out-in"> -->
            <router-view v-if="IsRouterAlive"/>
        <!-- </transition> -->
    </div>
</template>
<script>
    // @ is an alias to /src
    // import JkTabs from "@/components/JkTabs.vue";
    export default {
        name: "Sys",
        components: {
            // jk_tabs: JkTabs
        },
        provide() {
            return {
                reload: this.reload
            }
        },
        data(){
            return {
                IsRouterAlive: true,
            }
        },
        methods: {//方法
            reload() {
                this.IsRouterAlive = false;
                this.$nextTick(function () {
                    this.IsRouterAlive = true;
                });
            },
        }
    };
</script>
<style scoped lang="less">

    @import "../../assets/css/bootstrap.min.css";
    @import "../../assets/css/animate.css";
    @import "../../assets/css/dev-register.css";
    /*@import "../../assets/css/index.css";*/
    @import "../../assets/css/multiple-select.css";
    @import "../../assets/css/omas-basic.css";

    .nav{
        position: relative;
        top: -30px;
        float: left;
        width: 83%;
        height: 800px;
        border: 0px;
        /*background-color: rgb(238, 238, 238);*/
        background-color: #faf8f7;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        overflow:auto;
    }
</style>
