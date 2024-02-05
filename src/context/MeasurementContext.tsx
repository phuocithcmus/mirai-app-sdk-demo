import _ from 'lodash';
import { createContext, ReactNode, useState } from 'react';

interface MeasureItem {
	eventName: string;
	measuring: boolean;
	time: number;
}

interface MeasurementProviderProps {
	children: ReactNode;
}

interface MeasurementContextDefault {
	start_measure: (eventName: string) => void;
	stop_measure: (eventName: string) => number; // Return time
}

const MeasurementDefault = {
	start_measure: () => false,
	stop_measure: () => 0,
};

const MeasurementContext = createContext<MeasurementContextDefault>(MeasurementDefault);

const MeasurementContextProvider = ({ children }: MeasurementProviderProps) => {
	const [events, setEvents] = useState<MeasureItem[]>([]);

	const start_measure = (eventName: string) => {
		const event = { eventName, measuring: true, time: Date.now() };
		setEvents([..._.filter(events, (evt) => evt.eventName !== eventName), event]);
	};

	const stop_measure = (eventName: string) => {
		let event = _.find(events, (evt) => evt.eventName === eventName);

		if (!event || !event.measuring) {
			console.log(`${eventName} is not measuring`);
			return 0;
		}

		setEvents(_.filter(events, (evt) => evt.eventName !== eventName));

		return Date.now() - event.time;
	};

	return (
		<MeasurementContext.Provider value={{ start_measure, stop_measure }}>{children}</MeasurementContext.Provider>
	);
};

export { MeasurementContext, MeasurementContextProvider };
