import { createContext, ReactNode, useState } from 'react';

interface AppChainContextProps {
	children: ReactNode;
	chainId: number;
}

interface AppChainContextDefault {
	chainId: number;
}

const appChainContextPropsDefault = {
	chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
};

const AppChainContext = createContext<AppChainContextDefault>(appChainContextPropsDefault);

const AppChainContextProvider = ({ children, chainId }: AppChainContextProps) => {
	return <AppChainContext.Provider value={{ chainId }}>{children}</AppChainContext.Provider>;
};

export { AppChainContext, AppChainContextProvider };
