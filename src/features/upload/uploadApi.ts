import { apiClient } from '../../api/client'

export type UploadedFileResponse = {
  id: number
  disk: string
  path: string
  url: string
  original_name: string
  stored_name: string
  mime_type: string
  size: number
  created_at: string
}

type UploadFilesResponse = {
  success: boolean
  message: string
  data: UploadedFileResponse[]
  meta: {
    count: number
  }
}

export async function uploadFiles(files: File[]) {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files[]', file)
  })

  const response = await apiClient.post<UploadFilesResponse>('/files', formData)
  return response.data
}
