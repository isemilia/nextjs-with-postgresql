'use client';

import { Button } from '@/shadcn/components/ui/button';
import { useEffect, useState } from 'react';

const Page = () => {
  const [me, setMe] = useState<{
    name: string;
    email: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    const getMe = async () => {
      const res = await fetch('/api/auth/me', { method: 'GET' });
      const { data } = await res.json();

      setMe(data.user);
    };

    getMe();
  }, []);

  return (
    <div className="p-40">
      Profile
      {me ? (
        <div className="mt-4 space-y-4 w-80">
          <div className="space-y-1">
            <div>ID: {me.id}</div>
            <div>Name: {me.name}</div>
            <div>Email: {me.email}</div>
          </div>
          <Button>Log out</Button>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default Page;
