<script setup name="Nav">
import {ref, watch, computed, onMounted} from 'vue'
import {Search, Calendar, User, SwitchButton} from '@element-plus/icons-vue'
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from "@/store/user.js";


const router = useRouter()
const route = useRoute()

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:model-value', 'search-string'])

const localSearchString = ref('')

const userStore=useUserStore()
watch(() => props.modelValue, (newVal) => {
  if (newVal === '') {
    localSearchString.value = ''
  }
})

const userInfo = ref({
  type: '-1',
  userName: 'XXX',
  isLogin: false
})

function toSearch() {
  emit('search-string', localSearchString.value)
}


function goTo(page){
  if(route.path==='/'&&page===''){
    router.go(0)
  }else{
    console.log(page)
    router.push('/' + page)
  }
}


// 模拟通知数据
const notifications = ref([
  {
    id: 1,
    title: '您报名的活动"2024春季招生宣讲会"已通过审核',
    time: '10分钟前',
    isRead: false
  },
  {
    id: 2,
    title: '您的活动即将开始',
    time: '1小时前',
    isRead: false
  },
  {
    id: 3,
    title: '系统通知：平台将于今晚进行系统维护',
    time: '2小时前',
    isRead: true
  }
])

// 计算未读消息数量
const unreadCount = computed(() => {
  return notifications.value.filter(notice => !notice.isRead).length
})

// 处理点击通知
const handleNotification = (id) => {
  const notice = notifications.value.find(notice => notice.id === id)
  if (notice) {
    notice.isRead = true
  }
}

// 标记所有通知为已读
const markAllAsRead = () => {
  notifications.value.forEach(notice => notice.isRead = true)
}

// 导航栏下拉菜单路由跳转
const handleCommand = (command) => {
  if (command === 'myActivities') {
    router.push({name: 'myActivities'})
    
  } else if (command === 'accountManage') {
    
    router.push({name: 'accountManage'})
    
  } else if (command === 'logout') {
    // 登出清除localstorage和 pinia state
    userStore.logout()
    router.go(0)
  }
}


onMounted(()=>{
  const userInfo_storage= JSON.parse(localStorage.getItem('userInfo'))
  if(userInfo_storage!==null){
    userStore.login(userInfo_storage, userInfo_storage.token.token)
    Object.assign(userInfo.value,userStore.userInfo)
    userInfo.value.isLogin=true
  }
})
</script>



<template>
  <div class="container-main">
    <div class="container-nav">
      <div class="container-logo-nav">
<!--        logo超链接-->
        <div class="logo-text" @click="goTo('')">
          <img src="@/assets/svg/logo-text.svg">
        </div>
<!--        搜索框-->
        <el-input v-if="route.path==='/'"
          v-model="localSearchString"
          class="container-search"
          placeholder="搜索活动"
          @keyup.enter="toSearch"
        >
          <template #suffix>
            <el-icon class="suffix-icon" style="cursor: pointer;" @click="toSearch">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>

      
<!--      登录按钮-->
      <div class="button-login" @click="goTo('login')" v-if="!userInfo.isLogin">登录</div>
      
<!--      已登录的个人图标-->
      <div class="container-button-nav" v-if="userInfo.isLogin">
<!--        管理员专属图标-->
        <div v-if="userInfo.type==='3'||userInfo.type==='4'" style="height:28px;">
            <img src="@/assets/svg/plus.svg" style="margin-right:40px;cursor: pointer" @click="goTo('publish')">
            <img src="@/assets/svg/sidebar.svg" style="cursor: pointer" @click="goTo('console')">
        </div>
