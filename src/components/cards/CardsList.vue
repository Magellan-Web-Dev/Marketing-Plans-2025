<script setup lang="ts">
import { defineProps } from 'vue'
import { type PlanTypes } from '../../stores/plans.ts'
import CardItem from './CardItem.vue'
import BillingCycleOptions from './BillingCycleOptions.vue'

const props = defineProps<{
  data: PlanTypes
}>()

const { id, dollarPlans, focusPlans } = props.data

</script>

<template>
    <BillingCycleOptions :planGroup="id" planType="Dollar Plan" />
    <ul class="list-layout">
      <CardItem v-for="item in dollarPlans" :key="item.id" :data="item" />
    </ul>
    <BillingCycleOptions :planGroup="id" planType="Focus Plan" />
    <ul class="list-layout">
      <CardItem v-for="item in focusPlans" :key="item.id" :data="item" />
    </ul>
</template>
