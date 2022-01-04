<template>
  <div class="app-container">
    <el-form ref="form" :model="dataAdd" :rules="rules">
      <el-input v-model="dataAdd.id" type="hidden" />
      <el-input v-model="dataAdd.icon" type="hidden" />

      <pan-thumb :image="image" style="margin-left: 40px" />
      <el-button type="primary" icon="el-icon-upload" style="margin-left: 40px" @click="toggleShow">
        Change Portrait
      </el-button>
      <my-upload
        field="img"
        :width="18"
        :height="18"
        :model-value.sync="show"
        img-format="png"
        @crop-success="cropSuccess"
      />
      <el-form-item style="margin-left: 40px; margin-top: 40px" label-width="70px" label="Label:">
        <el-input v-model="dataAdd.label" maxlength="50" type="text" class="cs-text" autosize placeholder="Please enter the label" />
        <span v-show="labelShortLength" class="word-counter">{{ labelShortLength }}words</span>
      </el-form-item>
      <el-form-item style="margin-left: 40px" label-width="70px" label="Category:">
        <el-select v-model="cids" :placeholder="$t('table.categoryMap')" :popper-append-to-body="false" popper-class="select" multiple clearable>
          <el-option v-for="(item, key) in categoryOptions" :key="key" :label="item" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 40px" label-width="70px" label="Intro:">
        <el-input v-model="dataAdd.intro" maxlength="1000" :rows="1" type="textarea" class="cs-textarea" autosize placeholder="Please enter the intro" />
        <span v-show="introShortLength" class="word-counter">{{ introShortLength }}words</span>
      </el-form-item>
      <el-form-item style="margin-left: 40px" label-width="70px" label="Message:">
        <el-input v-model="dataAdd.message" maxlength="1000" :rows="1" type="textarea" class="cs-textarea" autosize placeholder="Please enter the message" />
        <span v-show="messageShortLength" class="word-counter">{{ messageShortLength }}words</span>
        <span style="padding-left: 15px; color: #E9882F">请按以下格式输入：标题1：内容1；标题2：内容2</span>
      </el-form-item>
      <el-form-item style="margin-left: 40px" label-width="70px" label="Summary:">
        <el-input v-model="dataAdd.summary" maxlength="1000" :rows="1" type="textarea" class="cs-textarea" autosize placeholder="Please enter the summary" />
        <span v-show="summaryShortLength" class="word-counter">{{ summaryShortLength }}words</span>
      </el-form-item>

      <el-form-item style="margin-left: 40px; padding-top: 15px">
        <el-button v-if="dataAdd.id>'0'" type="primary" @click="Update">Update</el-button>
        <el-button v-else type="primary" @click="Create">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createLabel, updateLabel, fetchLabel, fetchCategory } from '@/api/label'
import { uploadLabelIcon } from '@/api/upload'
import MyUpload from 'vue-image-crop-upload'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'LabelAdd',
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
        label: [{ validator: validateRequire }],
        Category: [{ validator: validateRequire }]
      },
      list: null,
      dataAdd: {
        id: '',
        label: '',
        categoryid: '',
        intro: '',
        message: '',
        summary: '',
        icon: ''
      },
      cids: [],
      categoryOptions: null,
      image: '',
      imgDataUrl: {
        base64: '' // the datebase64 url of created image
      },
      show: false
    }
  },
  computed: {
    labelShortLength() {
      return this.dataAdd.label.length
    },
    introShortLength() {
      return this.dataAdd.intro.length
    },
    messageShortLength() {
      return this.dataAdd.message.length
    },
    summaryShortLength() {
      return this.dataAdd.summary.length
    }
  },
  created() {
    this.getCategory()
    if (this.$route.params.id > 0) {
      this.getLabel()
    }
  },
  methods: {
    getCategory() {
      fetchCategory().then(response => {
        this.categoryOptions = response.data.allCategory
      })
    },
    getLabel() {
      fetchLabel(this.$route.params.id).then(response => {
        console.log(response.data)
        this.dataAdd = response.data
        this.image = response.data.icon
        this.cids = response.data.categoryid.split(',')
      })
    },
    toggleShow() {
      this.show = !this.show
    },
    cropSuccess(base64, field) {
      this.imgDataUrl.base64 = base64
      uploadLabelIcon(this.imgDataUrl).then(response => {
        this.image = response.data.imagePath
        this.dataAdd.icon = response.data.imagePath
        console.log(response.data)
      })
    },
    Create() {
      if (this.dataAdd.label.length === 0) {
        this.$message({
          message: '请填写必要的信息',
          type: 'warning'
        })
        return
      }
      var idss = ','
      for (const id in this.cids) {
        idss += this.cids[id] + ','
      }
      this.dataAdd.categoryid = idss
      createLabel(this.dataAdd).then(() => {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    Update() {
      if (this.dataAdd.label.length === 0) {
        this.$message({
          message: '请填写必要的信息',
          type: 'warning'
        })
        return
      }
      var idss = ','
      for (const id in this.cids) {
        idss += this.cids[id] + ','
      }
      this.dataAdd.categoryid = idss
      updateLabel(this.dataAdd).then(() => {
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

.select {
  width: 20px;
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
