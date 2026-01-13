import { useParams, useNavigate, Link } from 'react-router-dom'

// Legal page component for Privacy Policy and Terms of Service
export default function Legal() {
  const { page } = useParams()
  const navigate = useNavigate()

  const isPrivacy = page === 'privacy'
  const isTerms = page === 'terms'

  // Redirect to privacy if invalid page
  if (!isPrivacy && !isTerms) {
    navigate('/legal/privacy', { replace: true })
    return null
  }

  return (
    <div className="legal-page">
      {/* Header */}
      <header className="legal-header">
        <div className="legal-header-content">
          <Link to="/" className="legal-logo">
            <img src="/hindsightlogo.png" alt="Hindsight" className="legal-logo-img" />
            <span className="legal-logo-text">hindsight</span>
          </Link>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="legal-nav">
        <div className="legal-nav-content">
          <Link
            to="/legal/privacy"
            className={`legal-nav-tab ${isPrivacy ? 'active' : ''}`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/legal/terms"
            className={`legal-nav-tab ${isTerms ? 'active' : ''}`}
          >
            Terms of Service
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="legal-content">
        <div className="legal-container">
          {isPrivacy ? <PrivacyPolicy /> : <TermsOfService />}
        </div>
      </main>

      {/* Footer */}
      <footer className="legal-footer">
        <p>© 2025 Hindsight. All rights reserved.</p>
        <Link to="/" className="legal-footer-link">Back to Home</Link>
      </footer>
    </div>
  )
}

function PrivacyPolicy() {
  return (
    <article className="legal-article">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: January 2025</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Hindsight ("we," "our," or "us"). This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our trading analytics platform
          and related services.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>

        <h3>2.1 Information You Provide</h3>
        <ul>
          <li><strong>Account Information:</strong> Username and password when you create an account</li>
          <li><strong>Wallet Addresses:</strong> Solana wallet addresses you submit for analysis</li>
          <li><strong>Journal Entries:</strong> Trading notes and reflections you create</li>
          <li><strong>Quiz Responses:</strong> Answers to our trader archetype assessment</li>
        </ul>

        <h3>2.2 Information Collected Automatically</h3>
        <ul>
          <li><strong>Blockchain Data:</strong> Publicly available transaction history from submitted wallet addresses</li>
          <li><strong>Usage Data:</strong> How you interact with our platform (pages visited, features used)</li>
          <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide trading behavior analysis and insights</li>
          <li>Personalize your experience based on your trader archetype</li>
          <li>Operate and improve our AI coaching features</li>
          <li>Track your learning progress in Hindsight Academy</li>
          <li>Communicate important updates about our service</li>
          <li>Prevent fraud and ensure platform security</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing</h2>
        <p>We do not sell your personal information. We may share data with:</p>
        <ul>
          <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., hosting, analytics)</li>
          <li><strong>Blockchain Data Providers:</strong> APIs used to fetch public transaction data</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
        </ul>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data, including encryption
          in transit and at rest. However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Delete your account and associated data</li>
          <li>Export your data in a portable format</li>
        </ul>
        <p>To exercise these rights, visit your account settings or contact us.</p>
      </section>

      <section>
        <h2>7. Cookies and Tracking</h2>
        <p>
          We use essential cookies for authentication and session management. We also use
          analytics tools to understand how users interact with our platform. You can manage
          cookie preferences in your browser settings.
        </p>
      </section>

      <section>
        <h2>8. Children's Privacy</h2>
        <p>
          Hindsight is not intended for users under 18 years of age. We do not knowingly collect
          information from minors.
        </p>
      </section>

      <section>
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant
          changes by posting a notice on our platform.
        </p>
      </section>

      <section>
        <h2>10. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@tradehindsight.com">privacy@tradehindsight.com</a>.
        </p>
      </section>
    </article>
  )
}

