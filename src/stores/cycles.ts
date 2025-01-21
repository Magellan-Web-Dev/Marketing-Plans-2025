import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useSelectedStore, type SelectedData } from './selected.ts'

/**
 * Options for outputting prices in cards based upon billing cycle selected
 */

export interface SelectedBillingCycle {
  cycle: 'monthly' | 'quarterly' | 'yearly'
  planGroup: number
  planType: 'dollar plan' | 'focus plan'
}

/**
 * State store for managing which billing cycle option a user selected for cards
 */

export const useCyclesStore = defineStore('cycles', () => {
  /**
   * Selected Billing Cycles
   * Collects selected billing cycles for plan cycle output
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

    if (!data || !data.cycle || !data.planGroup || !data.planType) {
      console.error(
        `Invalid data passed into clickedBillingCycleHandler method in options store.  Data must contain keys of 'cycle', 'planGroup', and 'planType'`,
      )
      return
    }

    data.cycle = data.cycle.toLowerCase() as SelectedBillingCycle['cycle']
    data.planGroup = Number(data.planGroup) as SelectedBillingCycle['planGroup']
    data.planType = data.planType.toLowerCase() as SelectedBillingCycle['planType']

    /**
     * Check that there are no plan groups selected with the same plan cycle with just a different billing cycle to avoid duplicate cycle selection.
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
            ? { cycle: data.cycle, planGroup: data.planGroup, planType: data.planType }
            : selected,
      )
    }

    // Check if a plan from another billing cycle was already pre-selected.  If so, filter selectedPlans state to remove selection from other billing cycle

    const plansSelected = useSelectedStore().selectedPlans as SelectedData[]

    const filtered = plansSelected.filter(selected => {
      if (selected.cycle !== data.cycle) {
        if (selected.planGroup === data.planGroup &&
          selected.planType === data.planType) {
            return false
          }
        return true
      } else return true
    })

    useSelectedStore().selectedPlans = filtered

    // If the plan group and plan type do not exist in selectedBillingCycles, add it

    selectedBillingCycles.value = [...selectedBillingCycles.value, data] as SelectedBillingCycle[]
  }

  /**
   * Check if same billing cycle for same plan group and type has been selected
   *
   * @param data - SelectedBillingCycle
   *
   * @return boolean
   */

  function billingCyclePlanGroupTypeSelected(data: SelectedBillingCycle): boolean {
    data.cycle = data.cycle.toLowerCase() as SelectedBillingCycle['cycle']
    data.planGroup = Number(data.planGroup) as SelectedBillingCycle['planGroup']
    data.planType = data.planType.toLowerCase() as SelectedBillingCycle['planType']

    return (selectedBillingCycles.value as SelectedBillingCycle[]).some(
      (selected) =>
        selected.cycle === data.cycle &&
        selected.planGroup === data.planGroup &&
        selected.planType === data.planType,
    )
  }

  /**
   * Return what billing cycle is currently selected for a group of plans being either dollar or focus plans
   *
   * @param planGroup - SelectedBillingCycle['planGroup']
   * @param planType - SelectedBillingCycle['planType']
   *
   * @return SelectedBillingCycle['cycle]
   */

  function currentPlansGroupBillingTypeSelected(
    planGroup: SelectedBillingCycle['planGroup'],
    planType: SelectedBillingCycle['planType'],
  ): SelectedBillingCycle['cycle'] {
    planGroup = Number(planGroup) as SelectedBillingCycle['planGroup']
    planType = planType.toLowerCase() as SelectedBillingCycle['planType']

    const selectedCycle = (selectedBillingCycles.value as SelectedBillingCycle[]).find(
      (cycle) => cycle.planGroup === planGroup && cycle.planType === planType,
    )

    if (selectedCycle) {
      return selectedCycle.cycle
    } else return 'monthly'
  }

  return {
    selectedBillingCycles,
    clickedBillingCycleHandler,
    billingCyclePlanGroupTypeSelected,
    currentPlansGroupBillingTypeSelected,
  }
})
