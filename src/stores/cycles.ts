import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

/**
 * Options for outputting prices in cards based upon billing cycle selected
 */

export interface SelectedBillingCycle {
  type: 'monthly' | 'quarterly' | 'yearly'
  planGroup: number
  planType: 'Dollar Plan' | 'Focus Plan'
}

/**
 * State store for managing which billing cycle option a user selected for cards
 */

export const useCyclesStore = defineStore('cycles', () => {
  /**
   * Selected Billing Cycles
   * Collects selected billing cycles for plan pricing output
   */

  const selectedBillingCycles: Ref<SelectedBillingCycle[]> = ref([])

  /**
   * Collects billing cycles selected and stores it in selectedBillingCycles state array
   *
   * @param data - SelectedBillingCycle
   *
   * @return void
   */

  function clickedBillingCycleHandler(data: SelectedBillingCycle): void {
    // Check that data corresponds to SelectedBillingCycle interface

    if (!data || !data.type || !data.planGroup || !data.planType) {
      console.error(
        `Invalid data passed into clickedBillingCycleHandler method in options store.  Data must contain keys of 'type', 'planGroup', and 'planType'`,
      )
      return
    }

    data.type = data.type.toLowerCase() as SelectedBillingCycle['type']
    data.planType = data.type.toLowerCase() as SelectedBillingCycle['planType']

    console.log(data)

    /**
     * Check that there are no plan groups selected with the same plan type with just a different billing cycle to avoid duplicate cycle selection.
     * If such a duplicate is found, then change the billing cycle only, otherwise add it to selectedBillingCycles array
     */

    const samePlanGroupTypeSelected: boolean = (
      selectedBillingCycles.value as SelectedBillingCycle[]
    ).some(
      (selected) => selected.planGroup === data.planGroup && selected.planType === data.planType,
    )

    if (samePlanGroupTypeSelected) {
      selectedBillingCycles.value = (selectedBillingCycles.value as SelectedBillingCycle[]).map(
        (selected) =>
          selected.planGroup === data.planGroup && selected.planType === data.planType
            ? { type: data.type, planGroup: data.planGroup, planType: data.planType }
            : selected,
      )
      return
    }

    // If the plan group and plan type do no exist in selectedBillingCycles, add it

    selectedBillingCycles.value = [...selectedBillingCycles.value, data] as SelectedBillingCycle[]

    console.log(selectedBillingCycles.value)
  }

  return { selectedBillingCycles, clickedBillingCycleHandler }
})
