import U from 'uprogress';
import {ff} from '../../api';
import {ffErrorHandler} from '../../utils/model';

const defaultState = {
	loading: false,
	timleine: [],
	parameters: null
};

export const mentions = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters})
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const {setTimeline} = dispatch.mentions;
			const u = new U();

			try {
				u.start();
				await dispatch.notification.load();

				const timeline = await ff.get('/statuses/mentions', {format: 'html', ...state.mentions.parameters, ...parameters});
				setTimeline({timeline, parameters});
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				const isTimeout = errorMessage === 'Request timed out';

				if (isTimeout) {
					u.done();
					dispatch.mentions.fetch(parameters);
				} else {
					dispatch.message.notify(errorMessage);
					u.done();
				}
			}
		}
	})
};
