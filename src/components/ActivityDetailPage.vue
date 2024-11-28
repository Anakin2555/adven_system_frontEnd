<script setup name="ActivityDetail">

import Nav from "@/components/navigation/Nav.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, inject, onMounted, ref, toRaw, watch} from "vue";
import HighSchoolList from "@/components/components/region/HighSchoolList.vue";
import {ArrowDown, Warning} from "@element-plus/icons-vue";
import FeedbackItem from "@/components/components/feedback/FeedbackItem.vue";
import Bottom from "@/components/navigation/Bottom.vue";
import ActivityListItem from "@/components/components/activity/ActivityListItem.vue";
import {useUserStore} from "@/store/user.js";
import {isEmpty} from "element-plus/es/utils/index";
import {ElMessage, ElMessageBox} from "element-plus";
import global from '../global.js'

const route=useRoute()
const router=useRouter()
const activityId = ref(route.params.id)
const activityInfo = ref({})
const feedbackType=ref('查看全部')
const feedbackList=ref([])
const pageSize=ref(1000)
const recommendActivityList=ref([])
const axios=inject('axios')
const pageNo=ref(0)
const userStore=useUserStore()
const applyStatus=ref('报名成功')
const dialogVisible = ref(false)
const applyReason=ref('')
const chosenSchool=ref({})
const feedbackContent=ref('')
const feedbackFileList=ref([])
function backToHome(){
  router.push('/')
}


function downloadAttach(){
  
}

function handleFeedbackType(command){
  getFeedback(command)
  setTimeout(()=>{
    feedbackType.value = command
  },200)
}

// 添加日期比较函数
function dateCompare(date) {
  const currentDate = new Date()
  const compareDate = new Date(date.replace(/\./g, '-'))
  return currentDate <= compareDate
}

function processActivityData(activities) {
  return activities.map(activity => {
    const status = dateCompare(activity.applyEnd) ? '报名中' : '已结束'
    const area = activity.regions.map(item => item.regionName).join('、')
    const count_cur = activity.regions.reduce((total, item) => total + item.curStudent, 0)
    const count_max = activity.regions.reduce((total, item) => total + item.maxStudent, 0)
    const count_remain = count_max - count_cur

    return {
      ...activity,
      status,
      area,
      count_cur,
      count_max,
      count_remain
    }
  })
}

const formatedDate=computed(()=>{
  const beginDate=new Date(activityInfo.value.begin)
  const endDate=new Date(activityInfo.value.end)
  return `${beginDate.getMonth()+1}月${beginDate.getDate()}日-${endDate.getMonth()+1}月${endDate.getDate()}日`
})

const formatedArea=computed(()=>{
  let regions=activityInfo.value.regions||[]  // 必须要加上[],因为获取的area是异步任务，在得到数据之前会初始化一次
  return regions.map(item => item.regionName).join('、')
})

const formatedCount=computed(()=>{
  let regions=activityInfo.value.regions || []
  let count_cur=regions.reduce((total, item) => total + item.curStudent, 0)
  let count_max= regions.reduce((total, item) => total + item.maxStudent, 0)
  
  return '剩余: '+ (count_max-count_cur)+' / '+count_max
})

const applyLimitString=computed(()=>
    (activityInfo.value.college || []).map(item => item.college).join('、')+
    (activityInfo.value.grade || []).map(item=> item.grade).join('、')
)

const showCancelApply=computed(()=>{
  return ['学院审核中', '学校审核中', '报名成功'].includes(applyStatus.value)
})


// 监听路由变化以实现活动详情页根据id切换
watch(()=>route.params.id,(newId)=>{
  activityId.value=newId
  // location.reload()  //强制刷新整个页面
  init()
  
  window.scrollTo({top:0,behavior:"instant"})
  // console.log(activityInfo.value)
})



// 获取活动详情
async function getActivityDetail() {
  try {
    const result = await axios({
      url: '/api/activity/getOne',
      method: 'get',
      params: {
        id: activityId.value,
      },
    });
    activityInfo.value = result.data.data;
  } catch (error) {
    console.error('获取活动详情失败:', error);
  }
}

