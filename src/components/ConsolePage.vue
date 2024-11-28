<script setup name="ConsolePage">
  
import Nav from "@/components/navigation/Nav.vue";
import {onBeforeMount, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";


const route=useRoute()
const routerTitle=ref('发布的活动')
const sideButtonList=ref([
  {
    name:'报名审核',
    iconSrc: 'check-square',
    iconSrcChecked:'check-square-white'
  },
  {
    name:'活动管理',
    iconSrc: 'manage',
    iconSrcChecked: 'manage-white'
  },
  {
    name: '反馈审核',
    iconSrc: 'feedback-big',
    iconSrcChecked: 'feedback-white'
  },
  {
    name: '发布活动',
    iconSrc: 'publish',
    iconSrcChecked: 'publish'
  }
])

const routerArr=['application-audit','activity-manage','feedback-audit','publish']
const currentIndex=ref(0)
const router=useRouter()


// 浏览器返回时要监听地址变化来设定选项卡已选选项
watch(()=>route.path,()=>{
  console.log(route.path)
  if(route.path==='/console/application-audit'){
    currentIndex.value=0
  }else if(route.path==='/console/activity-manage'){
    currentIndex.value=1
  }else if(route.path==='/console/feedback-audit'){
    currentIndex.value=2
  }
})

function changeIndex(index){
  currentIndex.value=index
  
  if(index!==3) {
    router.push('/console/' + routerArr[index])
  }
  else
    router.push('/publish')
  
}


// 刷新页面要重新赋值currentIndex
onBeforeMount(()=>{
  if (route.path === '/console/application-audit') {
    currentIndex.value = 0
  } else if (route.path === '/console/activity-manage') {
    currentIndex.value = 1
  } else if (route.path === '/console/feedback-audit') {
    currentIndex.value = 2
  }
})
</script>

<template>
<div class="container-main">
  
  <div style="height: 88px">
    <Nav></Nav>
  </div>
  
  <div class="container-center">
    
    <div class="container-sidebar">
      <div class="text-title">
        工作台
        <el-divider border-style="dashed"/>
      </div>
      


      <div v-for="(item,index) in sideButtonList">
        <div class="button-container" :class="{'button-container-active':index===currentIndex}" @click="changeIndex(index)">
          <img :src="'/static/img/'+(index===currentIndex?item.iconSrcChecked:item.iconSrc)+'.png'">
          {{ item.name }}
          <img src="/static/img/arrow-white.png">
        </div>
      </div>
    </div>

    <div class="container-router-view">
      <RouterView>
      </RouterView>
    </div>
  </div>
  
  
</div>
</template>

<style scoped>
.container-center{
  width: 1400px;
  display: flex;
  flex-direction: row;
  margin: 40px auto 0;
  gap: 40px;

}
.container-sidebar{
  width: 335px;
  padding: 60px 40px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 16px;
  height: 752px;
  font-size: 20px;
  color: #636363;
  display: flex;
  position: fixed;
  flex-direction: column;
}
.text-title{
  font-family: MiSans-Regular;
  font-size: 18px;
  color: #a3a3a3
}
.button-container{
  font-family: MiSans-Medium;
  border-radius: 8px;
  margin-top: 20px;
  width: 255px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding:0px 24px;
  box-sizing: border-box;
  gap: 12px;
  cursor: pointer;
}

.container-sidebar :nth-child(5){
  margin-top:auto;
}
.button-container-active{
  font-family: MiSans-Demibold;
  background-color: #409EFF;
  color: white;
}
.button-container :nth-child(2){
  margin-left: auto;
}

.container-router-view{
  margin-left: 375px;
  width: 1025px;
  margin-top: 20px;
}
</style>