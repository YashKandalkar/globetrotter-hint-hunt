import { UserProfile } from "../components/auth/UserProfile";
import { AuthRequired } from "../components/auth/AuthRequired";

export default function ProfilePage() {
  return (
    <AuthRequired>
      <div className="container max-w-lg py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>
        <UserProfile />
      </div>
    </AuthRequired>
  );
}
