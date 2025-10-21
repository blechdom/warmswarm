import PlaceholderView from '@/components/PlaceholderView';
export default function ProgramsPage() {
  return <PlaceholderView
    title="Programs"
    description="Create and manage performance programs"
    icon="🎼"
    features={[
      "Build programs",
      "Assign content",
      "Set flow and timing",
      "Role assignment",
      "Save templates"
    ]}
    originalRoute="#program/15/:id"
    parentId="15"
  />;
}
