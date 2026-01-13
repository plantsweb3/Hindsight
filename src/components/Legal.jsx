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
      <p className="legal-updated">Last Updated: January 13, 2026</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Hindsight ("we," "us," or "our") respects your privacy and is committed to protecting your
          personal data. This Privacy Policy explains how we collect, use, store, and protect your
          information when you use our platform at tradehindsight.com ("the Platform").
        </p>
        <p>By using Hindsight, you consent to the practices described in this Privacy Policy.</p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>

        <h3>2.1 Information You Provide</h3>
        <p><strong>Account Information:</strong></p>
        <ul>
          <li>Email address</li>
          <li>Username/display name</li>
          <li>Password (encrypted)</li>
          <li>Profile preferences</li>
        </ul>

        <p><strong>Trading Journal Data:</strong></p>
        <ul>
          <li>Journal entries and notes you create</li>
          <li>Tags and categories you assign</li>
          <li>Trade reflections and analysis</li>
        </ul>

        <p><strong>Quiz and Assessment Data:</strong></p>
        <ul>
          <li>Archetype quiz responses</li>
          <li>Placement test answers and scores</li>
          <li>Academy progress and completion data</li>
        </ul>

        <p><strong>Communications:</strong></p>
        <ul>
          <li>Support requests</li>
          <li>Feedback and suggestions</li>
          <li>AI coaching conversations</li>
        </ul>

        <h3>2.2 Wallet and Blockchain Data</h3>
        <p>When you connect or analyze a wallet, we access <strong>publicly available blockchain data</strong> including:</p>
        <ul>
          <li>Wallet addresses (public keys only)</li>
          <li>Transaction history</li>
          <li>Token holdings and transfers</li>
          <li>Trading activity timestamps</li>
          <li>Profit/loss calculations derived from on-chain data</li>
        </ul>
        <p><strong>IMPORTANT:</strong> We <strong>NEVER</strong> collect, request, or store:</p>
        <ul>
          <li>Private keys</li>
          <li>Seed phrases / recovery phrases</li>
          <li>Wallet passwords</li>
          <li>Any credentials that control your funds</li>
        </ul>

        <h3>2.3 Automatically Collected Information</h3>
        <p><strong>Usage Data:</strong></p>
        <ul>
          <li>Pages visited and features used</li>
          <li>Time spent on the Platform</li>
          <li>Click patterns and navigation</li>
          <li>Feature engagement metrics</li>
        </ul>

        <p><strong>Device Information:</strong></p>
        <ul>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Device type (desktop/mobile)</li>
          <li>Screen resolution</li>
        </ul>

        <p><strong>Technical Data:</strong></p>
        <ul>
          <li>IP address</li>
          <li>Approximate location (country/region level)</li>
          <li>Referring website</li>
          <li>Session identifiers</li>
        </ul>

        <h3>2.4 Cookies and Similar Technologies</h3>
        <p>We use cookies and similar tracking technologies to:</p>
        <ul>
          <li>Keep you logged in</li>
          <li>Remember your preferences</li>
          <li>Analyze Platform usage</li>
          <li>Improve user experience</li>
        </ul>
        <p>
          You can control cookies through your browser settings, but some features may not work
          properly without them.
        </p>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use collected information to:</p>

        <h3>3.1 Provide Our Services</h3>
        <ul>
          <li>Analyze wallet transaction data</li>
          <li>Generate trading insights and statistics</li>
          <li>Power AI coaching conversations</li>
          <li>Track your Academy progress</li>
          <li>Store your journal entries</li>
          <li>Determine your trader archetype</li>
        </ul>

        <h3>3.2 Improve the Platform</h3>
        <ul>
          <li>Understand how users interact with features</li>
          <li>Identify bugs and technical issues</li>
          <li>Develop new features based on usage patterns</li>
          <li>Optimize performance and user experience</li>
        </ul>

        <h3>3.3 Communicate With You</h3>
        <ul>
          <li>Send important service updates</li>
          <li>Respond to support requests</li>
          <li>Notify you of changes to our Terms or Privacy Policy</li>
          <li>Send optional educational content (with your consent)</li>
        </ul>

        <h3>3.4 Security and Compliance</h3>
        <ul>
          <li>Detect and prevent fraud or abuse</li>
          <li>Enforce our Terms of Service</li>
          <li>Comply with legal obligations</li>
          <li>Protect the rights of users and third parties</li>
        </ul>
      </section>

      <section>
        <h2>4. AI Coaching and Data Processing</h2>

        <h3>4.1 How AI Coaching Works</h3>
        <p>Our AI coaching feature uses your data to provide personalized feedback:</p>
        <ul>
          <li>Your archetype and trading style</li>
          <li>Patterns from your wallet analysis</li>
          <li>Themes from your journal entries</li>
          <li>Your Academy progress and weak areas</li>
        </ul>

        <h3>4.2 Third-Party AI Processing</h3>
        <p>AI coaching is powered by Anthropic's Claude API. When you use AI coaching:</p>
        <ul>
          <li>Your conversation is sent to Anthropic for processing</li>
          <li>Anthropic processes the data to generate responses</li>
          <li>Anthropic's data practices are governed by their privacy policy</li>
        </ul>

        <h3>4.3 Conversation Storage</h3>
        <ul>
          <li>AI coaching conversations are stored to maintain chat history</li>
          <li>You can delete conversations at any time</li>
          <li>Deleted conversations are removed from our systems</li>
        </ul>
      </section>

      <section>
        <h2>5. Data Sharing and Disclosure</h2>

        <h3>5.1 We Do NOT Sell Your Data</h3>
        <p>
          We do not sell, rent, or trade your personal information to third parties for marketing purposes.
        </p>

        <h3>5.2 Service Providers</h3>
        <p>We share data with trusted service providers who help operate the Platform:</p>
        <div className="legal-table">
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Purpose</th>
                <th>Data Shared</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Helius</td>
                <td>Blockchain data API</td>
                <td>Wallet addresses (public)</td>
              </tr>
              <tr>
                <td>Anthropic</td>
                <td>AI coaching</td>
                <td>Conversation content</td>
              </tr>
              <tr>
                <td>Vercel</td>
                <td>Hosting</td>
                <td>Technical/usage data</td>
              </tr>
              <tr>
                <td>Turso</td>
                <td>Database</td>
                <td>All stored user data (encrypted)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          These providers are contractually obligated to protect your data and use it only for
          providing their services.
        </p>

        <h3>5.3 Legal Requirements</h3>
        <p>We may disclose information if required by law, such as:</p>
        <ul>
          <li>In response to valid legal process (subpoenas, court orders)</li>
          <li>To protect our rights or property</li>
          <li>To prevent fraud or illegal activity</li>
          <li>In connection with a merger, acquisition, or sale of assets</li>
        </ul>

        <h3>5.4 Aggregated/Anonymized Data</h3>
        <p>
          We may share aggregated, anonymized data that cannot identify you (e.g., "50% of users
          are FOMO Traders"). This data contains no personal information.
        </p>
      </section>

      <section>
        <h2>6. Data Security</h2>

        <h3>6.1 Security Measures</h3>
        <p>We implement industry-standard security measures:</p>
        <ul>
          <li>Encryption of data in transit (HTTPS/TLS)</li>
          <li>Encryption of sensitive data at rest</li>
          <li>Secure password hashing</li>
          <li>Regular security audits</li>
          <li>Access controls and authentication</li>
          <li>Rate limiting to prevent abuse</li>
        </ul>

        <h3>6.2 Your Responsibilities</h3>
        <p>You are responsible for:</p>
        <ul>
          <li>Keeping your login credentials secure</li>
          <li>Using a strong, unique password</li>
          <li>Logging out on shared devices</li>
          <li>Reporting any suspicious activity</li>
        </ul>

        <h3>6.3 No Guarantee</h3>
        <p>
          While we take security seriously, no system is 100% secure. We cannot guarantee absolute
          security of your data.
        </p>
      </section>

      <section>
        <h2>7. Data Retention</h2>

        <h3>7.1 How Long We Keep Data</h3>
        <div className="legal-table">
          <table>
            <thead>
              <tr>
                <th>Data Type</th>
                <th>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account information</td>
                <td>Until you delete your account</td>
              </tr>
              <tr>
                <td>Journal entries</td>
                <td>Until you delete them or your account</td>
              </tr>
              <tr>
                <td>Wallet analysis results</td>
                <td>Until you delete them or your account</td>
              </tr>
              <tr>
                <td>AI coaching conversations</td>
                <td>Until you delete them or your account</td>
              </tr>
              <tr>
                <td>Quiz/assessment results</td>
                <td>Until you delete your account</td>
              </tr>
              <tr>
                <td>Usage analytics</td>
                <td>24 months (anonymized thereafter)</td>
              </tr>
              <tr>
                <td>Server logs</td>
                <td>90 days</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>7.2 Account Deletion</h3>
        <p>When you delete your account:</p>
        <ul>
          <li>Your personal data is deleted within 30 days</li>
          <li>Some anonymized/aggregated data may be retained</li>
          <li>Backups are purged according to our backup retention schedule</li>
          <li>Data shared with third parties is subject to their retention policies</li>
        </ul>
      </section>

      <section>
        <h2>8. Your Rights and Choices</h2>

        <h3>8.1 Access and Portability</h3>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request a copy of your data in a portable format</li>
          <li>Know what data we have collected about you</li>
        </ul>

        <h3>8.2 Correction</h3>
        <p>
          You can update or correct your account information at any time through your account settings.
        </p>

        <h3>8.3 Deletion</h3>
        <p>You can:</p>
        <ul>
          <li>Delete individual journal entries, conversations, or wallets</li>
          <li>Delete your entire account (which removes all your data)</li>
          <li>Request deletion by contacting us</li>
        </ul>

        <h3>8.4 Opt-Out</h3>
        <p>You can opt out of:</p>
        <ul>
          <li>Marketing communications (unsubscribe link in emails)</li>
          <li>Optional analytics (contact us)</li>
          <li>Cookies (through browser settings)</li>
        </ul>

        <h3>8.5 Restrictions</h3>
        <p>Some data may be retained for legal compliance even after deletion requests.</p>
      </section>

      <section>
        <h2>9. Children's Privacy</h2>
        <p>
          Hindsight is not intended for users under 18 years of age. We do not knowingly collect
          data from children. If we discover we have collected data from a child, we will delete
          it promptly.
        </p>
      </section>

      <section>
        <h2>10. International Users</h2>

        <h3>10.1 Data Location</h3>
        <p>
          Our servers are located in the United States. By using the Platform, you consent to the
          transfer of your data to the United States.
        </p>

        <h3>10.2 GDPR (European Users)</h3>
        <p>If you are in the European Economic Area, you have additional rights under GDPR:</p>
        <ul>
          <li>Right to access</li>
          <li>Right to rectification</li>
          <li>Right to erasure</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object</li>
          <li>Right to withdraw consent</li>
        </ul>
        <p>
          To exercise these rights, contact us at{' '}
          <a href="mailto:hindsight.trade@proton.me">hindsight.trade@proton.me</a>.
        </p>

        <h3>10.3 CCPA (California Users)</h3>
        <p>California residents have rights under the CCPA:</p>
        <ul>
          <li>Right to know what data is collected</li>
          <li>Right to delete personal information</li>
          <li>Right to opt-out of data sales (we don't sell data)</li>
          <li>Right to non-discrimination</li>
        </ul>
      </section>

      <section>
        <h2>11. Third-Party Links</h2>
        <p>
          The Platform may contain links to third-party websites. We are not responsible for the
          privacy practices of these sites. Review their privacy policies before providing any
          information.
        </p>
      </section>

      <section>
        <h2>12. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. When we make significant changes:</p>
        <ul>
          <li>We will post the updated policy on this page</li>
          <li>We will update the "Last Updated" date</li>
          <li>We may notify you via email or Platform notification</li>
        </ul>
        <p>
          Your continued use of the Platform after changes constitutes acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h2>13. Contact Us</h2>
        <p>For questions, concerns, or requests regarding this Privacy Policy or your data:</p>
        <p>
          <strong>Email:</strong> <a href="mailto:hindsight.trade@proton.me">hindsight.trade@proton.me</a>
        </p>
        <p><strong>For data deletion or access requests:</strong></p>
        <p>Email us with the subject line "Data Request" and include:</p>
        <ul>
          <li>Your account email</li>
          <li>The specific request (access, deletion, correction)</li>
          <li>Any relevant details</li>
        </ul>
        <p>We will respond within 30 days.</p>
      </section>

      <section className="legal-summary">
        <h2>14. Summary</h2>
        <p><strong>In plain language:</strong></p>
        <ul>
          <li>We collect data to provide wallet analysis, AI coaching, and educational features</li>
          <li>We access public blockchain data only - never your private keys</li>
          <li>We use trusted third parties (Helius, Anthropic) to power our features</li>
          <li>We don't sell your data</li>
          <li>You can delete your data at any time</li>
          <li>We take security seriously but can't guarantee perfection</li>
          <li>Contact us if you have questions</li>
        </ul>
      </section>

      <section className="legal-agreement-notice">
        <p>
          <strong>BY USING HINDSIGHT, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS PRIVACY POLICY.</strong>
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
