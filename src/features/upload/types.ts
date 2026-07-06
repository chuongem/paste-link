export type UploadedFile = {
  id: string
  code: string
  name: string
  size: number
  type: string
  createdAt: string
  shareUrl?: string
  sharedAt?: string
  isShareEnabled?: boolean
  objectUrl: string
  storagePath?: string
}
