<script setup lang="ts">
import { defineProps } from 'vue'
import { onMounted } from 'vue'
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
 * Set starting billing cycle to 'monthly' when component loads
 */

onMounted(() => {
  buttonClickBillingCycle('monthly')
})

/**
 * Billing cycle option click handler
 *
 * @param string - SelectedBillingCycle['type']
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

/**
 * Check if billing cycle has already been selected
 *
 * @param string - SelectedBillingCycle['type']
 * @return boolean
 */

function billingCycleSelected(type: SelectedBillingCycle['type']): boolean|void {
  if (type !== 'monthly' && type !== 'quarterly' && type !== 'yearly') {
    console.error(
      `Cycle parameter must have a value of 'monthly', 'quarterly', or 'yearly' for the billingCycleSelected function`,
    )
    return
  }
  const data = { type, planGroup, planType }
  return useCyclesStore().billingCyclePlanGroupTypeSelected(data)
}
</script>

<template>
  <div class="billing-cycle-container">
    <h2 class="select-billing-cycle-text text-align-center">Select billing cycle</h2>
    <div class="billing-cycles-options-container">
      <button @click="buttonClickBillingCycle('monthly')" :class="[{'button-billing-cycle-active': billingCycleSelected('monthly')}, 'button-billing-cycle']">Monthly</button>
      <button @click="buttonClickBillingCycle('quarterly')" :class="[{'button-billing-cycle-active': billingCycleSelected('quarterly')}, 'button-billing-cycle']">Quarterly</button>
      <button @click="buttonClickBillingCycle('yearly')" :class="[{'button-billing-cycle-active': billingCycleSelected('yearly')}, 'button-billing-cycle']">Yearly</button>
    </div>
  </div>
</template>
