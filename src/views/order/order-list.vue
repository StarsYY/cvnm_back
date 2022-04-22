<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" maxlength="20" :placeholder="$t('table.nickname')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" maxlength="120" :placeholder="$t('table.name')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.transaction" style="width: 150px" clearable class="filter-item">
        <el-option v-for="item in transactionOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.payment" style="width: 150px" clearable class="filter-item">
        <el-option v-for="item in paymentOptions" :key="item.key" :label="item.label" :value="item.key" />
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
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.number')" prop="number" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.nickname')" prop="nickname" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.course')" prop="course" width="210px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.payment')" prop="payment" width="100px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.payment === null">-</span>
          <span v-if="row.payment === 0">微信支付</span>
          <span v-if="row.payment === 1">支付宝支付</span>
          <span v-if="row.payment === 2">积分兑换</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.transaction | statusFilter">
            <span v-if="row.transaction === 1">交易开启</span>
            <span v-if="row.transaction === 0">交易关闭</span>
            <span v-if="row.transaction === 2">已支付</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.paytime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.paytime !== null">{{ row.paytime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.invalidtime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.invalidtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createtime')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" fixed="right" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-popconfirm title="是否删除?" @onConfirm="handleDelete(row.id, $index)">
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
import { fetchList, deleteOrder } from '@/api/order'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'OrderList',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success',
        2: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
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
        transaction: null,
        payment: null,
        sort: 'asc'
      },
      deleteId: {
        id: null
      },
      transactionOptions: [{ label: '交易开启', key: 1 }, { label: '交易关闭', key: 0 }, { label: '已付款', key: 2 }],
      paymentOptions: [{ label: '微信', key: 0 }, { label: '支付宝', key: 1 }, { label: '积分兑换', key: 2 }],
      sortOptions: [{ label: 'ID 升序', key: 'asc' }, { label: 'ID 降序', key: 'desc' }],
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
      deleteOrder(this.deleteId).then(() => {
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
        const tHeader = ['id', 'nickname', 'name', 'transaction', 'payment', 'paytime', 'invalidtime', 'createtime']
        const filterVal = ['id', 'nickname', 'name', 'transaction', 'payment', 'paytime', 'invalidtime', 'createtime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Order-list'
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
