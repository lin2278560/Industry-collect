<template>
  <div class="nav">
<!--    <ul class="nav-items">-->

<!--      <li v-for="(v,i) in tap.items" @click="toView(i)" :class="{active:tap.select==i}" >-->
<!--        <img :src="v.img" /><br/>-->
<!--        <span>{{v.title}}</span>-->
<!--      </li>-->

<!--    </ul>-->

    <!--<Badge count="100" overflow-count="99"  class-name="nav-badge">
      <Icon type="ios-bell-outline" size="26" ></Icon>
    </Badge>-->

    <!--<Badge :count="1" overflow-count="99"  >
      <Avatar shape="square" icon="md-notifications" />
    </Badge>
-->
    <div class="ivu-layout-content" >
      <!--<transition name="move" mode="out-in"><router-view></router-view></transition>-->
      <div class="layout-content" style="border-radius: 8px; border-color: red;">
        <section id="container" class="body-scroll">
          <aside class="sidebar left-menu">
            <div id="leftside-navigation" class="nano">
              <ul class="nano-content">
<!--                <li class="sub-menu menu1">-->
                  <li v-for="(v,i) in tap.items" :class="[v.classname2,v.no]">
<!--                <li :class="{active:tap.select==i}" @click="toView(i,v)">-->
                      <a>
                        <Icon :type="v.classname" style="margin-bottom: 2px;" />
                        <span>{{v.title}}</span>
                        <Icon type="ios-arrow-forward" class="pull-right" style="float: right;" />
                      </a>
                      <ul class="leftside-ul1" style="display: none;">
                        <li v-for="(j,i) in tap.items2" :class="[j.classname,j.no]">
                            <a :class="['J_menuItem',j.no]">{{j.title}}</a>
                        </li>
                      </ul>
                      <ul class="leftside-ul2" style="display: none;">
                          <li v-for="(j,i) in tap.items3" :class="[j.classname,j.no]">
                              <a :class="['J_menuItem',j.no]">{{j.title}}</a>
                          </li>
                      </ul>
                      <ul class="leftside-ul3" style="display: none;">
                          <li v-for="(j,i) in tap.items4" :class="[j.classname,j.no]">
                              <a :class="['J_menuItem',j.no]">{{j.title}}</a>
                          </li>
                      </ul>
                      <ul class="leftside-ul4" style="display: none;">
                          <li v-for="(j,i) in tap.items5" :class="[j.classname,j.no]">
                              <a :class="['J_menuItem',j.no]">{{j.title}}</a>
                          </li>
                      </ul>
                      <ul class="leftside-ul5" style="display: none;">
                          <li v-for="(j,i) in tap.items6" :class="[j.classname,j.no]">
                              <a :class="['J_menuItem',j.no]">{{j.title}}</a>
                          </li>
                      </ul>
                      <ul class="leftside-ul6" style="display: none;">
                          <li v-for="(j,i) in tap.items7" :class="[j.classname,j.no]">
                              <a :class="['J_menuItem',j.no]">{{j.title}}</a>
                          </li>
                      </ul>
<!--                  <ul v-for="(v,i) in tap.items3" class="leftside-ul2" style="display: none;">-->
<!--                    <li :class="v.classname"><a class="J_menuItem">{{v.title}}</a></li>-->
<!--                  </ul>-->
<!--                  <ul v-for="(v,i) in tap.items4" class="leftside-ul3" style="display: none;">-->
<!--                    <li :class="v.classname"><a class="J_menuItem">{{v.title}}</a></li>-->
<!--                  </ul>-->
<!--                  <ul v-for="(v,i) in tap.items5" class="leftside-ul4" style="display: none;">-->
<!--                    <li :class="v.classname"><a class="J_menuItem">{{v.title}}</a></li>-->
<!--                  </ul>-->
<!--                  <ul v-for="(v,i) in tap.items6" class="leftside-ul5" style="display: none;">-->
<!--                    <li :class="v.classname"><a class="J_menuItem">{{v.title}}</a></li>-->
<!--                  </ul>-->
<!--                  <ul v-for="(v,i) in tap.items7" class="leftside-ul6" style="display: none;">-->
<!--                    <li :class="v.classname"><a class="J_menuItem">{{v.title}}</a></li>-->
<!--                  </ul>-->
                </li>
              </ul>
