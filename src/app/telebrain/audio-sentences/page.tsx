import PlaceholderView from '@/components/PlaceholderView';
export default function AudioSentencesPage() {
  return <PlaceholderView
    title="Audio Sentences"
    description="Compose sequences of audio clips into sentences"
    icon="🎵📝"
    features={[
      "Sequence audio clips",
      "Set timing and gaps",
      "Crossfade options",
      "Export composition"
    ]}
    originalRoute="#structure/58/:id"
    parentId="58"
  />;
}
