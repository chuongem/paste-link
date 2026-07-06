import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Clipboard, FilePlus2 } from 'lucide-react'
import { getApiErrorMessage } from '../../api/client'
import { uploadFiles } from './uploadApi'
import { readMockUploads, saveMockUploads } from './uploadStore'
import type { UploadedFile } from './types'

const MAX_SESSION_SIZE = Number(import.meta.env.VITE_MAX_UPLOAD_SESSION_BYTES ?? 300 * 1024 * 1024)

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function getFileCode(file: { id: number; stored_name: string; path: string }) {
  return file.stored_name.split('.').at(0) || file.path.split('/').at(-1) || String(file.id)
}

function getClipboardFiles(dataTransfer: DataTransfer) {
  const files = Array.from(dataTransfer.files)

  if (files.length > 0) {
    return files
  }

  return Array.from(dataTransfer.items)
    .filter((item) => item.kind === 'file')
    .map((item) => item.getAsFile())
    .filter((file): file is File => Boolean(file))
}

export function UploadDropzone() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploads, setUploads] = useState<UploadedFile[]>(() => readMockUploads())
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const sessionSize = useMemo(() => uploads.reduce((total, file) => total + file.size, 0), [uploads])

  const acceptFiles = useCallback(async (files: FileList | File[]) => {
    const nextFiles = Array.from(files)
    const nextSize = nextFiles.reduce((total, file) => total + file.size, 0)

    if (nextFiles.length === 0) {
      return
    }

    if (nextSize > MAX_SESSION_SIZE) {
      setError('This upload session is larger than 300MB.')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const response = await uploadFiles(nextFiles)
      const mappedFiles = response.data.map((file) => ({
        id: String(file.id),
        code: getFileCode(file),
        name: file.original_name,
        size: file.size,
        type: file.mime_type || 'application/octet-stream',
        createdAt: file.created_at,
        objectUrl: file.url,
        storagePath: file.path,
      }))

      setUploads((currentUploads) => {
        const updatedUploads = [...mappedFiles, ...currentUploads]
        saveMockUploads(updatedUploads)
        return updatedUploads
      })
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const files = getClipboardFiles(event.clipboardData)

    if (files.length > 0) {
      event.preventDefault()
      acceptFiles(files)
    }
  }, [acceptFiles])

  useEffect(() => {
    function handleWindowPaste(event: ClipboardEvent) {
      if (!event.clipboardData) {
        return
      }

      const target = event.target
      const isEditableTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)

      if (isEditableTarget) {
        return
      }

      const files = getClipboardFiles(event.clipboardData)

      if (files.length > 0) {
        event.preventDefault()
        acceptFiles(files)
      }
    }

    window.addEventListener('paste', handleWindowPaste)

    return () => {
      window.removeEventListener('paste', handleWindowPaste)
    }
  }, [acceptFiles])

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
        <p>Upload one or more files to the live file API. The current account token is sent with the request.</p>
        <button className="primary-button" type="button" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Choose files'}
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
          <strong>{isUploading ? 'Uploading...' : formatBytes(sessionSize)}</strong>
        </div>
        <div className="metric">
          <span>Limit</span>
          <strong>300 MB</strong>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
      </aside>

      <div className="upload-results">
        {uploads.length === 0 ? (
          <div className="empty-state">Uploaded files will appear here. Open My Page to create public share links.</div>
        ) : (
          uploads.map((file) => (
            <article className="file-row" key={file.id}>
              <div>
                <strong>{file.name}</strong>
                <span>{file.type} | {formatBytes(file.size)}</span>
              </div>
              <div className="file-actions">
                <a href="/my-page">Manage link</a>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
