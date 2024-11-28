<script setup name="ApplicationAudit">

import {Search} from "@element-plus/icons-vue";
import {inject, onMounted, ref, watch} from "vue";
import {useUserStore} from "@/store/user.js";
import {useRouter} from "vue-router";

const searchString=ref('')
const toAuditActivityList=ref([{auditCount:24,title:'“英才计划”招生活动',status:'报名中',count:'199/200',date:'2024.11.30-2024.12.3'}])
const filterList=ref([])
const axios=inject('axios')
const userStore=useUserStore()
const router=useRouter()

// 监听取消搜索
watch(()=>searchString.value,()=>{
  if(searchString.value===''){
    filterList.value=toAuditActivityList.value
  }
})


function parseListData(lists){
  let parsedList=[]
  lists.forEach(item=>{
    let parsedItem={}
    parsedItem.id=item.activity.id
    parsedItem.auditCount=item.countApply
    parsedItem.title=item.activity.title
    parsedItem.status=(new Date(item.activity.applyEnd)>new Date())?'报名中':'已截止'
    parsedItem.countCur=item.activity.regions.reduce((sum,curr)=>{return sum+curr.curStudent},0)
    parsedItem.countMax=item.activity.regions.reduce((sum,curr)=>sum+curr.maxStudent,0)
    parsedItem.date=item.activity.begin.replace(/-/g,'.').slice(6,)+'-'+item.activity.end.replaceAll(/-/g,'.').slice(6,)
    parsedItem.region=item.activity.regions
    parsedList.push(parsedItem)
  })
  return parsedList
}

function toSearch() {
  filterList.value=toAuditActivityList.value.filter(item=>item.title.indexOf(searchString.value)!==-1)
  console.log(filterList)
}
function toDetail(item){
  router.push({
    path:'/console/application-audit-detail',
    query:{
      'actInfo':encodeURIComponent(JSON.stringify(item))
    }
  })
}


function getToAuditActivity(){
  axios({
    url:'/api/activity/getToBeAudited',
    method:'get',
    headers:{
      'token':userStore.token
    },
    params:{
      'college': userStore.userInfo.college===null?'':userStore.userInfo.college
    }
  }).then((result)=>{
    console.log(result)
    toAuditActivityList.value=parseListData(result.data.data.records)
    filterList.value = toAuditActivityList.value
  })
}

onMounted(()=>{
  getToAuditActivity()

})

</script>

<template>
<div class="container-main">
  
  <div class="container-title" style="display: flex;flex-direction: row;align-items: center;justify-content: space-between">
    <div class="img-text-title">
      <img src="/static/img/activity.png">
      待审核的活动
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

  <div v-if="filterList.length===0" style="display: flex;flex-direction: column;align-items: center;gap:12px;
    margin-top: 180px;font-size: 16px;font-family: MiSans-Regular;color: #777777">
    <img src="/src/assets/svg/empty.svg" width="200" height="200" style="opacity: 70%">
    暂无申请待审核
  </div>
  
  <div class="audit-activity-list" v-else>
      <div class="item-container" v-for="(item,index) in filterList" :key="index" @click="toDetail(item)">
        <div style="display: flex;flex-direction: row;gap:10px;align-items: center">
          <img src="/static/img/blue-dot.png">
          <div style="font-family: MiSans-Medium;font-size: 22px;color: #4F4F4F">
            {{ item.auditCount}}
          </div>
          <div style="font-family: MiSans-Regular;font-size: 18px;color:#989898">
            待审核
          </div>
        </div>
        
        <div style="font-family: MiSans-Medium;font-size: 22px;color:#4F4F4F;display: flex;flex-direction: row;align-items: center">
          <div style="text-overflow: ellipsis;max-width: 240px;overflow: hidden;white-space: nowrap">
            {{ item.title}}
          </div>
          <div class="status-text" :class="{'status-text-blue':item.status==='报名中'}">
            {{ item.status}}
          </div>
        </div>
        
        <div class="count-text" style="display:flex;flex-direction: row;align-items: center;gap: 6px;">
          <img src="@/assets/svg/user.svg">
          {{ item.countMax-item.countCur+' / '+item.countMax}}
        </div>
        <div class="count-text" style="display:flex;flex-direction: row;align-items: center;gap: 6px;">
          <img src="@/assets/svg/clock.svg">
          {{item.date}}
        </div>
        
        <img src="static/img/advanceToAct.png">
      </div>

    
  </div>
</div>
</template>

<style scoped>
.img-text-title{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-family: MiSans-Demibold;
  color: #4f4f4f;
  font-size: 28px;
}

.el-input :deep(.el-input__wrapper)  {
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
.audit-activity-list{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.item-container{
  background-color: white;
  height: 100px;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 60px 0 40px ;
  box-sizing: border-box;
  justify-content: space-between;
  cursor: pointer;
  
}
.status-text{
  font-family: MiSans-Medium;
  font-size: 16px;
  border: 2px solid red;
  color: red;
  padding: 4px 6px;
  border-radius: 6px;
  margin-left: 10px;
}
.status-text-blue{
  color: #409EFF;
  border: 2px solid #409EFF;
}
.count-text{
  font-family: MiSans-Regular;
  font-size: 18px;
  color: #828282;
}
</style>