<template>
    <div>
        <JkNav/>
        <!--<JkMenu/>-->


        <Select v-model="model1" style="width:250px">
            <Option v-for="item in cityList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        <Input v-model="value"/>
        <button type="button" @click="send">查询</button>
        <div class="box" id="asd"
             style="background-color: #8a8a8a;color: #f2f2f2;height: 430px;overflow: auto;">
            <p v-for="(v,i) in text" :key="i" style="white-space: pre-line;">{{v}}</p>
        </div>

        <transition name="fade" mode="out-in">
            <router-view/>
        </transition>
    </div>
</template>
<script>
    // @ is an alias to /src
    // import JkNav from "@/components/JkNav.vue";
    // import JkMenu from "@/components/JkMenu.vue";

    export default {
        components: {},
        data() {
            return {

                cityList: [
                    'MONITOR_COLLECT_DEV',
                    'MONITOR_COLLECT_ITEM',
                ],
                model1: 'MONITOR_COLLECT_DEV',
                // value: [
                //     "5613a816-8b9f-43f1-b3dd-679fd7d25228"
                // ],
                value: null,

                webSocket: null,
                text: [],






            }
        },
        mounted() {
            this.connWebSocket();
        },
        methods: {
            connWebSocket() {
                let url = "wss://192.168.10.45:9999/collect/websocket";
                let webSocket = new WebSocket(url);
                this.webSocket = webSocket;

                webSocket.onmessage = this.$options.methods.onmessage.bind(this);
                webSocket.onopen = (e) => {
                    console.log("建立连接", e)
                };
                webSocket.onerror = (e) => console.log("连接异常", e);
                webSocket.onclose = (e) => {
                    console.log("连接关闭", e)
                };

            },
            closeWebSocket() {
                if (this.webSocket != null)
                    this.webSocket.close();
            },
            onmessage(e) {
                let data = JSON.parse(e.data);
                this.text.push(data);
                this.scrollBottom();
            },
            send() {
                let data = {
                    instruct: this.model1,
                    param: this.value
                };
                console.log(data);

                this.webSocket.send(JSON.stringify(data));
            },
            scrollBottom() {
                this.$nextTick(function () {
                    let div = document.getElementById('asd');
                    div.scrollTop = div.scrollHeight;
                })
            },
        },
        beforeDestroy() {
            this.closeWebSocket();
        }
    };
</script>
<style scoped lang="less">

</style>