// 报名状态查询
async function getApplyStatus() {
  try {
    const result = await axios({
      url: '/api/application/getAuditStatus',
      method: 'get',
      headers: {token: userStore.token},
      params: {
        userId: userStore.userInfo.id,
        activityId: activityId.value,
      },
    });

    if (result.data.status) {
      // 已报名
      const data = result.data.data;
      if (data.reject === 'true') {
        applyStatus.value = '未通过';
      } else if (data.collegePass === '0') {
        applyStatus.value = '学院审核中';
      } else if (
          (data.collegePass === '1' || data.collegePass === '-1') &&
          data.universityPass === '0'
      ) {
        applyStatus.value = '学校审核中';
      } else {
        applyStatus.value = '报名成功';
      }
    } else {
      // 还未报名
      if (new Date(activityInfo.value.applyEnd) < new Date()) {
        applyStatus.value = '报名已截止';
      } else {
        applyStatus.value = '申请报名';
      }
    }
  } catch (error) {
    console.error('查询报名状态失败:', error);
  }
}

// 获取子组件传过来的选中的学校名
function getChosenSchool(schoolName,schoolId){
  chosenSchool.value.name='已选择: '+schoolName
  chosenSchool.value.id=schoolId
}


// 申请报名
function applyActivity(){
  // console.log(chosenSchool.value)
  let applyDate=new Date()
  if (!chosenSchool.value.name) {
    ElMessage({message: '请选择学校.', type: 'warning'})
    return
  }
  if(applyReason.value===''){
    ElMessage({message:'请填写申请理由.',type:'warning'})
    return
  }
  if(activityInfo.value.type==='线下活动'){
  }
  axios({
    url:'/api/application/createApplication',
    method:'post',
    headers:{'token':userStore.token},
    data:{
      'userId':userStore.userInfo.id,
      'activityId':activityId.value,
      'highSchoolId':chosenSchool.value.id,
      'applyDate':applyDate.getFullYear()+'-'+(applyDate.getMonth()+1)+'-'+applyDate.getDate(),
      'reason': applyReason.value
    }
  }).then((result)=>{
    console.log(result)
    if(result.data.status){
      ElMessage({message:'报名成功！',type:'success'})
      applyReason.value=''
      dialogVisible.value=false
      getApplyStatus()
    }else{
      ElMessage({message:'报名失败',type:'error'})
    }
  })
}


// 取消报名
function cancelApply(){
  ElMessageBox.alert('确定取消报名吗', {
    // if you want to disable its autofocus
    // autofocus: false,
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText:'返回',
    callback: (action) => {
      if(action === 'confirm'){

        axios({
          url: '/api/application/deleteOne',
          method: 'get',
          headers: {'token': userStore.token},
          params: {
            'userId': userStore.userInfo.id,
            'activityId': activityId.value,
          }
          }).then(function (e) {
            if (e.data.status) {
              getApplyStatus()
              
              ElMessage({
                type: 'info',
                message: `已取消报名`,
              })
            } else {
              ElMessage({
                type: 'error',
                message: `服务器异常，请重试`,
              })
            }
          })
      }
    },
  })
}

// 获取推荐列表
async function getRecActivity(){
  axios({
    url: '/api/activity/getAllActivity',
    method: 'get',
    params: {
      'pageNo': 0,
      'pageSize': 4,
      'type': '线下活动',
      'searchString': '',
    }

  }).then(function (result) {
    // console.log(result)
    recommendActivityList.value = processActivityData(result.data.data.records);
    
  }).catch(function (e) {
    setTimeout(() => {
      console.error('请求失败，重新发送中...');
      getRecActivity();
    }, 10000)
  })
}

async function getFeedback(command){
  let type=''
  if(command==='查看老师'){
    type='2'
  }else if(command==='查看学生'){
    type='1'
  }
  axios({
    url:'/api/feedback/getAllFeedbackByActivityId',
    headers:{'token':userStore.token},
    method:'get',
    params:{
      'activityId': activityId.value.toString(),
      'pageNo':pageNo.value,
      'pageSize':pageSize.value,
      'type':type
    }
  }).then(function(e){
    feedbackList.value = e.data.data.records
    // console.log(feedbackList.value)
  }).catch(error=>{
    console.log(error)
  })
}

