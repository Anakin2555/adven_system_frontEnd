<script setup name="LoginBox">

import {inject, ref} from "vue";
import {useUserStore} from "@/store/user.js";
import {useRouter} from "vue-router";

const axios=inject("axios")

const ruleForm=ref({userName:'',pwd:''})
const formRef = ref(null);

const userStore = useUserStore()
const router=useRouter()

function cancelLogin(){
  router.push('/');
}


function submitForm() {
  formRef.value.validate(valid => {
    if (valid) {
      // axios
      axios({
        url:"/api/user/login",
        method:"get",
        params:{
          'account':ruleForm.value.userName,
          'password':ruleForm.value.pwd
        }
      }).then(function (result) {
        if(result.data.status){
          let e=result.data.data
          // console.log("e:", e)
          localStorage.setItem('userInfo',JSON.stringify(e))
          userStore.login(e,e.token.token)
          // console.log(userStore.userInfo,userStore.token)
          
          router.push('/')
          
        }else{
          alert("账号或密码错误")
        }
      })
    }else {
      console.log('error submit!!');
      return false;
    }
  })
}

</script>



<template>
  <div class="container">
    
    <div class="button-close" @click="cancelLogin"></div>
    
    <div class="loginTitle">登录</div>
    
    <el-form :model="ruleForm" status-icon label-width="100px" ref="formRef">
      
      <el-form-item style="width: 326px;height: 55px;margin-left: 100px" label-width="0" prop="userName">
        <el-input size="large" v-model="ruleForm.userName" placeholder="账号" name="userName" autocomplete="on"/>
      </el-form-item>
      <el-form-item style="width: 326px;height: 55px;margin-left: 100px" label-width="0" prop="userName">
        <el-input size="large" v-model="ruleForm.pwd" placeholder="密码" @keyup.enter="submitForm" autocomplete="on" name="password"/>
      </el-form-item>
      
      <RouterLink to="find-pwd">
        <el-link style="text-decoration:none;font-family:MiSans-Regular;font-size: 14px;margin-left: 370px;margin-top: -20px"  type="info">
          忘记密码
        </el-link>
      </RouterLink>
      
      <el-form-item>
        <el-button style="background-color:rgb(64, 158, 255);font-family:MiSans-Demibold;font-size:22px;border-radius:8px;color:white;;width: 326px;height: 50px;text-align: center;margin-top: 20px" type="info" 
                   @click="submitForm">
          登录
        </el-button>
      </el-form-item>
      
    </el-form>
  </div>
</template>

<style scoped>

.container{
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
.button-close{
  position: absolute;
  top: 40px;
  right: 40px;
  width: 32px;
  height: 32px;
  background-image: url("/static/img/backToIndex.png");
  cursor: pointer;
}
.loginTitle{
  font-family: MiSans-Demibold;
  color: rgba(51, 51, 51, 1);
  font-size: 36px;
  margin-top: 0px;
  margin-left: 100px;
  margin-bottom: 60px;
}
</style>