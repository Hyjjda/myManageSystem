<template>
  <el-card class="mb">
    <div class="mt">
      <span class="mr title">类别:</span>
      <el-tag
        class="mr"
        :type="curTag[0] === -1 ? 'primary' : 'info'"
        @click="setCurTag(-1, 0, '')"
      >
        全部
      </el-tag>
      <el-tag
        v-for="(item, index) in types"
        :key="item"
        class="mr"
        :type="curTag[0] === index ? 'primary' : 'info'"
        @click="setCurTag(index, 0, item)"
      >
        {{ item }}
      </el-tag>
    </div>
    <div class="mt">
      <span class="mr title">级别:</span>
      <el-tag
        class="mr"
        :type="curTag[1] === -1 ? 'primary' : 'info'"
        @click="setCurTag(-1, 1, '')"
      >
        全部
      </el-tag>
      <el-tag
        v-for="(item, index) in importants"
        :key="item"
        class="mr"
        :type="curTag[1] === index ? 'primary' : 'info'"
        @click="setCurTag(index, 1, item)"
      >
        {{ item }}
      </el-tag>
    </div>
    <div class="mt">
      <span class="mr title">平台:</span>
      <el-tag
        class="mr"
        :type="curTag[2] === -1 ? 'primary' : 'info'"
        @click="setCurTag(-1, 2, '')"
      >
        全部
      </el-tag>
      <el-tag
        v-for="(item, index) in publishs"
        :key="item"
        class="mr"
        :type="curTag[2] === index ? 'primary' : 'info'"
        @click="setCurTag(index, 2, item)"
      >
        {{ item }}
      </el-tag>
    </div>

    <el-divider></el-divider>
    <div class="mt">
      <span class="title mr">已选：</span>
      <el-tag
        class="mr"
        type="success"
        closable
        v-for="item in selectList"
        :key="item"
        @close="closeTag(item.type)"
      >
        {{ item.name }}
      </el-tag>
    </div>
  </el-card>
  <el-button
    type="primary"
    class="mt mb"
    @click="updateContent"
    :disabled="selectList.length !== 3 || !editorContent"
    v-permission="'admin'"
  >
    上传内容
  </el-button>
  <el-button class="mt mb" @click="exportToHtml" :disabled="!editorContent"> 导出文档 </el-button>
  <el-card>
    <editor
      v-model="editorContent"
      id="course-description"
      placeholder="请输入内容"
      apiKey="tr0n8wlc0qlv87ehat8yvt091c8mqes11uci3i8ex31hfb5i"
      :init="{
        promotion: false, // 关闭推广信息
        branding: false, // 关闭底部品牌信息
        language: 'zh_CN',
        language_url: 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/langs/zh_CN.js',
        plugins:
          'advlist anchor autolink charmap code fullscreen help image insertdatetime link lists media preview searchreplace table visualblocks wordcount',
        toolbar:
          'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        height: 500,
      }"
    />
  </el-card>
</template>

<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'
import { getTypeApi } from '@/apis/invest'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
const types = ref<string[]>([])
const importants = ref<string[]>([])
const publishs = ref<string[]>([])
const editorContent = ref<string>('')
interface selectType {
  name: string
  type: number
}
const getTypeList = async () => {
  const {
    data: { important, type, publish },
  } = await getTypeApi()

  types.value = type
  importants.value = important
  publishs.value = publish
}
const curTag = ref<number[]>([-1, -1, -1])
const setCurTag = (idx: number, type: number, name: string) => {
  if (idx === -1) {
    selectList.value = selectList.value.filter((item: selectType) => item.type !== type)
  } else {
    const index = selectList.value.findIndex((item: selectType) => item.type === type)
    if (index === -1) {
      selectList.value.push({ name: name, type: type })
    } else {
      selectList.value[index]!.name = name
    }
  }
  curTag.value[type] = idx
}

const selectList = ref<selectType[]>([])
const closeTag = (type: number) => {
  selectList.value = selectList.value.filter((item: selectType) => item.type !== type)
  curTag.value[type] = -1
}

const exportToHtml = () => {
  const blob = new Blob([editorContent.value], { type: 'text/html' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'document.html'
  link.click()
  URL.revokeObjectURL(link.href)
}
const updateContent = () => {
  console.log('类别：', selectList.value, '内容：' + editorContent.value)
  ElMessage({
    type: 'success',
    message: '发布成功',
  })
  curTag.value = [-1, -1, -1]
  selectList.value = []
  editorContent.value = ''
}
onMounted(() => getTypeList())
</script>

<style scoped lang="less">
.title {
  display: inline-block;
  width: 50px;
  font-size: 16px;
  font-weight: bold;
}
.el-tag {
  cursor: pointer;
}
</style>
