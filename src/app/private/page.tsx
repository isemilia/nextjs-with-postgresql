import { getCurrentUser } from '@/shared/utils/get-current-user';

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div>
      This page should only be accessible to authenticated users.
      <div>Current user: {user?.name}</div>
    </div>
  );
};

export default Page;
