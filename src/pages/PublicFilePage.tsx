import { Link, useParams } from 'react-router-dom'
import { FilePreview } from '../features/preview/FilePreview'
import { findPublicUploadByCode } from '../features/upload/uploadStore'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function getFileKind(name: string, type: string) {
  if (type === 'application/zip' || name.toLowerCase().endsWith('.zip')) {
    return 'ZIP archive'
  }

  const extension = name.split('.').at(-1)?.toUpperCase()
  return extension && extension !== name.toUpperCase() ? extension : type
}

export function PublicFilePage() {
  const { code } = useParams()
  const file = code ? findPublicUploadByCode(code) : null
  const isDisabled = file && !(file.isShareEnabled ?? true)

  return (
    <main className="public-page">
      <Link className="brand public-brand" to="/dashboard">
        <span className="brand-mark">P</span>
        <span>
          <strong>PasteLink</strong>
          <small>Public file preview</small>
        </span>
      </Link>

      {!file ? (
        <section className="auth-card">
          <p className="eyebrow">Not found</p>
          <h1>File link unavailable</h1>
          <p>This link is invalid, expired, or has not been created yet.</p>
        </section>
      ) : isDisabled ? (
        <section className="auth-card">
          <p className="eyebrow">Sharing paused</p>
          <h1>This link is disabled</h1>
          <p>The owner has temporarily turned off public access for this file.</p>
        </section>
      ) : (
        <section className="public-file-card">
          <div>
            <p className="eyebrow">Share code {file.code}</p>
            <h1>{file.name}</h1>
            <p>
              {getFileKind(file.name, file.type)} | {formatBytes(file.size)}
            </p>
            <p className="public-file-meta">Shared {new Date(file.sharedAt ?? file.createdAt).toLocaleString()}</p>
          </div>
          <FilePreview file={file} />
          <a className="primary-button" href={file.objectUrl} download={file.name}>
            {file.name.toLowerCase().endsWith('.zip') ? 'Download ZIP' : 'Download'}
          </a>
        </section>
      )}
    </main>
  )
}
