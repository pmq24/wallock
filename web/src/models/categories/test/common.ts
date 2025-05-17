import type CategoryService from '../CategoryService'

export async function mockCategories (categoryService: CategoryService) {
  const mockData: CategoryService.CreateData[] = [
    { name: 'Salary', type: 'income' },
    { name: 'Investments', type: 'income' },
    { name: 'Needs', type: 'expense' },
    { name: 'Wants', type: 'expense' },
    { name: 'Savings', type: 'expense' },
  ]

  for (const data of mockData) {
    const result = await categoryService.create(data)

    if (!result.success) {
      throw new Error(`Failed to mock categories: ${result.errors}`)
    }
  }
}
