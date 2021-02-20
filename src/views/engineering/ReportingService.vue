<template>
    <div style="display:flex;">
        <reportMenu v-show="nodetree"></reportMenu>


            <flexbtn :nodetree="nodetree" @childFn="parentFn"></flexbtn>
        <!-- <transition name="fade" mode="out-in"> -->
            <router-view v-if="IsRouterAlive" />
            <!--            <router-view :key="reload"></router-view>-->
        <!-- </transition> -->
    </div>
</template>

<script>
    import reportMenu from "./ReportMenu";
    import flexbtn from "@/components/flexbtn.vue";
    export default {
        name: "ReportingService",
        components: {
            reportMenu,flexbtn
        },
        provide() {
            return {
                reload: this.reload,
                
            }
        },
        data() {
            return {
                IsRouterAlive: true,nodetree: true,
                
            }
        },
        methods: {
            reload() {
                this.IsRouterAlive = false;
                this.$nextTick(function () {
                    this.IsRouterAlive = true;
                });
            },
            parentFn(payload) {
                this.nodetree = payload;
            },
        }
    }
</script>

<style scoped>

</style>