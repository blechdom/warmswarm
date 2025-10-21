import PlaceholderView from '@/components/PlaceholderView';
export default function AboutPage() {
  return <PlaceholderView
    title="About"
    description="Information about WarmSwarm and contact details"
    icon="📋"
    features={[
      "Project information",
      "Contact details",
      "Credits and acknowledgments",
      "Version information"
    ]}
    originalRoute="#about"
  />;
}
