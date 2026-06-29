import { useCallback, useMemo, useRef, useState } from 'react'
import { Clipboard, FilePlus2, LinkIcon, QrCode } from 'lucide-react'
import QRCode from 'qrcode'
import { APP_URL } from '../../api/client'
import { readMockUploads, saveMockUploads } from './uploadStore'
import type { UploadedFile } from './types'

const MAX_SESSION_SIZE = Number(import.meta.env.VITE_MAX_UPLOAD_SESSION_BYTES ?? 300 * 1024 * 1024)

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function createCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function UploadDropzone() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploads, setUploads] = useState<UploadedFile[]>(() => readMockUploads())
  const [error, setError] = useState<string | null>(null)
  const [qrByCode, setQrByCode] = useState<Record<string, string>>({})

  const sessionSize = useMemo(() => uploads.reduce((total, file) => total + file.size, 0), [uploads])

  const acceptFiles = useCallback((files: FileList | File[]) => {
    const nextFiles = Array.from(files)
    const nextSize = nextFiles.reduce((total, file) => total + file.size, 0)

    if (nextSize > MAX_SESSION_SIZE) {
      setError('This upload session is larger than 300MB.')
      return
    }

    const mappedFiles = nextFiles.map((file) => {
      const code = createCode()

      // This uses a temporary browser URL until the backend file upload API is available.
      return {
        id: crypto.randomUUID(),
        code,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        createdAt: new Date().toISOString(),
        shareUrl: `${APP_URL}/f/${code}`,
        objectUrl: URL.createObjectURL(file),
      }
    })

    const updatedUploads = [...mappedFiles, ...uploads]
    saveMockUploads(updatedUploads)
    setUploads(updatedUploads)
    setError(null)
  }, [uploads])

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const files = event.clipboardData.files

    if (files.length > 0) {
      acceptFiles(files)
    }
  }, [acceptFiles])

  async function createQr(file: UploadedFile) {
    const qr = await QRCode.toDataURL(file.shareUrl, { width: 180, margin: 1 })
    setQrByCode((current) => ({ ...current, [file.code]: qr }))
  }

  return (
    <section className="upload-grid">
      <div
        className="dropzone"
        role="button"
        tabIndex={0}
        onPaste={handlePaste}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          acceptFiles(event.dataTransfer.files)
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            if (event.target.files) {
              acceptFiles(event.target.files)
              event.target.value = ''
            }
          }}
        />
        <FilePlus2 size={42} />
        <h2>Paste, drop, or select files</h2>
        <p>Upload UI is ready. It will switch from local mock storage to the file API when backend endpoints are published.</p>
        <button className="primary-button" type="button">
          Choose files
        </button>
        <span className="dropzone-hint">
          <Clipboard size={16} />
          Ctrl+V also works here
        </span>
      </div>

      <aside className="upload-panel">
        <h3>Session</h3>
        <div className="metric">
          <span>Current size</span>
          <strong>{formatBytes(sessionSize)}</strong>
        </div>
        <div className="metric">
          <span>Limit</span>
          <strong>300 MB</strong>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
      </aside>

      <div className="upload-results">
        {uploads.length === 0 ? (
          <div className="empty-state">Uploaded files will appear here with public share links.</div>
        ) : (
          uploads.map((file) => (
            <article className="file-row" key={file.id}>
              <div>
                <strong>{file.name}</strong>
                <span>{file.type} · {formatBytes(file.size)}</span>
              </div>
              <div className="file-actions">
                <button type="button" onClick={() => navigator.clipboard.writeText(file.shareUrl)}>
                  <LinkIcon size={16} />
                  Copy
                </button>
                <a href={`/f/${file.code}`} target="_blank" rel="noreferrer">Open</a>
                <button type="button" onClick={() => createQr(file)}>
                  <QrCode size={16} />
                  QR
                </button>
              </div>
              {qrByCode[file.code] ? <img className="qr-image" src={qrByCode[file.code]} alt={`QR code for ${file.name}`} /> : null}
            </article>
          ))
        )}
      </div>
    </section>
  )
}
