import { useOnEventCallback } from '@app-helpers';
import _ from 'lodash';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Add feature name here
export enum Feature {
	App = 'application',
	DataTracking = 'data_tracking',
	KeyAndLootbox = 'key_n_lootbox',
}

interface FeatureToggleProviderProps {
	children: ReactNode;
}

interface FeatureToggleContextDefault {
	isEnabled?: (feature_name: Feature) => boolean;
}

const ftDefault = {};

const FeatureToggleContext = createContext<FeatureToggleContextDefault>(ftDefault);

const FeatureToggleContextProvider = ({ children }: FeatureToggleProviderProps) => {
	const [features, setFeatures] = useState<string[]>([]);

	const isEnabled = useOnEventCallback((feature_name: Feature) => {
		return _.includes(features, feature_name.toString());
	});

	useEffect(() => {
		const str_raw_features = (process.env.NEXT_PUBLIC_ENABLED_FEATURES ?? '') as string;
		setFeatures(_.split(str_raw_features, ',').map((f) => f.trim()));
	}, []);

	return <FeatureToggleContext.Provider value={{ isEnabled }}>{children}</FeatureToggleContext.Provider>;
};

export const isFeatureEnabled = (feature: Feature) => {
	const str_raw_features = (process.env.NEXT_PUBLIC_ENABLED_FEATURES ?? '') as string;
	const features = _.split(str_raw_features, ',').map((f) => f.trim());
	return _.includes(features, feature.toString());
};

export const useFeatureToggles = () => useContext(FeatureToggleContext);

export { FeatureToggleContext, FeatureToggleContextProvider };
