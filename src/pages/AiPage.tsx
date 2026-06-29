export function AiPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <p className="eyebrow">AI tools</p>
        <h1>Transcribe, summarize, translate, and extract</h1>
        <p>This section is ready for the AI endpoints planned in the PasteLink roadmap.</p>
      </section>

      <div className="feature-grid">
        {['AI Transcription', 'AI Summary', 'AI Translation', 'AI Chat with Files', 'AI Data Extraction'].map((feature) => (
          <article className="feature-tile" key={feature}>
            <h2>{feature}</h2>
            <p>Connect this tile to its API action when the backend publishes the endpoint.</p>
          </article>
        ))}
      </div>
    </div>
  )
}
