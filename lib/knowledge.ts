import { profile } from "@/content/profile";

/**
 * The assistant's entire knowledge: content/profile.ts compiled to JSON.
 * UI-only keys are left out. The phone number is not in profile.ts at all.
 * The string is byte-stable between requests so the prompt cache can reuse it.
 */
const { site, identity, contact, stats, experience, projects, google, recognition, community, certifications, skills, journey, about, talks, testimonials, writing } =
  profile;

const knowledge = {
  site,
  identity,
  contact: { email: contact.email, linkedin: contact.linkedin, github: contact.github },
  stats,
  experience,
  projects,
  google: { items: google.items, contributions: google.contributions, badgeCount: `${google.badgeCount}${google.badgeSuffix}` },
  recognition,
  community,
  certifications,
  skills,
  journey,
  about,
  talks,
  testimonials,
  writing,
};

const sectionIds = Object.keys(profile.chat.sectionLabels).join(", ");

export const systemPrompt = `${profile.chat.systemPrompt}

Valid section ids for links: ${sectionIds}.
Any value starting with "[PLACEHOLDER" or "[CONFIRM" is missing information: treat it as unknown and never repeat it.
Reply in plain text without markdown.

<profile_data>
${JSON.stringify(knowledge)}
</profile_data>`;
