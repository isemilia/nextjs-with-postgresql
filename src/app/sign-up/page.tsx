'use client';

import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { signUpSchema } from '@/shared/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const Page = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSubmit = async (formValues: z.infer<typeof signUpSchema>) => {
    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();

      console.log(data);

      router.push('/profile');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      Sign up
      <form className="mt-4 space-y-3 w-80">
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => {
            return <Input {...field} placeholder="Name" />;
          }}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field }) => {
            return <Input {...field} placeholder="Email" />;
          }}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field }) => {
            return <Input {...field} placeholder="Password" />;
          }}
        />

        <Button onClick={form.handleSubmit(handleSubmit)}>Submit</Button>
      </form>
    </div>
  );
};

export default Page;
