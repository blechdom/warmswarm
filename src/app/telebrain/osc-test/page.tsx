import PlaceholderView from '@/components/PlaceholderView';
export default function OSCTestPage() {
  return <PlaceholderView
    title="OSC Tester"
    description="Test Open Sound Control messages"
    icon="🔬"
    features={[
      "Send OSC messages",
      "Monitor incoming OSC",
      "Message templates",
      "Debug tools"
    ]}
    originalRoute="#testosc"
  />;
}
