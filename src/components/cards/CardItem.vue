<script setup lang="ts">
import { defineProps } from 'vue'
import { type Plan } from '../../stores/plans.ts'
import KeyFeature from './KeyFeature.vue'

const props = defineProps<{
  data: Plan
}>()

const { id, title, description, keyFeatures } = props.data

const { monthly, quarterly, yearly } = props.data.priceCalculations

// Price select interface

interface SelectedData {
  id: number;
  pricePlan: 'monthly' | 'quarterly' | 'yearly'
}

// Price select click handler

function priceSelect(e: Event): void {
  // Select HTML button clicked

  const htmlButton = e.target as HTMLButtonElement

  // Get data price attribute value

  const pricePlan: string = htmlButton.dataset.price ? htmlButton.dataset.price.toLowerCase() : ''

  // Check that priceType is a valid type

  if (pricePlan !== 'monthly' && pricePlan !== 'quarterly' && pricePlan !== 'yearly') {
    console.error(
      `Price button must have a data attribute of 'price' with a value of 'monthly', 'quarterly', or 'yearly'`,
    )
    return
  }

  const clickedItemData: SelectedData = {
    id,
    pricePlan
  }

  console.log(clickedItemData);
}
</script>

<template>
  <li class="list-item-styling">
    <h2 class="title text-color-1">{{ title }}</h2>
    <h4 class="description">{{ description }}</h4>
    <hr />
    <h4 class="key-features-heading">Key Features</h4>
    <ul class="key-features-list">
      <KeyFeature v-for="item in keyFeatures" :key="item.id" :data="item" />
    </ul>
    <hr />
    <h4 class="prices-heading"><strong>Pricing Plans</strong></h4>
    <ul class="prices-list">
      <li class="price-item">
        <p class="monthly-amount price">{{ monthly.outputs.totalOutput }} / monthly</p>
        <button @click="priceSelect" class="button button-highlight-hover" data-price="monthly">
          Select
        </button>
      </li>
      <li class="price-item">
        <p class="quarterly-amount price">{{ quarterly.outputs.totalOutput }} / quarterly</p>
        <button @click="priceSelect" class="button button-highlight-hover" data-price="quarterly">
          Select
        </button>
      </li>
      <li class="price-item">
        <p class="yearly-amount price">{{ yearly.outputs.totalOutput }} / yearly</p>
        <button @click="priceSelect" class="button button-highlight-hover" data-price="yearly">
          Select
        </button>
      </li>
    </ul>
  </li>
</template>
