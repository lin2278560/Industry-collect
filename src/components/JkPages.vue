<template>
    <div class="JkPages">
        <Tabs v-model="val" type="card">
            <TabPane v-for="(v,i) in pages" :label="v.label" :key="i" :name="v.name">
                <div v-if="val==v.name" :class="v.dfClass?'':'JkPagesView'">
                    <Expand :render="v.render"></Expand>
                </div>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Expand from "@/components/expand.js";

    export default {
        components: {
            Expand
        },
        props: {
            value: {type: String, default: ''},
            pages: Array,
        },
        data() {
            return {
                val: '',
            }
        },
        mounted() {
            if (!this.value)
                this.val = this.pages[0].name;
        },
        methods: {}
    };
</script>
<style scoped lang="less">
    @import "../assets/basic.less";

    @deep: ~'>>>';
    .JkPages {
        font-size: .875rem;

        .JkPagesView {
            .content();
            .box();
            margin: 1em auto 1.5em;
            background-color: white;
        }

        @{deep} .ivu-tabs-bar {
            .content();
            border-bottom: none;
            margin-bottom: 0;
        }

        @{deep} .ivu-tabs-nav {
            font-size: 1em;
            background-color: #e5e5e5;
            border-radius: .35em;
            padding: 0 .5em;
            //border-radius: 5px;
            //padding: 0;

            margin: 0;
            float: left;
            list-style: none;
            box-sizing: border-box;
            position: relative;
            transition: transform .5s ease-in-out;
        }

        @{deep} .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
            height: auto;
        }

        @{deep} .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
            margin: 0;
            height: auto;
            padding: .21em 1.2em;
            vertical-align: middle;
            border: none;
            border-bottom: 0;
            border-radius: 6%;
            transition: all .3s ease-in-out;
            background: transparent;

            &:hover {
                color: #fff;
                background-color: #ff6600;
            }
        }

        @{deep} .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
            color: #fff;
            border: none;
            //font-weight: bold;
            background-color: #ff6600;
        }

    }
</style>
