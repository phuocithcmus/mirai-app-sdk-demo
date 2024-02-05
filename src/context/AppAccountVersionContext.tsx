import { createContext, ReactNode, useCallback, useState } from "react";

interface AppAccountVersionContextProps {
  children: ReactNode;
}

interface AppAccountVersionContextDefault {
  version: number | null;
  setVersion: (ver: number) => void;
}

const AppAccountVersionContexttPropsDefault = {
  version: null,
  setVersion: () => false,
};

const AppAccountVersionContext = createContext<AppAccountVersionContextDefault>(
  AppAccountVersionContexttPropsDefault
);

const AppAccountVersionContextProvider = ({
  children,
}: AppAccountVersionContextProps) => {
  const [version, setVersion] = useState<number | null>(null);

  const setVersionState = useCallback((ver: number) => {
    setVersion(ver);
  }, []);

  return (
    <AppAccountVersionContext.Provider
      value={{ version, setVersion: setVersionState }}
    >
      {children}
    </AppAccountVersionContext.Provider>
  );
};

export { AppAccountVersionContext, AppAccountVersionContextProvider };
