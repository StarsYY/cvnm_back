<template>
  <div class="components-container">
    <el-row>
      <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
        <div class="left-container">
          <el-scrollbar height="600px">
            <div class="app-container-left">
              <el-input v-model="filterText" :placeholder="$t('table.search')" style="margin-bottom:30px;" />
              <el-tree
                ref="modularTree"
                :data="modularTree"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                class="filter-tree"
                default-expand-all
                @node-click="handleNodeClickModular"
              />
              <el-tree
                ref="tree"
                :data="treeData"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                class="filter-tree"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :xs="19" :sm="19" :md="19" :lg="19" :xl="19">
        <div class="right-container">
          <div class="filter-container">
            <el-input v-model="listQuery.name" :placeholder="$t('table.name')" style="width: 275px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.nickname" :placeholder="$t('table.author')" style="width: 275px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-select v-model="cgids" value-key="category" :placeholder="$t('table.categoryMap')" filterable multiple clearable class="filter-item" style="width: 275px" @change="selectCategory">
              <template v-for="item in categoryOptions">
                <el-option v-if="cchildren.length === 0" :key="item.id" :label="item.category" :value="item" />
                <el-option v-else-if="cchildren.indexOf(item.id) != -1" :key="item.id" :label="item.category" :value="item" />
              </template>
            </el-select>
            <el-select v-model="lids" :placeholder="$t('table.keyword')" filterable multiple clearable class="filter-item" style="width: 275px">
              <template v-for="(item, key) in labelOptions">
                <el-option v-if="children.length === 0" :key="key" :label="item" :value="key" />
                <el-option v-else-if="children.indexOf(key) != -1" :key="key" :label="item" :value="key" />
              </template>
            </el-select>
            <el-select v-model="rid" :placeholder="$t('table.root')" clearable class="filter-item" style="width: 210px" @change="selectRoot">
              <el-option v-for="item in rootOptions" :key="item.id" :label="item.root" :value="item.id" />
            </el-select>
            <el-select v-model="modularid" :placeholder="$t('table.modular')" clearable class="filter-item" style="width: 210px" @change="setModular">
              <el-option v-for="(item, key) in modularOptions" :key="key" :label="item" :value="key" />
            </el-select>
            <el-select v-model="listQuery.status" :placeholder="$t('table.status')" clearable class="filter-item" style="width: 210px">
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-select v-model="listQuery.sort" style="width: 170px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              {{ $t('table.search') }}
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
              {{ $t('table.add') }}
            </el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
              {{ $t('table.export') }}
            </el-button>
            <el-checkbox v-model="showCreatetime" class="filter-item" style="margin-left:45px;" @change="tableKey=tableKey+1">
              {{ $t('table.createtime') }}
            </el-checkbox>
            <el-checkbox v-model="showUpdatetime" class="filter-item" @change="tableKey=tableKey+1">
              {{ $t('table.updatetime') }}
            </el-checkbox>
            <el-checkbox v-model="showActions" class="filter-item" @change="tableKey=tableKey+1">
              {{ $t('table.actions') }}
            </el-checkbox>
            <el-checkbox v-model="showSend" class="filter-item" @change="tableKey=tableKey+1">
              {{ $t('table.sendMessage') }}
            </el-checkbox>
          </div>

          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            fit
            highlight-current-row
            style="width: 100%;"
            @sort-change="sortChange"
          >
            <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
              <template slot-scope="{row}">
                <span>{{ row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.name')" prop="name" min-width="110px">
              <template slot-scope="{row}">
                <span class="link-type" @click="handleUpdate(row.id)">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.author')" prop="author" width="110px" align="center">
              <template slot-scope="{row}">
                {{ row.author }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.modular')" prop="modular" width="110px" align="center">
              <template slot-scope="{row}">
                {{ row.modular }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.keyword')" min-width="110px">
              <template slot-scope="{row}">
                <el-tag v-for="(item, key) in row.labelMap" :key="key">{{ item }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.price')" prop="price" width="100px" align="center">
              <template slot-scope="{row}">
                <span style="color: #F6416C">￥ {{ row.price / 100 }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.score')" prop="score" width="50px" align="center">
              <template slot-scope="{row}">
                <span style="color: #ff9900">{{ row.score}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status | statusFilter">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="showCreatetime" :label="$t('table.createtime')" width="150px" align="center">
              <template slot-scope="{row}">
                <span style="color: #B2B9BF">{{ row.createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="showUpdatetime" :label="$t('table.updatetime')" width="150px" align="center">
              <template slot-scope="{row}">
                <span style="color: #B2B9BF">{{ row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="showActions" :label="$t('table.actions')" fixed="right" align="center" width="220" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
                  {{ $t('table.edit') }}
                </el-button>
                <el-button v-if="row.status!='已发布' && row.status!='待审核'" size="mini" @click="handleModifyStatus(row)">
                  {{ $t('table.draft') }}
                </el-button>
                <el-button v-if="row.status!='草稿' && row.status!='已发布'" size="mini" type="success" @click="handleModifyStatus(row)">
                  {{ $t('table.publish') }}
                </el-button>
                <el-button v-if="row.status!='草稿' && row.status!='待审核'" size="mini" @click="handleModifyStatus(row)">
                  {{ $t('table.audit') }}
                </el-button>
                <el-popconfirm title="是否删除？" @onConfirm="handleDelete(row)">
                  <template #reference>
                    <el-button v-if="row.status!='deleted'" v-model="deleteId.id" size="mini" type="danger" style="margin-left: 10px">
                      <span v-if="row.isdel === 0">{{ $t('table.delete') }}</span>
                      <span v-if="row.isdel === 1">{{ $t('table.restore') }}</span>
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
            <el-table-column v-if="showSend" :label="$t('table.sendMessage')" fixed="right" align="center" width="120" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="danger" size="mini" plain @click="sendMsg(row)">
                  {{ $t('table.sendMessage') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
        </div>
      </el-col>
    </el-row>
    
    <el-dialog title="发送消息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="内容" label-width="20%">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.content"
            clearable
            maxlength="250"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMessage">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, changeStatus, deleteCourse } from '@/api/course'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { sendMessageToUser } from '@/api/article'

const statusOptions = [
  { key: '已发布', display_name: '已发布' },
  { key: '草稿', display_name: '草稿' },
  { key: '待审核', display_name: '待审核' }
]

const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'CourseList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        已发布: 'success',
        草稿: 'info',
        待审核: 'danger',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return statusKeyValue[type]
    }
  },
  data() {
    return {
      filterText: '',
      modularTree: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        rootid: null,
        cids: null,
        ids: null,
        modularid: null,
        name: null,
        nickname: null,
        sort: 'asc',
        status: null
      },
      showCreatetime: false,
      showUpdatetime: false,
      showActions: true,
      modularid: null,
      rid: null,
      cgids: [],
      lids: [],
      cchildren: '',
      children: '',
      deleteId: {
        id: null
      },
      modularOptions: null,
      rootOptions: null,
      categoryOptions: null,
      labelOptions: null,
      statusOptions,
      sortOptions: [{ label: 'ID 升序', key: 'asc' }, { label: 'ID 降序', key: 'desc' }],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      cateMap: null,
      downloadLoading: false,
      count: 1,
      dialogFormVisible: false,
      form: {
        receiveuid: '',
        content: ''
      },
      showSend: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
      this.$refs.modularTree.filter(val)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resize() {
      console.log('resize')
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClickModular(data) {
      this.listQuery.rootid = null
      this.listQuery.cids = null
      this.listQuery.ids = null
      this.rid = null
      this.cgids = []
      this.lids = []
      if (data.value === 0) {
        this.listQuery.modularid = null
      } else {
        this.listQuery.modularid = data.value
      }
      this.getList()
    },
    handleNodeClick(data) {
      this.listQuery.modularid = null
      this.listQuery.rootid = null
      this.listQuery.cids = null
      this.rid = null
      this.cgids = []
      this.lids = []
      if (data.id === 0) {
        this.listQuery.ids = null
      } else {
        if (data.is === 'root') {
          this.listQuery.rootid = data.id
        } else if (data.is === 'category') {
          this.listQuery.cids = data.id + ','
        } else if (data.is === 'label') {
          this.listQuery.ids = data.id + ','
        }
      }
      this.getList()
    },

    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.modularOptions = response.data.allModular
        this.rootOptions = response.data.allRoot
        this.categoryOptions = response.data.allCategory
        this.labelOptions = response.data.allLabel

        if (this.count === 1) { // 防止重复刷新列表树
          this.modularTree = response.data.modularTree
          this.treeData = response.data.labelTree
          this.count += 1
        }
        this.listQuery.ids = null

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    setModular(val) {
      this.listQuery.modularid = val
    },
    selectRoot(val) {
      if (val === '') {
        this.listQuery.rootid = null
        this.cchildren = ''
      } else {
        this.listQuery.rootid = this.rid
        for (const id in this.rootOptions) {
          if (this.rootOptions[id].id === val) {
            this.cchildren = this.rootOptions[id].children
          }
        }
      }
    },
    selectCategory(val) {
      let obj = []
      for (const id in val) {
        obj = obj.concat(val[id].children)
      }
      let arr = []	// 去重复后的新数组
      arr = obj.filter((element, index, self) => {
        return self.indexOf(element) === index
      })
      this.children = arr
    },
    handleFilter() {
      var cidss = ''
      for (const id in this.cgids) {
        cidss += this.cgids[id].id + ','
      }
      var idss = ''
      for (const id in this.lids) {
        idss += this.lids[id] + ','
      }
      console.log(cidss)
      this.listQuery.cids = cidss
      this.listQuery.ids = idss
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row) {
      if(row.status === '草稿') {
        this.$message({
          message: '课程还没有上线，不能操作呦',
          type: 'warning'
        })
        return
      }
      changeStatus(row).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        if (row.status === '已发布') {
          row.status = '待审核'
        } else {
          row.status = '已发布'
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'asc'
      } else {
        this.listQuery.sort = 'desc'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.$router.push('/course/course-add')
    },
    handleUpdate(id) {
      this.$router.push({ name: 'CourseEdit', params: { id: id }})
    },
    handleDelete(row) {
      this.deleteId.id = row.id
      deleteCourse(this.deleteId).then(() => {
        if(row.isdel === 0) {
          this.$notify({
            title: '成功',
            message: '软删除成功',
            type: 'success',
            duration: 2000
          })
          row.isdel = 1
        } else if(row.isdel === 1) {
          this.$notify({
            title: '成功',
            message: '恢复成功',
            type: 'success',
            duration: 2000
          })
          row.isdel = 0
        }
      })
    },
    // handleDeleteR(id, index) { @contextmenu.right.native.prevent="handleDeleteR(row.id, $index)",$index
    //   this.$confirm(
    //     '将要彻底删除这个课程，请三思而后行！',
    //     'Warning',
    //     {
    //       confirmButtonText: 'OK',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning',
    //     }
    //   ).then(() => {
    //     this.deleteId.id = id
    //     deleteCourseR(this.deleteId).then(() => {
    //       this.$notify({
    //         title: '成功',
    //         message: '彻底删除成功',
    //         type: 'success',
    //         duration: 2000
    //       })
    //       this.list.splice(index, 1) // 列表中删除此行
    //       this.total -= 1
    //     })
    //   }).catch(() => {
    //     console.log('close')
    //   })
    // },
    sendMsg(row) {
      this.dialogFormVisible = true
      this.form.receiveuid = row.userid
    },
    submitMessage() {
      sendMessageToUser(this.form).then(() => {
        this.$message({
          message: '发送成功',
          type: 'success'
        })
        this.dialogFormVisible = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'categoryMap', 'createtime', 'updatetime', 'name', 'status']
        const filterVal = ['id', 'categoryMap', 'createtime', 'updatetime', 'name', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Course-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'createtime' || j === 'updatetime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'asc' : 'desc'
    }
  }
}
</script>

<style scoped>
  .app-container-left {
    padding-right: 10px;
    height: 600px;
  }

  .components-container {
    position: relative;
  }

  .left-container {
    height: 100%;
  }

  .right-container {
    padding-left: 10px;
    width: 100%;
    height: 100%;
  }
</style>
