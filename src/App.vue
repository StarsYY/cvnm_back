<template>
  <div id="app">
    <router-view />
    <global-uploader></global-uploader>
  </div>
</template>

<script>
import globalUploader from '@/components/GlobalUploader.vue'

export default {
  name: 'App',
  components: { globalUploader }
}
</script>
