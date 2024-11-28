<template>
  <div class="container" style="width:1400px; margin-top:40px">
    <div style="margin-right:auto; margin-left:0; color: #4f4f4f; font-weight: 500; font-size: 22px; font-family: MiSans-Medium">
      推荐活动
    </div>
    <ul class="container-card">
      <li class="card" v-for="(item, index) in formattedActivities" :key="item.id" @click="toDetail(item.id)">
        <img :src="item.formattedCover" />
        <div class="text-title">{{ item.title }}</div>
        <div class="container-region-date">
          <span class="text-region">{{ item.formattedRegion }}</span>
          <span class="text-date">{{ item.formattedDate }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup name="ActivityCard">
import {computed, toRaw} from 'vue';
import {useRouter} from "vue-router";

const props = defineProps(['recommendActivityList']);
const router=useRouter()
// 计算属性: 格式化活动列表中的每一项
const formattedActivities = computed(() => {
  return props.recommendActivityList.map(item => ({
    ...item,
    // 将 cover 中的第一个 "/" 替换为 "/file/"
    formattedCover: item.cover.replace('/', '/file/'),

    formattedRegion: item.regions.slice(0, 2).map(region => region.regionName).join('、') + (item.regions.length > 2 ? '...' : ''),

    // 格式化日期为 "MM.DD - MM.DD"
    formattedDate: item.begin.replace(/-/g, '.').slice(5) + '-' + item.end.replace(/-/g, '.').slice(5)
  }));
});

function toDetail(itemId){
  router.push(`/activity-detail/${itemId}`);
}

</script>


<style scoped>
.container ul{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    list-style: none;
}
.container-card{
    margin-top: 20px;
}
.card{
    cursor:pointer;
    display: inline-block;
    text-decoration: none;
    width: 320px;
    height: 280px;
    border-radius: 8px;
    background: #ffffff;
}

.card img{
    width: 320px;
    height: 192px;
    object-fit: cover;
    object-position: top;
    border-radius: 8px 8px 0 0;
}

.text-title{
    font-family: MiSans-Demibold;
    max-width: 296px;
    margin: 12px;
    font-size: 20px;
    color: #4F4F4F;
    font-weight: bold;
}

.container-region-date{
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 16px;
}

.text-region{
    max-width: 300px;
    margin-left: 12px;
    color: #ababab;
}

.text-date{
    max-width:100px;
    margin-right: 12px;
    line-height: 16px;
    color: #ababab;
    font-weight:normal;
}


</style>