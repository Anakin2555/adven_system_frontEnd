import {defineStore} from "pinia";


export const formPublish=defineStore('form-publish', {
    state:()=>(
        {
            activityFormList:[],
            
        }
    ),
    actions:{
        addActivityForm(activityForm){
            this.activityFormList.push(activityForm)
        },
        
    },
    getters:{}
    
})