<!--        通知图标-->
        <el-dropdown  trigger="hover" @command="handleNotification" v-if="userInfo.type==='1'||userInfo.type==='2'"> 
          <div class="notification-icon">
            <img src="@/assets/svg/bell.svg">
            <div v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <div class="notification-header" style=" padding: 4px 16px;display: flex;flex-direction: row;justify-content: space-between;align-items: center">
                <div style="font-family: MiSans-Demibold;font-size: 18px;">通知:</div>
                <el-button v-if="notifications.length > 0" 
                          type="text" 
                          @click="markAllAsRead">
                  全部已读
                </el-button>
              </div>
              
              <el-divider style="margin: 0" />
              
              <div class="notification-list" v-if="unreadCount > 0">
                <el-dropdown-item v-for="notice in notifications" 
                                :key="notice.id"
                                :command="notice.id">
                  <div class="notification-item" style="margin-top: 8px;margin-bottom: 8px" :class="{ unread: !notice.isRead }">
                    <div class="notice-title">{{ notice.title }}</div>
                    <div class="notice-time" style="margin-top: 6px">{{ notice.time }}</div>
                  </div>
                </el-dropdown-item>
              </div>
              
              <div v-if="unreadCount === 0" class="empty-notice" >
                暂无通知
              </div>
              
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
<!--        用户图标下拉菜单-->
        <div class="container-user">
          <el-dropdown size="large"
            placement="bottom-end"
            @command="handleCommand">
            <span class="el-dropdown-link">
              <img src="@/assets/svg/avatar.svg" style="margin-right: 10px;"/>
              <span>{{ userInfo.userName }}</span>
              <img src="@/assets/svg/dropdown.svg" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="myActivities" v-if="['1','2'].includes(userInfo.type)">
                  <el-icon><Calendar /></el-icon>
                  我的活动
                </el-dropdown-item>
                <el-dropdown-item command="accountManage">
                  <el-icon><User /></el-icon>
                  账号管理
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
  
</template>



<style scoped>

.container-main{ 
  width: 100%;
  height: 88px;
  position: fixed;
  top: 0;
  background: #ffffff;
  box-shadow: 0px 2px 12px #00000005;
  z-index: 99;
}

.container-nav{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 1400px;
  margin:0 auto;
  height: 88px;
}

.logo-text{
  cursor: pointer;
}

.container-search{
  width: 326px;
  height: 44px;
  margin-left: 80px;
  box-sizing: border-box;
  line-height: 44px;
  font-size: 18px;
}
.button-login{
  width: 96px;
  height: 40px;
  border-radius: 8px;
  background-color: rgba(64, 158, 255, 1);
  color: rgba(255, 255, 255, 1);
  font-weight: bold;
  font-family: MiSans-Demibold;
  cursor: pointer;
  font-size: 18px;
  text-align: center;
  line-height: 40px;
  margin-right: 0;
}
.el-input__inner{
  border-radius: 8px;
}
.button-icon-search{
  width: 44px;
  height: 44px;
  cursor: pointer;
}

.container-logo-nav{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.container-button-nav{

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

}
.container-user{
  position: relative;
  margin-left: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.fixed-dropdown {
  position: absolute !important; /* 固定弹出菜单位置 */
  top: 50px; /* 根据需要调整 */
  right: 0;
  z-index: 1000;
}

.el-dropdown-link {
    cursor: pointer;
    color: rgba(130, 130, 130, 1);
    font-family: MiSans-Regular;
    font-size: 16px;
  }
  .el-icon-arrow-right {
    font-size: 15px;
  }


.el-dropdown-link span,img{
  font-size: 18px;
  line-height: 26px;
  display: inline-block;
  vertical-align: middle;
}
.block-col-2 .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s;
}

.notification-icon img {
  display: block;
}

.notification-badge {
  position: absolute;
  top: 10px;
  right: 12px;
  transform: translate(50%, -50%);
  background-color: red;
  color: white;
  border-radius: 10px;
  padding: 0 6px;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  white-space: nowrap;
}

/* 如果你想给用户头像和下拉箭头也添加同样的效果 */
.container-user {
  position: relative;
  margin-left: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.container-user:hover {
  opacity: 0.8;
}

.el-dropdown-link {
  cursor: pointer;
  color: rgba(130, 130, 130, 1);
  font-family: MiSans-Regular;
  font-size: 16px;
  transition: all 0.3s;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 4px;
}



</style>



