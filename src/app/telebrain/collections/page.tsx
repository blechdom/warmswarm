import PlaceholderView from '@/components/PlaceholderView';
export default function CollectionsPage() {
  return <PlaceholderView
    title="Content Collections"
    description="Organize content into reusable collections"
    icon="📚"
    features={[
      "Group related content",
      "Nested collections",
      "Tag and categorize",
      "Share collections"
    ]}
    originalRoute="#structure/59/:id"
    parentId="59"
  />;
}
