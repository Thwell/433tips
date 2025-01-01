"use client";

import styles from "@/app/styles/about.module.css";

export default function Disclaimer() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContainerInner}>
        <h2>Disclaimer</h2>
        <p>
          The information and analysis provided on 433Tips is intended for
          informational and entertainment purposes only. By accessing or using
          the Website, you acknowledge and agree to the terms and conditions set
          forth in this Disclaimer. The following statement elucidates the
          scope, limitations, and implications of the content presented on the
          Website.
        </p>
        <p>
          <h2>No Guarantees or Warranties</h2>
          The predictions, analyses, and opinions expressed on the Website are
          based on a synthesis of historical data, statistical models, and
          heuristic algorithms. However, they should not be construed as a
          guarantee of accuracy, reliability, or predictive certainty. We make
          no representations or warranties, express or implied, regarding the
          correctness, timeliness, completeness, or suitability of the
          information provided.
        </p>
        <p>
          <h2>Assumption of Risks</h2>
          You acknowledge that sports predictions inherently involve
          uncertainties and variables that may impact the outcome of events.
          Engaging with the Website&apos;s content involves a degree of risk, and you
          expressly assume all such risks associated with acting upon or relying
          upon the information presented herein.
        </p>
        <p>
          <h2>No Financial or Legal Advice</h2>
          The content presented on the Website does not constitute financial,
          investment, legal, or professional advice. You are advised to consult
          with qualified professionals before making any financial or legal
          decisions based on the information provided on the Website. However,
          our tipsters do their very best to ensure you have quality tips at
          your fingertips.
        </p>
        <p>
          <h2>Limitation of Liability</h2>
          In no event shall 433Tips or its affiliates, partners, directors,
          officers, employees, agents, or representatives be liable for any
          direct, indirect, incidental, special, or consequential damages
          arising out of or in connection with the use or misuse of the
          Website&apos;s content.
        </p>
        <p>
          <h2>Third-Party Content</h2>
          The Website may contain links to third-party websites or content. We
          do not endorse or control such content and disclaim any responsibility
          for the accuracy, legality, or reliability of third-party information.
        </p>
        <p>
          <h2>Intellectual Property</h2>
          The intellectual property rights, including copyrights and trademarks,
          pertaining to the Website&apos;s content belong to 433Tips or its
          licensors. Reproduction, distribution, or modification of the content
          without explicit authorization is prohibited.
        </p>
        <p>
          <h2>Jurisdiction</h2>
          This Disclaimer shall be governed by and construed in accordance with
          the laws of 433Tips. Any disputes arising from the use of the Website
          shall be subject to the exclusive jurisdiction of the competent courts
          of 433Tips.
        </p>
        <p>
          <h2>Changes to this Disclaimer</h2>
          433Tips reserves the right to modify, amend, or update this Disclaimer
          at any time without notice. Users are encouraged to review this
          Disclaimer periodically for changes.
        </p>
      </div>
    </div>
  );
}
