<template>
  <div @click="toDetail">
    
    
<!--    itemType 有四个类别：main、recommend、myActivity、manage-->
<!--    首页的长条形列表项-->
    <div v-if="itemType!=='recommend'" class="container-main" :class="{'container-main-manage':itemType==='manage'}">
      <img :src="cover">
      <div class="container-info">
        <div style="display:flex;align-items: center;">
          <span class="text-title">{{ title}}</span>
          <span class="text-status" :class="{'text-actOver':status==='已结束'}">{{ status }}</span>
        </div>

        <div class="text-date">
          <img src="@/assets/svg/clock.svg" style="margin-right: 4px;">{{ begin +"- " +end}}
        </div>

        <div class="text-region-count">
          <img src="@/assets/svg/map-pin.svg" style="margin-right: 4px;">{{ area }}
          <img style="margin-left: 80px;margin-right: 4px;" src="@/assets/svg/user.svg">剩余名额: {{ count_remain + " / " + count_max}}
        </div>

      </div>
      <div class="text-feedback">
        {{itemType==='myActivity'?'填写反馈':''}}
      </div>
      <div class="icon" >
        <img v-if="itemType!=='manage'" src="@/assets/svg/forward-arrow.svg">
        <img v-else src="/static/img/delete.png" @click="">
      </div>
    </div>
    
<!--    推荐侧栏列表项-->
    <div v-if="itemType==='recommend'" class="container-small-main">
      <img :src="cover" width="133px" height="89px" style="border-radius: 8px">
      <div class="container-info-small">
        <div style="display:flex;align-items: center;">
          <span class="text-title-small">{{ title}}</span>
        </div>

        <div class="text-date-small">
          <img src="@/assets/svg/clock.svg" width="16" height="16" style="margin-right: 4px;">{{ begin.slice(5,) +"-  " + end.slice(5,)}}
        </div>
        
        <div class="text-region-count-small">
          <img src="@/assets/svg/map-pin.svg" width="16" height="16" style="margin-right: 4px;">
          <div>{{ area }}</div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup name="ActivityListItem">


import {toRefs} from "@vue/reactivity";
import {useRouter} from "vue-router";

let props=defineProps(['activity','itemType'])
let {id,title,regions,begin,end,cover,applyEnd,status,area,count_max,count_remain,count_cur} = props.activity
const itemType=props.itemType



begin = begin.replace(/-/g,'.');
end = end.replace(/-/g,'.');
cover = cover.replace('/','/file/')

const router=useRouter()

function toDetail(){
  router.push({path:`/activity-detail/${id}`})
}

</script>

<style scoped>

.container-main{
  border-radius: 12px;
  background: #ffffff;
  width:1400px;
  height: 180px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  justify-content: start;

}

.container-main-manage{
  width: 100%;
}
.container-small-main {
  width: 294px;
  height: 89px;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  
}
.container-main >img{
  width:256px;
  height: 156px;
  object-fit: cover;
  object-position: center;
  border-radius: 10px;
  margin:12px 0px 12px 16px;
}

.container-info{
  margin: 32px 0 26px 40px;
    
}

.container-info-small{
  margin-left: 8px;
}

.text-feedback{
  font-family: MiSans-Medium;
  color: #959595;
  font-size: 18px;
  margin-left: auto;
}
.icon{
  
  margin-right: 60px;

}

.text-date{
  margin-top: 28px;
  display: flex;
  align-items: center;
  color: #828282;
  font-size: 18px;
}

.text-date-small{
  margin-top: 20px;
  display: flex;
  align-items: center;
  color: #828282;
  font-size: 14px;
}
.text-title{
  font-weight: bold;
  color: #4f4f4f;
  font-size: 26px; 
  font-family: MiSans-DemiBold;
}

.text-title-small{
  font-weight: bold;
  color: #4f4f4f;
  font-size: 18px;
  font-family: MiSans-DemiBold;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-status{
  margin-left: 12px;
  font-size: 18px;
  border: 2px solid #409EFF;
  border-radius: 6px;
  padding: 3px;
  color: #409EFF;
  font-family: MiSans-Medium;
}
.text-actOver{
  color:red;
  border: 2px solid red;
  
}
.text-region-count{
  margin-top: 12px;
  display: flex;
  align-items: center;
  color: #8f8f8f;
  font-size: 18px;
}

.text-region-count-small {
  margin-top: 4px;
  display: flex;
  align-items: center;
  color: #8f8f8f;
  font-size: 14px;
  
}
.text-region-count-small div{
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>