<script setup lang="ts">
import { defineProps } from 'vue'
import { type SelectedBillingCycle, useCyclesStore } from '../../stores/cycles.ts'

/**
 * Props
 */

const props = defineProps<{
  planGroup: SelectedBillingCycle['planGroup']
  planType: SelectedBillingCycle['planType']
}>()

const { planGroup, planType } = props

/**
 * Billing cycle option click handler
 *
 * @param Event
 * @return void
 */

function buttonClickBillingCycle(type: SelectedBillingCycle['type']): void {
  if (type !== 'monthly' && type !== 'quarterly' && type !== 'yearly') {
    console.error(
      `Cycle parameter must have a value of 'monthly', 'quarterly', or 'yearly' for the buttonClickBillingCycle function`,
    )
    return
  }

  const data = { type, planGroup, planType }

  useCyclesStore().clickedBillingCycleHandler(data)
}
</script>

<template>
  <ul class="billing-cycles-options-container">
    <li @click="buttonClickBillingCycle('monthly')">Monthly</li>
    <li @click="buttonClickBillingCycle('quarterly')">Quarterly</li>
    <li @click="buttonClickBillingCycle('yearly')">Yearly</li>
  </ul>
</template>
