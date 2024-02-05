import { createContext, ReactNode, useState } from 'react';

interface ConnectWalletProviderProps {
	children: ReactNode;
}

interface ConnectWalletContextDefault {
	isOpen: boolean;
	toggleModal: (isVisible: boolean) => void;
}

const connectWalletDefault = {
	isOpen: false,
	toggleModal: () => false,
};

const ConnectWalletContext = createContext<ConnectWalletContextDefault>(connectWalletDefault);

const ConnectWalletContextProvider = ({ children }: ConnectWalletProviderProps) => {
	const [isOpen, setToggle] = useState(false);

	const toggleModal = (isVisible: boolean) => {
		setToggle(isVisible);
		return isVisible;
	};

	return <ConnectWalletContext.Provider value={{ isOpen, toggleModal }}>{children}</ConnectWalletContext.Provider>;
};

export { ConnectWalletContext, ConnectWalletContextProvider };
