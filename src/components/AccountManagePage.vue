<template>
  <div class="container-account-manage">
    <Nav></Nav>
    <div class="container">
<!--      导航栏的占位-->
      <div style="width: 100%;height: 88px;margin-top: 30px"></div>

      <div class="container-card">
        <div>
          <div class="container-user" style="display: flex;flex-direction: row;margin-left: 180px;margin-top: 220px;">
            <img width="89" height="89" src="/static/img/user-image-big.png">
            <div style="margin-left: 20px;margin-top: 13px;">
              <div style="color: rgba(79, 79, 79, 1);font-family: MiSans-Medium;font-size: 24px;">
                {{ userInfo.userName }}
              </div>
              <div style="display: flex;flex-direction: row;margin-top: 12px">
                <img src="/static/img/identity.png" >
                <div style="margin-left: 4px;color: rgba(130, 130, 130, 1);font-family: MiSans-Regular;font-size: 18px;">
                  {{identity}}
                </div>
              </div>
            </div>
          </div>
          <el-button @click="logOut" class="button-exit">退出登录</el-button>
        </div>
        
        <div class="verticalLine"></div>
        
        <div class="container-form" style="margin-top: 160px;margin-left: 12%">
          
          <div style="width: 96px;height: 32px;color: #4f4f4f;font-family: MiSans-Demibold;font-size: 24px;">
            修改密码
          </div>
          
          <el-form :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm" ref="editPasswordForm">
            
            <el-form-item class="el_item" style="width: 326px;height: 55px;margin-top: 30px;" label-width="0" prop="oldPass">
              <el-input size="large" type="password" placeholder="当前密码" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
            </el-form-item>
            
            <el-form-item class="el_item" label-width="0" style="width: 326px;height: 55px;margin-top:20px;margin-bottom: -4px" prop="newPass">
              <el-input size="large" placeholder="新密码" type="password" v-model="ruleForm.newPass" autocomplete="off" show-password></el-input>
            </el-form-item>
            
            <el-form-item class="el_item" label-width="0" style="border-radius:10px;width: 326px;height: 55px;margin-top:20px;margin-bottom: -4px" prop="confirmNewPass">
              <el-input size="large" placeholder="确认密码" v-model="ruleForm.confirmNewPass" type="password" autocomplete="off" show-password></el-input>
            </el-form-item>
          
            <el-form-item label-width="0">
              <el-button style="background-color:rgb(64, 158, 255);font-family:MiSans-Demibold;font-size:22px;border-radius:8px;color:white;width: 326px;height: 50px;text-align: center;margin-top: 30px"
                         type="info" @click="editPass('ruleForm')">修改</el-button>
            </el-form-item>
          </el-form>

        </div>
        
      </div>
    </div>
    
  </div>
</template>

<script setup name="AccountManage">

import Nav from "@/components/navigation/Nav.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {useUserStore} from "@/store/user.js";
import {useRouter} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";  

const router=useRouter()
const userInfo = ref({});
const identity = ref('');
const ruleForm = ref({
  oldPass: '',
  newPass: '',
  confirmNewPass: ''
});
const editPasswordForm=ref(null)

// 验证函数
const validateOldPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入当前密码'));
  } else {
    callback();
  }
};

const validateNewPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'));
  } else {
    callback();
  }
};

const validateConfirmPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== ruleForm.value.newPass) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};


// 表单验证规则
const rules = ref({
  oldPass: [
    { validator: validateOldPass, trigger: 'blur' }
  ],
  newPass: [
    { validator: validateNewPass, trigger: 'blur' },
    { min: 6, max: 12, message: '密码长度在 6 到 12 个字符', trigger: 'blur' }
  ],
  confirmNewPass: [
    { validator: validateConfirmPass, trigger: 'blur' }
  ]
});


function type2Identity(){
  if(userInfo.value.type==='1'){
    identity.value='学生'
  }else if(userInfo.value.type==='2'){
    identity.value='带队老师'
  }else if(userInfo.value.type==='3'){
    identity.value='学院管理员'
  }else if(userInfo.value.type==='4'){
    identity.value='学校管理员'
  }
}
function editPass(formName){
  editPasswordForm.value.validate((valid)=>{
    if(valid){
      axios({
        url:'/api/user/alertPassword',
        method:"post",
        headers:{'token':useUserStore().token},
        data:{
          'userId':userInfo.value.id,
          'newPassword':ruleForm.value.newPass,
          'oldPassword':ruleForm.value.oldPass
        }
      }).then((result)=>{
        if(result.data.status){
          ElMessage({message:'密码修改成功，请使用新密码重新登录',type:'success'})
          logOut()
        }else{
          ElMessage({message:'旧密码输入错误，请重试',type:'error'})
        }
      })
    }
  })
}

function logIn(){
  userInfo.value=useUserStore().userInfo
  type2Identity()
  console.log(userInfo)
}


function logOut(){
  useUserStore().logout()
  router.push('/login')
}


onMounted(()=>{
  logIn()
})
</script>

<style scoped>
html{
  overflow-y: hidden;
}
.container-account-manage {
  width: 100%;
  height: 100vh;
  background: url("/static/img/loginBack.png") no-repeat center center;
  background-size: cover; /* 背景图片覆盖容器 */

}
.container{
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  width: 100%;
}
.container-card {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  width: 1400px;
  height: 694px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 1);
}

.button-exit{
  border-radius:8px;
  color:white;
  text-align: center;
  color: rgba(130, 130, 130, 1);
  font-family: MiSans-Regular;
  font-size: 22px;
  margin-left: 189px;
  margin-top: 60px;
  width: 268px;
  height: 50px;
  border: 1px solid rgba(130, 130, 130, 1);
  box-sizing: border-box;
}
.button-exit:hover{
  border-color: #000000;
}
.verticalLine{
  margin-left: 12%;
  margin-top: 10%;
  width: 2px;
  height: 60%;
  background-color: #f5f5f5;
}


</style>