function TermsOfService() {
  return (
    <article className="legal-article">
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: January 2025</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Hindsight ("the Platform"), you agree to be bound by these Terms of
          Service. If you do not agree to these terms, do not use the Platform.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          Hindsight provides trading behavior analytics, educational content, and AI-powered coaching
          for cryptocurrency traders. The Platform analyzes publicly available blockchain data to
          provide insights about trading patterns.
        </p>
      </section>

      <section className="legal-disclaimer">
        <h2>3. Important Disclaimer - Not Financial Advice</h2>
        <p>
          <strong>HINDSIGHT DOES NOT PROVIDE FINANCIAL, INVESTMENT, LEGAL, OR TAX ADVICE.</strong>
        </p>
        <p>
          The information, analysis, and educational content provided on this Platform is for
          informational and educational purposes only. Nothing on this Platform should be construed as:
        </p>
        <ul>
          <li>A recommendation to buy, sell, or hold any cryptocurrency or token</li>
          <li>Investment advice or financial planning services</li>
          <li>A guarantee of future trading performance</li>
          <li>Professional financial or legal counsel</li>
        </ul>
        <p>
          Trading cryptocurrencies involves substantial risk of loss. You should consult with a
          qualified financial advisor before making any investment decisions. Past performance
          does not guarantee future results.
        </p>
      </section>

      <section>
        <h2>4. User Accounts</h2>
        <p>You are responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Providing accurate and current information</li>
          <li>Notifying us immediately of any unauthorized access</li>
        </ul>
      </section>

      <section>
        <h2>5. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Platform for any illegal purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with or disrupt the Platform's operation</li>
          <li>Scrape, data mine, or extract data without permission</li>
          <li>Impersonate others or misrepresent your affiliation</li>
          <li>Use the Platform to harass, abuse, or harm others</li>
        </ul>
      </section>

      <section>
        <h2>6. Pro Features and $SIGHT Token</h2>
        <p>
          Certain features require Pro status, which may be obtained by holding the $SIGHT token.
          Token holdings are verified through on-chain data. We reserve the right to modify Pro
          requirements at any time.
        </p>
        <p>
          <strong>Note:</strong> Holding $SIGHT does not constitute an investment in Hindsight or
          guarantee any returns. Token value may fluctuate and you may lose your entire investment.
        </p>
      </section>

      <section>
        <h2>7. Intellectual Property</h2>
        <p>
          All content, features, and functionality of the Platform are owned by Hindsight and
          protected by intellectual property laws. You may not copy, modify, distribute, or
          create derivative works without our permission.
        </p>
      </section>

      <section>
        <h2>8. Third-Party Services</h2>
        <p>
          The Platform may integrate with or link to third-party services (e.g., blockchain data
          providers, exchanges). We are not responsible for the content, privacy practices, or
          availability of these third-party services.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, HINDSIGHT SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO
          LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
        </p>
        <ul>
          <li>Your use or inability to use the Platform</li>
          <li>Any trading decisions made based on Platform content</li>
          <li>Unauthorized access to your data</li>
          <li>Errors, bugs, or interruptions in service</li>
          <li>Third-party conduct or content</li>
        </ul>
      </section>

      <section>
        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Hindsight and its affiliates from any claims,
          damages, or expenses arising from your use of the Platform or violation of these Terms.
        </p>
      </section>

      <section>
        <h2>11. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the Platform at any time,
          with or without cause, and with or without notice. You may also delete your account
          at any time through account settings.
        </p>
      </section>

      <section>
        <h2>12. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. Continued use of the Platform after changes
          constitutes acceptance of the modified Terms.
        </p>
      </section>

      <section>
        <h2>13. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with applicable laws,
          without regard to conflict of law principles.
        </p>
      </section>

      <section>
        <h2>14. Contact</h2>
        <p>
          For questions about these Terms, contact us at{' '}
          <a href="mailto:legal@tradehindsight.com">legal@tradehindsight.com</a>.
        </p>
      </section>
    </article>
  )
}
