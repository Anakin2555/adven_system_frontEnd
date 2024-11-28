export default {
    getNowTime(){
        let now=new Date()
        return now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()
    },

    // 添加日期比较函数
    dateCompare(date)
    {
        const currentDate = new Date()
        const compareDate = new Date(date.replace(/\./g, '-'))
        return currentDate <= compareDate
    },

    // 预处理获取到的活动数据
    processActivityData(activities) {
        return activities.map(activity => {
            const status = this.dateCompare(activity.applyEnd) ? '报名中' : '已结束'
            const area = activity.regions.map(item => item.regionName).join('、')
            const count_cur = activity.regions.reduce((total, item) => total + item.curStudent, 0)
            const count_max = activity.regions.reduce((total, item) => total + item.maxStudent, 0)
            const count_remain = count_max - count_cur
    
            return {
                ...activity,
                status,
                area,
                count_cur,
                count_max,
                count_remain
            }
        })
    }
}