import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { Button, Card, SectionHeading } from '../components/ui';
import heroImg from '../assets/doctor-patient.jpg';

const features = [
  {
    title: 'Patient Profiles',
    body: 'Condition, medications, follow-up schedule, and test history in one place.',
    icon: '◫',
  },
  {
    title: 'Medication Reminders',
    body: 'Keep dosing routines visible so patients stay consistent between visits.',
    icon: '◷',
  },
  {
    title: 'Checkup Reminders',
    body: 'Automatic signals as follow-up dates approach or become overdue.',
    icon: '◎',
  },
  {
    title: 'Health Logging',
    body: 'Patients record sugar, blood pressure, and weight in a few simple steps.',
    icon: '⌁',
  },
  {
    title: 'Trend Graphs',
    body: 'Turn readings into clear charts clinicians can review at a glance.',
    icon: '◔',
  },
  {
    title: 'Doctor Dashboard',
    body: 'See who is on track and who needs attention without digging through files.',
    icon: '▦',
  },
  {
    title: 'Missed Follow-Up Flags',
    body: 'Overdue checkups and quiet logging periods rise to the top.',
    icon: '!',
  },
  {
    title: 'Appointment Management',
    body: 'Request, confirm, reschedule, and cancel visits inside the same workflow.',
    icon: '◷',
  },
];

const steps = [
  { n: '01', title: 'Onboard', body: 'Doctor creates a patient profile with condition, medication, and follow-up cadence.' },
  { n: '02', title: 'Remind', body: 'CareTrack triggers checkup and medication reminders as dates approach.' },
  { n: '03', title: 'Log', body: 'Patients record sugar, BP, and weight between clinic visits.' },
  { n: '04', title: 'Monitor', body: 'Readings feed trend graphs visible to both patient and doctor.' },
  { n: '05', title: 'Flag', body: 'The dashboard highlights missed follow-ups and concerning patterns.' },
  { n: '06', title: 'Act', body: 'Clinicians reach out, adjust care, or schedule an earlier visit.' },
];

const faqs = [
  {
    q: 'Who is CareTrack for?',
    a: 'Small clinics and physicians managing chronic conditions like diabetes, hypertension, and asthma — plus their patients who need support between visits.',
  },
  {
    q: 'What can patients log?',
    a: 'Patients can log blood sugar, blood pressure (systolic and diastolic), and weight through the patient portal.',
  },
  {
    q: 'How do doctors know who needs attention?',
    a: 'The doctor dashboard flags missed follow-ups, high BP or sugar trends, overdue tests, quiet logging periods, and pending appointment requests.',
  },
  {
    q: 'Does CareTrack replace an EMR?',
    a: 'No. CareTrack focuses on the follow-up loop between visits — reminders, logging, trends, and actionable flags — without hospital-EMR complexity.',
  },
];

