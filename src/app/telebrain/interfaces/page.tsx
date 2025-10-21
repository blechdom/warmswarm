import PlaceholderView from '@/components/PlaceholderView';
export default function InterfacesPage() {
  return <PlaceholderView
    title="Interfaces"
    description="Design custom user interfaces for performers"
    icon="🖥️"
    features={[
      "Drag-and-drop builder",
      "Custom layouts",
      "Button configuration",
      "Role-specific UIs"
    ]}
    originalRoute="#program/13/:id"
    parentId="13"
  />;
}
