// contexts/UserContext.tsx
import { getUserByEmail } from '@/data/user';
import { QueryResultRow } from '@vercel/postgres';
import { useSession } from 'next-auth/react';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useQuery } from 'react-query';

interface UserContextProps {
    username: string;
    name: string;
    role: string;
    organisation: string;
    setUsername: (username: string) => void;
    setName: (name: string) => void;
    setOrganisation: (organisation: string) => void;
    setRole: (role: string) => void;
}

const userContextPropsDefaultValues: UserContextProps = {
    username: "",
    name: "",
    role: "",
    organisation: "",
    setUsername: () => { },
    setName: () => { },
    setOrganisation: () => { },
    setRole: () => { }
};

const UserContext = createContext<UserContextProps>(userContextPropsDefaultValues);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [username, setUsername] = useState<string>(userContextPropsDefaultValues.username);
    const [name, setName] = useState<string>(userContextPropsDefaultValues.name);
    const [role, setRole] = useState<string>(userContextPropsDefaultValues.role);
    const [organisation, setOrganisation] = useState<string>(userContextPropsDefaultValues.organisation);
    const [user, setUser] = useState<QueryResultRow | undefined>(undefined);

    const { data: session } = useSession();
    const useremail = session?.user?.email || '';

    const fetchUser = async () => {
        if (useremail) {
            return await getUserByEmail(useremail);
        }
    };

    const { data, isError, isLoading } = useQuery(['user', useremail], fetchUser, {
        enabled: !!useremail,
    });

    useEffect(() => {
        if (data && !isLoading) {
            setUsername(data?.email || "");
            setName(data?.name || "");
            setRole(data?.role || "");
            setOrganisation(data?.organisation || "");

            localStorage.setItem('username', data?.email || "");
            localStorage.setItem('name', data?.name || "");
            localStorage.setItem('role', data?.role || "");
            localStorage.setItem('organisation', data?.organisation || "");
        }
    }, [data, isLoading]);

    return (
        <UserContext.Provider value={{ username, name, role, organisation, setUsername, setName, setOrganisation, setRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => React.useContext(UserContext);

export default UserContext;
