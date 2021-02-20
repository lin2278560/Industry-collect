<template>
    <div class="c_tabs">

        <template v-for="(value,i) in links">
            <router-link v-if="!value.child" :to="value.to">{{value.name}}</router-link>
            <Dropdown v-if="value.child">
                <router-link :to="value.to" class="tab_dir">{{value.name}}
                    <Icon type="ios-arrow-down"></Icon>
                </router-link>
                <DropdownMenu slot="list" style="padding:20px;">
                    <template v-for="(child,j) in value.child">
                        <router-link :to="child.to">{{child.name}}</router-link>
                        <template v-if="j < (value.child.length-1)">|</template>
                    </template>
                </DropdownMenu>
            </Dropdown>
            <template v-if="i<links.length-1">|</template>
        </template>

        <!--<template v-for="(value,i) in links">
            <router-link :to="value.to">{{value.name}}</router-link>
            <template v-if="i<links.length-1">|</template>
        </template>-->
    </div>
</template>
<script>
    export default {
        name: "JkTabs",
        props: {
            links: {type: Array},//[{name: "用户管理", to: "about"}]
        },
        data(){
            return {
                test: [
                    {name: "报表统计", to: "log"},
                    {
                        name: "历史日志",
                        child: [
                            {name: "视频业务", to: "log"},
                            {name: "结构化同步", to: "log"},
                            {name: "非结构同步", to: "log"},
                        ]
                    }
                ]
            };
        }
    };
</script>
<style scoped lang="less">
    .c_tabs {
        /*text-align: center;*/
        /*padding: 18px;*/
        /*border-bottom: solid 1px #e9e9e9;*/
        .tab_dir {
            &:active {
                pointer-events: none;
            }
            &:hover {
                cursor: pointer;
            }
        }
        a {
            font-size: 0.9375em;
            padding: 28px 14px;
            color: #2c3e50;
            text-decoration: none;
            transition: ease-out .4s;
            border-radius: 5%;
            &.router-link-active { //router-link-exact-active
                color: #ff6600;
                border-bottom: solid 4px #ff6600;
            }
        }
        &:nth-child(0) :after {
            content: "|";
        }
    }
</style>
