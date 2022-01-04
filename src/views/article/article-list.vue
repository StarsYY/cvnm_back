<template>
  <div class="components-container">
    <el-row>
      <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
        <div class="left-container">
          <el-scrollbar>
            <div class="app-container-left">
              <el-input v-model="filterText" :placeholder="$t('table.labelMap')" style="margin-bottom:30px;" /><el-tree
                ref="plateTree"
                :data="plateTree"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                class="filter-tree"
                default-expand-all
                @node-click="handleNodeClickPlate"
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
            <el-input v-model="listQuery.title" :placeholder="$t('table.title')" style="width: 275px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-select v-model="cgids" value-key="category" :placeholder="$t('table.categoryMap')" filterable multiple clearable class="filter-item" style="width: 275px" @change="selectCategory">
              <template v-for="item in categoryOptions">
                <el-option v-if="cchildren.length === 0" :key="item.id" :label="item.category" :value="item" />
                <el-option v-else-if="cchildren.indexOf(item.id) != -1" :key="item.id" :label="item.category" :value="item" />
              </template>
            </el-select>
            <el-select v-model="lids" :placeholder="$t('table.labelMap')" filterable multiple clearable class="filter-item" style="width: 275px">
              <template v-for="(item, key) in labelOptions">
                <el-option v-if="children.length === 0" :key="key" :label="item" :value="key" />
                <el-option v-else-if="children.indexOf(key) != -1" :key="key" :label="item" :value="key" />
              </template>
            </el-select>
            <el-select v-model="rid" :placeholder="$t('table.root')" clearable class="filter-item" style="width: 210px" @change="selectRoot">
              <el-option v-for="item in rootOptions" :key="item.id" :label="item.root" :value="item.id" />
            </el-select>
            <el-select v-model="plateid" :placeholder="$t('table.plate')" clearable class="filter-item" style="width: 210px" @change="setPlate">
              <el-option v-for="(item, key) in plateOptions" :key="key" :label="item" :value="key" />
            </el-select>
            <el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 210px">
              <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-select v-model="listQuery.publish" :placeholder="$t('table.publish')" clearable class="filter-item" style="width: 210px">
              <el-option v-for="item in publishOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-select v-model="listQuery.status" :placeholder="$t('table.status')" clearable class="filter-item" style="width: 210px">
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-select v-model="listQuery.tag" :placeholder="$t('table.tag')" clearable class="filter-item" style="width: 210px">
              <el-option v-for="item in tagOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
            <el-table-column :label="$t('table.title')" prop="title" min-width="110px">
              <template slot-scope="{row}">
                <span class="link-type" @click="handleUpdate(row.id)">{{ row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.author')" prop="author" width="110px" align="center">
              <template slot-scope="{row}">
                {{ row.author }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.ancestor')" prop="plate" width="110px" align="center">
              <template slot-scope="{row}">
                {{ row.plate }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.labelMap')" min-width="100px">
              <template slot-scope="{row}">
                <el-tag v-for="(item, key) in row.labelMap" :key="key">{{ item }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status | statusFilter">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.tag')" class-name="status-col" width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.tag | statusFilter">
                  {{ row.tag }}
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
            <el-table-column v-if="showActions" :label="$t('table.actions')" fixed="right" align="center" width="300" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
                  {{ $t('table.edit') }}
                </el-button>
                <el-button v-if="row.status!='Publish'" size="mini" type="success" @click="handleModifyStatus(row)">
                  {{ $t('table.publish') }}
                </el-button>
                <el-button v-if="row.status!='Draft'" size="mini" @click="handleModifyStatus(row)">
                  {{ $t('table.draft') }}
                </el-button>
                <el-button v-if="row.tag!='Essence' && row.tag!='Default'" size="mini" type="warning" @click="handleModifyTag(row)" @contextmenu.right.native.prevent="handleModifyTagR(row)">
                  {{ $t('table.essence') }}
                </el-button>
                <el-button v-if="row.tag!='Recommend' && row.tag!='Default'" size="mini" type="warning" @click="handleModifyTag(row)" @contextmenu.right.native.prevent="handleModifyTagR(row)">
                  {{ $t('table.recommend') }}
                </el-button>
                <el-button v-if="row.tag!='Essence' && row.tag!='Recommend'" size="mini" @contextmenu.right.native.prevent="handleModifyTagR(row)">
                  {{ $t('table.default') }}
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
import { fetchList, changeStatus, changeTag, changeRTag, deleteArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const statusOptions = [
  { key: 'Publish', display_name: 'Publish' },
  { key: 'Draft', display_name: 'Draft' },
  { key: 'Audit', display_name: 'Audit' }
]

const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ArticleList',
  components: { SplitPane, Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Publish: 'success',
        Draft: 'info',
        Essence: 'warning',
        Recommend: 'warning',
        Default: 'info',
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
      plateTree: [],
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
        plateid: null,
        title: null,
        sort: 'asc',
        type: null,
        publish: null,
        status: null,
        tag: null
      },
      showCreatetime: false,
      showUpdatetime: false,
      showActions: false,
      plateid: null,
      rid: null,
      cgids: [],
      lids: [],
      cchildren: '',
      children: '',
      deleteId: {
        id: null
      },
      plateOptions: null,
      rootOptions: null,
      categoryOptions: null,
      labelOptions: null,
      statusOptions,
      tagOptions: [{ key: 'Default', display_name: 'Default' }, { key: 'Essence', display_name: 'Essence' }, { key: 'Recommend', display_name: 'Recommend' }],
      typeOptions: [{ key: 'Original', display_name: 'Original' }, { key: 'Reprint', display_name: 'Reprint' }, { key: 'Translation', display_name: 'Translation' }],
      publishOptions: [{ key: 'Public', display_name: 'Public' }, { key: 'Private', display_name: 'Private' }],
      sortOptions: [{ label: 'ID Ascending', key: 'asc' }, { label: 'ID Descending', key: 'desc' }],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      cateMap: null,
      downloadLoading: false,
      count: 1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
      this.$refs.plateTree.filter(val)
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
    handleNodeClickPlate(data) {
      this.listQuery.rootid = null
      this.listQuery.cids = null
      this.listQuery.ids = null
      if (data.value === 0) {
        this.listQuery.plateid = null
      } else {
        this.listQuery.plateid = data.value
      }
      this.getList()
    },
    handleNodeClick(data) {
      this.listQuery.plateid = null
      this.listQuery.rootid = null
      this.listQuery.cids = null
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
        console.log(response)
        this.list = response.data.items
        this.total = response.data.total
        this.plateOptions = response.data.allPlate
        this.rootOptions = response.data.allRoot
        this.categoryOptions = response.data.allCategory
        this.labelOptions = response.data.allLabel
        if (this.count === 1) { // 防止重复刷新列表树
          this.plateTree = response.data.plateTree
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
    setPlate(val) {
      this.listQuery.plateid = val
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
      changeStatus(row).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        if (row.status === 'Publish') {
          row.status = 'Draft'
        } else {
          row.status = 'Publish'
        }
      })
    },
    handleModifyTag(row) {
      changeTag(row).then(() => {
        if (row.tag === 'Essence') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          row.tag = 'Recommend'
        } else if (row.tag === 'Recommend') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          row.tag = 'Essence'
        }
      })
    },
    handleModifyTagR(row) {
      changeRTag(row).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        if (row.tag !== 'Default') {
          row.tag = 'Default'
        } else {
          row.tag = 'Recommend'
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
      // 直接跳转
      this.$router.push('/article/article-add')
    },
    handleUpdate(id) {
      // 带参数跳转
      // this.$router.push({ path: '/admin/admin-edit', query: { id: id } });
      this.$router.push({ name: 'ArticleEdit', params: { id: id }})
      // this.$router.push("/admin/admin-edit/" + id);
    },
    handleDelete(id, index) {
      this.deleteId.id = id
      deleteArticle(this.deleteId).then(() => {
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
        const tHeader = ['id', 'categoryMap', 'createtime', 'updatetime', 'title', 'status']
        const filterVal = ['id', 'categoryMap', 'createtime', 'updatetime', 'title', 'status']
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
