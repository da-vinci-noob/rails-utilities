interface Utility {
  id: number
  title: string
  description: string
  icon: string
  status: string
  createdAt: Date
}

export const utilities: Utility[] = [
  {
    id: 1,
    title: 'Ruby Benchmark',
    description: 'Benchmark and Compare Codes',
    icon: 'https://unsplash.com/photos/1TyF7oE5Vio/download?force=true&w=640',
    status: 'Stable',
    createdAt: new Date('2024-10-11')
  },
  {
    id: 2,
    title: 'Text Manipulation',
    description: 'Manipulate Text, Sort Lines and more',
    icon: 'https://unsplash.com/photos/lud4OaUCP4Q/download?force=true&w=640',
    status: 'Testing',
    createdAt: new Date('2024-11-11')
  }
]
