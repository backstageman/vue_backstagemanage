<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert show-icon title="注意：只允许第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <!-- 选择分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="editDialogVisible = true"
          >添加参数</el-button>
          <el-table :data="manyTableData" border stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染动态参数标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 控制按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
          >添加属性</el-button>
          <el-table :data="onlyTableData" border stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染动态参数标签 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 控制按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性的对话框 -->
    <el-dialog
      :title=" '添加' + titleText"
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
      width="50%"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数/属性对话框 -->
    <el-dialog
      :title=" '添加' + titleText"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      width="50%"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      // 当前点击的标签页
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加参数对话框是否可见
      addDialogVisible: false,
      // 添加参数的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      },
      // 添加参数的数据对象
      addForm: {
        attr_name: ''
      },
      // 控制修改参数对话框是否可见
      editDialogVisible: false,
      // 修改参数的数据对象
      editForm: {
        attr_name: '',
        attr_id: ''
      },
      // 修改参数的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.catelist = res.data
      // console.log(this.catelist)
    },
    handleChange() {
      // console.log(this.selectedCateKeys)
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
      // console.log(this.activeName)
    },
    //  获取参数的列表数据
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        // 将级联选择器的内容清空
        this.selectedCateKeys.length = []
        // 清空动态参数的数据
        this.manyTableData = []
        // 清空静态属性的数据
        this.onlyTableData = []
        return
      }
      // 证明选中的是三级分类
      // console.log(this.selectedCateKeys)
      // 根据所选分类的id和当前所处的面板，获得对应的请求参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为每一个数据对象添加自身的input控制逻辑
        // 控制输入文本是否显示
        item.inputVisible = false
        // 输入文本内的值
        item.inputValue = ''
      })

      console.log(res.data)
      /* 无论是动态参数还是静态属性都是同一个请求，因此返回的数据结果需要判断后
       再赋值到data中 */
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 展示修改表单
    async showEditDialog(attrId) {
      this.editDialogVisible = true

      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          attr_sel: this.activeName
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('查询分类失败！')
      }

      this.editForm = res.data
    },
    // 展示添加表单
    showAddDialog() {
      this.editDialogVisible = true
    },
    // 添加对话框关闭重置表单
    addDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改对话框关闭重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加参数
    addParams() {
      // 验证表单数据
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )

        if (res.meta.status !== 201) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        // 刷新数据
        this.getParamsData()
        // 关闭对话框
        this.editDialogVisible = false
      })
    },
    // 修改参数
    editParams() {
      // 验证表单数据
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改属性失败！')
        }
        this.$message.success('修改属性成功!')
        // 重新获取数据
        this.getParamsData()
        // 关闭对话框
        this.editDialogVisible = false
      })
    },
    // 删除属性
    async removeParams(attrid) {
      const confirmMsg = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmMsg !== 'confirm') {
        return this.$message.info('取消删除！')
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrid}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      // 重新获取数据
      this.getParamsData()
      // 关闭对话框
      this.editDialogVisible = false
    },
    //  文本框失去焦点，或摁下了 Enter 就会会触发处理函数
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        // 置空
        row.inputValue = ''
        // 隐藏
        row.inputVisible = false
        return
      }
      // 如果没有被return 出去就做后续的处理

      // 保存数据到这个行对象
      row.attr_vals.push(row.inputValue.trim())
      // 清空input
      row.inputValue = ''
      // 隐藏输入框
      row.inputVisible = false

      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      // 发起网络请求保存到数据库
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败！')
      }
      this.$message.success('修改参数成功！')
    },
    // 删除属性操作
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    // 输入文本的控制显示事件
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    // 根据级联选择框是否选择判断按钮是否禁用
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取商品分类id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-button {
  margin: 15px 0;
}
.el-tag {
  margin-right: 15px;
}
.input-new-tag {
  max-width: 150px;
}
</style>
