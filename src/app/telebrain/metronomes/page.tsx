import PlaceholderView from '@/components/PlaceholderView';
export default function MetronomesPage() {
  return <PlaceholderView
    title="Metronomes"
    description="Rhythmic timing and beat synchronization"
    icon="🥁"
    features={[
      "Adjustable BPM",
      "Time signatures",
      "Accent patterns",
      "Visual indicators"
    ]}
    originalRoute="#perform/36/:id"
    parentId="36"
  />;
}
