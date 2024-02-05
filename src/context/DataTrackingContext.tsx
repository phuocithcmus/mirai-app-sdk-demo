import { useOnEventCallback } from '@app-helpers';
import { useActiveWeb3React } from '@pegaxy/auth-sdk';
import TrackingClient, { EventWhitelist, SharedSchema } from '@pegaxy/event-tracking-webworker';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { ConnectWalletContext } from './ConnectWalletContext';
import { Feature, isFeatureEnabled } from './FeatureToggleContext';

interface DataTrackingProviderProps {
	children: ReactNode;
}

interface DataTrackingContextDefault {
	trackingClient?: TrackingClient | null;
	pushWebLogEvent?: <T extends SharedSchema>(payload: T) => Promise<void>;
	startTracking?: () => void;
	isStarted?: boolean;
}

const dataTrackingDefault = {
	trackingClient: null,
	isStarted: false,
};

const DataTrackingContext = createContext<DataTrackingContextDefault>(dataTrackingDefault);

const DataTrackingContextProvider = ({ children }: DataTrackingProviderProps) => {
	const { account } = useActiveWeb3React();
	const { toggleModal } = useContext(ConnectWalletContext);
	const router = useRouter();

	const [is_started, setIsStarted] = useState<boolean>(false);

	const tracking_client = useRef<TrackingClient | null>(null);

	const pushWebLogEvent = useOnEventCallback(async <T extends SharedSchema>(payload: T) => {
		if (tracking_client.current) {
			return tracking_client.current.pushWebLog(payload, {
				address: account,
			});
		}
	});

	const watchHeartBeat = useOnEventCallback(() => {
		if (tracking_client.current) {
			return tracking_client.current.watchHeartBeat(window.location.href, {
				address: account,
			});
		}
	});

	const defineMetadata = useOnEventCallback(() => {
		if (tracking_client.current) {
			return tracking_client.current.defineMetadata({
				address: account,
			});
		}
	});

	const addWhitelistedEvents = useOnEventCallback(() => {
		const events = _.split(process.env.NEXT_PUBLIC_WHITELISTED_TRACKING_EVENTS, ',').map((e) => e.trim());
		events.forEach((e) => {
			EventWhitelist.INSTANCE.add(e);
			console.log('Register event: ' + e);
		});
	});

	const startTracking = useOnEventCallback(async () => {
		return new Promise((resolve) => {
			addWhitelistedEvents();

			// Off tracking web v1
			// setTimeout(async () => {
			// 	const trackingClient = new TrackingClient();

			// 	if (process.env.NODE_ENV === 'production') {
			// 		await trackingClient.putWorker(new Worker('/js/worker.js'));
			// 	} else {
			// 		const worker_url = new URL('../../node_modules/@pegaxy/event-tracking-webworker/dist/worker/worker.js', import.meta.url); // prettier-ignore
			// 		await trackingClient.putWorker(new Worker(worker_url));
			// 	}

			// 	// For testing first
			// 	await trackingClient.putConfig({
			// 		Env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
			// 	});

			// 	// 5 mins interval for committing events to Backend
			// 	await trackingClient.setCommitInterval(Number(process.env.NEXT_PUBLIC_TRACKING_EVENT_COMMIT_INTERVAL));

			// 	// Set checksum salt
			// 	await trackingClient.setChecksumSalt(process.env.NEXT_PUBLIC_TRACKING_EVENT_SALT);

			// 	tracking_client.current = trackingClient;

			// }, 1000);

			resolve(true);
		});
	});

	useEffect(() => {
		if (is_started) {
			watchHeartBeat();
		}
	}, [is_started, account, router.query, router.pathname]);

	useEffect(() => {
		if (is_started) {
			defineMetadata();
		}
	}, [is_started, account]);

	useEffect(() => {
		if (isFeatureEnabled(Feature.DataTracking)) {
			(async () => {
				try {
					await startTracking();
					setIsStarted(true);
				} catch (e) {}
			})();

			return () => {
				if (tracking_client.current) {
					tracking_client.current.destroy();
					tracking_client.current = null;
				}
			};
		}
	}, []);

	return (
		<DataTrackingContext.Provider
			value={{
				trackingClient: tracking_client.current,
				startTracking,
				pushWebLogEvent,
				isStarted: is_started,
			}}
		>
			{children}
		</DataTrackingContext.Provider>
	);
};

const useDataTrackingContext = () => useContext(DataTrackingContext);

export { DataTrackingContext, DataTrackingContextProvider, useDataTrackingContext };