function uploadFeedback(){
  if(feedbackContent.value===''){
    ElMessage({message:'请输入反馈内容',type:'warning'})
    return
  }
  axios({
    url:'/api/feedback/addFeedback',
    method:'post',
    headers:{'token':userStore.token},
    data:{
      'activityId':activityId.value,
      'userId':userStore.userInfo.id,
      'publishDate':global.getNowTime(),
      'activityName':activityInfo.value.title,
      'college':userStore.userInfo.college,
      'attachments':feedbackFileList.value,
      'userName':userStore.userInfo.userName,
      'type':userStore.userInfo.type,
      'feedback':feedbackContent.value,
    }
  }).then((result)=>{
    if(result.data.status){
      ElMessage({message:'反馈提交成功！',type:'success'})
      getFeedback(feedbackType.value)
      feedbackContent.value=''
    } else {
      ElMessage({message: '反馈提交失败，请重试！', type: 'error'})

    }
  })
}

async function init(){
  await getActivityDetail()
  await getApplyStatus()
  await getRecActivity()
  await getFeedback()
}

// 挂载时加载
onMounted(()=>{
  init()
})
</script>

<template>
  <div class="container">
<!--    导航栏-->
    <div class="nav-container" style="height: 88px">
      <Nav/>
    </div>
    
<!--    首要信息展示-->
    <div class="container-main">
      
<!--      活动概要展示-->
      <div class="container-outline">
        <div style="margin:0 auto;padding-left:60px;width: 1340px;height: 564px; position: relative;">
          
          <div class="link-container">
            <div style="cursor:pointer;" @click="backToHome">活动列表</div>
            <div style="height:24px;width:24px;background-image: url('/static/img/chevron-right.png')"></div>
            <div>{{ activityInfo.title }}</div>
          </div>
          
          <div class="school-logo-container">
            <img src="/static/img/schoolLogo.png" alt="logo">
            <div class="school-name">四川大学</div>
            <div class="school-email">www.scu.edu.cn</div>
          </div>
          
          <div class="activityTitle"> {{ activityInfo.title }}</div>
          
          <div class="activityInfo">
            <div>{{ formatedDate }}</div>
            <img src="/static/img/vertial-divider.png">
            <div style="max-width: 340px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
              {{formatedArea}}
            </div>
            <img src="/static/img/vertial-divider.png">
            <div> {{ formatedCount }} </div>
          </div>
          
          
<!--          报名按钮-->
          <div class="apply-button-container">

            <el-dropdown :disabled="!showCancelApply">
              <el-button class="apply-button" :class="{
                'apply-button-auditing':applyStatus.slice(-3)==='审核中',
                'apply-button-ban':['未通过','报名已截止','活动进行中'].includes(applyStatus),
                'apply-button-success':applyStatus==='报名成功'
              }"  @click="dialogVisible=(applyStatus==='申请报名')">
                {{applyStatus}}
                <el-icon class="el-icon--right" v-if="showCancelApply">
                  <arrow-down/>
                </el-icon>
              </el-button>
              <template #dropdown >
                <el-dropdown-menu >
                  <el-dropdown-item @click="cancelApply">取消报名</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            
            
<!--            报名弹窗-->
            <el-dialog
                v-model="dialogVisible"
                width="1400"
                style="display:flex;flex-direction:column;align-items:center;padding:40px 40px;border-radius: 16px;"
            >
              
              <div style="font-family: MiSans-Medium;font-size: 24px;margin-bottom: 40px">选择地区及高中</div>

              <HighSchoolList :regions="activityInfo.regions" :sendChosenSchool="getChosenSchool"></HighSchoolList>
              
              <div style="margin-top: 40px;font-family: MiSans-Medium;font-size: 22px">申请理由</div>

              <el-input class="apply-reason-text-area"
                  v-model="applyReason"
                  style="width: 1260px;margin-top: 16px;border-radius: 16px;font-family: MiSans-Regular;font-size: 18px"
                  :autosize="{ minRows: 5, maxRows: 15 }"
                  type="textarea"
                  placeholder="为何能胜任本活动,包括你的过去志愿经历和时长..."
              />
              
              <div style="font-family:MiSans-Regular;font-size:18px;margin-top:20px;display: flex;flex-direction: row;justify-content: end;align-items: center;">
                {{chosenSchool.name}}
                <el-button @click="applyActivity" style="margin-left:20px;height:50px;width:120px;background-color: #409EFF;color: white;font-family: MiSans-Demibold;font-size: 20px;border-radius: 8px">提交</el-button>
              </div>
              
            </el-dialog>
            
<!--            报名限制提醒-->
            <div style="display:flex;flex-direction:row;align-items:center;gap:4px;margin-left: 20px;font-family: MiSans-Regular;color: rgb(96,96,96);font-size: 16px;" v-if="applyLimitString!==''">
              <el-icon>
                <Warning/>
              </el-icon>
              仅限{{applyLimitString}}的同学报名
            </div>
            
          </div>
          
        </div>
      </div>
      
      
