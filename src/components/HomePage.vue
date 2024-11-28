
<script setup name="Home">
import {onMounted, reactive, ref} from 'vue'
import Nav from './navigation/Nav.vue';
import Carousel from './components/Carousel.vue';
import Bottom from './navigation/Bottom.vue';
import ActivityCard from '@/components/components/activity/ActivityCard.vue';
import ActivityListItem from '@/components/components/activity/ActivityListItem.vue';

import { inject } from 'vue'
import {ArrowDown} from "@element-plus/icons-vue";
import global from "@/global.js";

const axios = inject('axios')

let activatedType=ref('全部活动');
let searchString = ref('')
const activityType=['全部活动','线下活动','线上活动'];
let recommendActivityList=ref([]);
let bannerActivityList=ref([]);
let activityList=ref([]);
let filteredActivityList=ref([])
let restrictRegion=ref('不限地区')
let sortPattern=ref('按开始日期从近往远')
let regionList=ref([
        '不限地区',
        '华北地区',
        '华东地区',
        '华中地区',
        '华南地区',
        '西北地区',
        '西南地区',
        '东北地区'
        ])


// 接收搜索框输入
function receiveSearchString(val){
  searchString.value = val
  filteredActivityList.value = activityList.value.filter(item => item.title.includes(searchString.value))
}

// 清空搜索框
function clearSearch(){
  searchString.value = ''
}

// 点击切换活动类别
function choseType(item){
  activatedType.value = item
  if(item !== '全部活动'){
    filteredActivityList.value = activityList.value.filter(activity => {
      return activity.type === item
    })
  }else{
    filteredActivityList.value=activityList.value
  }
  if(item!=='线上活动')
    handleRegion(restrictRegion.value)
  
}


// 列表地区限定
function handleRegion(command) {
  restrictRegion.value = command
  console.log(command)
  
  if (command !== '不限地区') {
    // 从完整列表中筛选符合条件的活动
    filteredActivityList.value = activityList.value.filter(activity => {
      return activity.regions.some(region => {
        return region.regionName === command})
    })
  } else {
    // 重置为完整列表
    filteredActivityList.value = [...activityList.value]
  }
  
  // 如果当前有类型筛选，需要再次应用类型筛选
  if (activatedType.value !== '全部活动') {
    filteredActivityList.value = filteredActivityList.value.filter(activity => {
      return activity.type === activatedType.value
    })
  }
  
  // 重新应用当前的排序方式
  applySorting(sortPattern.value)
}



// 列表排序方式
function handleSort(command) {
  sortPattern.value = command
  applySorting(command)
}

// 抽取排序逻辑为独立函数
function applySorting(pattern) {
  // 根据筛选条件确定要排序的列表
  let list = restrictRegion.value === '不限地区' 
    ? [...activityList.value]
    : [...filteredActivityList.value];
  
  // 排序逻辑
  const sortingStrategies = {
    '按开始日期从远往近': (a, b) => new Date(a.begin.replace(/\./g, '-')) - new Date(b.begin.replace(/\./g, '-')),
    '按开始日期从近往远': (a, b) => new Date(b.begin.replace(/\./g, '-')) - new Date(a.begin.replace(/\./g, '-')),
    '按剩余名额': (a, b) => b.count_remain - a.count_remain,
    '按招录人数': (a, b) => b.count_max - a.count_max
  };

  // 执行排序
  if (sortingStrategies[pattern]) {
    list.sort(sortingStrategies[pattern]);
  }

  // 更新对应的列表
  if (restrictRegion.value === '不限地区') {
    activityList.value = list;
  }
  filteredActivityList.value = list;
  
}




// 获取活动列表数据
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
    console.log(global.processActivityData(result.data.data.records))
    activityList.value = global.processActivityData(result.data.data.records);
    
    if(firstMount){
      bannerActivityList.value = activityList.value.slice(2, 6);
      recommendActivityList.value = activityList.value.slice(6, 10);
      applySorting(sortPattern.value)
    }
  }).catch(function (e) {
    setTimeout(()=>{
      console.error('请求失败，重新发送中...');
      getActivity(true);
    },10000)
  })
}



// 首次加载
onMounted(()=>{
  getActivity(true,)
})

