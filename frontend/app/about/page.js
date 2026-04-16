import dynamic from "next/dynamic";

const AboutContent = dynamic(
  () => import("../../components/about/AboutContent"),
  { ssr: false }
);

export default function AboutPage() {
  return <AboutContent />;
}
