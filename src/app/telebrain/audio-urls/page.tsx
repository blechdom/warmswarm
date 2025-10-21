import PlaceholderView from '@/components/PlaceholderView';
export default function AudioURLsPage() {
  return <PlaceholderView
    title="Audio URLs"
    description="Link to audio files from external URLs"
    icon="🔗"
    features={[
      "Add audio URLs",
      "Preview audio",
      "Organize by tags",
      "Batch import"
    ]}
    originalRoute="#create/21/:id"
    parentId="21"
  />;
}
