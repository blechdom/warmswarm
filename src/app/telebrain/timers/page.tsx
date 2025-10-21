import PlaceholderView from '@/components/PlaceholderView';
export default function TimersPage() {
  return <PlaceholderView
    title="Timers"
    description="Create countdown and stopwatch timers"
    icon="⏱️"
    features={[
      "Countdown timers",
      "Stopwatch mode",
      "Visual/audio alerts",
      "Multiple timers"
    ]}
    originalRoute="#perform/35/:id"
    parentId="35"
  />;
}
