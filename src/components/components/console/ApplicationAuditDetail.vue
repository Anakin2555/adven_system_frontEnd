<script setup>

import {useRoute, useRouter} from "vue-router";
import {computed, inject, onBeforeMount, onMounted, ref, watch} from "vue";
import {Search} from "@element-plus/icons-vue";
import {useUserStore} from "@/store/user.js";
import {ElMessage, ElMessageBox} from "element-plus";
const route=useRoute()
const router=useRouter()
const activityInfo=ref({})
const currentRegion=ref(0)
const searchString=ref('')
const axios=inject('axios')
const userStore=useUserStore()
const auditList=ref([])
const remainCountByRegion=ref([])
const pageSize=ref(50)
const pageNo=ref(1)
const multipleSelection=ref([])

const countRemain=computed(()=>{
  let region= activityInfo.value.region[currentRegion.value]
  return region.maxStudent-region.curStudent
})

// 地区变化时触发更新表格数据
watch(()=>currentRegion.value,()=>{
  auditList.value=remainCountByRegion.value[currentRegion.value].auditList
})


function back(){
  router.back()
}

// 审批后需要手动刷新获取每个地区剩余名额，因为初始化的名额是从列表页传过来的
function refreshRemainCount(){
  axios({
    url:'/api/activity/getOne',
    method:'get',
    params:{
      'id':activityInfo.value.id
    }
  }).then((e)=>{
    activityInfo.value.region=e.data.data.regions
  }).catch(error=>{
    console.log(error)})
}

// 遍历每个地区的待审核申请信息
function getRemainCountByRegion() {
  // 审核后要重新计算每个地区的待审核列表
  remainCountByRegion.value=[]
  // 用来存储每个 axios 请求的 Promise
  const requests = activityInfo.value.region.map(item => {
    return axios({
      url: '/api/application/getApplicationByRegion',
      method: 'get',
      headers: {'token': userStore.token},
      params: {
        'activityId': activityInfo.value.id,
        'region': item.regionName,
        'pageSize': pageSize.value,
        'pageNo': pageNo.value,
        'type': userStore.userInfo.userName,
        'searchString': '',
      }
    }).then((result) => {
      console.log(result)
      if (result.data.data.records.length !== 0) {
        remainCountByRegion.value.push({
          regionName: item.regionName,
          auditCount: result.data.data.records.length,
          auditList: result.data.data.records
        });
      }
    });
  });
  
  // 使用 Promise.all 等待所有请求完成
  Promise.all(requests).then(() => {
    // 所有请求都完成后更新 auditList
    if (remainCountByRegion.value.length > 0) {
      auditList.value = remainCountByRegion.value[0].auditList;
    }else{
      auditList.value = []
      remainCountByRegion.value = []
    }
  }).catch(error => {
    console.error('Error fetching data:', error);
  });
}



function toSearch(){
  
}
function handleSelectionChange(val){
  multipleSelection.value=val
}

function getUserIds(){
  return [...multipleSelection.value.map((item)=>item.userId)]
}

// 批量拒绝
function handleAllDeny(){
  let userIds = getUserIds()
  ElMessageBox.confirm(
      '审核拒绝后将不可撤销，确认批量拒绝这些申请吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    axios({
      url: '/api/application/rejectMultiply',
      method: 'post',
      headers: {'token': userStore.token},
      data: {
        'activityId': String(activityInfo.value.id),
        'userType': String(userStore.userInfo.userName),
        'userIds': String(userIds)
      }
    }).then((e) => {
      if (e.data.status) {
        ElMessage({
          type: 'success',
          message: '已批量拒绝',
        })
        // 更新表格和剩余名额
        // refreshRemainCount()
        getRemainCountByRegion()
      }else{
        ElMessage({message:'服务器错误，请重试',type:'error'})
      }
    })
  }).catch((error)=> ElMessage({message: '服务器错误，请重试', type: 'error'}))

}


