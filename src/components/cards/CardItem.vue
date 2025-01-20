<script setup lang="ts">
import { defineProps } from 'vue'
import { type Plan } from '../../stores/plans.ts'
import { useSelectedStore, type SelectedData } from '../../stores/selected.ts'
import KeyFeature from './KeyFeature.vue'

/**
 * Props
 */

const props = defineProps<{
  data: Plan
}>()

const { id, title, description, keyFeatures } = props.data

const { monthly, quarterly, yearly } = props.data.priceCalculations

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

 function priceAlreadySelected(pricing: string): boolean| void {
  if (pricing !== 'monthly' && pricing !== 'quarterly' && pricing !== 'yearly') {
    console.error(
      `Pricing parameter must have a value of 'monthly', 'quarterly', or 'yearly' for the priceAlreadySelected function`,
    )
    return
  }
  const clickedItemData: SelectedData = {
    plan: id,
    pricing,
  }
  return useSelectedStore().samePlanSelected(clickedItemData)
}

/**
 * Collect button click data
 *
 * @param Event
 * @return SelectedData|void
 */

function buttonClickData(e: Event): SelectedData|void {
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

const priceOutput = monthly.outputs.totalOutput;

</script>

<template>
  <li class="list-item-styling">
    <div class="title-price-description-button-container">
      <h3 class="title text-color-1">{{ title }}</h3>
      <div class="price-container">
        <h4 class="price">{{ priceOutput }} <small>per month</small></h4>
        <p class="discount">10% discount ($100 monthly savings)</p>
      </div>
      <p class="description">{{ description }}</p>
      <button class="button">Select Plan</button>
    </div>
    <hr />
    <h4 class="key-features-heading">Key Features</h4>
    <ul class="key-features-list">
      <KeyFeature v-for="item in keyFeatures" :key="item.id" :data="item" />
    </ul>
  </li>
</template>
