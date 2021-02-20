<template>
    <div>
        <div style="display:flex;flex-wrap: nowrap;overflow-x:hidden; overflow-y:auto;">
            <test v-show="nodetree"></test>
            <!-- <transition name="fade" mode="out-in"> -->
                <flexbtn :nodetree="nodetree" @childFn="parentFn"></flexbtn>
                <router-view v-if="IsRouterAlive" />
                
    <!--            <router-view :key="reload"></router-view>-->
            <!-- </transition> -->
        </div>
    </div>
</template>

<script>
    import test from "./test";
    import flexbtn from "@/components/flexbtn.vue";
    export default {
        name: "CollectionService",
        components: {
            test,
            flexbtn
        },
        provide() {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                IsRouterAlive: true,
                nodetree: true,
            }
        },
        created: function() {
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