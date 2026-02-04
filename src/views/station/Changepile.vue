<template>
  <el-card>
    <el-select style="width: 180px" placeholder="请选择站点" v-model="value" filterable>
      <el-option
        v-for="item in stationList"
        :key="item.id"
        :value="item.name"
        :label="item.name"
      ></el-option>
    </el-select>
  </el-card>
  <el-card class="mt">
    <el-radio-group size="large" v-model="radio" @change="handleChange">
      <el-radio-button :label="`全部${allCount}`" :value="0" />
      <el-radio-button :label="`空闲中 ${checkCount(1)}`" :value="1" />
      <el-radio-button :label="`充电中 ${checkCount(2)}`" :value="2" />
      <el-radio-button :label="`链接中 ${checkCount(3)}`" :value="3" />
      <el-radio-button :label="`排队中 ${checkCount(4)}`" :value="4" />
      <el-radio-button :label="`已预约 ${checkCount(5)}`" :value="5" />
      <el-radio-button :label="`故障 ${checkCount(6)}`" :value="6" />
    </el-radio-group>
  </el-card>

  <el-card class="mt">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in copyData" :key="item.id">
        <div class="item">
          <div class="pic">
            <p v-if="item.status === 1">空闲中</p>
            <p v-else-if="item.status === 2">充电中</p>
            <p v-else-if="item.status === 3">链接中</p>
            <p v-else-if="item.status === 4">排队中</p>
            <p v-else-if="item.status === 5">已预约</p>
            <p v-else-if="item.status === 6">故障</p>
            <img
              :src="item.status === 1 ? free : item.status === 6 ? outline : ing"
              width="100px"
            />
            <p v-if="item.status === 2">{{ item.percent }}</p>
            <p v-else>--%</p>
          </div>
          <div class="info">
            <h3>{{ item.id }}</h3>
            <hr />
            <p>功率：{{ item.power }}</p>
            <p>电压：{{ item.voltage }}</p>
            <p>电流：{{ item.current }}</p>
            <p>温度：{{ item.tem }}</p>
          </div>
        </div>
        <div class="btn mt">
          <div>
            <p class="fl ml">暂无预警</p>
            <div class="fr mr">
              <el-button size="small">维修记录</el-button>

              <el-popover placement="right" :width="300" trigger="click" title="最新5条记录">
                <template #reference>
                  <el-button size="small" type="primary">使用记录</el-button>
                </template>
                <el-timeline>
                  <el-timeline-item
                    v-for="j in item.record"
                    :timestamp="j.time"
                    :key="j.time"
                    type="primary"
                    hollow
                  >
                    {{ j.msg }}
                  </el-timeline-item>
                </el-timeline>
              </el-popover>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
//图片导入
import free from '@/assets/free.png'
import outline from '@/assets/outline.png'
import ing from '@/assets/ing.png'

import { getPipeApi } from '@/apis/station'
import { computed, onMounted, ref, watch } from 'vue'
const value = ref<string>('')
const radio = ref<number>(0)
const stationList = ref<any>([])
const dataList = ref<any>([])
const copyData = ref<any>([])
const getPipeList = async () => {
  const { data } = await getPipeApi()
  stationList.value = data
  dataList.value = data[0].list
  copyData.value = dataList.value
}

function checkCount(num: number): number {
  return dataList.value.filter((item: { status: number }) => item.status === num).length
}
const allCount = computed(
  () =>
    checkCount(1) + checkCount(2) + checkCount(3) + checkCount(4) + checkCount(5) + checkCount(6),
)

const handleChange = () => {
  copyData.value = dataList.value
  if (radio.value) {
    copyData.value = copyData.value.filter((item: { status: any }) => item.status === radio.value)
  }
}
watch(value, () => {
  const res = stationList.value.filter((item: { name: string }) => item.name === value.value)
  dataList.value = res[0].list
  copyData.value = dataList.value
})

onMounted(() => getPipeList())
</script>

<style lang="less" scoped>
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border-radius: 10px 10px 0 0;
  background-color: #d9dcdd;
  padding: 20px;
  margin-top: 20px;
  .pic {
    p {
      width: 80px;
      color: #41d0bf;
      text-align: center;
      margin-bottom: 10px;
    }
  }
  .info {
    margin-left: 35px;
    color: #999;
    line-height: 30px;
    font-size: 16px;
  }
}
.btn {
  background-color: #c7e1f2;
  height: 50px;
  line-height: 50px;
}
</style>
