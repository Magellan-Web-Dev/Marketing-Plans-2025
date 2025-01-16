import { ref, Ref } from 'vue'
import { defineStore } from 'pinia'
import HttpReq, { type ApiData } from '../../helpers/httpReq.ts'
import { type Calculations } from '../../helpers/calculatePrice.ts'

/**
 * Defines api data interface, along with parsed data interface after calculations have been made when data is collected.
 */

// KeyFeature, Plan, PlanTypes interfaces are part of api data

interface KeyFeature {
  title: string
  description: string
}

//  PriceCalculations interface is part of parsed data after calculations made

export interface PriceCalculations {
  monthly: Calculations
  quarterly: Calculations
  yearly: Calculations
}

export interface Plan {
  title: string
  monthlyPrice: number
  quarterlyDiscount: number
  yearlyDiscount: number
  description: string
  estimatedAnnualROI: number
  keyFeatures: KeyFeature[] // Key Feature
  planPrice?: number // planPrice is used for dollarPlans
  priceCalculations?: PriceCalculations
}

export interface PlanTypes {
  dollarPlans: Plan
  focusPlans: Plan
}

export const usePlansStore = defineStore('plans', () => {
  const plansData: Ref<PlanTypes> | null = ref(null)
  const plansUrl: Ref<string> = ref('')

  /**
   * Updates the URL used to fetch rates data.
   * @param url - The URL of the rates data API endpoint.
   */

  function setUrl(url: string): void {
    plansUrl.value = url
  }

  /**
   * Fetches plans data from the specified URL.
   * If successful, updates `ratesData` with the fetched data.
   * @returns A promise that resolves to `true` if successful, or `false` if the request fails.
   */

  async function fetchPlans(): Promise<boolean> {
    if (!plansUrl.value) {
      console.error('Plans URL is not set.')
      return false
    }

    try {
      const response: ApiData = await HttpReq.get(plansUrl.value)

      if (!response.ok) {
        throw new Error('Fetch request to get rates data did not return valid JSON.')
      }

      plansData.value = response.data as PlanTypes
      return true
    } catch (err) {
      console.error('Error fetching rates data:', err)
      return false
    }
  }

  return { ratesData, ratesUrl, setUrl, fetchRates }
})
