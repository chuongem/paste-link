export function WalletPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <p className="eyebrow">Credits</p>
        <h1>Wallet and subscriptions</h1>
        <p>The UI mirrors the credit model from the product brief and is ready for billing endpoints.</p>
      </section>

      <section className="pricing-grid">
        {[
          ['$5', '500 credits'],
          ['$10', '1,100 credits'],
          ['$20', '2,400 credits'],
          ['$50', '6,500 credits'],
        ].map(([price, credits]) => (
          <article className="feature-tile" key={price}>
            <h2>{price}</h2>
            <p>{credits}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
