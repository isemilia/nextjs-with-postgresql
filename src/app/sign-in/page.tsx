import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';

const Page = () => {
  return (
    <div className="p-40">
      Sign in
      <div className="mt-4 space-y-3 w-80">
        <Input />
        <Input />
        <Button>Submit</Button>
      </div>
    </div>
  );
};

export default Page;
