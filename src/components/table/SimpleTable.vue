<template>
    <div class="simpleTable">
        <TableFilterSimple :render="render" :title="title" :filterAttr="filterAttr" @tableFilterSimple="tableFilterSimple"/>
        <TableBody :url="url" :columns="columns" :size="size" :filter="filter" :flush="flush"/>
    </div>
</template>

<script>

    import TableBody from "./TableBody.vue";
    import TableFilterSimple from "./TableFilterSimple.vue";

    export default {
        components: {
            TableBody, TableFilterSimple
        },
        props: {
            title: String,
            filterAttr: Object,
            render:Function,

            columns: Array,
            url: String,
        },
        data() {
            return {
                size: null,
                filter: null,
                flush: null,
            }
        },
        mounted() {

        },
        computed: {},
        methods: {
            // tableFilterSimple(size, filter) {
            //     this.size = size;
            //     this.filter = filter;
            //     this.flush = new Date().getTime();
            // }
        },
        watch: {
        }
    };
</script>
<style scoped lang="less">
    @deep: ~'>>>';
    .simpleTable {
        font-size: .875rem;
        position: relative;
        /*background-color: white;*/
    }
</style>
