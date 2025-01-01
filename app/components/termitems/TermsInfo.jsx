"use client";

import styles from "@/app/styles/about.module.css";

export default function TermsInfo() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContainerInner}>
        <p>
          Welcome to 433Tips! These Terms and Conditions govern the use of our website and services. By accessing 433Tips, you acknowledge and agree to abide by these Terms.
        </p>
        
        <h2>1. Use of Services</h2>
        <p>
          Our platform offers match predictions, analyses, and related sports content. While we strive for accuracy, predictions are speculative and may not guarantee specific outcomes.
        </p>

        <h2>2. VIP Subscription</h2>
        <p>
          Paid subscriptions grant exclusive access to premium content, but all payments are final and non-refundable.
        </p>

        <h2>3. Free Tips and Jackpot Tips</h2>
        <p>
          Free predictions are available as general information only and are not guaranteed.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          Content on 433Tips is protected by intellectual property laws and may not be reproduced or distributed without permission.
        </p>

        <h2>5. User Conduct</h2>
        <p>
          Users must comply with applicable laws and avoid disruptive or harmful activity on the platform.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          433Tips is not liable for any damages arising from the use of its services.
        </p>

        <h2>7. Third-Party Links</h2>
        <p>
          We are not responsible for content on third-party sites linked from our platform.
        </p>

        <h2>8. Modification of Terms</h2>
        <p>
          We may update these Terms at any time, so please review periodically.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms are governed by the laws applicable to 433Tips, with disputes under the jurisdiction of relevant courts.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          For any inquiries, please reach out to <a href="mailto:support@433tips.com">support@433tips.com</a>.
        </p>
      </div>
    </div>
  );
}
