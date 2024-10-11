interface Utility {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: string;
  createdAt: Date;
}

export const utilities: Utility[] = [
  {
    id: 1,
    title: 'Ruby Benchmark',
    description: 'Benchmark and Compare Codes',
    icon: 'placeholder.svg',
    status: 'Stable',
    createdAt: new Date('2024-10-11')
  }
]
