import PlaceholderView from '@/components/PlaceholderView';
export default function MultiRolesPage() {
  return <PlaceholderView
    title="Multi-Roles"
    description="Coordinate multiple roles in complex performances"
    icon="👥"
    features={[
      "Define role relationships",
      "Set dependencies",
      "Communication channels",
      "Permission management"
    ]}
    originalRoute="#program/50/:id"
    parentId="50"
  />;
}
