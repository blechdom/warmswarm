import PlaceholderView from '@/components/PlaceholderView';
export default function TelepromptsPage() {
  return <PlaceholderView
    title="Teleprompts"
    description="Create text prompts for performers"
    icon="📝"
    features={[
      "Rich text editor",
      "Formatting options",
      "Timing controls",
      "Templates"
    ]}
    originalRoute="#create/19/:id"
    parentId="19"
  />;
}
