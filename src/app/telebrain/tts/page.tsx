import PlaceholderView from '@/components/PlaceholderView';
export default function TTSPage() {
  return <PlaceholderView
    title="Text-to-Speech"
    description="Generate audio from text using TTS"
    icon="🗣️"
    features={[
      "Multi-language TTS",
      "Voice selection",
      "Speed/pitch control",
      "Save generated audio"
    ]}
    originalRoute="#create/23/:id"
    parentId="23"
  />;
}
