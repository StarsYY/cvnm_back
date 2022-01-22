<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <el-input v-model="postForm.id" type="hidden" />
      <el-input v-model="postForm.cover" type="hidden" />

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <ERDropdown v-model="postForm.tag" />
        <CommentDropdown v-model="postForm.type" />
        <PlatformDropdown v-model="postForm.publish" />
        <SourceUrlDropdown v-if="postForm.type === '翻译' || postForm.type === '转载'" v-model="postForm.source" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          Draft
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                Title
              </MDinput>
            </el-form-item>

            <el-form-item :label="$t('table.ancestor')">
              <el-cascader ref="plateCascader" v-model="postForm.plateid" :options="options" :props="props" clearable style="width: 420px" @change="setAncestor" />
            </el-form-item>
            <br>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="7">
                  <el-form-item label-width="60px" label="Author:" class="postInfo-container-item">
                    <el-select v-model="author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="Search user" @change="changeId">
                      <el-option v-for="(item, key) in userListOptions" :key="key" :label="item" :value="key" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="9">
                  <el-form-item label-width="120px" label="Label:" class="postInfo-container-item">
                    <el-select v-model="ids" multiple clearable style="width: 250px" class="filter-item" placeholder="Select Label">
                      <el-option v-for="(item, key) in labelOptions" :key="key" :label="item" :value="key" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="120px" label="Hot:" class="postInfo-container-item">
                    <el-select v-model="postForm.hot" clearable style="width: 200px" class="filter-item" placeholder="Select Hot">
                      <el-option v-for="item in hotOptions" :key="item.key" :label="item.label" :value="item.key" />
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Summary:">
          <el-input v-model="postForm.summary" maxlength="300" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="50px" label="Cover:">
          <pan-thumb :image="image" style="margin-left: 40px" />
          <el-button type="primary" icon="el-icon-upload" style="margin-left: 40px" @click="toggleShow">
            Change Portrait
          </el-button>
          <my-upload
            field="img"
            :model-value.sync="show"
            img-format="png"
            @crop-success="cropSuccess"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import MyUpload from 'vue-image-crop-upload'
import PanThumb from '@/components/PanThumb'
import { validURL } from '@/utils/validate'
import { fetchArticle, createArticle, fetchLabel, updateArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import { uploadArticleCover } from '@/api/upload'
import { CommentDropdown, ERDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  id: undefined,
  title: '', // 文章题目
  userid: '',
  summary: '', // 文章摘要
  content: '', // 文章内容
  cover: '',
  plateid: '',
  labelid: '',
  tag: '',
  type: '原创',
  publish: '公开',
  status: 'draft',
  up: 0,
  down: 0,
  watch: 0,
  hot: '',
  source: '' // 文章外链
}

export default {
  name: 'ArticleAdd',
  components: { Tinymce, MDinput, Upload, Sticky, MyUpload, PanThumb, CommentDropdown, ERDropdown, PlatformDropdown, SourceUrlDropdown },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      ids: [],
      author: '',
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      labelOptions: null,
      hotOptions: [{ label: 'Hot', key: 'Hot' }, { label: 'Top', key: 'Top' }],
      tempRoute: {},
      image: '',
      imgDataUrl: {
        base64: '' // the datebase64 url of created image
      },
      props: {
        checkStrictly: true
      },
      options: null,
      show: false
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.summary.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.$route.params.id > 0) {
      this.fetchData(this.$route.params.id)
    }
    this.fetchLabel()
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.image = response.data.cover
        this.ids = response.data.labelid.split(',')
        this.author = response.data.author

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    fetchLabel() {
      fetchLabel().then(response => {
        this.options = response.data.optionPlate
        this.labelOptions = response.data.allLabel
      })
    },
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(base64, field) {
      this.imgDataUrl.base64 = base64
      uploadArticleCover(this.imgDataUrl).then(response => {
        this.image = response.data.imagePath
        this.postForm.cover = response.data.imagePath
        console.log(response.data)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    setAncestor() {
      this.postForm.plateid = this.postForm.plateid[this.postForm.plateid.length - 1]
    },
    changeId() {
      this.postForm.userid = this.author
    },
    submitForm() {
      console.log(this.postForm)
      var idss = ','
      for (const id in this.ids) {
        idss += this.ids[id] + ','
      }
      console.log(idss)
      this.postForm.labelid = idss
      if (this.postForm.userid === '' || this.postForm.labelid === '' || this.postForm.plateid === '' || this.postForm.labelid === ',') {
        this.$message({
          message: '作者、标签和板块为必传项',
          type: 'error'
        })
        return
      }
      if (this.$route.params.id > 0) {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.postForm.status = '已发布'
            updateArticle(this.postForm).then(() => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: '修改文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published' // 改变颜色
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.postForm.status = '已发布'
            createArticle(this.postForm).then(() => {
              this.loading = true
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.postForm.status = 'published' // 改变颜色
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      var idss = ','
      for (const id in this.ids) {
        idss += this.ids[id] + ','
      }
      this.postForm.labelid = idss
      this.postForm.status = '草稿'
      if (this.postForm.userid === '' || this.postForm.labelid === '' || this.postForm.plateid === '' || this.postForm.labelid === ',') {
        this.$message({
          message: '作者和标签为必传项',
          type: 'error'
        })
        return
      }
      if (this.$route.params.id > 0) {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            updateArticle(this.postForm).then(() => {
              this.$message({
                message: '修改成功',
                type: 'success',
                showClose: true,
                duration: 1000
              })
              this.postForm.status = 'draft'
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            createArticle(this.postForm).then(response => {
              this.$message({
                message: '保存成功',
                type: 'success',
                showClose: true,
                duration: 1000
              })
              this.postForm.status = 'draft'
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.userList) return
        this.userListOptions = response.data.userList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 50px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
