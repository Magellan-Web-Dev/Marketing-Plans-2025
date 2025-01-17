<script setup lang="ts">
import { defineProps } from 'vue'
import { type PlanTypes } from '../../stores/plans.ts'

const props = defineProps<{
  data: PlanTypes
}>()

const { id, dollarPlans, focusPlans } = props.data

console.log(id)
console.log(dollarPlans)
console.log(focusPlans)
</script>

<template>
  <div></div>
</template>
