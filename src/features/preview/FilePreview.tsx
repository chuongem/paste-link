import type { UploadedFile } from '../upload/types'

export function FilePreview({ file }: { file: UploadedFile }) {
  if (file.type.startsWith('audio/')) {
    return <audio controls src={file.objectUrl} className="media-preview" />
  }

  if (file.type.startsWith('video/')) {
    return <video controls src={file.objectUrl} className="media-preview" />
  }

  if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
    return (
      <div className="text-preview">
        This local mock preview cannot read the original file after a browser refresh. The real file API will provide stable preview content here.
      </div>
    )
  }

  return <div className="empty-state">Preview is not available for this file type yet.</div>
}
