<template>
  <el-steps
    style="max-width: 600px"
    :active="currentStep"
    finish-status="success"
    class="mb"
    align-center
  >
    <el-step />
    <el-step />
    <el-step />
  </el-steps>
  <div style="max-width: 600px">
    <div v-if="currentStep === 0">
      <slot name="step-1"></slot>
    </div>
    <div v-if="currentStep === 1">
      <slot name="step-2"></slot>
    </div>
    <div v-if="currentStep === 2">
      <slot name="step-3"></slot>
    </div>

    <div class="stepBtns">
      <el-button v-if="currentStep > 0" @click="currentStep--"> 上一步</el-button>
      <el-button @click="nextStep" type="primary">
        {{ currentStep < 2 ? '下一步' : '提交' }}</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const props = defineProps(['form1', 'form2', 'form3'])
const currentStep = ref<number>(0)
const emits = defineEmits(['submitData'])

const nextStep = () => {
  const currentForm = [props.form1, props.form2, props.form3]

  currentForm[currentStep.value].validate((valid: boolean) => {
    console.log(valid)
    if (valid) {
      if (currentStep.value < 2) currentStep.value++
      else {
        emits('submitData')
        currentStep.value = 0
      }
    }
  })
}
</script>
