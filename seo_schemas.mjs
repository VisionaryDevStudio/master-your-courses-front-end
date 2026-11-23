export const SITE_ORIGIN = "https://masteryourcourses.com";
export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const DEFAULT_SOCIAL_IMAGE = `${SITE_ORIGIN}/mentors/zoey.png`;
export const DEFAULT_SOCIAL_IMAGE_ALT = "Master Your Courses — 1-on-1 Mentorship, Live Group Cohorts & Practice Courses";

export function toCanonicalUrl(routePath = "") {
  const clean = String(routePath)
    .replace(/^\.?\//, "")
    .split("?")[0]
    .split("#")[0];
  if (!clean || clean === "index.html") {
    return `${SITE_ORIGIN}/`;
  }
  if (clean.endsWith("/index.html")) {
    return `${SITE_ORIGIN}/${clean.slice(0, -"index.html".length)}`;
  }
  return `${SITE_ORIGIN}/${clean}`;
}

export const ORGANIZATION_ENTITY = Object.freeze({
  "@type": "EducationalOrganization",
  "@id": ORG_ID,
  name: "Master Your Courses",
  legalName: "Master Your Courses Inc.",
  url: `${SITE_ORIGIN}/`,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_ORIGIN}/#logo`,
    url: `${SITE_ORIGIN}/logo/logo.svg`,
    caption: "Master Your Courses"
  },
  image: DEFAULT_SOCIAL_IMAGE,
  description:
    "First-principles AP, Digital SAT, ACT, Math & Science Olympiad, MCAT, DAT, and 1-on-1 STEM course preparation led by award-winning educators, university researchers, and doctors.",
  areaServed: [
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "Canada" }
  ],
  knowsAbout: [
    "Advanced Placement (AP) Courses & Exams",
    "Digital SAT Reading & Writing and Math",
    "ACT Prep",
    "AMC 8, AMC 10, AMC 12 & AIME Mathematics Competitions",
    "USA Mathematical Olympiad (USAMO)",
    "Waterloo CEMC Mathematics & Computing Contests",
    "F=ma & USAPhO Physics Olympiad",
    "U.S. National Chemistry Olympiad (USNCO)",
    "USA Biology Olympiad (USABO)",
    "USA Computing Olympiad (USACO)",
    "Medical College Admission Test (MCAT)",
    "Dental Admission Test (DAT)",
    "High School Honors & University STEM Course Tutoring"
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Academic Advising & Admissions",
      url: `${SITE_ORIGIN}/contact.html`,
      availableLanguage: ["English"]
    }
  ]
});

export const WEBSITE_ENTITY = Object.freeze({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_ORIGIN}/`,
  name: "Master Your Courses",
  inLanguage: "en-US",
  publisher: { "@id": ORG_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_ORIGIN}/programs/?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

export const FACULTY_ENTITIES = Object.freeze([
  {
    "@type": "Person",
    "@id": `${SITE_ORIGIN}/#mentor-zoey`,
    name: "Zoey",
    jobTitle: "AP Biology & Science Specialist",
    image: `${SITE_ORIGIN}/mentors/zoey.png`,
    worksFor: { "@id": ORG_ID },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Johns Hopkins University"
    },
    award: ["2025–26 National Virtual Teacher of the Year"],
    knowsAbout: ["AP Biology", "Mastery-Based Science Instruction", "AP Free-Response Strategy"]
  },
  {
    "@type": "Person",
    "@id": `${SITE_ORIGIN}/#mentor-hossein-piri`,
    name: "Dr. Hossein Piri",
    jobTitle: "Quantitative Sciences, Math & AI Mentor",
    image: `${SITE_ORIGIN}/mentors/Dr.piri.jpg`,
    worksFor: { "@id": ORG_ID },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of British Columbia"
    },
    award: ["Killam Teaching Award — University of British Columbia"],
    knowsAbout: ["Calculus", "Statistics", "Competition Mathematics", "Operations Research", "Machine Learning"]
  },
  {
    "@type": "Person",
    "@id": `${SITE_ORIGIN}/#mentor-sherri-sadr`,
    name: "Dr. Sherri Sadr",
    jobTitle: "Doctor of Dental Medicine & Pre-Health Science Mentor",
    image: `${SITE_ORIGIN}/mentors/sherri.png`,
    worksFor: { "@id": ORG_ID },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of British Columbia Faculty of Dentistry"
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "Doctor of Dental Medicine (DMD)"
    },
    knowsAbout: ["DAT Prep", "MCAT Biology & Chemistry", "Undergraduate Research Mentorship"]
  }
]);

