import { useMemo, useState } from 'react'
import { Download, ExternalLink, LinkIcon, Power, PowerOff, QrCode } from 'lucide-react'
import QRCode from 'qrcode'
import {
  ensureShareLink,
  getPublicShareUrl,
  readMockUploads,
  setShareLinkEnabled,
} from '../features/upload/uploadStore'
import type { UploadedFile } from '../features/upload/types'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function getFileKind(file: UploadedFile) {
  const extension = file.name.split('.').at(-1)?.toUpperCase()

  if (file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')) {
    return 'ZIP archive'
  }

  if (extension && extension !== file.name.toUpperCase()) {
    return extension
  }

  return file.type || 'File'
}

function getSharedAt(file: UploadedFile) {
  return file.sharedAt ?? file.createdAt
}

export function MyPage() {
  const [files, setFiles] = useState<UploadedFile[]>(() => readMockUploads())
  const [qrById, setQrById] = useState<Record<string, string>>({})

  const sharedCount = useMemo(() => files.filter((file) => Boolean(file.shareUrl)).length, [files])

  function syncFiles(nextFiles?: UploadedFile[]) {
    const latestFiles = nextFiles ?? readMockUploads()
    setFiles(latestFiles)
  }

  function handleCreateLink(file: UploadedFile) {
    const updatedFile = ensureShareLink(file.id)

    if (!updatedFile) {
      return
    }

    syncFiles()
  }

  function handleToggle(file: UploadedFile) {
    syncFiles(setShareLinkEnabled(file.id, !(file.isShareEnabled ?? true)))
  }

  async function handleCopy(file: UploadedFile) {
    await navigator.clipboard.writeText(getPublicShareUrl(file.code))
  }

  async function handleQr(file: UploadedFile) {
    const qr = await QRCode.toDataURL(getPublicShareUrl(file.code), { width: 180, margin: 1 })
    setQrById((current) => ({ ...current, [file.id]: qr }))
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <p className="eyebrow">My page</p>
        <h1>Manage your file links</h1>
        <p>Create, copy, preview, download, pause, and turn file links into QR codes from one place.</p>
      </section>

      <section className="manage-summary" aria-label="File sharing summary">
        <div className="metric">
          <span>Total files</span>
          <strong>{files.length}</strong>
        </div>
        <div className="metric">
          <span>Shared links</span>
          <strong>{sharedCount}</strong>
        </div>
      </section>

      <section className="upload-results">
        {files.length === 0 ? (
          <div className="empty-state">No files yet. Upload a file first, then manage its public link here.</div>
        ) : (
          files.map((file) => {
            const hasLink = Boolean(file.shareUrl)
            const isEnabled = file.isShareEnabled ?? true
            const shareUrl = getPublicShareUrl(file.code)
            const relevantDate = new Date(getSharedAt(file)).toLocaleString()

            return (
              <article className="file-row managed-file-row" key={file.id}>
                <div>
                  <strong>{file.name}</strong>
                  <span>
                    {getFileKind(file)} | {formatBytes(file.size)} | {hasLink ? 'Shared' : 'Created'} {relevantDate}
                  </span>
                  {hasLink ? (
                    <span className={isEnabled ? 'status-pill enabled' : 'status-pill disabled'}>
                      {isEnabled ? 'Sharing enabled' : 'Sharing paused'}
                    </span>
                  ) : (
                    <span className="status-pill">No public link</span>
                  )}
                </div>

                <div className="file-actions">
                  {!hasLink ? (
                    <button type="button" onClick={() => handleCreateLink(file)}>
                      <LinkIcon size={16} />
                      Create share link
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={() => handleCopy(file)}>
                        <LinkIcon size={16} />
                        Copy link
                      </button>
                      <a href={shareUrl} target="_blank" rel="noreferrer">
                        <ExternalLink size={16} />
                        Open
                      </a>
                      <a href={file.objectUrl} download={file.name}>
                        <Download size={16} />
                        Download
                      </a>
                      <button type="button" onClick={() => handleQr(file)}>
                        <QrCode size={16} />
                        QR
                      </button>
                      <button type="button" onClick={() => handleToggle(file)}>
                        {isEnabled ? <PowerOff size={16} /> : <Power size={16} />}
                        {isEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </>
                  )}
                </div>

                {qrById[file.id] ? <img className="qr-image" src={qrById[file.id]} alt={`QR code for ${file.name}`} /> : null}
              </article>
            )
          })
        )}
      </section>
    </div>
  )
}
