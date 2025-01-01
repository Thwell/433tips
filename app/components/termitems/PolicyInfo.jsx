import styles from "@/app/styles/about.module.css";

export default function Policy() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutWrapper}>
      <div className={styles.aboutContainerInner}>
          <h1>Refund Policy</h1>

          <h2>Overview</h2>
          <p>
            This Policy governs returns and refunds for the VIP subscription
            services on 433Tips. By subscribing, you accept these terms.
          </p>

          <h2>No Refund Policy</h2>
          <p>
            VIP subscriptions provide access to exclusive sports predictions and
            content. Payments are non-refundable.
          </p>

          <h2>Quality Commitment</h2>
          <p>
            We strive to provide accurate predictions; however, the dynamic nature of
            sports means outcomes are inherently unpredictable.
          </p>

          <h2>Subscription Cancellation</h2>
          <p>
            Subscriptions can be canceled at any time, but access continues until
            the billing cycle ends. No partial refunds are issued.
          </p>

          <h2>Technical Issues</h2>
          <p>
            We address technical issues promptly; however, they do not
            qualify for refunds due to the intangible nature of our services.
          </p>

          <h2>Subscription Modifications</h2>
          <p>
            We may update subscription offerings without entitling subscribers to
            refunds for fees already paid.
          </p>

          <h2>Dispute Resolution</h2>
          <p>
            Disputes regarding subscription services are subject to arbitration
            and the jurisdiction outlined in our Terms of Use.
          </p>

          <h2>Contact for Refunds</h2>
          <p>
            For refund-related inquiries, please contact{" "}
            <a href="mailto:support@433tips.com">support@433tips.com</a>.
          </p>
        </div>
        <div className={styles.aboutContainerInner}>
          <h1>Privacy Policy</h1>
          <h2>Introduction</h2>
          <p>
            Welcome to 433Tips! This Privacy Policy outlines our practices regarding the
            collection, use, and protection of your information when using our
            services. By accessing 433Tips, you agree to these terms.
          </p>

          <h2>Information We Collect</h2>
          <p>
            <strong>Personal Information:</strong> Includes your name, email,
            and contact information provided during registration or usage.
          </p>
          <p>
            <strong>Usage Data:</strong> Data on how you interact with the
            website, such as IP address and pages viewed.
          </p>
          <p>
            <strong>Cookies:</strong> We use cookies to analyze browsing patterns.
            You can manage these in your browser settings.
          </p>

          <h2>Use of Information</h2>
          <p>To provide and improve our services.</p>
          <p>To personalize content and enhance user experience.</p>
          <p>To respond to inquiries and send updates.</p>
          <p>To analyze usage and improve website functionality.</p>

          <h2>Data Sharing</h2>
          <p>We may share information with:</p>
          <p>Service providers assisting us with website operations.</p>
          <p>Partners and affiliates for marketing purposes.</p>
          <p>Law enforcement when required by law.</p>

          <h2>Third-Party Links</h2>
          <p>
            We are not responsible for the privacy practices of third-party
            websites linked on our site. We recommend reviewing their privacy policies.
          </p>

          <h2>Security</h2>
          <p>
            We employ reasonable measures to protect your data, though no online
            method is completely secure.
          </p>

          <h2>Your Rights</h2>
          <p>Access, update, or delete your data.</p>
          <p>Opt-out of promotional emails.</p>
          <p>Manage cookies through your browser settings.</p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for individuals under 18, and we do not
            knowingly collect their information.
          </p>

          <h2>Policy Updates</h2>
          <p>
            We may update this Policy periodically. Significant updates will be posted on
            our website.
          </p>

          <h2>Contact</h2>
          <p>
            For any questions, please contact us at{" "}
            <a href="mailto:support@433tips.com">support@433tips.com</a>.
          </p>
        </div>
       
      </div>
    </div>
  );
}
