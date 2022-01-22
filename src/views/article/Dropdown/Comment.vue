<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      Type：{{ this.value }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-radio-group v-model="type" style="padding: 10px;">
        <el-radio v-for="item in typeOptions" :key="item.key" :label="item.key">
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: String,
      default: '原创'
    }
  },
  data() {
    return {
      typeOptions: [
        { key: '原创', name: '原创' },
        { key: '转载', name: '转载' },
        { key: '翻译', name: '翻译' },
        { key: '问题求助', name: '问题求助' },
        { key: '行业动态', name: '行业动态' },
        { key: '分享', name: '分享' },
        { key: '解决方案', name: '解决方案' },
        { key: '改进建议', name: '改进建议' }
      ],
    }
  },
  computed: {
    type: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
