import PlaceholderView from '@/components/PlaceholderView';
export default function SchedulerPage() {
  return <PlaceholderView
    title="Scheduler"
    description="Schedule events and performances"
    icon="🗓️"
    features={[
      "Calendar view",
      "Event management",
      "Recurring events",
      "Notifications"
    ]}
    originalRoute="#scheduler"
  />;
}
