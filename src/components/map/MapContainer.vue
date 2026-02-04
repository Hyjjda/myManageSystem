<template>
  <div id="container"></div>
</template>
<script lang="ts" setup>
import icon from '@/assets/flashIcon.png'
import stationPic from '@/assets/station.jpg'
import { getMapList } from '@/apis/map'
import AMapLoader from '@amap/amap-jsapi-loader'
import { onMounted, ref, onUnmounted } from 'vue'
const markers = ref([])
let map: any = null
onMounted(() => {
  AMapLoader.load({
    key: '612a653c5f66cd3cee94aba80b2a77c8', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        viewMode: '2D', // 是否为3D地图模式
        zoom: 5, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      })

      //自定义加点
      getMapList().then((res) => {
        //创建 信息窗体 实例
        const infoWindow = new AMap.InfoWindow({
          anchor: 'top-left',
          offset: new AMap.Pixel(16, -45),
        })
        markers.value = res.data
        markers.value.forEach((item: any) => {
          const marker = new AMap.Marker({
            position: item.position,

            icon: icon, //添加 icon 图标 URL
            title: item.title,
          })

          marker.on('click', () => {
            infoWindow.setContent(`
              <div style='display:flex;padding:10px;align-item:center'>
                <div>
                  <img src='${stationPic}' width='200px'/>
                </div>
                <div style='margin-left:20px;width:200px;line-height:30px'>
                <h3>${item.title}</h3>
                <p>数量：${item.count}</p>
                <p>状态：<span style='color:blue'>${item.status === 1 ? '使用中' : '维护中'}</span></p>
                </div>
              </div>
            `)
            infoWindow.open(map, marker.getPosition())
          })
          map.add(marker)
        })
      })
    })
    .catch((e) => {
      console.log(e)
    })
})

onUnmounted(() => {
  map?.destroy()
})
</script>

<style scoped lang="less">
#container {
  width: 100%;
  height: 80vh;
}
</style>
