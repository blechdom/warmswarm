import PlaceholderView from '@/components/PlaceholderView';
export default function MyBrainsPage() {
  return <PlaceholderView
    title="My Brains"
    description="Manage your projects and workspaces"
    icon="🧠"
    features={[
      "Project dashboard",
      "Recent activity",
      "Shared projects",
      "Templates"
    ]}
    originalRoute="#brains/:id"
  />;
}
