import dynamic from "next/dynamic";

const AgentContent = dynamic(
  () => import("../../components/agent/AgentContent"),
  { ssr: false }
);

export default function AgentPage() {
  return <AgentContent />;
}
