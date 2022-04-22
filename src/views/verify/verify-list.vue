<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" maxlength="20" :placeholder="$t('table.nickname')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" maxlength="20" :placeholder="$t('table.rname')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.position" :placeholder="$t('table.position')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.account" :placeholder="$t('table.account')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in accountOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
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
        <template #default="props">
          <p>公司/学校名称：{{ props.row.school }}</p>
          <p>擅长的技术：{{ props.row.technology }}</p>
          <p>自我介绍：{{ props.row.introduce }}</p>
          <p>经历：{{ props.row.start }} - {{ props.row.end }}</p>
          <p><span style="margin-right: 40px"></span>{{ props.row.experience }}</p>
          <p><span style="margin-right: 40px"></span>{{ props.row.detail }}</p>
          <p v-if="props.row.photo !== null && props.row.photo !== ''">照片：<img :src="props.row.photo"></p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.username')" prop="username" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.rname')" prop="name" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.position')" prop="name" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.account')" prop="name" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.email')" prop="name" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" fixed="right" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status!='1'" size="mini" type="success" @click="handleModifyStatus(row)">
            {{ $t('table.pass') }}
          </el-button>
          <el-button v-if="row.status!='0'" size="mini" @click="handleModifyStatus(row)">
            {{ $t('table.audit') }}
          </el-button>

          <el-popconfirm title="是否删除？" @onConfirm="handleDelete(row.id, $index)">
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
import { fetchList, changeStatus, deleteVerify } from '@/api/verify'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '专家', display_name: '专家' },
  { key: '讲师', display_name: '讲师' }
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'VerifyList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info',
        2: 'warning',
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
        name: null,
        position: null,
        account: null,
        status: null,
        sort: 'asc'
      },
      deleteId: {
        id: null
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 升序', key: 'asc' }, { label: 'ID 降序', key: 'desc' }],
      accountOptions: [{ label: '个人账户', key: '个人账户' }, { label: '非个人账户', key: '非个人账户' }],
      statusOptions: [{ label: '已通过', key: '1' }, { label: '待审核', key: '0' }],
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
        if (row.status === '1') {
          row.status = '0'
        } else {
          row.status = '1'
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
    handleDelete(id, index) {
      this.deleteId.id = id
      deleteVerify(this.deleteId).then(() => {
        this.$notify({
          title: '成功',
          message: '彻底删除成功',
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
        const tHeader = ['id', 'username', 'name']
        const filterVal = ['id', 'username', 'name']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Verify-list'
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
