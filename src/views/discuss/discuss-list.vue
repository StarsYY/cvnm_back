<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.discuss" :placeholder="$t('table.discuss')" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.course" :placeholder="$t('table.course')" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.nickname" :placeholder="$t('table.username')" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" :placeholder="$t('table.status')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 150px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
      <el-checkbox v-model="showSend" class="filter-item" style="margin-left:45px" @change="tableKey=tableKey+1">
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
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <div>评论：{{ row.discuss }}</div>
          <div v-if="row.admDis !== null" style="margin-top: 10px">社区管理员回复：{{ row.admDis }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.username')" prop="username" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.course')" min-width="100px">
        <template slot-scope="{row}">
          {{ row.course }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createtime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            <span v-if="row.status == 1">已通过</span>
            <span v-if="row.status == 0">待审核</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" fixed="right" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status!=1" size="mini" type="success" @click="handleModifyStatus(row)">
            {{ $t('table.pass') }}
          </el-button>
          <el-button v-if="row.status!=0" size="mini" @click="handleModifyStatus(row)">
            {{ $t('table.audit') }}
          </el-button>

          <el-popconfirm title="若该评论下有回复内容将一并删除，请三思而后行。" @onConfirm="handleDelete(row.id)">
            <template #reference>
              <el-button v-if="row.status!='deleted'" v-model="deleteId.id" size="mini" type="danger" style="margin-left: 10px">
                {{ $t('table.delete') }}
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
import { fetchList, changeStatus, deleteDiscuss } from '@/api/discuss'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { sendMessageToUser } from '@/api/article'

export default {
  name: 'DiscussList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        discuss: null,
        nickname: null,
        course: null,
        status: null,
        sort: 'asc'
      },
      deleteId: {
        id: null
      },
      statusOptions: [{ label: '已通过', key: '1' }, { label: '待审核', key: '0' }],
      sortOptions: [{ label: 'ID 升序', key: 'asc' }, { label: 'ID 降序', key: 'desc' }],
      downloadLoading: false,
      dialogFormVisible: false,
      form: {
        receiveuid: '',
        content: ''
      },
      showSend: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row) {
      changeStatus(row).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        if (row.status === 1) {
          row.status = 0
        } else {
          row.status = 1
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
    handleDelete(id) {
      this.deleteId.id = id
      deleteDiscuss(this.deleteId).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        let delId = []
        this.list.forEach((element, $index) => {
          if (response.data.findIndex(item => item === element.id) !== -1) {
            delId.push($index)
          }
        });
        delId.forEach((item, $index) => this.list.splice(item - $index, 1));
        this.total -= response.data.length
      })
    },
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
        const tHeader = ['id', 'discuss', 'username', 'course', 'reviewName', 'createtime', 'status']
        const filterVal = ['id', 'discuss', 'username', 'course', 'reviewName', 'createtime', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Comment-list'
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
