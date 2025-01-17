<script setup lang="ts">
import { defineProps } from 'vue'
import { type KeyFeature } from '../../stores/plans.ts'

const props = defineProps<{
  data: KeyFeature
}>()

const { title, description } = props.data

</script>

<template>
  <li>
    <strong v-if="title">
      {{ title }}:
    </strong>
    {{ description }}
  </li>
</template>
