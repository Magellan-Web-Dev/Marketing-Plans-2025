<script setup lang="ts">
import { defineProps, onMounted, computed } from 'vue'
import { type SelectedBillingCycle, useCyclesStore } from '../../stores/cycles.ts'

/**
 * Props
 */

const props = defineProps<{
  planGroup: SelectedBillingCycle['planGroup']
  planType: SelectedBillingCycle['planType']
}>()

const { planGroup, planType } = props

const cyclesStore = useCyclesStore()

/**
 * Set starting billing cycle to 'monthly' when component loads.
 * Makes sure cycle is not set to a value other than monthly, which is the starting default
 */


onMounted(() => {
  const currentCycle = cyclesStore.currentPlansGroupBillingTypeSelected(planGroup, planType)
  if (currentCycle === 'monthly') {
    buttonClickBillingCycle('monthly')
  }
})

/**
 * Used to determine which billing cycle plan is currently active
 *
 * @param - SelectedBillingCycle['cycle']
 * @return boolean
 */

const activeCycle = computed(() => {
  return (cycle: SelectedBillingCycle['cycle']) =>
    isValidCycle(cycle) && cyclesStore.billingCyclePlanGroupTypeSelected({ cycle, planGroup, planType })
})

/**
 * Used to check is billing cycle data is valid
 *
 * @param - SelectedBillingCycle['cycle']
 * @return boolean
 */

function isValidCycle(cycle: SelectedBillingCycle['cycle']): boolean {
  return ['monthly', 'quarterly', 'yearly'].includes(cycle)
}

/**
 * Billing cycle option click handler
 *
 * @param string - SelectedBillingCycle['type']
 * @return void
 */

function buttonClickBillingCycle(cycle: SelectedBillingCycle['cycle']): void {
  if (!isValidCycle(cycle)) {
    console.error(
      `Cycle parameter must have a value of 'monthly', 'quarterly', or 'yearly' for the buttonClickBillingCycle function`,
    )
    return
  }

  const data = { cycle, planGroup, planType }

  cyclesStore.clickedBillingCycleHandler(data)
}

</script>

<template>
  <div class="billing-cycle-container">
    <h2 class="select-billing-cycle-text text-align-center">Select billing cycle</h2>
    <div class="billing-cycles-options-container">
      <button @click="buttonClickBillingCycle('monthly')" :class="[{'button-billing-cycle-active': activeCycle('monthly')}, 'button-billing-cycle']" :aria-pressed="activeCycle('monthly')">Monthly</button>
      <button @click="buttonClickBillingCycle('quarterly')" :class="[{'button-billing-cycle-active': activeCycle('quarterly')}, 'button-billing-cycle']" :aria-pressed="activeCycle('quarterly')">Quarterly</button>
      <button @click="buttonClickBillingCycle('yearly')" :class="[{'button-billing-cycle-active': activeCycle('yearly')}, 'button-billing-cycle']" :aria-pressed="activeCycle('yearly')">Yearly</button>
    </div>
  </div>
</template>
