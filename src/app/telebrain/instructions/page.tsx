import PlaceholderView from '@/components/PlaceholderView';
export default function InstructionsPage() {
  return <PlaceholderView
    title="Instructions"
    description="How to use WarmSwarm platform"
    icon="📖"
    features={[
      "Getting started guide",
      "Feature walkthrough",
      "Best practices",
      "Troubleshooting tips"
    ]}
    originalRoute="#instructions"
  />;
}
