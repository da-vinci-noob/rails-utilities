const ONBOARDING_KEY = 'rails-utilities:onboarding-complete'
const CATEGORIES_KEY = 'rails-utilities:focus-categories'

export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true'
}

export function completeOnboarding(categories: string[]) {
  localStorage.setItem(ONBOARDING_KEY, 'true')
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

export function getFocusCategories(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CATEGORIES_KEY) ?? '[]')
  } catch {
    return []
  }
}
