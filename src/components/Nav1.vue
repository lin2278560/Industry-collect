<template>
  <div class="nav">
    <ul class="nav-items">
        <li v-for="(v,i) in tap.items" :key="i" >
              <div @click="quick(v.to)">
                  <Icon :type="v.type" style="margin-bottom: 3px;font-size: 25px;" /><br/>
                  <span style="font-size: 12px;">{{v.title}}</span>
              </div>
      </li>
    </ul>
  </div>
</template>
<script>
    import Utils from './test.js';
    export default {
        name: "NetworkGateway",
        components: {

        },
        data(){
            return{
                tap:{
                    items:[
                        {to:"/sys", title:"首页", type:"md-home"},
                        {to:"/engineering/collectionService/info", title:"采集服务", type:"md-create"},
                        {to:"/engineering/reportingService/info", title:"转发服务", type:"md-crop"},
                        {to:"/engineering/engineered", title:"工程配置", type:"md-build"},
                        {to:"/sys/count/collect", title:"业务统计", type:"md-list-box"},
                        {to:"/logs/logCommond", title:"日志与审计", type:"md-list-box"},
                        {to:"/user/userConfig", title:"用户配置", type:"ios-contact"},
                    ],
                    select:0
                }
            }
        },
        mounted() {
            this.$storage.getStorage("loginType") == "true" ? this.loginType = true : this.loginType = false;
            if(this.loginType == false){
                this.tap.items[0].to ="/sys/info/upload"
            }
            this.showPermission();
        },
        methods:{
            showPermission() {
                let users = this.$storage.getStorage("users");
                if(users != null) {users  = users.replace("\"","").replace("\"","");}
                if(users == "usermanager") {
                    this.tap.items.splice(0, 6);
                }else if(users == "logauditor") {
                    this.tap.items.splice(0, 5);
                    this.tap.items.splice(1, 1);
                }else {
                    this.tap.items.splice(5, 2);
                }
            },
            // toView(i){
            // this.tap.select=i;
            // this.$router.push({path:this.tap.items[i].to});
            // getInfo: function (to) {
            //     console.log(to);
            // },
            quick (e) {
                this.$router.push({ path: e });
                Utils.$emit('demo1',e);
            },
            functionA(e) {
                // this.$router.push({ path: index });
                Utils.$emit('demo','qqq');
            }
        }
    }
</script>
<style scoped>
    .nav{
        width: 100%;
        /*height:120px;*/
        height:90px;
        background-color: #e86429;
    }

    .nav-items{
        list-style: none;
        color: white;
        /*display: inline-block;*/
        /*margin: 20px 70px 0 50px;*/
        margin: 10px 70px 0 50px;
    }
    .nav-items li{
        display: inline-block;
        cursor: pointer;
        width:75px;
        /*height:75px;*/
        margin: 0 10px 0 0;
        text-align: center;
    }
    .nav-items li:hover{
        border-bottom:solid 5px white;
    }
    .nav-items li.active{
        border-bottom:solid 5px white;
    }
    .nav-items img{
        display: inline-block;
        width:35px;
        height:35px;
        padding:0;
        margin: 0 20px 5px;
    }
    .nav-items span{
        font-size: 16px;
        line-height: 1;
        font-weight: 500;
    }
    a {
        text-decoration: none;
    }
    .router-link-active {
        text-decoration: none;
    }
</style>
