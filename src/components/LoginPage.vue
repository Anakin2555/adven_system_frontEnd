<script setup name="Login">
  
</script>

<template>
  <div class="container-main">
    <div class="container-img"></div>
    <div class="container-loginModule">
      <Transition name="fade">
        <RouterView ></RouterView>
      </Transition>
    </div>
  </div>
</template>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: all 1s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.container-main{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: url("/static/img/loginBack.png") no-repeat center center;
  background-size: cover;
  width: 100%;
  height: 100vh;
}
.container-img{
  width: 430px;
  height: 675px;
  border-radius: revert;
  background-image: url("/static/img/loginIcon.png");
}
.container-loginModule{
  display: flex;
  border-radius: 0 12px 12px 0;
  background-color: white;
  flex-direction: column;
  width: 560px;
  height: 675px;
  justify-content: center;
}

</style>