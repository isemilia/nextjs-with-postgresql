import { useEffect, useState } from "react";

const useGetUsers = () => {
    const [users, setUsers] = useState<{ name: string; id: number }[]>();

    const getUsers = async () => {
        const res = await fetch('/api/users', { method: 'GET' });

        const data = await res.json();

        setUsers(data);
    };

    useEffect(() => {
        getUsers();
    }, [])

    return { users, getUsers }
}

export default useGetUsers;