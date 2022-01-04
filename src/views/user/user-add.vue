<template>
  <div class="app-container">
    <el-form ref="form" :model="dataAdd" :rules="rules">
      <el-input v-model="dataAdd.uid" type="hidden" />
      <el-input v-model="dataAdd.portrait" type="hidden" />

      <pan-thumb :image="image" style="margin-left: 40px" />
      <el-button type="primary" icon="el-icon-upload" style="margin-left: 40px" @click="toggleShow">
        Change Portrait
      </el-button>
      <my-upload
        field="img"
        :width="110"
        :height="110"
        :model-value.sync="show"
        img-format="png"
        @crop-success="cropSuccess"
      />
      <el-form-item style="margin-left: 40px; margin-top: 40px" label-width="70px" label="Nickname:">
        <el-input v-model="dataAdd.nickname" maxlength="50" type="text" class="cs-text" autosize placeholder="Please enter the nickname" />
        <span v-show="nicknameShortLength" class="word-counter">{{ nicknameShortLength }}words</span>
      </el-form-item>
      <el-form-item style="margin-left: 40px" label-width="70px" label="Password:">
        <el-input v-model="dataAdd.password" type="password" class="cs-text" placeholder="Please enter the password" />
        <span v-show="passwordShortLength" class="word-counter">{{ passwordShortLength }}words</span>
      </el-form-item>
      <el-form-item style="margin-left: 40px" label-width="70px" label="Summary:">
        <el-input v-model="dataAdd.summary" maxlength="250" :rows="1" type="textarea" class="cs-textarea" autosize placeholder="Please enter the summary" />
        <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
      </el-form-item>

      <el-form-item style="margin-left: 40px; padding-top: 15px">
        <el-button v-if="dataAdd.uid>'0'" type="primary" @click="Update">Update</el-button>
        <el-button v-else type="primary" @click="Create">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createUser, updateUser, fetchUser } from '@/api/user'
import { uploadUserPortrait } from '@/api/upload'
import MyUpload from 'vue-image-crop-upload'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'UserAdd',
  components: { MyUpload, PanThumb },
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
        nickname: [{ validator: validateRequire }],
        password: [{ validator: validateRequire }]
      },
      list: null,
      dataAdd: {
        uid: '',
        nickname: '',
        password: '',
        summary: '',
        portrait: ''
      },
      image: '',
      imgDataUrl: {
        base64: '' // the datebase64 url of created image
      },
      show: false
    }
  },
  computed: {
    nicknameShortLength() {
      return this.dataAdd.nickname.length
    },
    passwordShortLength() {
      return this.dataAdd.password.length
    },
    contentShortLength() {
      return this.dataAdd.summary.length
    }
  },
  created() {
    if (this.$route.params.uid > 0) {
      this.getUser()
    }
  },
  methods: {
    getUser() {
      fetchUser(this.$route.params.uid).then(response => {
        console.log(response.data)
        this.dataAdd = response.data
        this.image = response.data.portrait
      })
    },
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(base64, field) {
      this.imgDataUrl.base64 = base64
      uploadUserPortrait(this.imgDataUrl).then(response => {
        this.image = response.data.imagePath
        this.dataAdd.portrait = response.data.imagePath
        console.log(response.data)
      })
    },
    Create() {
      if (this.dataAdd.nickname.length === 0 || this.dataAdd.password.length === 0) {
        this.$message({
          message: '请填写必要的用户名和密码',
          type: 'warning'
        })
        return
      }
      createUser(this.dataAdd).then(() => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    Update() {
      if (this.dataAdd.nickname.length === 0 || this.dataAdd.password.length === 0) {
        this.$message({
          message: '请填写必要的用户名和密码',
          type: 'warning'
        })
        return
      }
      updateUser(this.dataAdd).then(() => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
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

.cs-textarea ::v-deep {
  textarea {
    padding-right: 50px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.cs-text ::v-deep {
  .el-input__inner {
    padding-right: 50px;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
