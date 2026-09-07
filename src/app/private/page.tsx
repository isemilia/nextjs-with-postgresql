import { getCurrentUser } from '@/shared/utils/get-current-user';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="p-40">
      This page should only be accessible to authenticated users.
      <div>Current user: {user.name}</div>
    </div>
  );
};

export default Page;
