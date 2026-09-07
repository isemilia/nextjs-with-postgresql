import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';

const Page = () => {
  return (
    <div className="p-40">
      Sign up
      <div className="mt-4 space-y-3 w-80">
        <Input placeholder="Email" />
        <Input placeholder="Password" />
        <Button>Submit</Button>
      </div>
    </div>
  );
};

export default Page;
