import LegalPage, { H2, P, Ul } from "../components/LegalPage";

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <P>
        TradeFlow LLC ("TradeFlow," "we," "us," or "our") provides a workforce
        management platform (time clock, scheduling, job tracking, estimating,
        and invoicing) for trade contractor businesses, available via our web
        application and our iOS/Android mobile apps. This Privacy Policy
        explains what information we collect, how we use it, and the choices
        you have.
      </P>
      <P>
        TradeFlow is a business-to-business product. Your employer or the
        contracting company you work for ("the Company") controls the
        TradeFlow account and determines what information is collected about
        you as part of using the app for work.
      </P>

      <H2>1. Information We Collect</H2>
      <P><strong>Account information</strong> — name, email address, phone number, and role, provided when your Company creates your account or invites you.</P>
      <P><strong>Time &amp; job data</strong> — clock in/out times, assigned projects, timesheets, and job notes.</P>
      <P><strong>Location data</strong> — GPS coordinates captured when you clock in or out, and, where your Company has enabled jobsite geofencing, periodic background location while you are clocked in, used solely to detect arrival at or departure from a configured jobsite and prompt a clock-in/out reminder.</P>
      <P><strong>Photos &amp; camera</strong> — if you choose to scan a receipt or attach a project photo, the image you select or capture.</P>
      <P><strong>Contacts</strong> — only if you choose to use the "fill from contacts" feature when creating a customer or invoice; we do not access your contacts otherwise.</P>
      <P><strong>Billing information</strong> — your Company's subscription and payment details are processed by our payment processor (Clover); individual employees do not provide payment information through the mobile app.</P>
      <P><strong>Device &amp; usage data</strong> — device model, OS version, app version, crash logs, and push notification tokens.</P>

      <H2>2. How We Use Your Information</H2>
      <Ul>
        <li>Operate core features: time tracking, scheduling, job/project management, estimating, and invoicing</li>
        <li>Verify jobsite arrival/departure for geofenced clock-in/out, where enabled by your Company</li>
        <li>Send push notifications and reminders related to your shifts or account</li>
        <li>Provide customer support and respond to inquiries</li>
        <li>Maintain security, prevent fraud, and debug issues</li>
      </Ul>
      <P>We do not sell your personal information.</P>

      <H2>3. Who Can See Your Data</H2>
      <P>
        Data you generate in TradeFlow (time entries, location, photos, job
        activity) is visible to administrators and supervisors at your
        Company, since the platform exists to let a business manage its own
        workforce. It is not visible to other, unrelated companies using
        TradeFlow.
      </P>

      <H2>4. Service Providers</H2>
      <P>
        We use the following third parties to operate TradeFlow. Each
        processes data only as needed to provide their service to us:
      </P>
      <Ul>
        <li><strong>Supabase</strong> — database, authentication, and file storage</li>
        <li><strong>Clover</strong> — payment processing for Company subscriptions</li>
        <li><strong>Expo / Apple / Google</strong> — push notification delivery</li>
      </Ul>

      <H2>5. Data Retention &amp; Deletion</H2>
      <P>
        We retain your information for as long as your account is active or
        as needed to provide the service. You can request deletion of your
        account at any time directly from the app (Settings → Delete Account
        on mobile, or Settings on web), or by emailing{" "}
        <a href="mailto:support@tradeflowllc.com">support@tradeflowllc.com</a>.
        If you are the sole administrator of your Company's account,
        deleting your account also deletes your Company's TradeFlow data.
        If other administrators remain on the account, only your personal
        account is removed.
      </P>

      <H2>6. Your Choices</H2>
      <Ul>
        <li>Location permission can be denied or revoked in your device settings; this will disable geofenced clock-in/out but not prevent manual clock-in/out</li>
        <li>Camera, photo, and contacts permissions are optional and only requested when you use the related feature</li>
        <li>You can request a copy or deletion of your data by contacting support</li>
      </Ul>

      <H2>7. Children's Privacy</H2>
      <P>TradeFlow is a workplace tool and is not directed at children. We do not knowingly collect data from anyone under 16.</P>

      <H2>8. International Users</H2>
      <P>TradeFlow's infrastructure is hosted in the United States. By using TradeFlow, you consent to your information being processed and stored in the United States.</P>

      <H2>9. Changes to This Policy</H2>
      <P>We may update this Privacy Policy from time to time. Material changes will be reflected by updating the "Last updated" date above.</P>

      <H2>10. Contact Us</H2>
      <P>
        Questions about this policy or your data? Email us at{" "}
        <a href="mailto:support@tradeflowllc.com">support@tradeflowllc.com</a>.
      </P>
    </LegalPage>
  );
}
