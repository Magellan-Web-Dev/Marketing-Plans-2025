<script setup lang="ts">
import { defineProps } from 'vue'
import { type PlanTypes } from '../../stores/plans.ts'
import CardItem from './CardItem.vue'
import BillingCycleOptions from './BillingCycleOptions.vue'

/**
 * Props
 */

const props = defineProps<{
  data: PlanTypes
}>()

const { id, dollarPlans, focusPlans } = props.data

</script>

<template>
  <BillingCycleOptions :planGroup="id" planType="dollar plan" />
  <h2 class="select-plan-text text-align-center text-wrap-balance">Select Your Dollar Plan</h2>
  <ul class="list-layout">
    <CardItem
      v-for="item in dollarPlans"
      :key="item.id"
      :data="item"
      :planGroup="id"
      planType="dollar plan"
    />
  </ul>
  <BillingCycleOptions :planGroup="id" planType="focus plan" />
  <h2 class="select-plan-text text-align-center text-wrap-balance">Select Your Focus Plan</h2>
  <ul class="list-layout">
    <CardItem
      v-for="item in focusPlans"
      :key="item.id"
      :data="item"
      :planGroup="id"
      planType="focus plan"
    />
  </ul>
</template>
