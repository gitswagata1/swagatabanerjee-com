import { profile } from "@/content/profile";
import { Section } from "@/components/ui/Section";
import { SkillsBoard } from "./SkillsClient";

export function Skills() {
  return (
    <Section id="skills" sheet={profile.sheets.skills} title="Skills">
      <SkillsBoard />
    </Section>
  );
}