<!--      活动内容与报名学校-->
      <div class="content-school-container">
        <div class="content-container" style="display: flex;flex-direction: row;align-items: center;">
            <img src="static/img/actContextIcon.png"/>
            <div>活动内容</div>
            <div @click="downloadAttach()">附件下载</div>
          
        </div>
        <div class="text-container"> 
          <div style="line-height: 170%">
            {{ activityInfo.information}}
          </div>
          <img :src="isEmpty(activityInfo)?'':activityInfo.cover.replace('/','/file/')" style="border-radius: 12px" width="240" height="145">
        </div>
        
        
<!--        活动开设地点-->
        <div class="highschool-container content-container" style="display: flex;flex-direction: row;align-items: center;">
          <img src="static/img/highSchoolIcon.png"/>
          <div>开设高中</div>
        </div>
        
<!--        地区高中列表组件-->
        <div class="region-choose-container">
          <HighSchoolList :regions="activityInfo.regions||[{highSchoolList:[]}]" style="margin-top: 20px;margin-left: 40px">
          </HighSchoolList>
          
        </div>
      </div>
      
<!--      活动反馈-->
      <div class="container-feedback">
        
<!--        反馈-->
        <div class="container-feedback-main">
          <div class="content-container"
               style="display: flex;flex-direction: row;align-items: center;">
            <img src="static/img/actFeedBackIcon.png"/>
            <div>活动反馈</div>
          </div>
          
<!--          反馈提交框-->
          <div style="display: flex;flex-direction: column;margin-left: 40px;margin-top: 20px">
            <el-input class="apply-reason-text-area"
                      v-model="feedbackContent"
                      style="width: 860px;margin-top: 16px;border-radius: 16px;font-family: MiSans-Regular;font-size: 18px"
                      :autosize="{ minRows: 4, maxRows: 15 }"
                      type="textarea"
                      placeholder="评价一下此次活动吧！"
            />

            <div style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;margin-top: 10px">
              <el-upload
                  v-model:file-list="fileList"
                  class="upload-demo"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  multiple
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :limit="3"
                  :on-exceed="handleExceed"
              >
              <span
                  style="text-decoration: underline;font-size: 15px;color:gray;font-family: MiSans-Medium;">
                上传附件
              </span>

              </el-upload>
              
              <el-button
                  style="margin-right:10px;height:40px;width:100px;
                  background-color: #409EFF;color: white;font-family: MiSans-Demibold;
                  font-size: 18px;border-radius: 8px" @click="uploadFeedback">
                提交
              </el-button>
              
            </div>
            
          </div>
          
          
<!--          反馈类型筛选下拉-->
          <div class="dropDownContainer" v-if="feedbackList.length!==0">
            <el-dropdown @command="handleFeedbackType">
            <span class="el-dropdown-link" style="cursor:pointer;font-family: MiSans-Regular;font-size: 16px;margin-top: 20px">
              {{ feedbackType }}
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </span>
              <template #dropdown>
                <el-dropdown-menu class="dropDownClass">
                  <el-dropdown-item command="查看全部">查看全部</el-dropdown-item>
                  <el-dropdown-item command="查看老师">查看老师</el-dropdown-item>
                  <el-dropdown-item command="查看学生">查看学生</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          
<!--          反馈列表-->
          <div class="feedback-list">
            <FeedbackItem v-for="(item,index) in feedbackList" :key="index" :feedbackInfo="item"></FeedbackItem>
          </div>
          
<!--          反馈空白插画-->
          <div class="feedback-list-empty" v-if="feedbackList.length===0">
            <img src="src/assets/svg/empty.svg"  width="180" height="170" style="opacity: 0.5">
            暂时还没有反馈哦！
          </div>
          
<!--          分页-->
<!--          <div class="page-container">-->
<!--            <el-pagination background layout="prev, pager, next" :total="1" -->
<!--                           :hide-on-single-page="feedbackList.length<=pageSize"-->
<!--            />-->
<!--          </div>-->
          
        </div>
        
        
<!--        侧栏推荐活动-->
        <div class="container-recommend-activity">
          <div class="recommend-title">
            <img src="/static/img/vertical-divider-blue.png">
            推荐活动
          </div>
          
          <ActivityListItem :activity="item" :item-type="'recommend'" v-for="(item,index) in recommendActivityList" :key="index">
          </ActivityListItem>
        </div>
        
      </div>
      
      
      
    </div>
    <Bottom></Bottom>

  </div>