/**
 * Single source of truth for breadcrumb hub links — used by both the visible
 * breadcrumb nav and the BreadcrumbList schema so they never disagree.
 */
export const BREADCRUMB_HUB_URLS = Object.freeze({
  Programs: "programs/index.html",
  "AP Prep": "programs/ap-prep.html",
  "Digital SAT Prep": "programs/sat-prep.html",
  "SAT & ACT Prep": "programs/sat-prep.html",
  "Competition Prep": "programs/competition-prep.html",
  "MCAT & DAT Prep": "programs/mcat-dat-prep.html",
  "Course Tutoring": "programs/course-tutoring.html",
  "Research & Admissions": "programs/stem-research-mentorship.html",
  "Textbooks & Workbooks": "books/index.html",
  "Free Resources": "resources/index.html",
  "Tools & Calculators": "tools/index.html",
  "Practice & Quizzes": "practice/index.html",
  "Past Exam Solutions": "solutions/index.html",
  "Diagnostic Mock Exams": "mock-exams/index.html",
  "Study Guides": "guides/index.html",
  "Sign In": "login.html"
});

/**
 * Builds a Google-valid BreadcrumbList where EVERY ListItem (including intermediate hubs)
 * carries an explicit absolute `item` URL.
 */
export function buildBreadcrumbSchema(routePath, breadcrumbNames = []) {
  const leafUrl = toCanonicalUrl(routePath);
  const elements = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_ORIGIN}/`
    },
    ...breadcrumbNames.map((name, idx) => {
      const isLast = idx === breadcrumbNames.length - 1;
      const mappedHub = BREADCRUMB_HUB_URLS[name];
      const itemUrl = isLast
        ? leafUrl
        : mappedHub
          ? toCanonicalUrl(mappedHub)
          : leafUrl;
      return {
        "@type": "ListItem",
        position: idx + 2,
        name,
        item: itemUrl
      };
    })
  ];

  return {
    "@type": "BreadcrumbList",
    "@id": `${leafUrl}#breadcrumb`,
    itemListElement: elements
  };
}

export function buildFaqSchema(routePath, faqs = []) {
  const leafUrl = toCanonicalUrl(routePath);
  return {
    "@type": "FAQPage",
    "@id": `${leafUrl}#faq`,
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  };
}

export function buildVideoObjectsSchema(videos = []) {
  return videos.map(video => ({
    "@type": "VideoObject",
    name: `${video.student} — ${video.school} | Master Your Courses`,
    description: video.quote,
    thumbnailUrl: [`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`],
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    uploadDate: video.uploadDate || "2024-06-01",
    publisher: { "@id": ORG_ID }
  }));
}

/**
 * Reusable Course + CourseInstance schema graph for all 43 AP, SAT, ACT, Olympiad, MCAT, DAT & Tutoring pages.
 */
export function buildCoursePageGraph({
  routePath,
  breadcrumb,
  title,
  description,
  courseCode = "",
  educationalLevel = "High School & Undergraduate",
  teaches = [],
  formats = ["1-on-1 Mentorship", "Live Group Cohort", "On-Demand Practice Course"],
  instructorIds = [],
  faqs = []
}) {
  const pageUrl = toCanonicalUrl(routePath);
  const courseEntity = {
    "@type": "Course",
    "@id": `${pageUrl}#course`,
    name: title,
    description,
    url: pageUrl,
    inLanguage: "en-US",
    provider: { "@id": ORG_ID },
    educationalLevel,
    ...(courseCode ? { courseCode } : {}),
    ...(teaches.length ? { teaches } : {}),
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student"
    },
    hasCourseInstance: formats.map(fmt => ({
      "@type": "CourseInstance",
      name: `${title} — ${fmt}`,
      courseMode: "online",
      instructor: instructorIds.map(id => ({ "@id": id }))
    }))
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbSchema(routePath, breadcrumb),
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${title} — Master Your Courses`,
        description,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": `${pageUrl}#course` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` }
      },
      courseEntity,
      ...(faqs.length ? [buildFaqSchema(routePath, faqs)] : [])
    ]
  };
}