<!--              <ul class="nano-content">-->
<!--                <li class="sub-menu menu_1">-->
<!--                  <a href="#"><Icon type="md-desktop"></Icon><span>系统配置</span><i class="arrow fa fa-angle-right pull-right"></i></a>-->
<!--                  <ul class="leftside-ul" style="display: none;">-->
<!--                    <li class="systemuserhave"><a class="J_menuItem">首页</a> </li>-->
<!--                    <li class="systemuserhave"><a class="J_menuItem">运行状态</a> </li>-->
<!--                    <li class="systemuserhave"><a class="J_menuItem">硬盘存储信息</a> </li>-->
<!--                    <li class="systemuserhave"><a class="J_menuItem">拓扑图 </a> </li>-->
<!--                    <li class="loguserhave"><a class="J_menuItem">操作日志 </a> </li>-->
<!--                    <li class="loguserhave"><a class="J_menuItem">错误日志下载</a> </li>-->
<!--                  </ul>-->
<!--                </li>-->

<!--                <li class="sub-menu menu_2">-->
<!--                  <a href="#"><i class="fa fa-cogs"></i><span>基础配置</span><i class="arrow fa fa-angle-right pull-right"></i></a>-->
<!--                  <ul class="leftside-ul" style="display: none;">-->
<!--                    <li><a class="J_menuItem">网卡配置</a></li>-->
<!--                    <li><a class="J_menuItem">端口聚合</a></li>-->
<!--                    <li><a class="J_menuItem">网闸配置</a></li>-->
<!--                    <li><a class="J_menuItem">路由配置</a></li>-->
<!--                    <li><a class="J_menuItem">元数据配置</a></li>-->
<!--                    <li><a class="J_menuItem">snmptrap配置</a></li>-->
<!--                    <li class="haveno"><a class="J_menuItem">基础配置备份恢复</a></li>-->
<!--                  </ul>-->
<!--                </li>-->

<!--                <li class="sub-menu menu_3">-->
<!--                  <a href="#"><i class="fa fa-cogs"></i><span>功能配置</span><i class="arrow fa fa-angle-right pull-right"></i></a>-->
<!--                  <ul class="leftside-ul" style="display: none;">-->
<!--                    <li class="systemuserhave"><a class="J_menuItem">客户端配置</a></li>-->
<!--                    <li class="systemuserhave"><a class="J_menuItem">队列配置</a></li>-->
<!--                    <li class="systemuserhave"><a class="J_menuItem">代理配置</a></li>-->
<!--                    <li class="userhave"><a class="J_menuItem">用户管理</a></li>-->
<!--                    <li class="systemuserhave"><a class="J_menuItem">功能配置备份恢复</a></li>-->
<!--                  </ul>-->
<!--                </li>-->
<!--                <li class="sub-menu menu_4">-->
<!--                  <a href="#"><i class="fa fa-cogs"></i><span>系统配置</span><i class="arrow fa fa-angle-right pull-right"></i></a>-->
<!--                  <ul class="leftside-ul" style="display: none;">-->
<!--                    <li><a class="J_menuItem">重启系统</a></li>-->
<!--                    <li><a class="J_menuItem">重启服务</a></li>-->
<!--                    <li><a class="J_menuItem">系统注册</a></li>-->
<!--                    <li><a class="J_menuItem">系统升级</a></li>-->
<!--                    <li><a class="J_menuItem recover_config">恢复出厂配置</a></li>-->
<!--                  </ul>-->
<!--                </li>-->
<!--              </ul>-->
            </div>
          </aside>