</script>

<template>
  <div>
    <div class="container-nav">
      <Nav v-model="searchString" @search-string="receiveSearchString"></Nav>
    </div>

    <div class="container-page">
      <!--      轮播图-->
      <Carousel class="carousel" :bannerActivityList="bannerActivityList" v-if="searchString===''"></Carousel>

      <!--      推荐活动卡片-->
      <ActivityCard :recommendActivityList="recommendActivityList" v-if="searchString===''">
      </ActivityCard>


      <!--     搜索结果展现-->
      <div v-if="searchString!==''" class="searchResult">
        <span style="font-family: MiSans-Demibold">"{{ searchString }}"</span>
        <span>{{filteredActivityList.length}}条搜索结果</span>
        <span @click="clearSearch"
              style="color: #409EFF;text-decoration: underline;font-family: MiSans-Demibold;cursor:pointer">取消搜索</span>
      </div>


      <!--      活动类型筛选-->
      <div class="container-filter" v-if="searchString===''">
        <ul class="container-type">
          <li @click="choseType(item)" v-for="(item,index) in activityType" :key="index"
              :class="{'is-activated':activatedType===item}">{{ item }}
          </li>
        </ul>

        <div class="sort-Filter-Container">
          <el-dropdown @command="handleRegion" v-if="activatedType!=='线上活动'">
                  <span class="el-dropdown-link" style="cursor:pointer;font-family: MiSans-Regular;font-size: 16px">
                    {{ restrictRegion }}
                    <el-icon class="el-icon--right">
                      <arrow-down/>
                    </el-icon>
                  </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    v-for="(region, index) in regionList"
                    :key="index"
                    :command="region">
                  {{ region }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>

          </el-dropdown>
          <el-dropdown @command="handleSort">
                  <span class="el-dropdown-link" style="cursor:pointer;font-family: MiSans-Regular;font-size: 16px">
                    {{ sortPattern }}
                    <el-icon class="el-icon--right">
                      <arrow-down/>
                    </el-icon>
                  </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="按开始日期从近往远">按开始日期从近往远</el-dropdown-item>
                <el-dropdown-item command="按开始日期从远往近">按开始日期从远往近</el-dropdown-item>
                <el-dropdown-item command="按剩余名额">按剩余名额</el-dropdown-item>
                <el-dropdown-item command="按招录人数">按招录人数</el-dropdown-item>
              </el-dropdown-menu>
            </template>

          </el-dropdown>
        </div>
      </div>


      <!--      活动列表-->
      <ul class="container-activitylist"
          v-if="searchString===''&& activatedType==='全部活动'&& restrictRegion==='不限地区'">
        <li v-for="(item,index) in activityList" :key="item.id">
          <ActivityListItem :activity="item" :item-type="'main'">
          </ActivityListItem>
        </li>
      </ul>


      <ul class="container-activitylist"
          v-if="searchString!==''||activatedType!=='全部活动'|| restrictRegion!=='不限地区'">
        <li v-for="(item,index) in filteredActivityList" :key="item.id">
          <ActivityListItem :activity="item">
          </ActivityListItem>
        </li>
      </ul>
    </div>

    <Bottom></Bottom>
  </div>


</template>


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

.searchResult{
  display: flex;
  margin-top: 60px;
  align-items: center;
  flex-direction: row;
  column-gap: 12px;
  height: 42px;
  line-height: 42px;
}

.container-filter {
  width: 1399px;
  margin-top: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center; /* 使所有元素垂直居中对齐 */
  gap: 20px; /* 调整元素之间的间距 */
}
 
.container-type{
  list-style:none;
}

.container-type li{
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

.sort-Filter-Container{
    margin-bottom: 10px;
    margin-right: 20px;
    display: flex;
    flex-direction: row;
    column-gap: 30px;
  }
.container-activitylist{
  list-style: none;
  margin-top: 20px;
}
.container-activitylist li{
  margin-bottom: 30px;
}

/* 添加下拉菜单样式 */
.el-dropdown {
  margin-left: 20px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.el-dropdown-menu__item) {
  font-family: MiSans-Regular;
  font-size: 14px;
  padding: 8px 20px;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f7fa;
}
</style>
