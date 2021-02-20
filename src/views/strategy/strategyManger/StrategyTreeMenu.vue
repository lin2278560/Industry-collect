<template>
  <ul class="tree-menu">
    <li v-for="(item, index) in data" :key="index">
      <div @click="quick(item), toggle(item, index)"  @contextmenu.prevent="loginType && rightBtn(item,index)" style="border-bottom: 1px solid rgb(169, 169, 169);">

      <!--      <div @click="quick(item)"  @contextmenu.prevent="rightBtn(item,index)" style="border-bottom: 1px solid rgb(169, 169, 169);">-->
        <Icon v-if="item.id == 1 || item.id == 10" type="md-paper" style="margin-left: 20px;" />
        <Icon v-if="item.id == 2 || item.id == 20" type="md-crop" style="margin-left: 30px;" />
        <Icon v-if="item.id == 3 || item.id == 30" type="md-desktop" style="margin-left: 40px;" />
        &nbsp;
        <Tooltip :content="item.menuName">
          <span>{{item[name] || item.menuName | ellipsis }}</span>
        </Tooltip>
        <i :class="['icon',item.children && item.children.length ? folderIconList[index] : 'file-text',loading ? loadingIconList[index] : '']"></i>
<!--        <i v-if="item.id == 1 || item.id == 10 || item.id == 2 || item.id == 20" :class="['icon','folder']" @click="toggle(item, index)"></i>-->
      </div>
      <tree-menu v-if="scope[index]" :data="item.children"></tree-menu>
    </li>
  </ul>
</template>

<script>
  export default {
  name: "treeMenu",
  inject: ["reload"],
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 8) {
        return value.slice(0,6) + '...'
      }
      return value
    }
  },
  props: {
    // data: Array,
    data: {type: Array},
    name: String,
    loading: Boolean
  },
  data() {
    return {
      folderIconList: [],
      loadingIconList: [],
      scope: {},
      menuName:"",
      uuid: null,
      menu: [],
      timer: "",//定义一个定时器的变量
      newVal2 :[],
      loginType: null,//系统类型
    };
  },
  created () {
    this.data.forEach((item, index) => {
      if (item.children && item.children.length) {
        // this.folderIconList[index] = 'folder';
        this.folderIconList[index] = this.scope[index] ? "folder-open" : "folder";
      }
    });
  },
  mounted() {
    //做了调转
    this.$storage.getStorage("loginType") == "true" ? this.loginType = false : this.loginType = true;
    console.log(this.loginType)
  },
  watch: {
    data: function(newVal,oldVal){
      // this.formDetail = newVal;
      newVal.forEach((item, index) => {
          if (item.children && item.children.length && item.menuName == "采集服务" || item.menuName == "转发服务") {
              this.$set(this.scope, index, true);
              this.folderIconList[index] = 'folder-open';
          }else if (item.children && item.children.length){
              this.folderIconList[index] = 'folder';
          }
      });
    }
  },
  methods: {
    doTask(index) {
      this.$set(this.scope, index, !this.scope[index]);
      this.folderIconList[index] = this.scope[index] ? "folder-open" : "folder";
    },
    toggle(item, index) {
      //this.$emit("getSubMenu", item.menuName);
      this.loadingIconList = [];
      //alert(item.menuName+'   '+index);
      if (item.children && item.children.length) {
        this.doTask(index);
      } else {
        this.loadingIconList[index] = "loading";

        this.$emit("getSubMenu", item, subMenuList => {
          if (subMenuList && subMenuList.length) {
            this.doTask(index);
          }
        });
      }
    },
    quick(item) {
      // this.$emit("getConfigName", item.menuName);
      this.$storage.setStorage("getItem", item);
      if(item.id == 1) {
          this.$router.push({ path: "/engineering/collectionService/info" });
      }else if(item.id == 2) {
          this.$router.push({ path: "/engineering/collectionService/channelConfig" });
      }else if(item.id == 3) {
          this.$router.push({ path: "/engineering/collectionService/driveConfig" });
      }else if(item.id == 10) {
          this.$router.push({ path: "/engineering/reportingService/info" });
      }else if(item.id == 20) {
          this.$router.push({ path: "/engineering/reportingService/channelConfig" });
      }else if(item.id == 30) {
        this.$router.push({ path: "/engineering/reportingService/driveConfig" });
      }
      this.reload();
    },
    //右击出现功能菜单
    rightBtn(item, index) {
      document.getElementById("msgRightMenu").style.display = "none";
      document.getElementById("msgRightMenu1").style.display = "none";
      document.getElementById("msgRightMenu2").style.display = "none";
      this.menuName = item.menuName;
      var menuname = this.menuName;
      //有问题  子节点触发外部事件
      //alert("长度" + item.id.length + "   " + item.id);
      let menu = null;
      if (item.id == 1 || item.id == 10) {
        this.$emit("getSubMenu", item, index);
        menu = document.getElementById("msgRightMenu");
      } else if (item.id == 2 || item.id == 20) {
        var that = this.$parent;
        that.$emit("getSubMenu", item, index);
        menu = document.getElementById("msgRightMenu1");
      } else if (item.id == 3 || item.id == 30) {
        var that = this.$parent.$parent;
        that.$emit("getSubMenu", item, index);
        menu = document.getElementById("msgRightMenu2");
      } else if (item.id.length == 4) {
        var that = this.$parent.$parent.$parent;
        that.$emit("getSubMenu", item, index);
      }

      //this.$parent.$emit("getSubMenu",menuname);
      // let menu = document.getElementById("msgRightMenu");
      var e = e || window.event;
      var marginWidths = 400;
      var marginHeight = 110;

      //鼠标点的坐标
      // var oX = e.clientX - marginWidths;
      // var oY = e.clientY - marginHeight;
      var oX = e.pageX - marginWidths;
      var oY = e.pageY - marginHeight;
      if (oX > 423) {
        oX = 423;
      }
      //菜单出现后的位置
      menu.style.display = "block";
      menu.style.left = oX + 130 + "px";
      menu.style.top = oY - 50 + "px";
      document.onclick = function() {
        menu.style.display = "none";
      };

      //阻止浏览器默认事件
      return false; //一般点击右键会出现浏览器默认的右键菜单，写了这句代码就可以阻止该默认事件
    }
  }
};
</script>
 
<style scoped>
.tree-menu {
  list-style: none;
}
.tree-menu li {
  line-height: 3;
  /*border-bottom: 1px solid #999;*/
}
.tree-menu li span {
  font-size: 12px;
  cursor: default;
}
.icon {
  width: 15px;
  height: 15px;
  background-repeat: no-repeat;
  /*vertical-align: -2px;*/
  float: right;
  margin: 14px 20px 0 0;
}
.icon.folder {
  background-image: url(../../../assets/images/myimg/folder.jpg);
  background-size: 14px 13px;
}
.icon.folder-open {
  background-image: url(../../../assets/images/myimg/folder-open.jpg);
  background-size: 14px 13px;
}
/*.icon.file-text {*/
/*  background-image: url(../../assets/images/myimg/text.png);*/
/*  background-size: 12px 15px;*/
/*}*/
/*.icon .loading {*/
/*  background-image: url(/src/assets/loading.gif);*/
/*  background-size: 15px;*/
/*}*/
</style>