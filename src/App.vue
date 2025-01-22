<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { usePlansStore } from './stores/plans.ts'
import LoadingSpinner from './components/LoadingSpinner.vue'
import LoadingError from './components/LoadingError.vue'
import HomeView from './views/HomeView.vue'

const loading = ref<boolean>(true)
const removeSpinner = ref<boolean>(false)
const errorLoading = ref<boolean>(false)

onMounted(async(): Promise<void> => {

  // Load Marketing Plans data on init

  const plans = usePlansStore()

  // Set plans data url based upon environment

  const dataUrl: string = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_PRODUCTION_ROUTE_URL + import.meta.env.VITE_DATA_URL
    : import.meta.env.VITE_PRODUCTION_BASE_URL + import.meta.env.VITE_DATA_URL

  plans.setUrl(dataUrl)

  // Fetch plans data

  const getPlans = await plans.fetch()

  // Error handler if plans data could not be retrieved

  if (!getPlans) {
    errorLoading.value = true
  }

  // Create delay of loading spinner to avoid flicker on fast data load

  setTimeout(() => {
    loading.value = false
  }, 500)

  // Delayed removal of loading spinner component after fade out

  document.addEventListener('transitionend', () => {
    setTimeout(() => {
      removeSpinner.value = true
    }, 500)
  })
})
</script>

<template>
  <main :class="[{ loading: loading }, 'background-style-1']">
    <LoadingSpinner v-if="!removeSpinner" />
    <HomeView v-if="!errorLoading && !loading" />
    <LoadingError v-if="errorLoading" />
  </main>
</template>
