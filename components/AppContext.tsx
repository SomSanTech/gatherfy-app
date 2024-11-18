// AppContext.tsx
import React, { createContext, useContext, useState } from 'react';

// กำหนดประเภทของค่าที่จะส่งใน context
interface AppContextType {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    page: String;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    countResult: number;
    setCountResult: React.Dispatch<React.SetStateAction<number>>;
}

// สร้าง context และตัวให้ค่าเริ่มต้น
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [search, setSearch] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState<string>('');
    const [countResult, setCountResult] = useState<number>(0);

    return (
        <AppContext.Provider value={{ search, setSearch , isLoading, setIsLoading , page , setPage , countResult, setCountResult}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};
