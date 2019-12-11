<template>
  <el-container class="home-containner">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <h1>内容管理系统</h1>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单区域-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsOjb[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index=" '/' + subItem.path "
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <!-- welcome组件 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单栏数据
      menuList: [],
      // 图标数据
      iconsOjb: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠菜单栏
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    // 从session中读取当前激活的路径
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单列表的方法
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 切换侧边的的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 将每次点击之后的路径保存到sessionStorage中
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      // 更新data中的activePath
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-containner {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 50px;
    }
    h1 {
      margin-left: 15px;
      color: #fff;
      font-size: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.1em;
  cursor: pointer;
}
</style>
