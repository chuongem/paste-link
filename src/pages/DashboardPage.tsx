import { UploadDropzone } from '../features/upload/UploadDropzone'

export function DashboardPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <p className="eyebrow">MVP workspace</p>
        <h1>Upload anything and get a shareable link</h1>
        <p>Authentication is connected to the live API. File upload is isolated behind a mock adapter until backend file endpoints are available.</p>
      </section>

      <UploadDropzone />
    </div>
  )
}
