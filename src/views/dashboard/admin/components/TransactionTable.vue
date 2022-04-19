<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单编号" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.number | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="价格" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="支付状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.transaction | statusFilter">
          <span v-if="row.transaction === 1">待付款</span>
          <span v-if="row.transaction === 0">取消订单</span>
          <span v-if="row.transaction === 2">已付款</span>
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        2: 'success',
        0: 'danger',
        1: 'warning'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList().then(response => {
        this.list = response.data

        this.list.forEach(element => {
          if(element.payment === 2) {
            element.price = (element.price * 0.8 / 100).toFixed(2)
          } else {
            element.price = element.price / 100
          }
        })
      })
    }
  }
}
</script>
