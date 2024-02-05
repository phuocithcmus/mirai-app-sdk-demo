import { ConnectWalletContextProvider } from "./ConnectWalletContext";
import { MeasurementContextProvider } from "./MeasurementContext";
import { SwapContextProvider } from "./SwapContext";
import React from "react";
import { AppAccountVersionContextProvider } from "./AppAccountVersionContext";
import { FeatureToggleContextProvider } from "./FeatureToggleContext";

export const combineComponents = (
  ...components: React.FC<{ children: React.ReactNode }>[]
): React.FC<{ children: React.ReactNode }> => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      // eslint-disable-next-line react/display-name
      return ({
        children,
      }: React.ComponentProps<
        React.FC<{ children: React.ReactNode }>
      >): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};

const providers = [
  FeatureToggleContextProvider,
  ConnectWalletContextProvider,
  MeasurementContextProvider,
  SwapContextProvider,
  AppAccountVersionContextProvider,
];

interface IAppContextProvider {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<IAppContextProvider> =
  combineComponents(...providers);
