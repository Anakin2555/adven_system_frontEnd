<template>
  <div class="container">
    <div class="container-nav">
      <div class="container-logo-nav">
        <a class="logo-text">
        <img src="@/assets/svg/logo-text.svg">
        </a>
        <el-input v-if="user.type==='student'" class="container-search" v-model="searchString" placeholder="搜索活动" >
          <template #suffix>
              <el-icon  @click="toSearch" class="button-icon-search">
                <img src="@/assets/svg/search.svg">
              </el-icon>
            </template>
        </el-input>
      </div>

      <div class="container-button-nav">
        <div v-if="user.type==='admin'" style="height:28px;">
            <img src="@/assets/svg/plus.svg" style="margin-right:40px">
            <img src="@/assets/svg/sidebar.svg">
        </div>
        <img v-else src="@/assets/svg/bell.svg">


        <div class="container-user">
          <img src="@/assets/svg/avatar.svg" style="margin-right: 10px;" />
          <el-dropdown
            placement="bottom-end">
            <span class="el-dropdown-link">
              <span>{{ user.name }}</span>
              <img src="@/assets/svg/dropdown.svg" />
            </span>
            <template #dropdown>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>Action 0</el-dropdown-item>
                <el-dropdown-item>Action 2</el-dropdown-item>
                <el-dropdown-item>Action 3</el-dropdown-item>
                <el-dropdown-item>Action 4</el-dropdown-item>
                <el-dropdown-item>Action 5</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup name="Nav">
import { ref } from '@vue/reactivity'



let user={
  type:'student',
  name:'张鲁刚'
}

let searchString=ref('')

function toSearch(){
  alert('搜索');
}




    

</script>

<style scoped>
.container{
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
  margin-top: 6px;
}

.container-search{
  width: 326px;
  height: 44px;
  margin-left: 80px;
  box-sizing: border-box;
  line-height: 44px;
  font-size: 18px;
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
  //justify-content: space-between;

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


.el-dropdown-link{
  cursor: pointer;
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
</style>



