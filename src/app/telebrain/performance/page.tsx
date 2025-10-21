import PlaceholderView from '@/components/PlaceholderView';
export default function PerformancePage() {
  return <PlaceholderView
    title="Performance Setup"
    description="Configure and prepare for live performance"
    icon="📢"
    features={[
      "Select performance program",
      "Configure roles",
      "Set up interfaces",
      "Test connections"
    ]}
    originalRoute="#performance2"
  />;
}
