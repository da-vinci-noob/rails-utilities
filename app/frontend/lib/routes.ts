export function titleToPath(title: string): string {
  return title
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

export function getComponentPath(title: string): string {
  // Remove all non-alphanumeric characters for the folder name
  return title.replace(/\//g, '').replace(/[^a-zA-Z0-9]/g, '')
}
