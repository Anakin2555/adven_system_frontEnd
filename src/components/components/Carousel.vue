<template>
    <div class="container-carousel">
        <el-carousel  :interval="3000"  height="360px">
            <el-carousel-item v-for="(item,index) in bannerActivityList" :key="item.id">
                <img :src="item.banner.replace('/','/file/')" class="image">
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script setup name="Carousel">
defineProps(['bannerActivityList'])

</script>

<style scpoed>

.container-carousel{
    width: 1400px;
    height: 360px;
    border-radius: 20px;
    overflow: hidden;
}
.el-carousel__item h3 {
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.el-carousel__item > img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

</style>