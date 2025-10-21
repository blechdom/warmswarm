import PlaceholderView from '@/components/PlaceholderView';
export default function FragmentsPage() {
  return <PlaceholderView
    title="Fragments"
    description="Create reusable program fragments"
    icon="🧩"
    features={[
      "Build modular components",
      "Reuse across programs",
      "Parameter configuration",
      "Version control"
    ]}
    originalRoute="#program/51/:id"
    parentId="51"
  />;
}
