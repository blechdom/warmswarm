import PlaceholderView from '@/components/PlaceholderView';
export default function NetworksPage() {
  return <PlaceholderView
    title="Networks"
    description="Visualize and manage performance networks"
    icon="🕸️"
    features={[
      "Network topology view",
      "Connection management",
      "Routing configuration",
      "Performance metrics"
    ]}
    originalRoute="#networks"
  />;
}
