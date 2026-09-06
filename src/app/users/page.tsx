'use client';

import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { useState } from 'react';

const Page = () => {
  const [name, setName] = useState<string>();

  const handleSubmit = async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    console.log(data);
  };

  return (
    <div className="p-40">
      <h2>Create a user</h2>
      <div className="mt-4 space-y-3 w-80">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default Page;
