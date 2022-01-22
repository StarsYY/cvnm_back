<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" :placeholder="$t('table.nickname')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" :placeholder="$t('table.status')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 150px" class="filter-item" @change="handleFilter">
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
      <el-table-column :label="$t('table.uid')" prop="uid" sortable="custom" align="center" width="80" :class-name="getSortClass('uid')">
        <template slot-scope="{row}">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.nickname')" prop="nickname" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.summary')" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row.uid)">{{ row.summary }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createtime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updatetime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updatetime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.online')" prop="islog" width="100px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.online === 1" style="color: #13CE66">在线</span>
          <span v-if="row.online === 0" style="color: #777">离线</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" fixed="right" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.uid)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='启用'" size="mini" type="success" @click="handleModifyStatus(row)">
            {{ $t('table.enable') }}
          </el-button>
          <el-button v-if="row.status!='禁用'" size="mini" @click="handleModifyStatus(row)">
            {{ $t('table.disable') }}
          </el-button>

          <el-popconfirm title="此为软删除，彻底删除请点击右键" @onConfirm="handleDelete(row)">
            <template #reference>
              <el-button v-if="row.status!='deleted'" v-model="deleteId.uid" size="mini" type="danger" style="margin-left: 10px" @contextmenu.right.native.prevent="handleDeleteR(row.uid, $index)">
                <span v-if="row.isdel === 0">{{ $t('table.delete') }}</span>
                <span v-if="row.isdel === 1">{{ $t('table.restore') }}</span>
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, changeStatus, deleteUser, deleteUserR } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '启用', display_name: '启用' },
  { key: '禁用', display_name: '禁用' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        启用: 'success',
        禁用: 'info',
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
        nickname: null,
        status: null,
        sort: 'asc'
      },
      deleteId: {
        uid: null
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 升序', key: 'asc' }, { label: 'ID 降序', key: 'desc' }],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      downloadLoading: false
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
        if (row.status === '启用') {
          row.status = '禁用'
        } else {
          row.status = '启用'
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'uid') {
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
      this.$router.push('/user/user-add')
    },
    handleUpdate(uid) {
      this.$router.push({ name: 'UserEdit', params: { uid: uid }})
    },
    handleDelete(row) {
      this.deleteId.uid = row.uid
      deleteUser(this.deleteId).then(() => {
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
    handleDeleteR(uid, index) {
      this.$confirm(
        '将要彻底删除这个用户，请三思而后行！',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(() => {
        this.deleteId.uid = uid
        deleteUserR(this.deleteId).then(() => {
          this.$notify({
            title: '成功',
            message: '彻底删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1) // 列表中删除此行
          this.total -= 1
        })
      }).catch(() => {
        console.log('close')
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['uid', 'nickname', 'summary', 'createtime', 'updatetime', 'status']
        const filterVal = ['uid', 'nickname', 'summary', 'createtime', 'updatetime', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'User-list'
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
