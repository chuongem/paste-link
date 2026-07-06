import { UploadDropzone } from '../features/upload/UploadDropzone'

export function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <p className="eyebrow">MVP workspace</p>
        <h1>Upload anything, share when ready</h1>
        <p>Authentication and file upload are connected to the live API. Choose, drop, or paste files here, then manage public links from My Page.</p>
      </section>

      <UploadDropzone />
    </div>
  )
}
