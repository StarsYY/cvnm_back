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
      default: 'Original'
    }
  },
  data() {
    return {
      typeOptions: [
        { key: 'Original', name: 'Original' },
        { key: 'Translation', name: 'Translation' },
        { key: 'Reprint', name: 'Reprint' }
      ]
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
