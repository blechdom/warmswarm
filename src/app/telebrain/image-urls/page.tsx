import PlaceholderView from '@/components/PlaceholderView';
export default function ImageURLsPage() {
  return <PlaceholderView
    title="Image URLs"
    description="Link to images from external URLs"
    icon="🔗"
    features={[
      "Add image URLs",
      "Preview images",
      "Organize by tags",
      "Batch import"
    ]}
    originalRoute="#create/17/:id"
    parentId="17, 18"
  />;
}
