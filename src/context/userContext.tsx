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
    organisationid: string;
    setUsername: (username: string) => void;
    setName: (name: string) => void;
    setOrganisation: (organisation: string) => void;
    setRole: (role: string) => void;
    setOrganisationId: (organisationid: string) => void;
}

const userContextPropsDefaultValues: UserContextProps = {
    username: "",
    name: "",
    role: "",
    organisation: "",
    organisationid: "",
    setUsername: () => { },
    setName: () => { },
    setOrganisation: () => { },
    setRole: () => { },
    setOrganisationId: () => { }
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
    const [organisationid, setOrganisationId] = useState<string>(userContextPropsDefaultValues.organisationid);

    const { data: session } = useSession();
    const useremail = session?.user?.email || '';

    const fetchUser = async () => {
        if (useremail) {
            return await getUserByEmail(useremail);
        }
    };

    const { data, isLoading, error } = useQuery(['user', useremail], fetchUser, {
        enabled: !!useremail,
    });

    useEffect(() => {
        if (data && !isLoading) {
            setUsername(data?.useremail || "");
            setName(data?.username || "");
            setRole(data?.role || "");
            setOrganisation(data?.organisationname || "");
            setOrganisationId(data?.organisationid || "")
        }
    }, [data, isLoading]);

    if (error) {
        console.error("Error fetching user data:", error);
    }

    return (
        <UserContext.Provider value={{ username, name, role, organisation, organisationid, setUsername, setName, setOrganisation, setRole, setOrganisationId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => React.useContext(UserContext);

export default UserContext;
