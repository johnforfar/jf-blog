import getConfig from 'next/config'

export function useBasePath(path: string): string {
  const { publicRuntimeConfig } = getConfig()
  const basePath = publicRuntimeConfig?.basePath || ''
  return `${basePath}${path}`
}