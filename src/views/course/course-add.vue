<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <el-input v-model="postForm.id" type="hidden" />
      <el-input v-model="postForm.cover" type="hidden" />

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
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
            <el-form-item style="margin-bottom: 40px;" prop="name">
              <MDinput v-model="postForm.name" :maxlength="100" name="name" required>
                课程名称
              </MDinput>
            </el-form-item>

            <el-form-item :label="$t('table.modular')">
              <el-cascader ref="plateCascader" v-model="postForm.modularid" :options="options" :props="props" clearable style="width: 420px" @change="setAncestor" />
            </el-form-item>
            <br>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="9">
                  <el-form-item label-width="40px" label="作者" class="postInfo-container-item">
                    <el-select v-model="author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="搜索" @change="changeId">
                      <el-option v-for="(item, key) in userListOptions" :key="key" :label="item" :value="key" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="9">
                  <el-form-item label-width="120px" label="关键字" class="postInfo-container-item">
                    <el-select v-model="ids" multiple clearable style="width: 250px" class="filter-item" placeholder="请选择关键字">
                      <el-option v-for="(item, key) in labelOptions" :key="key" :label="item" :value="key" />
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
            </div>

            <el-form-item label="价格">
              <div class="slider-demo-block">
                <el-slider v-model="postForm.price" :max="100000" :format-tooltip="formatTooltip" style="width: 80%"></el-slider>
                <el-input-number v-model="price" :precision="2" :step="0.01" :min="0" :max="1000" style="width: 150px" @change="setPrice" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="video" style="margin-bottom: 30px">
          <div style="border: 1px solid black">
            <el-button @click="uploadVideo">上传</el-button>
          </div>
        </el-form-item>

        <el-form-item prop="introduction" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.introduction" :height="400" />
        </el-form-item>

        <el-form-item style="margin-bottom: 40px;" label-width="40px" label="封面">
          <div class="my-upload">
            <div v-if="showImage" class="my-cover" @click="toggleShow">
              <div style="margin-bottom: 16px">
                <svg-icon icon-class="coveimage" style="width: 50px; height: 44px" />
              </div>
              <div>请选择封面图</div>
            </div>
            <div v-if="!showImage" class="my-img-div" v-on:mouseover="showIcon = !showIcon" v-on:mouseout="showIcon = !showIcon">
              <img :src="image" class="my-image" :class="{'my-image-hover' : showIcon}" >
              <div :class="{'my-hidden' : !showIcon}" style="cursor: pointer" @click="toggleShow">
                <svg-icon icon-class="edit16" class-name='my-edit16' />
              </div>
              <div :class="{'my-hidden' : !showIcon}" style="cursor: pointer" @click="showImage = ! showImage, postForm.cover = ''">
                <svg-icon icon-class="delete16" class-name='my-edit16' style="left: 184px" />
              </div>
            </div>
          </div>
          <my-upload
            field="img"
            :model-value.sync="show"
            img-format="png"
            :width="656"
            :height="369"
            :noCircle="true"
            :noSquare="true"
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
import { fetchCourse, fetchLabel, createCourse, updateCourse } from '@/api/course'
import { searchUser } from '@/api/remote-search'
import { uploadCourseCover } from '@/api/upload'
import Bus from '@/utils/bus';

const defaultForm = {
  id: undefined,
  name: '',
  userid: '',
  cover: '',
  modularid: '',
  labelid: '',
  status: 'draft',
  price: 0
}

export default {
  name: 'CourseAdd',
  components: { Tinymce, MDinput, Upload, Sticky, MyUpload },
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
    const formatTooltip = (val) => {
      this.price = val / 100
      return val / 100
    }
    return {
      postForm: Object.assign({}, defaultForm),
      formatTooltip,
      price: 0,
      ids: [],
      author: '',
      loading: false,
      userListOptions: [],
      rules: {
        name: [{ validator: validateRequire }],
        introduction: [{ validator: validateRequire }]
      },
      labelOptions: null,
      tempRoute: {},
      image: '',
      imgDataUrl: {
        base64: '' // the datebase64 url of created image
      },
      props: {
        expandTrigger: 'hover',
      },
      options: null,
      show: false,
      showImage: true,
      showIcon: false
    }
  },
  computed: {
    // // 文件选择后的回调
    // Bus.$on('fileAdded', () => {
    //     console.log('文件已选择')
    // }),
    // // 文件上传成功的回调
    // Bus.$on('fileSuccess', () => {
    //     console.log('文件上传成功')
    // }),
    lang() {
      return this.$store.getters.language
    },
  },
  created() {
    if (this.$route.params.id > 0) {
      this.fetchData(this.$route.params.id)
    }
    this.fetchLabel()
  },
  methods: {
    uploadVideo() {
      // 打开文件选择框
      Bus.$emit('openUploader', {
        id: '1111'  // 传入的参数
      })
    },
    fetchData(id) {
      fetchCourse(id).then(response => {
        this.postForm = response.data

        // just for test
        this.image = response.data.cover
        this.ids = response.data.labelid.split(',')
        this.author = response.data.author

        if(this.image !== '' && this.image !== null) {
          this.showImage = false
        }

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
        this.options = response.data.optionModular
        this.labelOptions = response.data.allLabel
      })
    },
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(base64, field) {
      this.imgDataUrl.base64 = base64
      uploadCourseCover(this.imgDataUrl).then(response => {
        this.image = response.data.imagePath
        this.postForm.cover = response.data.imagePath
        this.showImage = false
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Course'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Course'
      document.title = `${title} - ${this.postForm.id}`
    },
    setAncestor() {
      this.postForm.modularid = this.postForm.modularid[this.postForm.modularid.length - 1]
    },
    setPrice() {
      this.postForm.price = this.price * 100
    },
    changeId() {
      this.postForm.userid = this.author
    },
    submitForm() {
      var idss = ','
      for (const id in this.ids) {
        idss += this.ids[id] + ','
      }
      this.postForm.labelid = idss
      if (this.postForm.userid === '' || this.postForm.labelid === '' || this.postForm.modularid === '' || this.postForm.labelid === ',') {
        this.$message({
          message: '作者、关键字和模块为必传项',
          type: 'error'
        })
        return
      }
      if (this.$route.params.id > 0) {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.postForm.status = '已发布'
            updateCourse(this.postForm).then(() => {
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
            createCourse(this.postForm).then(() => {
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
      if (this.postForm.name.length === 0) {
        this.$message({
          message: '请填写课程名称',
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
      if (this.postForm.userid === '' || this.postForm.labelid === '' || this.postForm.modularid === '' || this.postForm.labelid === ',') {
        this.$message({
          message: '作者和标签为必传项',
          type: 'error'
        })
        return
      }
      if (this.$route.params.id > 0) {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            updateCourse(this.postForm).then(() => {
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
            createCourse(this.postForm).then(() => {
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

.my-upload {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: #333;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: 'tnum';
  outline: 0;
}

.my-img-div {
  width: 328px;
  height: 184px;
  position: relative;
}

.my-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  border: 1px dashed #d6d6d6;
  border-radius: 4px;
  width: 328px;
  height: 184px;
}

.my-image {
  width: 100%;
  height: 100%;
}

.my-image-hover {
  filter: brightness(.5);
}

.my-edit16 {
  width: 32px;
  height: 32px;
  position: absolute;
  left: 112px;
  top: 78px;
  filter: invert(100%) sepia(5%) saturate(530%) hue-rotate(193deg) brightness(114%) contrast(100%);
}

.my-hidden {
  display: none;
}

.slider-demo-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin-left: 70px;
}
</style>
