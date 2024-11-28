<script setup name="FeedbackItem">
import {InfoFilled} from '@element-plus/icons-vue'
defineProps(['feedbackInfo'])


function onCancel(){
  
}
</script>

<template>
<div class="container-main">
  <div class="userIcon">
    <div>{{feedbackInfo.userName.slice(1,)}}</div>
  </div>
  <div class="container-text">
    <div class="text-title-time-container">
      <div class="text-name">
        {{feedbackInfo.userName}}
      </div>
      <div class="text-user-type">
        {{feedbackInfo.type==='1'?"学生":"带队老师"}}
      </div>
      <div class="text-time">
        {{feedbackInfo.publishDate.slice(0,-2)}}
      </div>
    </div>
    <div class="text-feedback">
      {{feedbackInfo.feedback }}
    </div>
    <div class="attachment">
      反馈附件下载
    </div>
    
  </div>

  <el-popconfirm
      width="120"
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="删除此条反馈?"
      @cancel="onCancel"
  >
    <template #reference>
      <div class="moreFunction"></div>
    </template>
    <template #actions="{ confirm, cancel }">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button
          type="danger"
          size="small"
          @click="confirm">
        删除
      </el-button>
    </template>
  </el-popconfirm>
</div>
</template>

<style scoped>
.userIcon {
  float: left;
  width: 56px;
  height: 56px;
  background-color: #409EFF;
  border-radius: 28px;
  text-align: center;
}

.userIcon div {
  line-height: 56px;
  font-size: 19px;
  font-family: MiSans-Demibold;
  font-weight: bold;
  color: white;
}
.container-main{
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 10px;
}
.container-text{
  display: flex;
  flex-direction: column;
  gap:10px;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  padding-bottom: 20px;
}
.text-title-time-container{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.text-name{
  max-width: 150px;
  height: 27px;
  line-height: 27px;
  color: rgba(79, 79, 79, 1);
  font-family: MiSans-Medium;
  font-weight: 500;
  font-size: 20px;
}
.text-user-type{
  max-width: 56px;
  margin-left: 16px;
  font-size: 14px;
  color: #409eff;
  font-family: MiSans-Medium;
  font-weight: 500;
  border: 1px #409EFF solid;
  padding: 3px 7px 3px 7px;
  border-radius: 6px;
}
.text-time{
  margin-left: 50px;
  color: rgba(189, 189, 189, 1);
  font-family: MiSans-Regular;
  font-size: 16px;
}
.text-feedback{
  width: 740px;
  color: rgba(130, 130, 130, 1);
  line-height: 24px;
  font-family: MiSans-Normal;
  font-size: 18px;
  max-width: 740px;
}
.attachment{
  color: rgba(130, 130, 130, 1);
  font-family: MiSans-Medium;
  font-weight: 500;
  font-size: 18px;
  height: 32px;
  cursor: pointer;
  text-decoration-line: underline;
}

.moreFunction{
  cursor: pointer;
  margin-top: 40px;
  margin-left: 20px;
  width: 28px;
  height: 28px;
  background-image: url("/static/img/more-vertical.png");
  float: right;
}
</style>