/**
 * Reusable Book + Product schema graph for /books/* textbook & workbook pages.
 */
export function buildBookProductGraph({
  routePath,
  breadcrumb,
  title,
  description,
  isbn = "",
  bookFormat = "https://schema.org/Paperback",
  price = "",
  currency = "USD",
  faqs = []
}) {
  const pageUrl = toCanonicalUrl(routePath);
  const bookEntity = {
    "@type": ["Book", "Product"],
    "@id": `${pageUrl}#book`,
    name: title,
    description,
    url: pageUrl,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID },
    author: { "@id": ORG_ID },
    bookFormat,
    ...(isbn ? { isbn } : {}),
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price: String(price),
            priceCurrency: currency,
            availability: "https://schema.org/InStock",
            url: pageUrl,
            seller: { "@id": ORG_ID }
          }
        }
      : {})
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbSchema(routePath, breadcrumb),
      bookEntity,
      ...(faqs.length ? [buildFaqSchema(routePath, faqs)] : [])
    ]
  };
}

/**
 * Reusable WebApplication schema graph for free interactive calculators, planners & diagnostics (/tools/*, /mock-exams/*).
 */
export function buildToolAppGraph({
  routePath,
  breadcrumb,
  title,
  description,
  featureList = [],
  faqs = []
}) {
  const pageUrl = toCanonicalUrl(routePath);
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbSchema(routePath, breadcrumb),
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#app`,
        name: title,
        description,
        url: pageUrl,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        provider: { "@id": ORG_ID },
        ...(featureList.length ? { featureList } : {}),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        }
      },
      ...(faqs.length ? [buildFaqSchema(routePath, faqs)] : [])
    ]
  };
}

/**
 * Reusable LearningResource + Article schema graph for past FRQ solutions, study guides, quizzes & exam articles.
 */
export function buildLearningResourceGraph({
  routePath,
  breadcrumb,
  title,
  description,
  learningResourceType = "Study Guide",
  educationalLevel = "High School & Undergraduate",
  teaches = [],
  authorId = ORG_ID,
  reviewerId = "",
  datePublished = "2026-01-15",
  dateModified = "2026-11-22",
  faqs = []
}) {
  const pageUrl = toCanonicalUrl(routePath);
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbSchema(routePath, breadcrumb),
      {
        "@type": ["LearningResource", "Article"],
        "@id": `${pageUrl}#resource`,
        headline: title,
        name: title,
        description,
        url: pageUrl,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        learningResourceType,
        educationalLevel,
        ...(teaches.length ? { teaches } : {}),
        author: { "@id": authorId },
        ...(reviewerId ? { reviewedBy: { "@id": reviewerId } } : {}),
        publisher: { "@id": ORG_ID },
        datePublished,
        dateModified
      },
      ...(faqs.length ? [buildFaqSchema(routePath, faqs)] : [])
    ]
  };
}

/**
 * Reusable EducationEvent schema graph for /workshops/* live seasonal exam sessions.
 */
export function buildEducationEventGraph({
  routePath,
  breadcrumb,
  title,
  description,
  startDate,
  endDate
}) {
  const pageUrl = toCanonicalUrl(routePath);
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbSchema(routePath, breadcrumb),
      {
        "@type": "EducationEvent",
        "@id": `${pageUrl}#event`,
        name: title,
        description,
        url: pageUrl,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        isAccessibleForFree: true,
        organizer: { "@id": ORG_ID },
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        location: {
          "@type": "VirtualLocation",
          url: pageUrl
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: pageUrl
        }
      }
    ]
  };
}
