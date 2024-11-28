<script setup name="FindPwd">

import {inject, ref} from "vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

const ruleForm = ref({realName: '', idNum: ''})
const formRef = ref(null);
const axios=inject('axios')
const router=useRouter()
function cancelLogin() {
  router.push('/');
}

function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      
      ElMessage({
        message:'提交成功,请稍候...',
        type:'info',
      })
      
      
      // 发送请求
      axios({
        url: "/api/user/findPassword",
        params:{
          'userName':ruleForm.value.realName,
          'id':ruleForm.value.idNum
        }
      }).then((response) => {
        if(response.data.status){
          // 邮箱发送成功
          ElMessage({
            message:'邮件发送成功，请查看邮箱:'+response.data.data,
            type:'success',
          })
          router.back()
        }else{
          // 发送邮箱失败
          ElMessage({
            message:'输入错误，请检查姓名与身份证号',
            type:'error',
          })
        }
      })
    } else {
      console.log('error submit!!');
      return false;
    }
  })
}
</script>

<template>
  <div class="container">
    <div class="button-close" @click="cancelLogin"></div>
    
    <div class="button-back">
      <img src="/static/img/backCrossing.png" width="24" height="24"/>
      <RouterLink style="text-decoration: none;
            width:200px;font-family:MiSans-Regular;font-size: 18px;color: rgba(130, 130, 130, 1);" 
                  to="login-box">
        返回
      </RouterLink>
      
    </div>
    
    <div class="loginTitle">找回密码</div>

    <el-form :model="ruleForm" status-icon label-width="100px" ref="formRef">

      <el-form-item style="width: 326px;height: 55px;margin-left: 100px" label-width="0" prop="userName">
        <el-input size="large" v-model="ruleForm.realName" placeholder="真实姓名" name="realName" autocomplete="on"/>
      </el-form-item>
      
      <el-form-item style="width: 326px;height: 55px;margin-left: 100px" label-width="0" prop="userName">
        <el-input size="large" v-model="ruleForm.idNum" placeholder="身份证号" @keyup.enter="submitForm" name="idNum" autocomplete="on"/>
      </el-form-item>

      <el-form-item>
        <el-button
            style="background-color:rgb(64, 158, 255);font-family:MiSans-Demibold;font-size:22px;border-radius:8px;color:white;;width: 326px;height: 50px;text-align: center;margin-top: 20px"
            type="info"
            @click="submitForm">
          确认
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 560px;
  height: 675px;
  background: #ffffff;
  border-radius: 0 12px 12px 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}

.button-close {
  position: absolute;
  top: 40px;
  right: 40px;
  width: 32px;
  height: 32px;
  background-image: url("/static/img/backToIndex.png");
  cursor: pointer;
}

.button-back {
  margin-left: 100px;
  position: absolute;
  top: 90px;
  display: flex;
  flex-direction:row;
  align-items: center;
}
.loginTitle {
  font-family: MiSans-Demibold;
  color: rgba(51, 51, 51, 1);
  font-size: 36px;
  margin-top: 0px;
  margin-left: 100px;
  margin-bottom: 60px;
}
</style>