<script setup lang="ts">
import { usePlansStore, type PlanTypes } from '../stores/plans.ts'
import CardsList from '../components/cards/CardsList.vue'

const data: PlanTypes[] | null = usePlansStore().calculatedPlans

</script>

<template>
  <div class="lists-layouts boxed-content-width">
    <h1 class="text-align-center">Marketing Plans {{ new Date().getFullYear() }}</h1>
    <CardsList v-for="planList in data" :key="planList.id"
      :data="planList" />
  </div>
</template>
