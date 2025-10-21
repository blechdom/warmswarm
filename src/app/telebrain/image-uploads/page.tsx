import PlaceholderView from '@/components/PlaceholderView';
export default function ImageUploadsPage() {
  return <PlaceholderView
    title="Image Uploads"
    description="Upload images to the platform"
    icon="⬆️"
    features={[
      "Upload images",
      "JPG, PNG, GIF, SVG support",
      "Image optimization",
      "Gallery view"
    ]}
    originalRoute="#create/18/:id"
    parentId="18"
  />;
}
