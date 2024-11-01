<template>
  <div class="container">
    <img :src="cover">
    <div class="container-info">
        <div style="display:flex;align-items: center;">
            <span class="text-title">{{ title}}</span>
            <span class="text-status" :class="{'text-actOver':status==='已结束'}">{{ status }}</span>
        </div>
        
        <div class="text-date">
            <img src="@/assets/svg/clock.svg" style="margin-right: 4px;">{{ begin+"-"+end}}
        </div>

        <div class="text-region-count">
            <img src="@/assets/svg/map-pin.svg" style="margin-right: 4px;">{{ area }}
            <img style="margin-left: 80px;margin-right: 4px;" src="@/assets/svg/user.svg" >剩余名额: {{ count_remain+" / "+count_max}}
        </div>

    </div>
    <div class="icon">
        <img src="@/assets/svg/forward-arrow.svg">
    </div>
  </div>
</template>

<script setup name="ActivityListItem">


let {activity}=defineProps(['activity'])
let {title,regions,begin,end,cover,applyEnd} = activity
let status=dateCompare(applyEnd)?'报名中':'已结束';
let area = regions.map(item => item.regionName).join('、');
let count_cur = regions.reduce((total, item) => total + item.curStudent, 0);
let count_max = regions.reduce((total, item) => total + item.maxStudent, 0);
let count_remain=count_max-count_cur; 


begin = begin.replace(/-/g,'.');
end = end.replace(/-/g,'.');
cover = cover.replace('/','/file/')

function dateCompare(startdate) {
  let arr = startdate.split("-");
  let starttime = new Date(arr[0], arr[1] - 1, arr[2]);
  let starttimes = starttime.getTime();
  let now = new Date().getTime();
  return starttimes >= now;
}

</script>

<style scoped>
.container{
    border-radius: 12px;
    background: #ffffff;
    width:1400px;
    height: 180px;
    display: flex;
    flex-direction: row;
    align-items: center;
    
}

.container >img{
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
.icon{
    margin-left: auto;
    margin-right: 60px;
}

.text-date{
    margin-top: 28px;
    display: flex;
    align-items: center;
    color: #828282;
    font-size: 18px;
}
.text-title{
    font-weight: bold;
    color: #4f4f4f;
    font-size: 26px; 
    font-family: MiSans-DemiBold;
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
</style>