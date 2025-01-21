import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { type SelectedBillingCycle } from './cycles.ts'

/**
 *  Price plan selected interface
 */

export interface SelectedData {
  plan: number
  cycle: SelectedBillingCycle['cycle']
  planGroup: number
  planType: SelectedBillingCycle['planType']
}

/**
 * State store for collecting selected price plans and corresponding cycle
 */

export const useSelectedStore = defineStore('selected', () => {
  /**
   * Selected Plans
   * Collects plans that were selected and their cycle into an array
   */

  const selectedPlans: Ref<SelectedData[]> = ref([])

  /**
   * Collects clicked data and stores it in selectedPlans state array.
   * If selectedPlans contains same clicked data, it is removed
   *
   * @param data - SelectedData
   *
   * @return void
   */

  function clickedPriceHandler(data: SelectedData): void {
    if (!data || !data.plan || !data.cycle || !data.planGroup || !data.planType) {
      console.error(
        `Invalid data passed into clickedPriceHandler method in selected store.  Data must contain a plan with a numeric id and a cycle key with a 'monthly', 'quarterly', or 'yearly' value, along with the planGroup id and planType`,
      )
      return
    }

    data.plan = Number(data.plan)

    // Check if the same plan and price has already been selected.

    if (samePlanSelected(data)) {
      selectedPlans.value = (selectedPlans.value as SelectedData[]).filter(
        (selected) =>
          selected.plan !== data.plan && selected.cycle.toLowerCase() === data.cycle.toLowerCase(),
      )
      console.log(selectedPlans.value)
      return
    }

    // If the clickedPrice item was not already selected, add it to the selectedPlans array

    selectedPlans.value = [...(selectedPlans.value as SelectedData[]), data]
    console.log(selectedPlans.value)
  }

  /**
   * Determines is the same plan and cycle has already been selected.
   * If selectedPlans contains same clicked data, it is removed
   *
   * @param data - SelectedData
   *
   * @return void
   */

  function samePlanSelected(data: SelectedData): boolean | void {
    if (!data || !data.plan || !data.cycle) {
      console.error(
        `Invalid data passed into clickedPriceHandler method in selected store.  Data must contain a plan with a numeric id and a cycle key with a 'monthly', 'quarterly', or 'yearly' value`,
      )
      return
    }
    const samePlanSelected: boolean = selectedPlans.value.some(
      (p: SelectedData) => p.plan === Number(data.plan) && p.cycle === data.cycle.toLowerCase(),
    )

    return samePlanSelected
  }

  // Return state and methods

  return { selectedPlans, clickedPriceHandler, samePlanSelected }
})
