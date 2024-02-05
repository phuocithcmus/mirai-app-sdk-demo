import { combineComponents } from '@app-helpers/component';
import { ConnectWalletContextProvider } from '@contexts/ConnectWalletContext';
import { MeasurementContextProvider } from '@contexts/MeasurementContext';
import { RacingContextProvider } from '@contexts/RacingContext';
import { SwapContextProvider } from '@contexts/SwapContext';
import React from 'react';
import { AppAccountVersionContextProvider } from './AppAccountVersionContext';
import { ConfigContextProvider } from './ConfigContext';
import { FeatureToggleContextProvider } from './FeatureToggleContext';

const providers = [
	FeatureToggleContextProvider,
	ConnectWalletContextProvider,
	MeasurementContextProvider,
	RacingContextProvider,
	SwapContextProvider,
	ConfigContextProvider,
	AppAccountVersionContextProvider,
];

interface IAppContextProvider {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<IAppContextProvider> = combineComponents(...providers);
