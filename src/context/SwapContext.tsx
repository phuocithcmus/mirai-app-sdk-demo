import { createContext, ReactNode, useState } from 'react';

interface ConnectWalletProviderProps {
	children: ReactNode;
}

interface ConnectWalletContextDefault {
	is_open: boolean;
	swap: (isVisible: boolean) => void;
}

const connectWalletDefault = {
	is_open: false,
	swap: () => false,
};

const SwapContext = createContext<ConnectWalletContextDefault>(connectWalletDefault);

const SwapContextProvider = ({ children }: ConnectWalletProviderProps) => {
	const [is_open, setIsOpen] = useState(false);

	const swap = (is_visible: boolean) => {
		setIsOpen(is_visible);

		return is_visible;
	};

	return <SwapContext.Provider value={{ is_open, swap }}>{children}</SwapContext.Provider>;
};

export { SwapContext, SwapContextProvider };
