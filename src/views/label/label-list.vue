<template>
  <div class="components-container">
    <el-row>
      <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
        <div class="left-container">
          <div class="app-container-left">
            <el-input v-model="filterText" :placeholder="$t('table.categoryMap')" style="margin-bottom:30px;" />
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
        </div>
      </el-col>
      <el-col :xs="19" :sm="19" :md="19" :lg="19" :xl="19">
        <div class="right-container">
          <div class="filter-container">
            <el-input v-model="listQuery.label" :placeholder="$t('table.label')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-select v-model="rid" :placeholder="$t('table.root')" style="width: 200px" clearable class="filter-item" @change="selectRoot">
              <el-option v-for="item in rootOptions" :key="item.id" :label="item.root" :value="item.id" />
            </el-select>
            <el-select v-model="cids" :placeholder="$t('table.categoryMap')" multiple clearable class="filter-item" style="width: 250px">
              <template v-for="(item, key) in categoryOptions">
                <el-option v-if="children.length === 0" :key="key" :label="item" :value="key" />
                <el-option v-else-if="children.indexOf(key) != -1" :key="key" :label="item" :value="key" />
              </template>
            </el-select>
            <el-select v-model="listQuery.sort" style="width: 150px" class="filter-item" @change="handleFilter">
              <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
            <br>
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
            <el-table-column :label="$t('table.label')" prop="label" min-width="100px">
              <template slot-scope="{row}">
                <span class="link-type" @click="handleUpdate(row.id)">{{ row.label }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.categoryMap')" min-width="100px">
              <template slot-scope="{row}">
                <el-tag v-for="(item, key) in row.categoryMap" :key="key">{{ item }}</el-tag>
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
            <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
                  {{ $t('table.edit') }}
                </el-button>
                <el-popconfirm title="Are you sure to delete this?" @onConfirm="handleDelete(row.id,$index)">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SplitPane from 'vue-splitpane'
import { fetchList, deleteLabel } from '@/api/label'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'SplitpaneDemo',
  components: { SplitPane, Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      filterText: '',
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
        ids: null,
        rootid: null,
        label: null,
        sort: 'asc'
      },
      rid: null,
      cids: [],
      deleteId: {
        id: null
      },
      rootOptions: null,
      categoryOptions: null,
      sortOptions: [{ label: 'ID Ascending', key: 'asc' }, { label: 'ID Descending', key: 'desc' }],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      children: '',
      cateMap: null,
      downloadLoading: false,
      count: 1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
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
    handleNodeClick(data) {
      if (data.id != 0) {
        if (data.is === 'category') {
          this.listQuery.ids = data.id + ','
          this.listQuery.rootid = null
        } else if (data.is === 'root') {
          this.listQuery.rootid = data.id
          this.listQuery.ids = null
        }
      } else {
        this.listQuery.ids = null
        this.listQuery.rootid = null
      }
      this.getList()
    },

    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.categoryOptions = response.data.allCategory
        this.rootOptions = response.data.allRoot

        if (this.count === 1) {
          this.treeData = response.data.labelTree
          this.count += 1
        }

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      var idss = ''
      for (const id in this.cids) {
        idss += this.cids[id] + ','
      }
      this.listQuery.ids = idss
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
    selectRoot(val) {
      if (val === '') {
        this.listQuery.rootid = null
        this.children = ''
      } else {
        this.listQuery.rootid = this.rid
        for (const id in this.rootOptions) {
          if (this.rootOptions[id].id === val) {
            this.children = this.rootOptions[id].children
          }
        }
      }
    },
    handleCreate() {
      // 直接跳转
      this.$router.push('/label/label-add')
    },
    handleUpdate(id) {
      // 带参数跳转
      // this.$router.push({path:'/admin/admin-edit',query:{id: id}});
      this.$router.push({ name: 'LabelEdit', params: { id: id }})
      // this.$router.push("/admin/admin-edit/" + id);
    },
    handleDelete(id, index) {
      this.deleteId.id = id
      deleteLabel(this.deleteId).then(() => {
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
        const tHeader = ['id', 'categoryMap', 'createtime', 'updatetime', 'label', 'status']
        const filterVal = ['id', 'categoryMap', 'createtime', 'updatetime', 'label', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'AdminUser-list'
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

<style  scoped>
  .app-container-left {
    padding-right: 10px;
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
