<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right breadcrumbArea">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 1.为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
/* 0. 引入echarts */
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      // 折线图需要的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    // 2.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 发请求获取数据
    const { data: res } = await this.$http.get('reports/type/1')

    // 合并数据
    const result = _.merge(this.options, res.data)
    // 3.指定图表的配置项和数据

    // 4.使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped>
</style>