<!--          <div class="row J_mainContent" id="content-main">-->
<!--            <iframe class="J_iframe" name="iframe0" width="100%" height="100%" src="pages/index.html" frameborder="0" data-id="pages/index.html" seamless></iframe>-->
<!--          </div>-->
        </section>
      </div>
    </div>

  </div>
</template>
<!--<script src="../assets/js/jquery.min.js"></script>-->
<script>
  export default {

    data(){
      return{
        tap:{
          items:[
            // {to:"/index/home", img:"../../../static/img/nav/menu_05.png", title:"监控总览"},
            // {to:"/index/alarm", img:"../../../static/img/nav/menu_04.png", title:"故障告警"},
            // {to:"/index/data", img:"../../../static/img/nav/menu_03.png", title:"数据对账"},
            // {to:"/index/log", img:"../../../static/img/nav/menu_02.png", title:"日志审计"},
            // {to:"/index/monitor", img:"../../../static/img/nav/menu_06.png", title:"资源监控"},
            // {to:"/index/interface", img:"../../../static/img/nav/menu_07.png", title:"接口管理"},
            // {to:"/index/sys", img:"../../../static/img/nav/menu_01.png", title:"系统管理"}
            {classname:"md-settings", title:"系统配置", no:"1", classname2:"sub-menu"},
            {classname:"md-git-network", title:"网络配置", no:"2", classname2:"sub-menu"},
            {classname:"md-flash", title:"高可用性", no:"3", classname2:"sub-menu"},
            {classname:"md-folder-open", title:"本地服务", no:"4", classname2:"sub-menu"},
            {classname:"md-sync", title:"数据同步", no:"5", classname2:"sub-menu"},
            {classname:"md-briefcase", title:"病毒库管理", no:"6", classname2:"sub-menu"}
          ],
          items2:[
            {classname:"systemuserhave", title:"系统状态", no:"1"},
            {classname:"systemuserhave", title:"系统时间", no:"1"},
            {classname:"systemuserhave", title:"系统维护", no:"1"},
            {classname:"systemuserhave", title:"登录设置", no:"1"},
            {classname:"systemuserhave", title:"备份/恢复", no:"1"},
            {classname:"systemuserhave", title:"系统升级", no:"1"},
            {classname:"systemuserhave", title:"设备信息", no:"1"}

              // {classname:"systemuserhave", title:"接口配置", no:"2"},
              // {classname:"systemuserhave", title:"网关设置", no:"2"},
              // {classname:"systemuserhave", title:"静态路由", no:"2"},
              // {classname:"systemuserhave", title:"通道设置", no:"2"},
              // {classname:"systemuserhave", title:"IP/MAC绑定", no:"2"},
              //
              // {classname:"systemuserhave", title:"双机热备", no:"3"},
              // {classname:"systemuserhave", title:"虚拟IP", no:"3"},
              // {classname:"systemuserhave", title:"双机热备状态", no:"3"},
              //
              // {classname:"systemuserhave", title:"通讯访问控制", no:"4"},
              // {classname:"systemuserhave", title:"FTP服务", no:"4"},
              // {classname:"systemuserhave", title:"SMB服务", no:"4"},
              // {classname:"systemuserhave", title:"NFS服务", no:"4"},
              // {classname:"systemuserhave", title:"可信接入认证", no:"4"},
              // {classname:"systemuserhave", title:"邮件服务", no:"4"},
              //
              // {classname:"systemuserhave", title:"数据资源", no:"5"},
              // {classname:"systemuserhave", title:"数据库系统配置", no:"5"},
              // {classname:"systemuserhave", title:"业务注册", no:"5"},
              // {classname:"systemuserhave", title:"业务与服务管理", no:"5"},
              //
              // {classname:"systemuserhave", title:"引擎信息", no:"6"},
              // {classname:"systemuserhave", title:"隔离区管理", no:"6"}
          ],
          items3:[
            {classname:"systemuserhave", title:"接口配置", no:2},
            {classname:"systemuserhave", title:"网关设置", no:2},
            {classname:"systemuserhave", title:"静态路由", no:2},
            {classname:"systemuserhave", title:"通道设置", no:2},
            {classname:"systemuserhave", title:"IP/MAC绑定", no:2}
          ],
          items4:[
            {classname:"systemuserhave", title:"双机热备", no:3},
            {classname:"systemuserhave", title:"虚拟IP", no:3},
            {classname:"systemuserhave", title:"双机热备状态", no:3}
          ],
          items5:[
            {classname:"systemuserhave", title:"通讯访问控制", no:4},
            {classname:"systemuserhave", title:"FTP服务", no:4},
            {classname:"systemuserhave", title:"SMB服务", no:4},
            {classname:"systemuserhave", title:"NFS服务", no:4},
            {classname:"systemuserhave", title:"可信接入认证", no:4},
            {classname:"systemuserhave", title:"邮件服务", no:4}
          ],
          items6:[
            {classname:"systemuserhave", title:"数据资源", no:5},
            {classname:"systemuserhave", title:"数据库系统配置", no:5},
            {classname:"systemuserhave", title:"业务注册", no:5},
            {classname:"systemuserhave", title:"业务与服务管理", no:5}
          ],
          items7:[
            {classname:"systemuserhave", title:"引擎信息", no:6},
            {classname:"systemuserhave", title:"隔离区管理", no:6}
          ],
          select:0
        },
        time:'2018-07-26 15:30',

      }
    },
    methods:{
      toView(i,v){
        this.tap.select=i;
        this.$router.push({path:this.tap.items[i].to});
      }
    }
  }

  $(function () {
    $(".sub-menu").click(function(){

      var str = $(this).prop("className");
      var arr = str.split(" ");
      $(this).addClass("active").siblings().removeClass("active");
      $(this).find(".leftside-ul"+arr[1]).slideToggle(500);
      $(this).siblings().find("ul").hide();
    });
  });
