import PlaceholderView from '@/components/PlaceholderView';
export default function TutorialPage() {
  return <PlaceholderView
    title="Tutorial"
    description="Interactive tutorial for new users"
    icon="🎓"
    features={[
      "Step-by-step guide",
      "Interactive examples",
      "Video tutorials",
      "Practice exercises"
    ]}
    originalRoute="#tutorial"
  />;
}
