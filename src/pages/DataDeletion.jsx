import LegalPage, { H2, P, Ul } from "../components/LegalPage";

export default function DataDeletion() {
  return (
    <LegalPage title="Account & Data Deletion" updated="October 2026">
      <P>
        You can permanently delete your TradeFlow account and data in two
        ways:
      </P>

      <H2>1. In the App (Fastest)</H2>
      <Ul>
        <li><strong>Mobile:</strong> Settings tab → Danger Zone → Delete Account → type DELETE to confirm.</li>
        <li><strong>Web:</strong> Settings → Danger Zone → Delete Account.</li>
      </Ul>
      <P>
        This deletes your account immediately. If other administrators
        remain on your Company's account, only your personal account is
        removed. If you are the sole administrator, your Company's TradeFlow
        data is deleted as well.
      </P>

      <H2>2. By Email</H2>
      <P>
        If you can't access the app, email{" "}
        <a href="mailto:support@tradeflowllc.com">support@tradeflowllc.com</a>{" "}
        with the subject line "Account Deletion Request" and include your
        full name and the email address on your TradeFlow account. We
        respond within 7 business days and complete deletion within 30 days.
      </P>

      <H2>What Gets Deleted</H2>
      <Ul>
        <li>Account information — name, email, login credentials</li>
        <li>Time clock entries and location data tied to your clock-ins/outs</li>
        <li>Project assignments and work history</li>
        <li>Profile information</li>
      </Ul>
      <P>
        Your employer/Company may retain anonymized timesheet records as
        required for payroll and legal compliance, even after your personal
        account is deleted.
      </P>

      <H2>Questions</H2>
      <P>
        Email <a href="mailto:support@tradeflowllc.com">support@tradeflowllc.com</a>.
      </P>
    </LegalPage>
  );
}