// 批量通过
function handleAllPass(){
  let userIds = getUserIds()
  if (userIds.length > countRemain.value) {
    ElMessage({message: '通过人数超过限制', type: 'error'})
  }else{
    ElMessageBox.confirm(
      '通过后将不可撤销，确认批量通过这些申请吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(() => {
      axios({
        url:'/api/application/passMultiply',
        method: 'post',
        headers:{'token': userStore.token},
        data:{
          'activityId': String(activityInfo.value.id),
          'userType': String(userStore.userInfo.userName),
          'userIds':String(userIds)
        }
      }).then((e)=>{
        if(e.data.status){
          ElMessage({
            type: 'success',
            message: '已批量通过',
          })
          // 通过后更新表格
          // refreshRemainCount()
          getRemainCountByRegion()
        } else {
          ElMessage({message: '服务器错误，请重试', type: 'error'})
        }
      })
    })
  }
}

function handlePass(row){
  if(countRemain<=0){
    ElMessage({message:'名额不足',type:'error'})
  }else{
    axios({
      url:'/api/application/pass',
      method:'get',
      headers:{'token': userStore.token},
      params:{
        'userType':userStore.userInfo.userName,
        'userId':row.userId,
        'activityId':activityInfo.value.id
      }
      
    }).then((e)=>{
      // console.log(e)
      if(e.data.status){
        // refreshRemainCount()
        getRemainCountByRegion()
      }else{
        ElMessage({message:'服务器错误，请重试',type:'error'})
      }
    })
  }
}

function handleDeny(row){
  axios({
    url: '/api/application/reject',
    method: 'get',
    headers: {'token': userStore.token},
    params: {
      'userType': userStore.userInfo.userName,
      'userId': row.userId,
      'activityId': activityInfo.value.id
    }
  }).then((e) => {
    if (e.data.status) {
      // refreshRemainCount()
      getRemainCountByRegion()
    } else {
      ElMessage({message: '服务器错误，请重试', type: 'error'})
    }
  })
}

function chooseRegion(regionIndex) {
  currentRegion.value = regionIndex
  // console.log(regionIndex)
}


onBeforeMount(()=>{
  activityInfo.value=JSON.parse(decodeURIComponent(route.query.actInfo))
  getRemainCountByRegion()
  refreshRemainCount()
  
})

</script>





<template>
<div class="container-main">
<!--  返回列表-->
  <div @click="back" style="display: inline-flex; align-items: center;;cursor:pointer;width:150px;font-family: MiSans-Medium;color: #828282;font-size: 18px">
    <img src="/static/img/arrow-back.png">
    待审核活动
  </div>
  
<!--  标题及基本信息-->
  <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;margin-top: 20px">
    <div class="text-title">
      {{activityInfo.title}}
      <span class="status-text" :class="{'status-text-blue':activityInfo.status==='报名中'}">
      {{activityInfo.status}}
    </span>
    </div>
    <div style="display: flex;flex-direction: row;align-items: center;gap:6px;font-family: MiSans-Medium;color: #989898;font-size: 18px">
      <img src="/static/img/clock.png">
      {{activityInfo.date}}
    </div>
  </div>

<!--  地区标签栏-->
  <ul class="container-list">
    <li v-for="(item,index) in remainCountByRegion" :class="{'is-activated':index===currentRegion}"
        :key="index" @click="chooseRegion(index)">
      {{ item.regionName}}
      <span style="background-color: #409EFF;border-radius: 20px;color: white;padding:0px 8px">
        {{item.auditCount}}
      </span>
    </li>
  </ul>
  
<!--  审批表格-->
  <div class="container-audit-table" v-if="auditList.length!==0">
    <div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between">
      <div class="text-audit-info">
        <img src="/static/img/user.png">
        剩余名额: {{ countRemain }}
      </div>
      
      
<!--      搜索输入框-->
      <el-input
          v-model="searchString"
          class="container-search"
          placeholder="搜索"
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

    
<!--    批量审核-->
    <div v-show="multipleSelection.length>0" class="showCheckCount">
      <div>已选中 {{multipleSelection.length}} 条</div>
      <div @click="handleAllDeny">
        <img style="cursor: pointer" src="static/img/deny-circle.png" width="28" height="28">
        批量拒绝
      </div>

      <div @click="handleAllPass">
        <img style="cursor: pointer" src="static/img/pass-circle.png" width="28" height="28">
        批量通过
      </div>
    </div>
     
