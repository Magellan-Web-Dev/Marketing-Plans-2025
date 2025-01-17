<script setup lang="ts">
import { defineProps } from 'vue'
import { type PlanTypes } from '../../stores/plans.ts'
import CardItem from './CardItem.vue'

const props = defineProps<{
  data: PlanTypes
}>()

const { dollarPlans, focusPlans } = props.data

</script>

<template>
    <ul class="list-layout">
      <CardItem v-for="item in dollarPlans" :key="item.id" :data="item" />
    </ul>
    <ul class="list-layout">
      <CardItem v-for="item in focusPlans" :key="item.id" :data="item" />
    </ul>
</template>
