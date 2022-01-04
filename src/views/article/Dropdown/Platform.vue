<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      Publish：{{ this.value }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-border">
      <el-radio-group v-model="publish" style="padding: 5px 15px;">
        <el-radio v-for="item in publishOptions" :key="item.key" :label="item.key">
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
      default: 'Public',
      type: String
    }
  },
  data() {
    return {
      publishOptions: [
        { key: 'Public', name: 'Public' },
        { key: 'Private', name: 'Private' }
      ]
    }
  },
  computed: {
    publish: {
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
