<template>
  <div>
    <div class="container">
      <img src="static/img/indexLogo.png" style="width: 139px; height: 33px; margin-top: 60px"/>
      <lottie
          :options="defaultOptions"
          :height="400"
          :width="480"
          @animCreated="handleAnimation"
      />

      <div class="title">页面飞走了</div>
      <div class="text">请检查网页地址是否正确</div>

      <button class="bt" @click="toHome">前往首页</button>
    </div>
  </div>
</template>

<script setup name="NotFound">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import * as animationData from '../assets/lottie/data.json';

// 路由实例
const router = useRouter();

// 响应式数据
const defaultOptions = {animationData};
const animationSpeed = ref(1);
let anim = null;

// 方法
const handleAnimation = (animation) => {
  anim = animation;
  anim.setSpeed(2);
};

const stop = () => {
  anim?.stop();
};

const play = () => {
  anim?.play();
};

const pause = () => {
  anim?.pause();
};

const onSpeedChange = () => {
  anim?.setSpeed(animationSpeed.value);
};

const toHome = () => {
  router.push('/');
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.title {
  margin-top: 20px;
  color: #4f4f4f;
  font-family: MiSans-Demibold;
  font-size: 36px;
}

.text {
  margin-top: 12px;
  color: #a6a6a6;
  font-family: MiSans-Regular;
  font-size: 24px;
}

.bt {
  border: none;
  cursor: pointer;
  border-radius: 8px;
  margin-top: 60px;
  width: 208px;
  height: 55px;
  color: #ffffff;
  background-color: #409EFF;
  font-family: MiSans-Demibold;
  font-size: 22px;
}
</style>
