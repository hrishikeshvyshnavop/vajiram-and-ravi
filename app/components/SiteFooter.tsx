import FooterWordmark from "./FooterWordmark";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";

// Footer laid out like primefold's (brand + signup on the left, link columns on the right,
// legal row below); the links and contact details are the current V&R site's own.

const columns = [
  {
    title: "Courses",
    links: [
      "UPSC GS Course 2027",
      "UPSC GS Online Course 2027",
      "UPSC 2 Year Course",
      "UPSC 2 Year Online Course",
      "UPSC Online Coaching",
      "UPSC CSAT Course",
      "Current Affairs Course",
      "UPSC Study Material",
    ],
  },
  {
    title: "Test series & mentorship",
    links: [
      "UPSC Prelims Test Series 2027",
      "UPSC Mains Test Series 2027",
      "Mains Test Series Hindi Medium",
      "UPSC Optional Test Series",
      "UPSC Mentorship Program 2027",
      "Mentorship Program Hindi Medium",
      "Interview Guidance Program (IGP)",
    ],
  },
  {
    title: "UPSC exam",
    links: [
      "UPSC 2027",
      "UPSC Exam Pattern",
      "UPSC Syllabus",
      "UPSC CSAT Syllabus",
      "Optional Subjects List",
      "UPSC Selection Process",
      "UPSC Interview",
      "UPSC Age Limit",
      "IAS Salary",
    ],
  },
  {
    title: "Exam updates",
    links: ["UPSC Calendar 2027", "UPSC Admit Card", "Prelims Answer Key", "UPSC Cut Off", "UPSC Final Result 2025"],
  },
  {
    title: "Free resources",
    links: ["UPSC Current Affairs", "Previous Year Papers", "UPSC Books", "Model Answers for Mains 2026"],
  },
];

const company = ["About Us", "Careers", "Contact Us", "FAQs"];
const legal = ["Terms and Conditions", "Privacy Policy", "Grievance Redressal"];

export default function SiteFooter() {
  return (
    <footer className="relative z-10 bg-white text-[#1a1814]">
      {/* The footer content sits on a card above the wordmark, with rounded bottom corners. */}
      <div className="relative z-10 rounded-b-3xl bg-white shadow-[0_0_0_1px_#e2e2e2]">
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-16 md:px-[72px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          <div>
            <a href="#" className="flex items-center gap-2 text-lg font-medium">
              <Logo />
              Vajiram &amp; Ravi
            </a>
            <p className="mt-4 text-sm leading-5 text-[#545454]">
              Preparing aspirants for the UPSC Civil Services Examination for five decades.
            </p>
            <p className="mt-6 text-sm leading-5 text-[#545454]">
              For registration or seat allotment, call{" "}
              <a href="tel:08062206330" className="font-medium text-[#1a1814] underline-offset-2 hover:underline">
                080-6220-6330
              </a>
              <br />
              Mon – Sat, 9 AM – 7 PM
            </p>
            <p className="mt-6 text-sm leading-5 text-[#545454]">Get exam updates in your inbox.</p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-5">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-medium leading-6">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm leading-5 text-[#545454] transition-colors hover:text-[#1a1814]">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[#e2e2e2] py-6 text-xs leading-4 text-[#545454] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Vajiram &amp; Ravi. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {[...company, ...legal].map((l) => (
              <li key={l}>
                <a href="#" className="transition-colors hover:text-[#1a1814]">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>

      <FooterWordmark />
    </footer>
  );
}
