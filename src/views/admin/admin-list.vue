<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.introduction" :placeholder="$t('table.introduction')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" :placeholder="$t('table.status')" clearable class="filter-item" style="width: 150px">
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
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.username')" prop="username" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.introduction')" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row.id)">{{ row.introduction }}</span>
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
            <div v-if="row.status == '1'">Enable</div>
            <div v-else>Disable</div>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.online')" prop="online" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.online === 1" style="color: #13CE66">在线</span>
          <span v-if="row.online === 0" style="color: #777">离线</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" fixed="right" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='1'" size="mini" type="success" @click="handleModifyStatus(row)">
            {{ $t('table.enable') }}
          </el-button>
          <el-button v-if="row.status!='0'" size="mini" @click="handleModifyStatus(row)">
            {{ $t('table.disable') }}
          </el-button>
          <el-popconfirm title="Are you sure to delete this?" @onConfirm="handleDelete(row.id, row.online, $index)">
            <template #reference>
              <el-button v-if="row.status!='deleted'" v-model="deleteId.id" size="mini" type="danger" style="margin-left: 10px">
                {{ $t('table.delete') }}
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
import { fetchList, changeStatus, deleteAdmin } from '@/api/admin'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '1', display_name: 'Enable' },
  { key: '0', display_name: 'Disable' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'AdminList',
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
        introduction: null,
        status: null,
        sort: 'asc'
      },
      deleteId: {
        id: null
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: 'asc' }, { label: 'ID Descending', key: 'desc' }],
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
      if(row.online === 1) {
        this.$message({
          message: '不能禁用已登录管理员',
          type: 'warning'
        })
        return
      }
      changeStatus(row).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = 1 - row.status
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
      this.$router.push('/admin/admin-add')
    },
    handleUpdate(id) {
      this.$router.push({ name: 'AdminEdit', params: { id: id }})
      // this.$router.push({path:'/admin/admin-edit',query:{id: id}});
      // this.$router.push("/admin/admin-edit/" + id);
    },
    handleDelete(id, online, index) {
      if(online === 1) {
        this.$message({
          message: '不能删除已登录管理员',
          type: 'warning'
        })
        return
      }
      this.deleteId.id = id
      deleteAdmin(this.deleteId).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1) // 列表中删除此行
        this.total -= 1
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'username', 'introduction', 'createtime', 'updatetime', 'status']
        const filterVal = ['id', 'username', 'introduction', 'createtime', 'updatetime', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'AdminUser_list'
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
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
