<script setup lang="ts">
import { defineProps } from 'vue'
import { type Plan } from '../../stores/plans.ts'
import KeyFeature from './KeyFeature.vue'

const props = defineProps<{
  data: Plan
}>()

const { title, description, keyFeatures } = props.data

const { monthly } = props.data.priceCalculations

</script>

<template>
  <li class="list-item-styling">
    <h3>{{ title }}</h3>
    <h4>{{ monthly.outputs.monthlyOutput }} / month</h4>
    <h5>{{ description }}</h5>
    <hr>
    <h6>Key Features</h6>
    <ul>
      <KeyFeature v-for="item in keyFeatures" :key="item.id" :data="item" />
    </ul>
  </li>
</template>
