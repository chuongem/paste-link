import { Link, useParams } from 'react-router-dom'
import { FilePreview } from '../features/preview/FilePreview'
import { findMockUploadByCode } from '../features/upload/uploadStore'

export function PublicFilePage() {
  const { code } = useParams()
  const file = code ? findMockUploadByCode(code) : null

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
          <p>This local preview only knows files uploaded in the current browser before refresh.</p>
        </section>
      ) : (
        <section className="public-file-card">
          <div>
            <p className="eyebrow">Share code {file.code}</p>
            <h1>{file.name}</h1>
            <p>{file.type}</p>
          </div>
          <FilePreview file={file} />
          <a className="primary-button" href={file.objectUrl} download={file.name}>
            Download
          </a>
        </section>
      )}
    </main>
  )
}
