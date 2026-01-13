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
          <a href="mailto:hindsight.trade@proton.me">hindsight.trade@proton.me</a>.
        </p>
      </section>
    </article>
  )
}

function TermsOfService() {
  return (
    <article className="legal-article">
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last Updated: January 13, 2026</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Hindsight ("the Platform," "we," "us," or "our") at tradehindsight.com,
          you ("User," "you," or "your") agree to be bound by these Terms of Service ("Terms"). If you
          do not agree to these Terms, do not use the Platform.
        </p>
        <p>
          We reserve the right to modify these Terms at any time. Continued use of the Platform after
          changes constitutes acceptance of the modified Terms.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          Hindsight is a trading journal, wallet analysis, and educational platform designed for
          cryptocurrency traders. Our services include:
        </p>
        <ul>
          <li><strong>Wallet Analysis:</strong> Analysis of publicly available blockchain transaction data</li>
          <li><strong>Trading Journal:</strong> Tools to log and reflect on trading decisions</li>
          <li><strong>AI Coaching:</strong> AI-powered feedback based on your trading patterns</li>
          <li><strong>Academy:</strong> Educational content about cryptocurrency trading</li>
          <li><strong>Archetype Assessment:</strong> Quizzes to identify your trading style</li>
        </ul>
      </section>

      <section className="legal-disclaimer">
        <h2>3. NOT FINANCIAL ADVICE</h2>
        <p><strong>THIS IS CRITICAL - PLEASE READ CAREFULLY:</strong></p>
        <p>
          Hindsight is an <strong>EDUCATIONAL AND INFORMATIONAL PLATFORM ONLY</strong>. Nothing on this
          Platform constitutes:
        </p>
        <ul>
          <li>Financial advice</li>
          <li>Investment advice</li>
          <li>Trading advice</li>
          <li>Tax advice</li>
          <li>Legal advice</li>
          <li>A recommendation to buy, sell, or hold any cryptocurrency, token, or financial instrument</li>
        </ul>
        <p>
          All analysis, insights, AI coaching responses, educational content, and other information
          provided through the Platform are for <strong>INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY</strong>.
        </p>
        <p>
          <strong>You are solely responsible for your own trading and investment decisions.</strong> Past
          performance does not guarantee future results. Cryptocurrency trading involves substantial risk
          of loss and is not suitable for all investors.
        </p>
        <p>
          We strongly recommend consulting with a qualified financial advisor, tax professional, or legal
          counsel before making any financial decisions.
        </p>
        <p><strong>By using this Platform, you acknowledge that:</strong></p>
        <ul>
          <li>You will not rely on any information from Hindsight as financial advice</li>
          <li>You understand cryptocurrency trading carries significant risk</li>
          <li>You are solely responsible for any losses you may incur</li>
          <li>Hindsight and its operators bear no liability for your trading decisions</li>
        </ul>
      </section>

      <section>
        <h2>4. Eligibility</h2>
        <p>To use Hindsight, you must:</p>
        <ul>
          <li>Be at least 18 years of age (or the age of majority in your jurisdiction)</li>
          <li>Have the legal capacity to enter into a binding agreement</li>
          <li>Not be prohibited from using the Platform under applicable laws</li>
          <li>Not be located in a jurisdiction where use of the Platform is prohibited</li>
        </ul>
      </section>

      <section>
        <h2>5. User Accounts</h2>
        <h3>5.1 Account Creation</h3>
        <p>You may need to create an account to access certain features. You agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Promptly update any changes to your information</li>
          <li>Accept responsibility for all activity under your account</li>
        </ul>

        <h3>5.2 Account Security</h3>
        <p>
          You are responsible for maintaining the confidentiality of your account. Notify us immediately
          of any unauthorized access or security breach.
        </p>

        <h3>5.3 Account Termination</h3>
        <p>We reserve the right to suspend or terminate accounts that:</p>
        <ul>
          <li>Violate these Terms</li>
          <li>Engage in fraudulent or illegal activity</li>
          <li>Abuse the Platform or other users</li>
          <li>Remain inactive for extended periods</li>
        </ul>
      </section>

      <section>
        <h2>6. $SIGHT Token and Pro Tier</h2>
        <h3>6.1 Pro Tier Access</h3>
        <p>
          Certain features ("Pro Features") require holding a minimum amount of $SIGHT tokens in a
          connected wallet. The current requirement is 0.25 SOL worth of $SIGHT tokens.
        </p>

        <h3>6.2 Token Disclaimer</h3>
        <ul>
          <li>$SIGHT is a utility token for Platform access only</li>
          <li>Holding $SIGHT does not represent equity, ownership, or investment in Hindsight</li>
          <li>$SIGHT has no guaranteed value and may lose value</li>
          <li>We make no promises about future token value or utility</li>
          <li>Token requirements for Pro access may change at our discretion</li>
          <li>$SIGHT is not a security and should not be purchased as an investment</li>
        </ul>

        <h3>6.3 No Refunds</h3>
        <p>
          Token purchases and Pro tier access are non-refundable. You are responsible for understanding
          the risks of cryptocurrency tokens before acquiring $SIGHT.
        </p>
      </section>

      <section>
        <h2>7. Wallet Connection and Data</h2>
        <h3>7.1 Public Blockchain Data</h3>
        <p>
          When you connect or analyze a wallet, we access <strong>publicly available blockchain data</strong>.
          This includes transaction history, token holdings, and other on-chain activity that is already
          visible to anyone on the blockchain.
        </p>

        <h3>7.2 No Private Key Access</h3>
        <p>
          Hindsight <strong>NEVER</strong> requests, stores, or has access to your private keys, seed phrases,
          or wallet passwords. If anyone claiming to represent Hindsight asks for this information, it is a scam.
        </p>

        <h3>7.3 Data Accuracy</h3>
        <p>
          Wallet analysis is based on blockchain data and third-party APIs. We do not guarantee the accuracy,
          completeness, or timeliness of any analysis or data displayed.
        </p>
      </section>

      <section>
        <h2>8. AI Coaching</h2>
        <h3>8.1 AI Limitations</h3>
        <p>Our AI coaching feature is powered by third-party AI models. AI responses:</p>
        <ul>
          <li>Are generated automatically and may contain errors</li>
          <li>Are not reviewed by humans before delivery</li>
          <li>Should not be relied upon as professional advice</li>
          <li>May not account for your complete financial situation</li>
        </ul>

        <h3>8.2 No Guarantee</h3>
        <p>
          We do not guarantee that AI coaching will improve your trading performance. Results vary and
          depend on many factors beyond our control.
        </p>
      </section>

      <section>
        <h2>9. User Content</h2>
        <h3>9.1 Your Content</h3>
        <p>
          You retain ownership of content you create on the Platform (journal entries, notes, etc.). By using
          the Platform, you grant us a limited license to store, process, and display your content to provide
          our services.
        </p>

        <h3>9.2 Prohibited Content</h3>
        <p>You agree not to submit content that:</p>
        <ul>
          <li>Is illegal, harmful, or offensive</li>
          <li>Infringes on intellectual property rights</li>
          <li>Contains malware or malicious code</li>
          <li>Attempts to manipulate or deceive other users</li>
          <li>Violates any applicable laws or regulations</li>
        </ul>
      </section>

      <section>
        <h2>10. Prohibited Uses</h2>
        <p>You agree NOT to:</p>
        <ul>
          <li>Use the Platform for illegal purposes</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with the Platform's operation or security</li>
          <li>Scrape, crawl, or harvest data from the Platform</li>
          <li>Impersonate others or misrepresent your identity</li>
          <li>Use bots or automated systems to abuse the Platform</li>
          <li>Circumvent Pro tier restrictions or payment requirements</li>
          <li>Share account access with others</li>
          <li>Use the Platform to promote scams or fraudulent projects</li>
          <li>Harass, abuse, or harm other users or our team</li>
        </ul>
      </section>

      <section>
        <h2>11. Intellectual Property</h2>
        <h3>11.1 Our Property</h3>
        <p>
          The Platform, including its design, code, content, logos, and trademarks, is owned by Hindsight
          and protected by intellectual property laws. You may not copy, modify, distribute, or create
          derivative works without our permission.
        </p>

        <h3>11.2 Feedback</h3>
        <p>
          If you provide feedback or suggestions, you grant us the right to use them without compensation
          or attribution.
        </p>
      </section>

      <section>
        <h2>12. Third-Party Services</h2>
        <p>The Platform integrates with third-party services including:</p>
        <ul>
          <li>Blockchain networks (Solana)</li>
          <li>Data providers (Helius)</li>
          <li>AI providers (Anthropic)</li>
          <li>Authentication providers</li>
        </ul>
        <p>
          We are not responsible for the availability, accuracy, or actions of third-party services. Your
          use of third-party services is subject to their respective terms.
        </p>
      </section>

      <section>
        <h2>13. Disclaimers</h2>
        <h3>13.1 "As Is" Basis</h3>
        <p>
          THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, OR NON-INFRINGEMENT.
        </p>

        <h3>13.2 No Guarantees</h3>
        <p>WE DO NOT GUARANTEE THAT:</p>
        <ul>
          <li>The Platform will be uninterrupted or error-free</li>
          <li>Analysis or data will be accurate or complete</li>
          <li>The Platform will meet your expectations</li>
          <li>Any errors will be corrected</li>
        </ul>

        <h3>13.3 Market Risks</h3>
        <p>
          CRYPTOCURRENCY MARKETS ARE HIGHLY VOLATILE. PAST PERFORMANCE DOES NOT INDICATE FUTURE RESULTS.
          YOU MAY LOSE SOME OR ALL OF YOUR INVESTMENT.
        </p>
      </section>

      <section>
        <h2>14. Limitation of Liability</h2>
        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
        <ul>
          <li>
            HINDSIGHT, ITS OPERATORS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
          </li>
          <li>
            OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS (OR $100
            IF YOU PAID NOTHING)
          </li>
          <li>
            WE ARE NOT LIABLE FOR ANY TRADING LOSSES, MISSED OPPORTUNITIES, OR FINANCIAL DECISIONS YOU MAKE
          </li>
        </ul>
      </section>

      <section>
        <h2>15. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Hindsight and its operators from any claims,
          damages, losses, or expenses (including legal fees) arising from:
        </p>
        <ul>
          <li>Your use of the Platform</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any third-party rights</li>
          <li>Your trading or investment decisions</li>
        </ul>
      </section>

      <section>
        <h2>16. Dispute Resolution</h2>
        <h3>16.1 Informal Resolution</h3>
        <p>
          Before filing any legal claim, you agree to contact us and attempt to resolve the dispute
          informally for at least 30 days.
        </p>

        <h3>16.2 Governing Law</h3>
        <p>
          These Terms are governed by the laws of the State of Texas, United States, without regard to
          conflict of law principles.
        </p>

        <h3>16.3 Arbitration</h3>
        <p>
          Any disputes not resolved informally shall be resolved through binding arbitration, except where
          prohibited by law. You waive the right to participate in class actions.
        </p>
      </section>

      <section>
        <h2>17. Modifications to Service</h2>
        <p>We reserve the right to:</p>
        <ul>
          <li>Modify or discontinue any feature at any time</li>
          <li>Change Pro tier requirements or pricing</li>
          <li>Update these Terms with reasonable notice</li>
          <li>Restrict access to certain jurisdictions</li>
        </ul>
      </section>

      <section>
        <h2>18. Contact</h2>
        <p>For questions about these Terms, contact us at:</p>
        <p>
          <strong>Email:</strong> <a href="mailto:hindsight.trade@proton.me">hindsight.trade@proton.me</a><br />
          <strong>Website:</strong> tradehindsight.com
        </p>
      </section>

      <section>
        <h2>19. Severability</h2>
        <p>
          If any provision of these Terms is found unenforceable, the remaining provisions will continue
          in effect.
        </p>
      </section>

      <section>
        <h2>20. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and
          Hindsight regarding your use of the Platform.
        </p>
      </section>

      <section className="legal-agreement-notice">
        <p>
          <strong>BY USING HINDSIGHT, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE
          BOUND BY THESE TERMS OF SERVICE.</strong>
        </p>
      </section>
    </article>
  )
}
