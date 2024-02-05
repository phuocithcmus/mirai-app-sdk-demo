import { SettingElement, StateElement, VisInUseMode } from '@app-constants';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import useQueryWebConfig from '@app-hooks/api/common/useQueryWebConfig';
import { GQLMyInfo, GQLWebConfigPlay } from '@app-schemas/api';
import { useQueryMyInfo } from '@app-hooks/api';
import {
	get,
	getAccountNoActiveTime,
	getCountdownLockVis,
	getErrorMessage,
	getGameConfigFromMyInfo,
} from '@app-helpers';
import _ from 'lodash';
import useQueryMyBalance from '@app-hooks/api/my/useQueryMyBalance';
import useMutationGameConfig from '@app-hooks/api/my/useMutationGameConfig';
import { toast } from 'react-toastify';
import ApiClient from '@app-clients/client';
import { QueryMyInfo } from '@app-clients/api';
import { NetworkStatus } from '@apollo/client';

interface ConfigContextProviderProps {
	children: ReactNode;
}

interface ConfigContextContextDefault {
	pega_detail_preview: string | null;
	config?: GQLWebConfigPlay | null;
	selectPegaModelPreview: (mode?: string | null) => void;
	is_show_alert?: boolean | null;
	showAlert?: (show: boolean) => void;
}

const DEFAULT_PEGA_DETAIL_PREVIEW = '3D';

const configContextDefault = {
	pega_detail_preview: DEFAULT_PEGA_DETAIL_PREVIEW,
	config: null,
	selectPegaModelPreview: () => false,
	is_show_alert: false,
	showAlert: () => false,
};

const ConfigContext = createContext<ConfigContextContextDefault>(configContextDefault);

function useConfigContext() {
	return useContext(ConfigContext);
}

const ConfigContextProvider = ({ children }: ConfigContextProviderProps) => {
	const [pega_detail_preview, setPegaDetailPreview] = useState<string | null>(null);
	const [is_show_alert, setShowAlert] = useState<boolean | null>(false);

	const { config } = useQueryWebConfig();
	// My info | Game config
	const { data: myInfo, refetch: refetchMyInfo } = useQueryMyInfo();
	const { vis_claimable } = useQueryMyBalance();

	const last_active = get(myInfo, (d) => d.last_active, null);

	const selectPegaModelPreview = (mode: string | null) => {
		return setPegaDetailPreview(mode);
	};

	const showAlert = (show: boolean) => {
		return setShowAlert(show);
	};

	const { updateGameConfig } = useMutationGameConfig({
		onError: (e: any) => {
			toast('Failed to switch game mode: ' + getErrorMessage(e), {
				type: 'error',
				delay: 1000,
			});
		},
		onCompleted: () => {
			// return gotoPickPegaPage(router, mode as string);
		},
	});

	useEffect(() => {
		const update_default_currency = async () => {
			const response = await ApiClient.query<{ query: GQLMyInfo }>({
				query: QueryMyInfo,
				fetchPolicy: 'network-only',
			});

			const data = get(response, (d) => d.data.query, {} as GQLMyInfo);
			const loading = response.networkStatus === NetworkStatus.loading;

			const currentGameConfig = getGameConfigFromMyInfo(data);
			if (
				!_.isNil(currentGameConfig) &&
				(_.isNil(currentGameConfig?.fusedMode) || _.isEmpty(String(currentGameConfig?.fusedMode)))
			) {
				await updateGameConfig({
					input: { ...currentGameConfig, fusedMode: VisInUseMode.OnChain },
				});

				await refetchMyInfo();
			}
		};

		update_default_currency().catch((e) => console.log(e));
	}, []);

	useEffect(() => {
		(async () => {
			const is_show_alert = localStorage.getItem(StateElement.Alert_Not_Active);
			if (!_.isNil(myInfo) && last_active) {
				const countdown_day_lock_vis = getCountdownLockVis(last_active);
				if (_.isNil(is_show_alert)) {
					if (
						countdown_day_lock_vis < Number(process.env.NEXT_PUBLIC_DEFAULT_ALERT_LOCK_VIS_DAY) &&
						(vis_claimable > 0 ||
							getAccountNoActiveTime(myInfo?.last_active) >=
								Number(process.env.NEXT_PUBLIC_DEFAULT_LOCK_VIS_DAY))
					) {
						setShowAlert(true);
						localStorage.setItem(StateElement.Alert_Not_Active, String(countdown_day_lock_vis));
					}
				} else {
					if (countdown_day_lock_vis >= Number(process.env.NEXT_PUBLIC_DEFAULT_ALERT_LOCK_VIS_DAY)) {
						localStorage.removeItem(StateElement.Alert_Not_Active);
					}
				}
			}
		})();
	}, [last_active]);

	useEffect(() => {
		(async () => {
			const mode = localStorage.getItem(SettingElement.Pega_Detail_Preview) || DEFAULT_PEGA_DETAIL_PREVIEW;
			setPegaDetailPreview(mode);
		})();
	}, []);

	useEffect(() => {
		if (!!pega_detail_preview) {
			localStorage.setItem(SettingElement.Pega_Detail_Preview, pega_detail_preview);
		}
	}, [pega_detail_preview]);

	return (
		<ConfigContext.Provider
			value={{
				is_show_alert,
				pega_detail_preview,
				config:
					process.env.NEXT_PUBLIC_MODE === 'prod' || process.env.NEXT_PUBLIC_MODE === 'test'
						? config?.play
						: config?.playTest,
				selectPegaModelPreview,
				showAlert,
			}}
		>
			{children}
		</ConfigContext.Provider>
	);
};

export { ConfigContext, ConfigContextProvider, useConfigContext };
