import { UploadDropzone } from '../features/upload/UploadDropzone'

export function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <p className="eyebrow">MVP workspace</p>
        <h1>Upload anything and get a shareable link</h1>
        <p>Authentication and file upload are connected to the live API. Choose, drop, or paste one or more files to create public links.</p>
      </section>

      <UploadDropzone />
    </div>
  )
}
