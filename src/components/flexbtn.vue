<template>
    <div style="float:left;">
        <Button v-show="flexbtn3" @click="enter3" class="flexbtn" style="" size="small" type="primary">
                <Icon type="ios-arrow-back"></Icon>
        </Button>
        <!-- <Button v-show="flexbtn2" @click="enter2" class="flexbtn" style="" size="small" type="primary">
                <Icon style="float:left" type="ios-arrow-back"></Icon>
                {{ message }}
                
        </Button> -->
        <Button v-show="flexbtn1" @click="enter1" class="flexbtn" style="" size="small" type="primary">
                <Icon type="ios-arrow-back"></Icon>
                
        </Button>
        
        <!-- <Button v-show="flexbtn5" @click="enter5" class="flexbtn1" style="" size="small" type="primary">
                <Icon type="ios-arrow-forward"></Icon>
                {{ message1 }}
                
        </Button> -->
        <Button v-show="flexbtn6" @click="enter6" class="flexbtn1" style="" size="small" type="primary">
                <Icon type="ios-arrow-back"></Icon>
                
        </Button>
        <Button v-show="flexbtn4" @click="enter4" class="flexbtn1" style="" size="small" type="primary">
                <Icon type="ios-arrow-forward"></Icon>
                
        </Button>
    </div>
</template>

<script>
import testVue from '../views/engineering/test.vue'
    export default {
        name: "flexbtn",
        data () {
            return {
                message :'. 节点导航栏隐藏',
                message1 :'. 节点导航栏展开',
                flexbtn1:false,
                flexbtn2:false,
                nodemessage:true,
                flexbtn3:true,
                flexbtn4:false,
                flexbtn5:false,
                flexbtn6:false,
            }
        },
        props: {
            nodetree: {
            type: Boolean,
            }
        },
        methods: {
            enter3(){
                // this.flexbtn1 = true
                // this.flexbtn2 = true
                this.flexbtn4 = true
                this.flexbtn3 = false
                this.nodemessage = false
                this.$emit('childFn', this.nodemessage);
            },
            enter2(){
                this.nodemessage = false
                this.$emit('childFn', this.nodemessage);
                this.flexbtn1 = false
                this.flexbtn2 = false
                this.flexbtn3 = false
                this.flexbtn4 = true
            },
            enter1(){
                this.flexbtn1 = false
                this.flexbtn2 = false
            },
            enter4(){
                this.flexbtn3 = true
                this.flexbtn4 = false
                // this.flexbtn5 = true
                // this.flexbtn6 = true
                this.nodemessage = true
                this.$emit('childFn', this.nodemessage);
            },
            enter5(){
                this.nodemessage = true
                this.$emit('childFn', this.nodemessage);
                this.flexbtn6 = false
                this.flexbtn5 = false
                this.flexbtn4 = false
                this.flexbtn3 = true
            },
            enter6(){
                this.flexbtn6 = false
                this.flexbtn5 = false
                this.flexbtn4 = true
            },
            setStorage(key, value){
                sessionStorage.setItem(key, JSON.stringify(value));
            },
            getStorage(key) {
                return sessionStorage.getItem(key);
            },
            removeStorage(key) {
                sessionStorage.removeItem(key);
            },
            
        }
    }
</script>

<style scoped>
    .flexbtn{
        position: absolute;
        left: 240px;;height: 40px;z-index:100;
        top: 230px;
        width: 25px;
        background: #b2b2b2;
        border: none;
    }
    .flexbtn1{
        position: absolute;
        left: 20px;;height: 40px;z-index:100;
        top: 230px;
        width: 25px;
        background: #b2b2b2;
        border: none;
    }           
</style>