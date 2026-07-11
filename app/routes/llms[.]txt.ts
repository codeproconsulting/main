import type { LoaderFunctionArgs } from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  const body = `# Proconsulting

> Expert study abroad and immigration consulting services based in the UK. We help students and families navigate university admissions, student visas, work permits, family reunification, and settlement applications across the UK, Europe, Canada, Australia, and USA.

## About

Proconsulting is a registered education and immigration consultancy with offices in Islamabad, Pakistan and Birmingham, UK. We have successfully processed 2000+ assessments, 500+ student visas, and 700+ cases since 2020.

## Services

### Study Abroad
- University admissions for UK, Europe, Canada, Australia, USA
- Student visa applications and guidance
- IELTS / English test preparation
- Career counselling and course selection
- Pre-departure guidance
- Scholarship assistance

### Immigration & Visas
- Visit visas
- Work permits
- Family visas and reunification
- Settlement applications
- Appeal support
- Legal consultation

## Key Pages

- Homepage: https://proconsulting.uk/
- Study Abroad: https://proconsulting.uk/education
- Immigration: https://proconsulting.uk/immigration
- About Us: https://proconsulting.uk/about
- Contact: https://proconsulting.uk/contact
- Blog: https://proconsulting.uk/education/blog
- Destinations: https://proconsulting.uk/education/destinations
- Universities: https://proconsulting.uk/education/universities
- Services: https://proconsulting.uk/education/services

## Contact

- Phone (UK): +44 7432 406993
- Phone (PK): +92 51 6135834
- Address: Vista Building, 2nd Floor, Office No 203-204, I-8 Markaz, Islamabad, Pakistan
- UK Office: 5 Saint Kilda's Road, B83JQ Birmingham, United Kingdom

## Social Profiles

- Facebook: https://www.facebook.com/proconsultinguk
- Instagram: https://www.instagram.com/pro_consulting1/
- LinkedIn: https://www.linkedin.com/company/proconsultinguk
- X (Twitter): https://x.com/proconsulting_
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
