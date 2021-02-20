<template>
    <div>
        <jk_nav/>
        <v-nav1/>
        <!-- <right-panel v-if="showSettings">
            <setting />
        </right-panel> -->
        <div style="display:flex;flex-wrap: nowrap;background:#eeeeee;">
            <v-nav2/>
            <!-- <transition name="fade" mode="out-in"> -->
                <router-view/>
            <!-- </transition> -->
        </div>
    </div>
</template>
<script>
    // @ is an alias to /src
    import JkNav from "@/components/JkNav.vue";
    import vNav1 from "@/components/Nav1.vue";
    import vNav2 from "@/components/Nav4.vue";
    // import setting from "@/components/Settings/index.vue";
    // import rightPanel from "@/components/RightPanel/index.vue";
    import { mapState } from 'vuex'

    export default {
        name: "Index",
        components: {
            "jk_nav":JkNav,
            "v-nav1":vNav1,
            "v-nav2":vNav2,
            // "setting":setting,
            // rightPanel,
        },
        // computed: {
        //     ...mapState({
        //         showSettings: state => state.settings.showSettings,
        //     }),
        // },
    }
    
</script>
<style scoped lang="less">
    @import '../assets/my-theme/index.less';
</style>
