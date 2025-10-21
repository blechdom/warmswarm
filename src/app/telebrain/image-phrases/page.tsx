import PlaceholderView from '@/components/PlaceholderView';
export default function ImagePhrasesPage() {
  return <PlaceholderView
    title="Image Phrases"
    description="Create sequences of images to form visual phrases"
    icon="🖼️📝"
    features={[
      "Sequence images",
      "Set timing",
      "Transition effects",
      "Preview phrase"
    ]}
    originalRoute="#structure/57/:id"
    parentId="57"
  />;
}
