import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router'
import ElementPlus from 'element-plus'
import './assets/fonts/font.css'
import 'element-plus/dist/index.css'
import axios from "axios";
import VueAxios from "vue-axios";
const app = createApp(App);


window.onload = function (){
    
    // console.log(performance.timing.domComplete-performance.timing.navigationStart)
    const observer = new PerformanceObserver((list)=>{
        console.log(list.getEntries(),'list')
        list.getEntries().forEach((entry)=>{
            console.log(entry.docComplete/1000)
        })
    })
}
app.use(VueAxios,axios)
app.provide('axios', app.config.globalProperties.axios)
app.use(ElementPlus)
app.use(store)
app.use(router)
app.config.productionTip = false
app.mount('#app')