<script setup lang="ts">
import { defineProps, computed, type ComputedRef } from 'vue'
import { type Plan } from '../../stores/plans.ts'
import { type Calculations } from '../../../helpers/calculatePrice.ts'
import { type SelectedBillingCycle, useCyclesStore } from '../../stores/cycles.ts'
import { useSelectedStore, type SelectedData } from '../../stores/selected.ts'
import KeyFeature from './KeyFeature.vue'

/**
 * Props
 */

const props = defineProps<{
  data: Plan
  planGroup: SelectedBillingCycle['planGroup']
  planType: SelectedBillingCycle['planType']
}>()

const { id, title, description, keyFeatures } = props.data

const { planGroup, planType } = props

const selectedStore = useSelectedStore()

/**
 * Price output
 */

const cyclesStore = useCyclesStore()

const cycleSelected: ComputedRef<SelectedBillingCycle['cycle']> = computed(() =>
  cyclesStore.currentPlansGroupBillingTypeSelected(planGroup, planType),
)

const outputNumbers: ComputedRef<Calculations> = computed(
  () => props.data.priceCalculations[cycleSelected.value],
)

/**
 * Price select click handler
 *
 * @param Event
 * @return void
 */

function priceSelect(e: Event): void {
  const clickedItemData = buttonClickData(e)
  if (clickedItemData) selectedStore.togglePlanSelection(clickedItemData)
}

/**
 * Check if price plan button has already been selected in the useSelectedStore selectedPlans state
 *
 * @return boolean|void
 */

const priceAlreadySelected: ComputedRef<boolean | void> = computed(() => {
  const clickedItemData: SelectedData = {
    plan: id,
    cycle: cycleSelected.value,
    planGroup,
    planType,
  }
  return selectedStore.isPlanSelected(clickedItemData)
})

/**
 * Collect button click data
 *
 * @param Event
 * @return SelectedData|void
 */

function buttonClickData(e: Event): SelectedData | void {
  // Select HTML button clicked

  const htmlButton = e.target as HTMLButtonElement

  // Get data price attribute value

  const cycle = htmlButton.dataset.price ? htmlButton.dataset.price.toLowerCase() : ''

  // Check that priceType is a valid type

  if (cycle !== 'monthly' && cycle !== 'quarterly' && cycle !== 'yearly') {
    console.error(
      `Price button must have a data attribute of 'price' with a value of 'monthly', 'quarterly', or 'yearly'`,
    )
    return
  }

  const clickedItemData: SelectedData = {
    plan: id,
    cycle,
    planGroup,
    planType,
  }

  return clickedItemData
}

/**
 * Checks if another plan within the same plan type under the same plan group id with the same cycle type has already been selected.
 *
 * @return boolean
 */

const anotherSiblingPlanPriceTypeSelected: ComputedRef<boolean | void> = computed(() => {
  const plansSelected = useSelectedStore().selectedPlans as SelectedData[]

  // Check of other sibling plans have been selected under the same billing cycle

  const anotherSiblingPlanSelected: boolean = plansSelected.some(
    (plan) =>
      plan.planGroup === planGroup &&
      plan.planType === planType &&
      plan.cycle === cycleSelected.value,
  )

  // Check that current card wasn't selected to avoid disabling card that is selected

  const currentPlanSelected: boolean = plansSelected.some((plan) => plan.plan === id)

  // Check that selected billing cycle didn't change

  return anotherSiblingPlanSelected && !currentPlanSelected
})
</script>

<template>
  <li
    :class="[{ 'disable-list-item': anotherSiblingPlanPriceTypeSelected }, 'list-item-styling']"
  >
    <div class="title-price-description-button-container">
      <h3 class="title text-color-1">{{ title }}</h3>
      <div class="price-container">
        <h4 class="price">{{ outputNumbers.outputs.monthlyOutput }} <small>per month</small></h4>
        <div :class="[{ 'show-discount': outputNumbers.hasDiscount }, 'discount-container']">
          <p>
            {{ outputNumbers.outputs.discountOutput }} discount ({{
            outputNumbers.outputs.savingsOutput
          }} savings)
          </p>
          <p>
            {{ outputNumbers.outputs.totalOutput }} total {{ cycleSelected }}
          </p>
        </div>
      </div>
      <p class="description">{{ description }}</p>
      <button
        :tabindex="anotherSiblingPlanPriceTypeSelected ? -1 : 0"
        @click="priceSelect"
        :class="[{ 'button-highlight': priceAlreadySelected }, 'button']"
        :data-price="cycleSelected"
      >
        {{ priceAlreadySelected ? `Selected Plan` : `Select Plan` }}
      </button>
    </div>
    <hr />
    <h4 class="key-features-heading">Key Features</h4>
    <ul class="key-features-list">
      <KeyFeature v-for="item in keyFeatures" :key="item.id" :data="item" />
    </ul>
  </li>
</template>
