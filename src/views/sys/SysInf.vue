<template>
    <div class="page-view">
        <JkPages :pages="pages"></JkPages>
    </div>
</template>

<script>
    // @ is an alias to /src
    //import Table from "@/components/JkTable.vue";
    import JkPages from "@/components/JkPages.vue";
    import IpManage from "./IpManage.vue";
    import RouteManage from "./RouteManage.vue";

    export default {
        components: {
            JkPages
        },
        data() {
            return {
                pages: [
                    {label: "地址管理", name: "地址管理", render: (h, params) => h(IpManage)},
                    {label: "路由管理", name: "路由管理", render: (h, params) => h(RouteManage)},
                ],
            }
        },
        computed: {},
        methods: {}
    };
</script>
<style scoped lang="less">

</style>
