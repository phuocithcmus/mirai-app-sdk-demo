import { PegaxyWalletAuthentication } from "@pegaxy/auth-sdk";
import { ReactNode, createContext } from "react";

interface AuthenticationContextProviderProps {
  children: ReactNode;
  auth: PegaxyWalletAuthentication;
}

interface AuthenticationContextDefault {
  auth?: PegaxyWalletAuthentication;
  // userPGXExisted?: boolean;
  // userMiraiExisted?: boolean;
  // miraiId?: string;
  // accessToken?: auth.TMiraiAccessToken;
  // setMiraiIDState?: (id: string) => void;
  // setUserPGXExisted?: (isExisted: boolean) => void;
}

const AuthenticationContext = createContext<AuthenticationContextDefault>({});

const AuthenticationContextProvider = ({
  children,
  ...props
}: AuthenticationContextProviderProps) => {
  // const { provider, account, library } = useActiveWeb3React();
  // const [user_pgx_existed, setUserPGXExisted] = useState<boolean>(false);
  // const [user_mirai_existed, setUserMiraiExisted] = useState<boolean>(false);
  // const [mirai_id, setMiraiId] = useState<string>(null);
  // const [isCheckingAuthentication, setIsCheckingAuthentication] = useState<boolean>(false);

  // const [access_token, setAccessToken] = useState<auth.TMiraiAccessToken>(null);

  // const setMiraiIDState = useOnEventCallback((id: string) => {
  // 	setMiraiId(id);
  // });

  // useEffect(() => {
  // 	(async () => {
  // 		if (account) {
  // 			setIsCheckingAuthentication(true);
  // 			try {
  // 				// prettier-ignore
  // 				const response = await ApiClient.mutate<{ mutation: GQLResponseCheckUserAddress }, MutationToCheckUserAddressArgs>({
  // 				mutation: MutationCheckUserAddress,
  // 				fetchPolicy: 'network-only',
  // 				variables: {
  // 					input: {
  // 						address: account,
  // 					},
  // 				}
  // 			});

  // 				const isExisted = get(response, (d) => d.data.mutation.data.existed, false);

  // 				setUserPGXExisted(isExisted);
  // 			} catch (e) {
  // 				console.log(e);
  // 				setUserPGXExisted(false);
  // 			}

  // 			setIsCheckingAuthentication(false);
  // 		}
  // 	})();
  // }, [account]);

  // useEffect(() => {
  // 	(async () => {
  // 		const tokenString = await localStorage.getItem(MiraiAuth.AUTH_TOKEN_KEY);
  // 		const accessToken = JSON.parse(tokenString) as auth.TMiraiAccessToken;
  // 		if (accessToken && !_.isNil(accessToken)) {
  // 			console.log(accessToken);
  // 			setAccessToken(accessToken);
  // 		}
  // 	})();
  // }, []);

  return (
    <>
      <AuthenticationContext.Provider
        value={{
          auth: props.auth,
          // userPGXExisted: user_pgx_existed,
          // userMiraiExisted: user_mirai_existed,
          // miraiId: mirai_id,
          // accessToken: access_token,
          // setMiraiIDState,
          // setUserPGXExisted,
        }}
      >
        {children}
      </AuthenticationContext.Provider>
    </>
  );
};

export { AuthenticationContext, AuthenticationContextProvider };