<!--    表格内容-->
    <el-table :data="auditList" height="650" style="width: 100%" class="container-el-table" 
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="userName" label="姓名" width="80"/>
      <el-table-column prop="grade" label="年级" width="80" sortable/>
      <el-table-column prop="college" label="学院" width="120" sortable/>
      <el-table-column prop="gpa" label="绩点" width="120" sortable/>
      <el-table-column prop="region" label="申请地区" width="120" sortable/>
      <el-table-column prop="schoolName" label="申请高中" width="150"/>
      <el-table-column label="申请理由" width="120">
        <template #default="{ row }">
          <el-popover
              placement="top-start"
              :width="200"
              trigger="hover"
              :content="row.reason" 
          >
            <template #reference>
              <div style="text-decoration: underline">查看理由</div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="auditAction" label="审核操作" width="150" >
        <template #default="{ row }">
          <img @click="handleDeny(row)" style="cursor: pointer" src="static/img/deny-circle.png" width="24" height="24">
          <img @click="handlePass(row) " style="cursor: pointer;margin-left: 20px" src="static/img/pass-circle.png"
               width="24" height="24">
        </template>
      </el-table-column>


    </el-table>
    
  </div>
  
  <div v-else style="display: flex;flex-direction: column;align-items: center;gap:12px;
    margin-top: 180px;font-size: 16px;font-family: MiSans-Regular;color: #777777">
    <img src="/src/assets/svg/empty.svg" width="200" height="200" style="opacity: 70%">
    暂无申请待审核
  </div>
  
  
</div>
</template>

<style scoped>

.text-title{
  color: #4F4F4F;
  font-family: MiSans-Demibold;
  font-size: 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
}

.status-text {
  font-family: MiSans-Medium;
  font-size: 16px;
  border: 2px solid red;
  color: red;
  padding: 4px 6px;
  border-radius: 6px;
  margin-left: 4px;
}

.status-text-blue {
  color: #409EFF;
  border: 2px solid #409EFF;
}

.is-activated {
  color: rgb(103, 103, 103) !important;
  font-family: MiSans-Medium !important;
  font-weight: 500 !important;
  position: relative; /* 确保伪元素相对于文字定位 */
  padding-bottom: 14px; /* 为下划线预留空间 */
}

.is-activated::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 20px; /* 下划线的长度，可以根据需要调整 */
  height: 4px; /* 下划线的厚度 */
  border-radius: 2px;
  background-color: rgb(103, 103, 103); /* 下划线的颜色 */
}
.container-list{
  margin-top: 40px;
  margin-left: 15px;
}
.container-list li {
  cursor: pointer;
  font-size: 18px;
  margin-right: 40px;
  color: #828282;
  font-family: MiSans-Regular;
  text-decoration: none;
  display: inline-block;
}

.container-audit-table{
  background-color: white;
  border-radius: 16px;
  height: 800px;
  padding: 30px 40px;
  box-sizing: border-box;
}
.text-audit-info{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-family: MiSans-Regular;
  color: #828282;
}

.container-search {
  width: 224px;
  height: 36px;
  line-height: 44px;
  font-size: 18px;
  background-color: wheat;
  border-radius: 8px;
}

.el-input :deep(.el-input__wrapper) {
  border-color: #BDBDBD;
  color: #BDBDBD;
  border-radius: 8px;
  height: 36px;
  font-size: 18px;
  font-family: MiSans-Regular;
}

.container-el-table{
  margin-top: 20px;
}

.showCheckCount {
  margin-top: 20px;
  width: 100%;
  height: 50px;
  border-radius: 12px;
  background: rgba(240, 245, 251, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
}

.showCheckCount > div {
  max-width: 300px;
  width: fit-content;
  display: inline-block;
  font-family: MiSans-Medium;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.showCheckCount > div > img {
  margin-right: 4px;
}

.showCheckCount > div:first-of-type {
  color: rgba(130, 130, 130, 1);
}

.showCheckCount > div:nth-of-type(2) {
  cursor: pointer;
  color: rgba(235, 87, 87, 1);
  margin-right: 30px;
  margin-left: auto;
}

.showCheckCount > div:last-of-type {
  cursor: pointer;
  color: rgba(64, 158, 255, 1);
  margin-right: 20px;
  margin-left: 0;
}
/*.container-el-table >>>.el-table__cell > .cell {
  color: rgba(189, 189, 189, 1);
  font-family: MiSans-Regular;
  font-size: 18px;
}*/

</style>