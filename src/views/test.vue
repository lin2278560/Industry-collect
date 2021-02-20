<template>
    <div id="container">
        <h3>可输入下拉框</h3>
        <Select class="select-box" v-model="selectValue" @on-change="okSelect">
            <Option v-for="(item, index) in options" :key="index" :value="item.value">{{item.text}}</Option>
        </Select>
        <Input type="text" class="input-box" ref="inputBox" v-model="value" />
    </div>
</template>

<script>
    export default {
        name: "test",
        data(){
            return {
                selectValue: '骑士总冠军',
                value: '骑士总冠军',
                options: [{
                    value: '骑士总冠军',
                    text: "骑士总冠军"
                }, {
                    value: '湖人总冠军',
                    text: "湖人总冠军"
                }, {
                    value: '火箭总冠军',
                    text: "火箭总冠军"
                }, {
                    value: '马刺总冠军',
                    text: "马刺总冠军"
                }]
            }
        },
        computed: {

            // 获取select框中所选文本值
            inputValue: function () {
                const self = this;
                var value;

                //遍历找到对应文本值
                this.options.forEach(function (item, index) {
                    if (item.value === self.selectValue) {
                        value = item.text;
                    }
                });

                return value;
            }
        },
        methods: {

            // input输入修改options中的对应数值
            changeValue: function () {
                const self = this;
                var text = this.$refs.inputBox.value;

                //遍历修改对应文本值
                this.options.forEach(function (item, index) {
                    if (item.value === self.selectValue) {
                        item.text = text;
                    }
                });

            },
            okSelect(data) {
                console.log(data);
                this.value = data;
            },
            okAddNode() {
                console.log(this.value);
            }
        }
    }
</script>

<style scoped>
    /*#container {*/
    /*    position: absolute;*/
    /*    top: 200px;*/
    /*    left: 0;*/
    /*    right: 0;*/
    /*    margin: 0 auto;*/
    /*    width: 600px;*/
    /*    height: 300px;*/
    /*    text-align: center;*/
    /*}*/

    .select-box {
        width: 130px;
        height: 50px;
        padding-left: 20px;
        font-size: 18px;
    }

    .input-box {
        position: absolute;
        margin-left: -130px;
        box-sizing: border-box;
        /*border: 1px solid #9e9e9e;*/
        border-right: none;
        width: 100px;
        height: 50px;
        padding-left: 20px;
        font-size: 18px;
    }
</style>