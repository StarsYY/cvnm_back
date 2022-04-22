<template>
  <div class="app-container-user-add">
    <el-form ref="form" :model="dataAdd" :rules="rules">
      <el-input v-model="dataAdd.uid" type="hidden" />
      <el-input v-model="dataAdd.portrait" type="hidden" />

      <div v-if="!edit">
        <pan-thumb :image="image" style="margin-left: 100px" />
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
      </div>
      <el-form-item v-if="!edit" style="margin-left: 40px; margin-top: 40px" label-width="90px" label="昵称:" prop="nickname">
        <el-input v-model="dataAdd.nickname" maxlength="20" type="text" class="cs-text" autosize placeholder="请输入昵称" />
        <span v-show="nicknameShortLength" class="word-counter">{{ nicknameShortLength }}words</span>
      </el-form-item>
      <el-form-item v-if="!edit" style="margin-left: 40px; margin-top: 15px" label-width="90px" label="密码:" prop="password">
        <el-input v-model="dataAdd.password" minlength="6" maxlength="32" type="password" class="cs-text" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item style="margin-left: 40px; margin-top: 15px" label-width="145px" label="是否为管理员:">
        <el-switch
          v-model="isadmin"
          inline-prompt
          active-text="是"
          inactive-text="否"
          @change="setIsAdmin"
        />
      </el-form-item>
      <el-form-item v-if="!edit" style="margin-left: 40px; margin-top: 15px" label-width="90px" label="简介:">
        <el-input v-model="dataAdd.summary" maxlength="250" :rows="1" type="textarea" class="cs-textarea" autosize placeholder="请输入简介" />
        <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
      </el-form-item>
      <el-form-item v-if="!edit" style="margin-left: 40px; margin-top: 15px" label-width="90px" label="性别:" size="small">
        <el-radio-group v-model="dataAdd.sex">
          <el-radio-button label="女"></el-radio-button>
          <el-radio-button label="男"></el-radio-button>
          <el-radio-button label="保密"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!edit" style="margin-left: 40px; margin-top: 15px" label-width="90px" label="姓名:">
        <el-input v-model="dataAdd.name" maxlength="20" type="text" class="cs-text" autosize placeholder="请输入姓名" />
        <span v-if="dataAdd.name.length > 0" class="word-counter">{{ dataAdd.name.length }}words</span>
      </el-form-item>
      <el-form-item v-if="!edit" style="margin-left: 40px; margin-top: 15px" label-width="90px" label="手机号:" prop="phone">
        <el-input v-model="dataAdd.phone" type="text" class="cs-text" autosize placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item v-if="!edit" style="margin-left: 40px; margin-top: 15px" label-width="90px" label="邮箱:" prop="email">
        <el-input v-model="dataAdd.email" type="text" class="cs-text" autosize placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item v-if="dataAdd.uid > 0" style="margin-left: 40px; margin-top: 15px" label-width="90px" label="封号时间:">
        <el-date-picker
          v-model="bantime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="setTime"
        >
        </el-date-picker>
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
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ]
      },
      rules: {
        nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { pattern: /^\S{6,32}$/, message: '密码长度位 6-32 位', trigger: 'blur' },
          { pattern: /^\w+$/, message: '密码只能由数字、字母、下划线组成', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '手机号不合法', trigger: 'blur' }
        ],
        email: [
          { pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱不合法', trigger: 'blur' }
        ]
      },
      list: null,
      dataAdd: {
        uid: '',
        nickname: '',
        password: '',
        isadmin: 0,
        summary: '',
        portrait: '',
        sex: '女',
        name: '',
        phone: '',
        email: '',
        starttime: '',
        finaltime: ''
      },
      isadmin: false,
      bantime: [],
      image: '',
      imgDataUrl: {
        base64: '' // the datebase64 url of created image
      },
      show: false,
      edit: false
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
      this.edit = true
      this.getUser()
    }
  },
  methods: {
    getUser() {
      fetchUser(this.$route.params.uid).then(response => {
        this.dataAdd = response.data
        this.image = response.data.portrait

        if(response.data.starttime !== null && response.data.starttime !== '') {
          this.bantime[0] = response.data.starttime
          this.bantime[1] = response.data.finaltime
        }
        if(response.data.isadmin === 1) {
          this.isadmin = true
        }
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
    setTime(val) {
      var d = val[0]
      this.dataAdd.starttime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
      d = val[1]
      this.dataAdd.finaltime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    },
    setIsAdmin() {
      if(this.isadmin) {
        this.dataAdd.isadmin = 1
      } else {
        this.dataAdd.isadmin = 0
      }
    },
    Create() {
      this.$refs.form.validate(valid => {
        if (valid) {
          createUser(this.dataAdd).then(() => {
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
          updateUser(this.dataAdd).then(() => {
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

.app-container-user-add {
  padding: 20px 100px 20px 20px;
}

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
