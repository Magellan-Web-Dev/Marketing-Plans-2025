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

/**
 * Price output
 */

const cyclesStore = useCyclesStore()

const cycleSelected: ComputedRef<SelectedBillingCycle['type']> = computed(() =>
  cyclesStore.currentPlansGroupBillingTypeSelected(planGroup, planType)
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
  if (clickedItemData) useSelectedStore().clickedPriceHandler(clickedItemData)
}

/**
 * Check if price plan button has already been selected in the useSelectedStore selectedPlans state
 *
 * @param Event
 * @return boolean|void
 */

function priceAlreadySelected(): boolean | void {
  const clickedItemData: SelectedData = {
    plan: id,
    pricing: cycleSelected.value,
  }
return useSelectedStore().samePlanSelected(clickedItemData)
}

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

  const pricing: string = htmlButton.dataset.price ? htmlButton.dataset.price.toLowerCase() : ''

  // Check that priceType is a valid type

  if (pricing !== 'monthly' && pricing !== 'quarterly' && pricing !== 'yearly') {
    console.error(
      `Price button must have a data attribute of 'price' with a value of 'monthly', 'quarterly', or 'yearly'`,
    )
    return
  }

  const clickedItemData: SelectedData = {
    plan: id,
    pricing,
  }

  return clickedItemData
}
</script>

<template>
  <li class="list-item-styling">
    <div class="title-price-description-button-container">
      <h3 class="title text-color-1">{{ title }}</h3>
      <div class="price-container">
        <h4 class="price">{{ outputNumbers.outputs.monthlyOutput }} <small>per month</small></h4>
        <p :class="[{ 'show-discount': outputNumbers.hasDiscount }, 'discount']">
          {{ outputNumbers.outputs.discountOutput }} discount
          ({{ outputNumbers.outputs.savingsOutput }} savings)
        </p>
      </div>
      <p class="description">{{ description }}</p>
      <button
        @click="priceSelect"
        :class="[{ 'button-highlight': priceAlreadySelected() }, 'button']"
        :data-price="cycleSelected"
      >
        Select Plan
      </button>
    </div>
    <hr />
    <h4 class="key-features-heading">Key Features</h4>
    <ul class="key-features-list">
      <KeyFeature v-for="item in keyFeatures" :key="item.id" :data="item" />
    </ul>
  </li>
</template>
