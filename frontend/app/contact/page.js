import dynamic from "next/dynamic";

const ContactContent = dynamic(
  () => import("../../components/contact/ContactContent"),
  { ssr: false }
);

export default function ContactPage() {
  return <ContactContent />;
}
