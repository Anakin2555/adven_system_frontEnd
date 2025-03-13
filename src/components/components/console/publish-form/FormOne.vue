<script setup>
import {ref} from "vue";

const form = ref({
  name: '',
  region: '',
  date1: '',
  date2: '',
  dateEnd: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const onSubmit = () => {
  console.log('submit!')
}
</script>

<template>
  <div>
    <!--  表单1-->
    <el-form class="el-form-main" :model="form" label-width="auto" style="max-width: 600px">

      <el-form-item label="活动名称">
        <el-input v-model="form.name"/>
      </el-form-item>

      <el-form-item label="活动简介">
        <el-input v-model="form.desc" type="textarea"/>
      </el-form-item>


      <el-form-item label="活动日期">
        <el-col :span="6">
          <el-date-picker
              v-model="form.date1"
              type="date"
              placeholder="开始日期"
              style="width: 100%"
          />
        </el-col>

        <el-col :span="1" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>

        <el-col :span="6">
          <el-date-picker
              v-model="form.date2"
              placeholder="结束日期"
              style="width: 100%"
          />
        </el-col>

        <el-col :span="2" class="text-center">
          <span class="text-gray-500"> </span>
        </el-col>

        <el-col :span="5">
          <el-date-picker
              v-model="form.dateEnd"
              type="date"
              placeholder="截止日期"
              clearable
          />
        </el-col>
      </el-form-item>


      <el-form-item>
        <el-button>Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
  
</template>

<style scoped>

</style>