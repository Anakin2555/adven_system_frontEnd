<script setup name="HighSchoolList">
import {onMounted, ref} from "vue";

const props=defineProps(['regions','sendChosenSchool'])

let current_region=ref(0)
const current_school=ref('')
function chooseRegion(regionIndex) {
  current_region.value=regionIndex
  // console.log(regionIndex)
}

function chooseSchool(schoolName,schoolId){
  props.sendChosenSchool(schoolName,schoolId)
  current_school.value=schoolName
}
onMounted(()=>{
  
})
</script>

<template>
  <div class="container-main">
<!--    地区选项-->
    <ul class="container-list">
      <li v-for="(item,index) in regions" :class="{'is-activated':index===current_region}"
          :key="index" @click="chooseRegion(index)">{{ item.regionName}}
      </li>
    </ul>
    
<!--    学校列表-->
    <div class="school-list-container">
      <div @click="chooseSchool(item.schoolName,item.id)" 
           :class="{'school-logo-container-chosen':item.schoolName===current_school}" 
           class="school-logo-container" v-for="(item,index) in regions[current_region].highSchoolList "
      :key="index">
        <img :src="'/file'+item.badge">
        <div>{{item.schoolName}}</div>
      </div>
    </div>
    
  </div>
  
</template>

<style scoped>
.container-main{
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.container-list li {
  cursor: pointer;
  font-size: 20px;
  margin-right: 40px;
  color: #828282;
  font-family: MiSans-Regular;
  text-decoration: none;
  display: inline-block;
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
  width: 24px; /* 下划线的长度，可以根据需要调整 */
  height: 4px; /* 下划线的厚度 */
  border-radius: 2px;
  background-color: rgb(103, 103, 103); /* 下划线的颜色 */
}

.school-list-container {
  max-width: 1300px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.school-logo-container:nth-of-type(7n+1){
  margin-left: 0;
}
.school-logo-container{
  width: 163px;
  height: 171px;
  border-radius: 12px;
  background: rgba(248, 248, 248, 1);
  margin-left: 20px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  font-family: MiSans-Regular;
  box-sizing: border-box;

}

.school-logo-container-chosen{
  background: rgb(243, 243, 243);
  border: 2px solid #dadada;
}
</style>