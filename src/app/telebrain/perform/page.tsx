import PlaceholderView from '@/components/PlaceholderView';
export default function PerformPage() {
  return <PlaceholderView
    title="Live Performance"
    description="Real-time performance interface"
    icon="🎪"
    features={[
      "Send/receive content",
      "Activity log",
      "Performer list",
      "Live TTS",
      "Image viewer"
    ]}
    originalRoute="#performance2/:parent_id/:id"
  />;
}
