<template>
  <div class="app-container">
    <el-form ref="form" :model="dataAdd" :rules="rules">
      <el-input v-model="dataAdd.id" type="hidden" />

      <pan-thumb :image="image" style="margin-left: 40px" />
      <el-button type="primary" icon="el-icon-upload" style="margin-left: 40px" @click="show = !show">
        Change Avatar
      </el-button>
      <my-upload
        field="img"
        :width="110"
        :height="110"
        :model-value.sync="show"
        img-format="png"
        @crop-success="cropSuccess"
      />
      <el-form-item style="margin-left: 40px;" prop="username">
        <MDinput v-model="dataAdd.username" :maxlength="100" name="name" required>
          Username
        </MDinput>
      </el-form-item>
      <el-form-item style="margin-left: 40px;" prop="password">
        <MDinput v-model="dataAdd.password" type="password" :maxlength="100" name="pass" required>
          Password
        </MDinput>
      </el-form-item>
      <el-form-item style="margin-left: 40px; padding-top: 15px" label="Summary:">
        <el-input v-model="dataAdd.introduction" maxlength="250" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
        <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
      </el-form-item>

      <el-form-item style="margin-left: 40px; padding-top: 15px">
        <el-button v-if="dataAdd.id>'0'" type="primary" @click="Update">Update</el-button>
        <el-button v-else type="primary" @click="Create">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createAdmin, updateAdmin, fetchAdmin } from '@/api/admin'
import MDinput from '@/components/MDinput'
import PanThumb from '@/components/PanThumb'
import { uploadAdminAvatar } from '@/api/upload'
import MyUpload from 'vue-image-crop-upload'

export default {
  name: 'AdminAdd',
  components: { MDinput, MyUpload, PanThumb },

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
    return {
      rules: {
        username: [{ validator: validateRequire }],
        password: [{ validator: validateRequire }]
      },
      list: null,
      dataAdd: {
        id: '',
        username: '',
        password: '',
        introduction: '',
        avatar: ''
      },
      image: '',
      imgDataUrl: {
        base64: '' // the datebase64 url of created image
      },
      show: false
    }
  },
  computed: {
    contentShortLength() {
      return this.dataAdd.introduction.length
    }
  },
  created() {
    if (this.$route.params.id > 0) {
      this.getUser()
    }
  },
  methods: {
    getUser() {
      fetchAdmin(this.$route.params.id).then(response => {
        console.log(response.data)
        this.dataAdd = response.data
        this.image = response.data.avatar
      })
    },
    cropSuccess(base64, field) {
      this.imgDataUrl.base64 = base64
      uploadAdminAvatar(this.imgDataUrl).then(response => {
        this.image = response.data.imagePath
        this.dataAdd.avatar = response.data.imagePath
      })
    },
    Create() {
      this.$refs.form.validate(valid => {
        if (valid) {
          createAdmin(this.dataAdd).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    Update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateAdmin(this.dataAdd).then(() => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.word-counter {
  width: 40px;
  position: absolute;
  right: 10px;
  color: #bfcbd9;
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
