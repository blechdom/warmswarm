import PlaceholderView from '@/components/PlaceholderView';
export default function LoginPage() {
  return <PlaceholderView
    title="Login"
    description="User authentication and session management"
    icon="🔐"
    features={[
      "User login/logout",
      "Session management",
      "Remember me functionality",
      "Password recovery"
    ]}
    originalRoute="#login"
  />;
}
