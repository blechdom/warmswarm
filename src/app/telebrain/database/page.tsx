import PlaceholderView from '@/components/PlaceholderView';
export default function DatabasePage() {
  return <PlaceholderView
    title="Database"
    description="Browse and manage database content"
    icon="💾"
    features={[
      "Content browser",
      "Search and filter",
      "Bulk operations",
      "Export data"
    ]}
    originalRoute="#database"
  />;
}