</script>
<style scoped type="less">
  /*引入css 样式文件*/
  @import '../assets/css/main.css';

  .nav{
    width: 100%;
    /*height:140px;*/
    background-color: #e86429;
  }

  /*.nav-items{*/
  /*  list-style: none;*/
  /*  color: white;*/
  /*  display: inline-block;*/
  /*  margin: 20px 70px 0 ;*/
  /*}*/
  /*.nav-items li{*/
  /*  display: inline-block;*/
  /*  cursor: pointer;*/
  /*  width:75px;*/
  /*  height:75px;*/
  /*  margin: 0 20px 0 0;*/
  /*  text-align: center;*/
  /*}*/
  /*.nav-items li:hover{*/
  /*  border-bottom:solid 5px white;*/
  /*}*/
  /*.nav-items li.active{*/
  /*  border-bottom:solid 5px white;*/
  /*}*/
  /*.nav-items img{*/
  /*  display: inline-block;*/
  /*  width:35px;*/
  /*  height:35px;*/
  /*  padding:0;*/
  /*  margin: 0 20px 5px;*/
  /*}*/
  /*.nav-items span{*/
  /*  font-size: 16px;*/
  /*  line-height: 1;*/
  /*}*/


  /*.ivu-layout-content{*/
  /*  position: relative;*/
  /*  top:-30px;*/
  /*  margin-right: 40px;*/
  /*  margin-left: 40px;*/
  /*}*/
  .ivu-layout-content{
    position: relative;
    top:-30px;
    margin-right: 40px;
    margin-left: 40px;
  }
  .left-menu {
    float: left;
    width: 13%;
    height: 900px;
    min-width: 130px;
    /* width: 200px; */
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }


</style>
