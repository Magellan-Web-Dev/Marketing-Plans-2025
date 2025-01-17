import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import HttpReq, { type ApiData } from '../../helpers/httpReq.ts'
import { calculatePrice, type Calculations } from '../../helpers/calculatePrice.ts'

/**
 * KeyFeature, Plan, PlanTypes interfaces are part of api data
 */

interface KeyFeature {
  id: number
  plan: number
  title?: string
  description: string
}

/**
 * PriceCalculations interface is part of parsed data after calculations made
 */

export interface PriceCalculations {
  monthly: Calculations
  quarterly: Calculations
  yearly: Calculations
}

/**
 * Plan interface are the keys inside each of the PlanTypes
 */

export interface Plan {
  id: number
  type: string
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

/**
 * PlanTypes interface each have the Plan interface nested inside them
 */

export interface PlanTypes {
  id: number
  dollarPlans: Plan[]
  focusPlans: Plan[]
}

/**
 * State store for collecting plans data from API and performing calculations to factor in quarterly and yearly discounts
 */

export const usePlansStore = defineStore('plans', () => {
  /**
   * Plans Url
   * Used to set url to make HTTP get request for plansData
   */

  const plansUrl: Ref<string | null> = ref(null)

  /**
   * Plans Data
   * Used to collect original data from API
   */

  const plansData: Ref<PlanTypes[] | null> = ref(null)

  /**
   * Calculated Plans
   * The calculatedData method performs calculations from the plansData retrieved and assigns it to calculatedPlans
   */

  const calculatedPlans: Ref<PlanTypes[] | null> = ref(null)

  /**
   * Updates the URL used to fetch rates data.
   *
   * @param url - The URL of the rates data API endpoint.
   * @return void
   */

  function setUrl(url: string): void {
    plansUrl.value = url
  }

  /**
   * Fetches plans data from the specified URL.
   * If successful, updates `ratesData` with the fetched data.
   *
   * @return A promise that resolves to `true` if successful, or `false` if the request fails.
   */

  async function fetch(): Promise<boolean> {
    // Check that plansUrl is not null

    if (!plansUrl.value) {
      console.error('Plans URL is not set.')
      return false
    }

    // Perform Http Request with HttpReq helper class.  Handles errors accordingly.

    try {
      const response: ApiData = await HttpReq.get(plansUrl.value)

      if (!response.ok) {
        throw new Error('Fetch request to get rates data did not return valid JSON.')
      }

      plansData.value = response.data as PlanTypes[]
      calculateData()
      return true
    } catch (err) {
      console.error('Error fetching rates data:', err)
      return false
    }
  }

  /**
   * Makes calculations for monthly, quarterly, and yearly price to factor in discounts
   * Assigns calculations to calculatedPlans state ref
   *
   * @return void
   */

  function calculateData(): void {
    try {
      // Check that plansData has been retrieved first before performing calculations.

      if (!plansData.value) {
        throw new Error('Plans data must be retrieved first before calculating')
      }

      // Perform calculations.  Calculate monthly, quarterly, and yearly discounts and savings.

      calculatedPlans.value = (plansData.value as PlanTypes[]).map((section) => {
        ;(Object.keys(section) as Array<keyof PlanTypes>).forEach((key) => {
          if (Array.isArray(section[key])) {
            const plans = section[key] as Plan[]
            plans.forEach((plan: Plan, index: number) => {
              const monthly: Calculations = calculatePrice('monthly', plan.monthlyPrice)
              const quarterly: Calculations = calculatePrice(
                'quarterly',
                plan.monthlyPrice,
                plan.quarterlyDiscount,
              )
              const yearly: Calculations = calculatePrice(
                'yearly',
                plan.monthlyPrice,
                plan.yearlyDiscount,
              )
              const priceCalculations: PriceCalculations = {
                monthly,
                quarterly,
                yearly,
              }
              ;(section[key] as unknown as Plan[])[index] = {
                ...plan,
                priceCalculations,
              }
            })
          }
        })
        return section
      })
    } catch (err: unknown) {
      console.error('Error calculating plans data:', err)
      calculatedPlans.value = null
    }
  }

  // Return state and methods

  return { plansUrl, plansData, calculatedPlans, setUrl, fetch, calculateData }
})
