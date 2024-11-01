
<template>
  <div>
    <div class="container-nav">
      <Nav></Nav>
    </div>

    <div class="container-page">
<!--      轮播图-->
      <Carousel class="carousel" :bannerActivityList="bannerActivityList"></Carousel>
      
<!--      推荐活动卡片-->
      <ActivityCard :recommendActivityList="recommendActivityList">
      </ActivityCard>
      
<!--      活动类型筛选-->
      <ul class="container-type">
          <li @click="choseType(item)" v-for="(item,index) in activityType" :key="index"
              :class="{'is-activated':activatedType===item}">{{ item }}</li>
      </ul>
      
<!--      活动列表-->
      <ul class="container-activitylist">
        <li v-for="(item,index) in activityList" :key="item.id" >
          <ActivityListItem :activity="item">
          </ActivityListItem>
        </li>
      </ul>
    </div>

    <Bottom></Bottom>
  </div>
  

</template>

<script setup name="Home">
import {onMounted, reactive, ref} from 'vue'
import Nav from './navigation/Nav.vue';
import Carousel from './components/Carousel.vue';
import Bottom from './navigation/Bottom.vue';
import ActivityCard from './activity/ActivityCard.vue';
import ActivityListItem from '@/components/activity/ActivityListItem.vue';

import { inject } from 'vue'
const axios = inject('axios')

let activatedType=ref('全部活动');
let searchString=ref('')
const activityType=['全部活动','线下活动','线上活动'];
let recommendActivityList=ref([]);
let bannerActivityList=ref([]);
let activityList=ref([]);




function choseType(item){ // 点击切换活动类别
  activatedType.value=item
}

function getActivity(firstMount,){
  axios({
    url:'/api/activity/getAllActivity',
    method: 'get',
    params:{
      'pageNo':0,
      'pageSize':20,
      'type':activatedType.value,
      'searchString':searchString.value,
    }

  }).then(function (result){
    activityList.value=result.data.data.records;
    if(firstMount){
      bannerActivityList.value = activityList.value.slice(2, 6);
      recommendActivityList.value = activityList.value.slice(6, 10);
    }

  }).catch(function (e) {
    setTimeout(()=>{
      console.error('请求失败，重新发送中...');
      getActivity();
    },10000)
  })
}

onMounted(()=>{
  getActivity(true,)
})

</script>






<style scoped>
.container-page{
  width: 1400px;
  margin:0 auto;
}
.container-nav{
  height: 88px;
}

.carousel{
  margin-top: 30px;
}


.container-type{
    list-style:none;

}

.container-type li{
  margin-top: 60px;
  cursor: pointer;
  font-size: 22px;
  margin-right: 40px;
  color: #828282;
  font-family: MiSans-Regular;
  text-decoration: none;
  display: inline-block;
}

.is-activated {
    color: rgba(79, 79, 79, 1) !important;
    font-family: MiSans-Medium !important;
    font-weight: 500 !important;
    font-size: 22px;
    position: relative; /* 确保伪元素相对于文字定位 */
    padding-bottom: 14px; /* 为下划线预留空间 */
}

.is-activated::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 24px; /* 下划线的长度，可以根据需要调整 */
  height: 4px; /* 下划线的厚度 */
  border-radius: 2px;
  background-color: rgba(79, 79, 79, 1); /* 下划线的颜色 */
}

.container-activitylist{
  list-style: none;
  margin-top: 20px;
}
.container-activitylist li{
  margin-bottom: 30px;
}
</style>
