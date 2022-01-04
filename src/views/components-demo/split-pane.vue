<template>
  <div class="components-container">
    <split-pane split="vertical" @resize="resize">
      <template slot="paneL">
        <div class="left-container" />
      </template>
      <template slot="paneR">
        <split-pane split="horizontal">
          <template slot="paneL">
            <div class="top-container" />
          </template>
          <template slot="paneR">
            <div class="bottom-container" />
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'

export default {
  name: 'SplitpaneDemo',
  components: { splitPane },
  methods: {
    resize() {
      console.log('resize')
    }
  }
}
</script>

<style  scoped>
  .components-container {
    position: relative;
    height: 100vh;
  }

  .left-container {
    border: 1px #F38181 solid;
    height: 100%;
  }

  .right-container {
    border: 1px #FCE38A solid;
    height: 200px;
  }

  .top-container {
    border: 1px #FCE38A solid;
    width: 100%;
    height: 100%;
  }

  .bottom-container {
    width: 100%;
    border: 1px #95E1D3 solid;
    height: 100%;
  }
</style>
