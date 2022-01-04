<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      Tag：{{ this.value }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-radio-group v-model="tag" style="padding: 10px;">
        <el-radio v-for="item in tagOptions" :key="item.key" :label="item.key">
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
      default: 'Default',
      type: String
    }
  },
  data() {
    return {
      tagOptions: [
        { key: 'Default', name: 'Default' },
        { key: 'Essence', name: 'Essence' },
        { key: 'Recommend', name: 'Recommend' }
      ]
    }
  },
  computed: {
    tag: {
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
