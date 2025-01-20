import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { type SelectedBillingCycle } from './cycles.ts'

/**
 *  Price plan selected interface
 */

export interface SelectedData {
  plan: number
  pricing: SelectedBillingCycle['type']
}

/**
 * State store for collecting selected price plans and corresponding pricing
 */

export const useSelectedStore = defineStore('selected', () => {
  /**
   * Selected Plans
   * Collects plans that were selected and their pricing into an array
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
    if (!data || !data.plan || !data.pricing) {
      console.error(
        `Invalid data passed into clickedPriceHandler method in selected store.  Data must contain a plan with a numeric id and a pricing key with a 'monthly', 'quarterly', or 'yearly' value`,
      )
      return
    }

    data.plan = Number(data.plan)

    // Check if the same plan and price has already been selected.

    if (samePlanSelected(data)) {
      selectedPlans.value = (selectedPlans.value as SelectedData[]).filter(
        (selected) =>
          selected.plan !== data.plan &&
          selected.pricing.toLowerCase() === data.pricing.toLowerCase(),
      )
      return
    }

    // If the clickedPrice item was not already selected, add it to the selectedPlans array

    selectedPlans.value = [...(selectedPlans.value as SelectedData[]), data]
  }

  /**
   * Determines is the same plan and pricing has already been selected.
   * If selectedPlans contains same clicked data, it is removed
   *
   * @param data - SelectedData
   *
   * @return void
   */

  function samePlanSelected(data: SelectedData): boolean | void {
    if (!data || !data.plan || !data.pricing) {
      console.error(
        `Invalid data passed into clickedPriceHandler method in selected store.  Data must contain a plan with a numeric id and a pricing key with a 'monthly', 'quarterly', or 'yearly' value`,
      )
      return
    }
    const samePlanSelected: boolean = selectedPlans.value.some(
      (p: SelectedData) => p.plan === Number(data.plan) && p.pricing === data.pricing.toLowerCase(),
    )

    return samePlanSelected
  }

  // Return state and methods

  return { selectedPlans, clickedPriceHandler, samePlanSelected }
})
