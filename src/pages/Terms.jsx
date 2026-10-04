import LegalPage, { H2, P, Ul } from "../components/LegalPage";

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="October 2026">
      <P>
        These Terms of Service ("Terms") govern your use of TradeFlow's web
        application and mobile apps (collectively, the "Service"), operated
        by TradeFlow LLC ("TradeFlow," "we," "us"). By creating an account or
        using the Service, you agree to these Terms.
      </P>

      <H2>1. Who May Use TradeFlow</H2>
      <P>
        TradeFlow is a business tool intended for trade contractor companies
        and their employees. A Company account is created by an authorized
        representative of that business ("Administrator"). Individual
        employee accounts are provisioned by the Company's Administrator.
      </P>

      <H2>2. Accounts</H2>
      <Ul>
        <li>You are responsible for keeping your login credentials secure.</li>
        <li>Administrators are responsible for managing who has access to their Company's account and data.</li>
        <li>You must provide accurate information when creating or updating your account.</li>
      </Ul>

      <H2>3. Subscriptions &amp; Billing</H2>
      <P>
        TradeFlow is offered to Companies on a subscription basis, billed
        through our payment processor (Clover) via the TradeFlow web
        application at <a href="https://app.tradeflowllc.com">app.tradeflowllc.com</a>.
        New Companies receive a free trial period as described at sign-up.
        Subscriptions renew automatically until cancelled by the Company's
        Administrator. Cancelling stops future billing; access continues
        through the end of the current paid period. The TradeFlow mobile
        apps do not themselves sell subscriptions or process payments —
        they are a login client for an account whose subscription is
        managed on the web.
      </P>

      <H2>4. Acceptable Use</H2>
      <P>You agree not to:</P>
      <Ul>
        <li>Use the Service for any unlawful purpose</li>
        <li>Attempt to access another Company's data without authorization</li>
        <li>Interfere with or disrupt the Service's operation or security</li>
        <li>Reverse engineer or resell the Service without our written consent</li>
      </Ul>

      <H2>5. Your Data</H2>
      <P>
        Your Company retains ownership of the data it enters into TradeFlow
        (time entries, job data, customer records, invoices, etc). We access
        this data only to operate, maintain, and support the Service, or as
        required by law. See our{" "}
        <a href="/privacy">Privacy Policy</a> for details on how we handle data.
      </P>

      <H2>6. Account Deletion</H2>
      <P>
        You may delete your individual account at any time from within the
        app (mobile Settings → Delete Account, or web Settings), or by
        emailing <a href="mailto:support@tradeflowllc.com">support@tradeflowllc.com</a>.
        Deleting the sole Administrator account for a Company also deletes
        that Company's TradeFlow data.
      </P>

      <H2>7. Service Availability</H2>
      <P>
        We aim to keep TradeFlow available and reliable but do not guarantee
        uninterrupted access. We may suspend or modify the Service for
        maintenance, security, or operational reasons.
      </P>

      <H2>8. Disclaimer &amp; Limitation of Liability</H2>
      <P>
        The Service is provided "as is" without warranties of any kind. To
        the maximum extent permitted by law, TradeFlow LLC is not liable for
        indirect, incidental, or consequential damages arising from your use
        of the Service.
      </P>

      <H2>9. Termination</H2>
      <P>
        We may suspend or terminate access to the Service for violation of
        these Terms, non-payment, or at our discretion with reasonable
        notice where practicable.
      </P>

      <H2>10. Changes to These Terms</H2>
      <P>
        We may update these Terms from time to time. Continued use of the
        Service after changes take effect constitutes acceptance of the
        revised Terms.
      </P>

      <H2>11. Contact</H2>
      <P>
        Questions about these Terms? Email{" "}
        <a href="mailto:support@tradeflowllc.com">support@tradeflowllc.com</a>.
      </P>
    </LegalPage>
  );
}
