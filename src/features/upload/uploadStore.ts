import type { UploadedFile } from './types'

const STORAGE_KEY = 'paste-link.mock-uploads'

export function readMockUploads(): UploadedFile[] {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    return JSON.parse(raw) as UploadedFile[]
  } catch {
    return []
  }
}

export function saveMockUploads(files: UploadedFile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
}

export function findMockUploadByCode(code: string) {
  return readMockUploads().find((file) => file.code === code) ?? null
}
