import type { UploadedFile } from './types'
import { APP_URL } from '../../api/client'

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

export function getPublicShareUrl(code: string) {
  return `${APP_URL}/f/${code}`
}

export function ensureShareLink(fileId: string) {
  const files = readMockUploads()
  let updatedFile: UploadedFile | null = null

  const updatedFiles = files.map((file) => {
    if (file.id !== fileId) {
      return file
    }

    updatedFile = {
      ...file,
      shareUrl: file.shareUrl ?? getPublicShareUrl(file.code),
      sharedAt: file.sharedAt ?? new Date().toISOString(),
      isShareEnabled: true,
    }

    return updatedFile
  })

  saveMockUploads(updatedFiles)
  return updatedFile
}

export function setShareLinkEnabled(fileId: string, isEnabled: boolean) {
  const updatedFiles = readMockUploads().map((file) => {
    if (file.id !== fileId || !file.shareUrl) {
      return file
    }

    return {
      ...file,
      isShareEnabled: isEnabled,
    }
  })

  saveMockUploads(updatedFiles)
  return updatedFiles
}

export function findPublicUploadByCode(code: string) {
  const file = findMockUploadByCode(code)

  if (!file?.shareUrl) {
    return null
  }

  return {
    ...file,
    shareUrl: getPublicShareUrl(file.code),
    isShareEnabled: file.isShareEnabled ?? true,
  }
}
