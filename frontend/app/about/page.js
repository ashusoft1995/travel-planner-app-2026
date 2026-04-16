import dynamic from "next/dynamic";

// AboutContent uses framer-motion which requires browser APIs.
// Loading with ssr:false prevents the server-side prerender crash.
const AboutContent = dynamic(
  () => import("../../components/about/AboutContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    ),
  }
);

export default function AboutPage() {
  return <AboutContent />;
}
