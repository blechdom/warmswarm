import PlaceholderView from '@/components/PlaceholderView';
export default function AudioUploadsPage() {
  return <PlaceholderView
    title="Audio Uploads"
    description="Upload audio files to the platform"
    icon="⬆️"
    features={[
      "Upload audio files",
      "MP3, OGG, WAV support",
      "Audio metadata",
      "File management"
    ]}
    originalRoute="#create/22/:id"
    parentId="22"
  />;
}
