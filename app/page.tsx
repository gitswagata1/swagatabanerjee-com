import { Loader } from "@/components/Loader";
import { About } from "@/components/sections/About";
import { Community } from "@/components/sections/Community";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Google } from "@/components/sections/Google";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { Recognition } from "@/components/sections/Recognition";
import { Skills } from "@/components/sections/Skills";
import { Ticker } from "@/components/sections/Ticker";

export default function Home() {
  return (
    <>
      <Loader />
      <main id="main">
        <Hero />
        <Ticker />
        <Experience />
        <Projects />
        <Google />
        <Recognition />
        <Journey />
        <Community />
        <Skills />
        <About />
      </main>
      <Contact />
    </>
  );
}
