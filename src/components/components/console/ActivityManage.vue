<script setup name="ActivityManage">

import {Search} from "@element-plus/icons-vue";
import {inject, onBeforeMount, ref} from "vue";
import ActivityListItem from "@/components/components/activity/ActivityListItem.vue";
import global from "@/global.js"


const axios=inject('axios')
const searchString=ref('')
const manageActivityList=ref([])

function getManageActivity(type,searchString){
  axios({
    url:'/api/activity/getAllActivity',
    method:'get',
    params:{
      'pageNo':1,
      'pageSize':50,
      'type':type,
      'searchString':searchString
    }
  }).then((e)=>{
    console.log(e)
    manageActivityList.value=global.processActivityData(e.data.data.records)
  })
}

function toSearch(){
  getManageActivity('全部活动',searchString.value)
}

onBeforeMount(()=>{
  getManageActivity('全部活动','')
})
</script>

<template>
  <div class="container-main" >
    
    <div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between">
      <div class="img-text-title">
        <img src="/static/img/activity.png">
        发布的活动
      </div>
      <!--    搜索输入框-->
      <el-input
          v-model="searchString"
          class="container-search"
          placeholder="搜索活动"
          @keyup.enter="toSearch"
          clearable
      >
        <template #suffix>
          <el-icon class="suffix-icon" style="cursor: pointer;" @click="toSearch">
            <Search/>
          </el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="container-list" >
      <ActivityListItem :activity="item" :item-type="'manage'" v-for="(item,index) in manageActivityList"></ActivityListItem>
    </div>
    
  </div>
</template>

<style scoped>
.container-main{
}
.img-text-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-family: MiSans-Demibold;
  color: #4f4f4f;
  font-size: 28px;
}

.el-input :deep(.el-input__wrapper) {
  border-color: #BDBDBD;
  color: #BDBDBD;
  border-radius: 8px;
  height: 44px;
  font-size: 18px;
  background: #F8F8F8;
  font-family: MiSans-Regular;
}

.container-search {
  width: 274px;
  height: 44px;
  line-height: 44px;
  font-size: 18px;
  background-color: wheat;
  border-radius: 8px;
}

.container-list{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>