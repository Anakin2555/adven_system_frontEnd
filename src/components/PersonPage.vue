<template>
    <div class="container-main">
      <div class="nav-container">
        <Nav></Nav>
      </div>
      
      <div class="container-list">
        
<!--        标题-->
        <div style="display:flex;flex-direction: row;align-items: center">
          <img src="/static/img/icon_activity.png">
          <div class="title-1">我的活动</div>
        </div>

<!--        活动列表-->
        <div style="display: flex;flex-direction: column;gap: 20px;margin-top: 20px">
          <ActivityListItem :activity="item" :itemType="'myActivity'" v-for="(item,index) in activities" :key="item.id"></ActivityListItem>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import {ref, onMounted, inject} from 'vue'
  import Nav from "@/components/navigation/Nav.vue";
  import ActivityListItem from "@/components/components/activity/ActivityListItem.vue";
  import {useUserStore} from "@/store/user.js";
  import global from "@/global.js"
  const axios=inject("axios")
  // 活动数据
  const activities = ref([])
  const userStore=useUserStore()
  
  
  // 获取活动数据
  const fetchActivities = async () => {
    try {
      // 这里添加获取活动数据的API调用
      await axios({
        url:'/api/activity/getMyActivity',
        headers:{'token':userStore.token},
        method:"get",
        params:{
          'pageNo':1,
          'pageSize':20,
          'userId':userStore.userInfo.id
        }
      }).then((result)=>{
        console.log(result)
        activities.value=global.processActivityData(result.data.data.records)
        console.log(activities.value)
        
        
      })
      
    } catch (error) {
      console.error('获取活动数据失败:', error)
    }
  }
  
  
  
  onMounted(() => {
    fetchActivities()
  })
  </script>
  
  <style scoped>
  .nav-container {
    height: 88px;
  }
  .container-list{
    width: 1400px;
    margin: 20px auto;
  }

  .title-1 {
    color: #4f4f4f;
    font-family: MiSans-Demibold;
    font-weight: 500;
    font-size: 24px;
    margin-right: 10px;
  }
  </style> 