import { Button } from '@/shadcn/components/ui/button';

const Page = () => {
  const user = { name: 'Emilia' };
  return (
    <div className="p-40">
      Sign up
      <div className="mt-4 space-y-3 w-80">
        <h2>{user.name}</h2>
        <Button>Log out</Button>
      </div>
    </div>
  );
};

export default Page;