</template>

<style scoped>
.apply-reason-text-area :deep(.el-textarea__inner){
  border-radius: 10px;
  border:1px solid #BDBDBD;
  padding: 18px;
}
.apply-button{
  font-size: 22px;
  border-radius: 8px;
  height: 50px;
  padding:0 24px;
  background-color:#409EFF;
  color: white;
  font-family: MiSans-Semibold;
}
.apply-button-auditing{
  background-color: #9BBCDE;
  color: white;
}
.apply-button-ban{
  background-color: transparent;
  border: 2px solid red;
  color:red
}
.apply-button-success{
  background-color: #36DD7C;
}
.recommend-title{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  color: rgba(79, 79, 79, 1);
  font-family: MiSans-Medium;
  font-weight: 500;
  font-size: 22px;
}
.page-container{
  margin-left: 40px;
}
.feedback-list{
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-left: 40px;
  margin-top: 20px;
}
.feedback-list-empty{
  margin-top: 60px;
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: MiSans-Medium;
  color: #8f8f8f;
  gap: 20px;
  font-size: 16px;
}
.dropDownContainer{
  margin-top: 20px;
  margin-left: 40px;
}
.container-feedback{
  width: 1400px;
  position: relative;
  top: -80px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  gap: 40px;
  
}
.container-feedback-main{
  border-radius: 20px;
  width: 1010px;
  background: white;
  padding: 50px 50px;
}
.container-recommend-activity{
  border-radius: 20px;
  width: 290px;
  background: white;
  padding: 50px 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.container{
  width: 100%;
  height: 100%;
  background: rgba(246, 246, 246, 1);
}

.container-outline{
  width: 100%;
  height: 524px;
  padding: 40px 0 0 0;
  background: linear-gradient(92.4deg, rgba(221, 238, 255, 1) 6.74%, rgba(233, 244, 255, 1) 19.23%, rgba(241, 241, 241, 1) 58.29%, rgba(206, 253, 195, 0.35) 95.63%, rgba(155, 232, 136, 0.24) 102.68%, rgba(192, 255, 177, 0) 116.67%);
}

.link-container{
  height: 24px;
  max-width: 800px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.link-container > div {
  height: 24px;
  line-height: 24px;
  color: rgb(99, 99, 99);
  font-family: MiSans-Regular;
  font-size: 18px;
}

.activityTitle{
  color: rgba(51, 51, 51, 1);
  font-family: MiSans-Medium;
  font-weight: 500;
  font-size: 42px;
  max-width: 900px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 90px;
}

.activityInfo{
  margin-top: 16px;
  max-width: 800px;
  color: rgba(79, 79, 79, 1);
  font-family: MiSans-Regular;
  font-size: 20px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}



.school-logo-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 90px;
  right: 140px;
}
.school-name{
  color: #4F4F4F;
  font-family: "PingFang SC";
  font-weight: 600;
  font-size: 24px;
  margin-top: 10px;
}

.school-email{
  color: #828282;
  font-family: MiSans-Regular;
  font-size: 14px;
}
.apply-button-container{
  margin-top: 96px;
  display: flex;
  flex-direction: row;
  align-items: center
}
.content-school-container{
  margin: 0 auto;
  position: relative;
  top:-120px;
  padding: 50px 0px 50px 50px;
  background: white;
  width: 1350px;
  border-radius: 20px;
}
.content-container > div:nth-of-type(1) {
  color: rgba(79, 79, 79, 1);
  font-family: MiSans-Medium;
  font-weight: 500;
  font-size: 24px;
  margin-left: 8px;
}
.content-container > div:nth-of-type(2) {
  color: rgba(130, 130, 130, 1);
  font-family: MiSans-Medium;
  font-weight: 500;
  font-size: 18px;
  height: 32px;
  line-height: 32px;
  margin-left: 32px;
  cursor: pointer;
  text-decoration-line: underline;
}

.content-container > div:nth-of-type(2):hover{
  color: blue;
}
.text-container{
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin-top: 20px;
  margin-left: 40px;
  width: 1240px;
  font-family: MiSans-Normal;
  font-size: 20px;
  color: rgb(99, 99, 99);
}

.highschool-container{
  margin-top: 80px;
}
</style>