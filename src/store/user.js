import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
    state: ()=>(
        {
            isLoggedIn: false,
            userInfo: {},
            token: ''
        }
    ),
    actions: {
        login(userData, token) {
            this.isLoggedIn = true
            this.userInfo = userData
            this.token = token
        },
        logout() {
            this.isLoggedIn = false
            this.userInfo = null
            this.token = ''
            // 清除 token 和用户信息
            localStorage.removeItem('userInfo')
        }
    },
    getters: {
        isAuthenticated: (state) => state.isLoggedIn
    }
})