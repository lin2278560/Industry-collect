<template>
    <div>
        <label style='margin-left:40px;'>密码:</label>
        <input v-model="pwd" id='inputValue' auto-complete="off"></input>
        <br></br>
        <div class='input_span'>
<!--            <label style='margin-left:40px;'>强度:</label>-->
            <span id="one"></span>
            <span id="two"></span>
            <span id="three"></span>
        </div>
    </div>
</template>

<script>
    export function checkStrong(sValue) {
        var modes = 0;
        //正则表达式验证符合要求的
        if(sValue.length < 1) return modes;
        if(/\d/.test(sValue)) modes++; //数字
        if(/[a-z]/.test(sValue)) modes++; //小写
        if(/[A-Z]/.test(sValue)) modes++; //大写
        if(/\W/.test(sValue)) modes++; //特殊字符

        //逻辑处理
        switch(modes) {
            case 1:
                return 1;
                break;
            case 2:
                return 2;
                break;
            case 3:
            case 4:
                return sValue.length < 10 ? 3 : 4
                break;
        }
        return modes;
    }
    export default {
        name: "test",

        data() {
            return {
                msgText: '',
                pwd: '',
            }
        },
        methods: {
        },
        watch: {
            pwd(newValue, oldValue) {
                this.msgText = checkStrong(newValue);
                if(this.msgText > 1 || this.msgText == 1) {
                    $("#one").css("background", "red");
                } else {
                    $("#one").css("background", "#eee");
                }
                if(this.msgText > 2 || this.msgText == 2) {
                    $("#two").css("background", "orange");
                } else {
                    $("#two").css("background", "#eee");
                }
                if(this.msgText == 4) {
                    $("#three").css("background", "#00D1B2");
                } else {
                    $("#three").css("background", "#eee");
                }
            }
        },
    }
</script>

<style scoped>
    #inputValue{
        width:240px;
        margin-left: 20px;
        padding-left: 10px;
        border-radius: 3px;
    }
    .input_span span {
        display: inline-block;
        width: 85px;
        height: 10px;
        background: #eee;
        line-height: 20px;
    }

    #one {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-right: 0px solid;
        margin-left: 20px;
        margin-right: 3px;
    }

    #two {
        border-left: 0px solid;
        border-right: 0px solid;
        margin-left: -5px;
        margin-right: 3px;
    }

    #three {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-left: 0px solid;
        margin-left: -5px;
    }
</style>