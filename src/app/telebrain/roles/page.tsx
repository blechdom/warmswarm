import PlaceholderView from '@/components/PlaceholderView';
export default function RolesPage() {
  return <PlaceholderView
    title="Roles"
    description="Define and manage performer roles"
    icon="🎭"
    features={[
      "Create roles",
      "Set permissions",
      "Assign users",
      "Role templates"
    ]}
    originalRoute="#perform/12/:id"
    parentId="12"
  />;
}
