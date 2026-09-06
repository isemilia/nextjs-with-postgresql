'use client';

import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import useGetUsers from '@/shared/hooks/get-users';
import { useEffect, useState } from 'react';

const Page = () => {
  const { users, getUsers } = useGetUsers();
  const [name, setName] = useState<string>();

  const handleSubmit = async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      getUsers();
    }

    const data = await res.json();

    console.log(data);
  };

  return (
    <div className="p-40">
      <h2>Create a user</h2>
      <div className="grid grid-cols-[auto_1fr] gap-20">
        <div className="mt-4 space-y-3 w-80">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
        <div>
          {users?.map((user) => {
            return (
              <div key={user.id}>
                ID: {user.id}, {user.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
