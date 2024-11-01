import { createRouter, createWebHashHistory } from "vue-router";
import home from '../components/Home.vue'


export default createRouter({
    history: createWebHashHistory(),
    routes: [{
            path: '/',
            name: 'home',
            component: home
        }, {
            path: '/',
            name: ''
        }



    ]
})