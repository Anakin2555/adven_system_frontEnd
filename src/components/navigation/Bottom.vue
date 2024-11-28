<template>
    <div class="container-main"> 
        <div class="container-bottom">
            <div style="display: flex;flex-direction: row;align-items: center;">
                <img src="../../assets/svg/logo-text.svg">
                <div style="color: #828282;margin-left: 40px;font-size: 18px;">
                    高校招生宣传活动报名平台
                </div>
            </div>
            
            <ul>
                <li>四川大学</li><li>电子科技大学</li><li>西南交通大学</li>
            </ul>
            <div class="container-feedback">
                <img src="../../assets/svg/email.svg">
                <div style="margin-left: 10px;">问题反馈</div>
                <div style="margin-left: 18px;">919673126@qq.com</div>
            </div>
        </div>
    </div>
</template>

<script setup name="Bottom">

</script>

<style scoped>
.container-main{
    width: 100%;
    height: 350px;
    background-color: white;
}
.container-bottom{
    width: 1400px;
    height: 350px;
    margin:0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    
    
    
}

ul li{
    color: #BDBDBD;
    font-size: 18px;
    text-decoration: none;
    display: inline;
    margin-right: 24px;
}

.container-feedback{
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 18px;
    color: #828282;
}
</style>