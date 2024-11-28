<script setup>

import Nav from "@/components/navigation/Nav.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";

const sideButtonList = ref([{name:'发布活动',iconSrc:'publish',iconSrcChecked:'publish-white'},{name: '草稿箱',iconSrc:'draft',iconSrcChecked:'draft-white'}])
const routerArr = ['publish', 'draft']
const currentIndex = ref(0)
const router = useRouter()

function changeIndex(index) {
  currentIndex.value = index
  router.push('/publish/'+routerArr[index])

}

</script>

<template>
  <div class="container-main">

    <div style="height: 88px">
      <Nav></Nav>
    </div>

    <div class="container-center">

      <div class="container-sidebar">
        <div v-for="(item,index) in sideButtonList">
          <div class="button-container" :class="{'button-container-active':index===currentIndex}"
               @click="changeIndex(index)">
            <img :src="'/static/img/'+(index===currentIndex?item.iconSrcChecked:item.iconSrc)+'.png'">
            {{ item.name}}
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
.container-center {
  width: 1400px;
  display: flex;
  flex-direction: row;
  margin: 40px auto 0;
  gap: 40px;
}

.container-sidebar {
  width: 335px;
  padding: 40px 40px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 16px;
  height: 252px;
  font-size: 20px;
  color: #636363;
  display: flex;
  flex-direction: column;
}

.text-title {
  font-family: MiSans-Regular;
  font-size: 18px;
  color: #a3a3a3
}

.button-container {
  font-family: MiSans-Medium;
  border-radius: 8px;
  margin-top: 20px;
  width: 255px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 24px;
  box-sizing: border-box;
  gap: 12px;
  cursor: pointer;
}

.container-sidebar :nth-child(5) {
  margin-top: auto;
}

.button-container-active {
  font-family: MiSans-Demibold;
  background-color: deepskyblue;
  color: white;
}

.button-container :nth-child(2) {
  margin-left: auto;
}
</style>