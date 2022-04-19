<template>
  <uploader
    ref="uploaderRef"
    :options="options"
    class="uploader-example"
    @file-success="onFileSuccess"
    @file-added="filesAdded"
    @file-error="onFileError"
    :file-status-text="fileStatusText"
  >
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p>将视频文件拖放到此处或选择视频文件进行上传</p>
      <uploader-btn :attrs="attrs">选视频文件</uploader-btn>
      <!-- <uploader-btn :directory="true" :attrs="attrs">选择文件夹</uploader-btn> -->
    </uploader-drop>
    <uploader-list></uploader-list>
  </uploader>
</template>

<script>
import SparkMD5 from 'spark-md5'
import { uploadCourseVideo } from '@/api/upload'

export default {
  data () {
    return {
      fileList: [],
      chunkFileDto: {
        identifier: '',
        filename: '',
        totalChunks: ''
      },
      options: {
        target: '/adm/course/upload/video', // 目标上传 URL
        chunkSize: 1024*1024*2, // 分块大小
        simultaneousUploads: 3, //并发上传数 ssacsacasc
        fileParameterName: "file", // 上传文件时文件的参数名，默认file
        maxChunkRetries: 3, // 最大自动失败重试上传次数
        testChunks: true, // 是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function (chunk, message) {
          const objMessage = JSON.parse(message)
          if (objMessage.skipUpload) {
            return true
          }

          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
        }
      },
      statusTextMap: {
        success: '上传成功',
        error: '上传失败',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
      attrs: {
        // accept: ['.tif', '.tiff'] // 接受的文件类型
        accept: '.mp4'
      },
      // 将不同的状态对应文字
      fileStatusText: (status, response) => {
        return this.statusTextMap[status]
      }
    }
  },
  methods: {
    onFileSuccess (rootFile, file, response, chunk) {
      var obj = JSON.parse(response)
      if(obj.data.merge) {
        console.log("文件需要合并操作")
        this.chunkFileDto.identifier = file.uniqueIdentifier
        this.chunkFileDto.filename = file.name
        this.chunkFileDto.totalChunks = chunk.offset + 1
        uploadCourseVideo(this.chunkFileDto).then(response => {
          console.log("文件上传成功")
          this.fileList.splice(0, 0, response.data)
        })
      } else {
        console.log("文件上传成功")
      }
    },
    sendUploaderToCourseAdd() {
      return this.fileList;
    },
    onFileError (rootFile, file, response, chunk) {
      // 文件上传失败的回调
      console.log(rootFile, file, response, chunk)
      this.$emit('onFileError')
    },
    computeMD5 (file) {
      const loading = this.$loading({
        lock: true,
        text: '正在计算文件大小',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const fileReader = new FileReader()
      const time = new Date().getTime()
      const blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      file.pause()

      loadNext()

      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          this.$nextTick(() => {
            console.log('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
          })
        } else {
          const md5 = spark.end()
          loading.close()
          this.computeMD5Success(md5, file)
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }
      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        loading.close()
        file.cancel()
      }

      function loadNext () {
        const start = currentChunk * chunkSize
        const end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
    computeMD5Success (md5, file) {
      file.uniqueIdentifier = md5 // 把md5值作为文件的识别码
    },
    filesAdded (file, event) {
      if (file.size / 1024 / 1024 / 1024 > 2) {
        // 文件不能大于2G
        this.form.videoUrl = ''
        this.$message.warning('文件大小不能超过2G')
        setTimeout(() => {
          this.$refs.uploaderRef.uploader.removeFile(file)
        }, 0)
        return false
      }
      this.computeMD5(file)
    }
  }
}

</script>

<style>
.uploader-example {
  width: 100%;
  padding: 15px;
  margin: auto;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}

.uploader-example .uploader-drop .uploader-btn {
  font-weight: 500;
  margin-right: 8px;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>