export default function Landing() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'doctor' ? '/doctor' : '/me'} replace />;
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="overflow-hidden bg-care-cream">
        <div className="ct-container grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-12 lg:py-20">
          <div>
            <p className="ct-kicker">Clinic follow-up · Chronic care</p>
            <h1 className="ct-display mt-3 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
              Chronic care doesn&apos;t stop when the appointment ends.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              CareTrack keeps patients connected between visits with reminders, health logging,
              trend monitoring, and actionable follow-up insights for clinics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/register" variant="navy">
                Get Started
              </Button>
              <Button as="a" href="#how-it-works" variant="secondary">
                See How It Works
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] shadow-soft">
              <img
                src={heroImg}
                alt="Doctor reviewing care details with a patient"
                className="h-[340px] w-full object-cover sm:h-[420px]"
              />
            </div>

            <div className="absolute -left-2 top-6 hidden max-w-[200px] rounded-2xl border border-line bg-white p-4 shadow-soft sm:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Patient follow-up</p>
              <p className="mt-1 font-semibold text-navy">BP logged today</p>
              <p className="text-xs text-care-teal">124 / 78 mmHg</p>
            </div>

            <div className="absolute -right-1 bottom-8 max-w-[220px] rounded-2xl border border-line bg-white p-4 shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">CareTrack signal</p>
              <p className="mt-1 font-semibold text-navy">Medication reminder sent</p>
              <p className="text-xs text-ink-muted">Follow-up due in 3 days</p>
              <span className="mt-2 inline-flex rounded-full bg-care-teal-light px-2.5 py-1 text-[10px] font-bold text-care-teal">
                On track
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy text-white">
        <div className="ct-container grid grid-cols-2 gap-6 py-10 md:grid-cols-4 md:gap-0">
          {[
            { value: '24/7', label: 'Patient engagement' },
            { value: '3×', label: 'Core monitoring signals' },
            { value: '100%', label: 'Follow-up visibility' },
            { value: '1', label: 'Connected care workflow' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`px-2 text-center md:border-r md:border-white/15 md:px-6 ${
                i === 3 ? 'md:border-r-0' : ''
              }`}
            >
              <p className="font-display text-3xl text-white">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-300 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="ct-section bg-white">
        <div className="ct-container grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-card shadow-card">
            <img
              src={heroImg}
              alt="Clinician and patient in consultation"
              className="h-[300px] w-full object-cover sm:h-[360px]"
            />
          </div>
          <div>
            <p className="ct-kicker">Who CareTrack is for</p>
            <h2 className="ct-display mt-2 text-3xl sm:text-4xl">
              Chronic disease isn&apos;t managed only during clinic visits.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Patients spend most of their time outside the clinic. Missed checkups, skipped
              medication, and silent trend changes are easy to miss until they become bigger
              problems. CareTrack closes that gap with a shared loop between doctors and patients.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Built for small clinics',
                'Clear health trends',
                'Smart follow-up signals',
                'Simple patient logging',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <span className="text-care-teal">✧</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="ct-section bg-care-cream">
        <div className="ct-container">
          <SectionHeading
            kicker="Core features"
            title="Everything needed for better follow-up"
            subtitle="One clean workflow for the clinic team and the patient — from reminders to trends."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, idx) => (
              <Card
                key={f.title}
                className={`p-5 transition hover:-translate-y-0.5 hover:shadow-soft ${
                  idx % 3 === 0 ? 'lg:col-span-1 bg-white' : 'bg-white'
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-care-teal-light text-lg text-care-teal">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced / dark */}
      <section id="for-doctors" className="ct-section bg-white">
        <div className="ct-container">
          <div className="rounded-[1.75rem] bg-navy p-8 text-white sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_repeat(5,1fr)] lg:items-start">
              <div className="lg:pr-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-teal-200">
                  Advanced care
                </p>
                <h2 className="font-display mt-2 text-3xl leading-tight sm:text-4xl">
                  See what happens between visits.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
                  Give clinic teams a focused workspace for chronic care monitoring — without chasing
                  every chart manually.
                </p>
              </div>
              {[
                { t: 'Health readings', d: 'Sugar, BP, and weight history.' },
                { t: 'Medication adherence', d: 'Reminder activity stays visible.' },
                { t: 'Missed follow-ups', d: 'Overdue checkups rise to the top.' },
                { t: 'Trend changes', d: 'Spot concerning patterns early.' },
                { t: 'Upcoming appointments', d: 'Keep visits organized.' },
              ].map((item) => (
                <div key={item.t} className="border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                  <p className="text-sm font-bold">{item.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="how-it-works" className="ct-section bg-care-cream">
        <div className="ct-container">
          <SectionHeading
            kicker="How CareTrack works"
            title="Onboard → Remind → Log → Monitor → Flag → Act"
            subtitle="A continuous care loop that builds a longitudinal health record for every patient."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <Card key={s.n} className="p-5">
                <p className="text-sm font-extrabold text-care-teal">{s.n}</p>
                <h3 className="mt-4 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor experience preview */}
      <section className="ct-section bg-white">
        <div className="ct-container">
          <SectionHeading
            kicker="Doctor experience"
            title="A dashboard built for follow-up visibility"
            subtitle="Total patients, attention flags, upcoming visits, and recent readings — designed for action."
          />
          <Card className="overflow-hidden p-0">
            <div className="border-b border-line bg-slate-50 px-5 py-4 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-wider text-care-teal">Clinic workspace preview</p>
              <h3 className="mt-1 font-display text-2xl text-navy">Doctor Dashboard</h3>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
              {[
                ['Total patients', 'Live from your clinic'],
                ['Needs attention', 'Flagged follow-ups'],
                ['Missed follow-ups', 'Overdue checkups'],
                ['Upcoming visits', 'Scheduled & requested'],
              ].map(([label, hint]) => (
                <div key={label} className="rounded-2xl border border-line bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
                  <p className="mt-2 font-display text-2xl text-navy">—</p>
                  <p className="mt-1 text-xs font-semibold text-care-teal">{hint}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 border-t border-line p-5 lg:grid-cols-2 sm:p-6">
              <div className="rounded-2xl border border-line p-4">
                <p className="font-semibold text-navy">Patients needing attention</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Flags for missed follow-ups, high BP/sugar trends, overdue tests, and pending
                  appointment requests appear here after you add patients.
                </p>
              </div>
              <div className="rounded-2xl border border-line p-4">
                <p className="font-semibold text-navy">Quick actions</p>
                <ul className="mt-2 space-y-2 text-sm text-ink-muted">
                  <li>• Add a patient profile</li>
                  <li>• Review trends and send a reminder</li>
                  <li>• Confirm or schedule appointments</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-line bg-care-cream px-5 py-4 sm:px-6">
              <Button as={Link} to="/register" variant="teal">
                Create clinic account →
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Patient experience */}
      <section id="for-patients" className="ct-section bg-care-cream">
        <div className="ct-container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="ct-kicker">Patient experience</p>
            <h2 className="ct-display mt-2 text-3xl sm:text-4xl">A simpler way to stay on track</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Patients see what matters today — readings, medication reminders, upcoming
              appointments, and follow-up status — without complex medical jargon.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Health overview',
                'Blood sugar, BP & weight',
                'Medication reminders',
                'Upcoming appointment',
                'Health trends',
                'Recent logs',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <span className="text-care-teal">✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-navy p-4 sm:p-5">
            <div className="rounded-2xl bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-care-teal">
                    CareTrack patient portal
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-navy">Your care at a glance</h3>
                </div>
                <span className="rounded-full bg-care-teal-light px-3 py-1 text-[10px] font-bold text-care-teal">
                  On track
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  ['Blood sugar', '—', 'mg/dL'],
                  ['Blood pressure', '—', 'mmHg'],
                  ['Weight', '—', 'kg'],
                ].map(([label, value, unit]) => (
                  <div key={label} className="rounded-xl border border-line p-3">
                    <p className="text-[10px] text-ink-muted">{label}</p>
                    <p className="mt-1 font-display text-xl text-navy">{value}</p>
                    <p className="text-[10px] font-semibold text-care-teal">{unit}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-line pt-4 text-sm">
                <p className="font-semibold text-navy">Today&apos;s reminder</p>
                <p className="mt-1 text-ink-muted">Medication and checkup reminders appear after your clinic onboards you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logging / trends */}
      <section className="ct-section bg-white">
        <div className="ct-container grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="ct-kicker">Health trends</p>
            <h2 className="ct-display mt-2 text-3xl sm:text-4xl">Logging that turns into insight</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Patients log readings quickly. Doctors review sugar, blood pressure, and weight trends
              without sorting through paper notes or scattered messages.
            </p>
          </div>
          <Card className="p-6">
            <p className="text-sm font-semibold text-navy">Trend preview</p>
            <div className="mt-4 flex h-36 items-end gap-2">
              {[40, 55, 48, 62, 58, 70, 66].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-care-teal to-care-blue/80"
                  style={{ height: `${h}%` }}
                  aria-hidden
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-muted">
              Charts use real patient readings from your CareTrack account — never fabricated medical data.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="ct-section bg-care-cream">
        <div className="ct-container">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[1.5rem] bg-navy p-8 text-white sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Keep the care journey moving.</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Connect your clinic team and patients with one simple follow-up experience.
              </p>
            </div>
            <Button as={Link} to="/register" variant="teal" className="shrink-0">
              Create Account →
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="ct-section bg-white">
        <div className="ct-container">
          <SectionHeading
            kicker="FAQ"
            title="Questions clinics and patients ask"
            subtitle="Clear answers about how CareTrack supports chronic care between visits."
          />
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((item) => (
              <details key={item.q} className="group rounded-card border border-line bg-white p-5 open:shadow-card">
                <summary className="cursor-pointer list-none font-semibold text-navy marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-care-teal transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
