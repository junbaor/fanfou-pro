import U from 'uprogress';
import {ff} from '../../api';
import {ffErrorHandler} from '../../utils/model';

const defaultState = {
	list: []
};

export const trends = {
	state: defaultState,

	reducers: {
		setList: (state, list) => ({...state, list})
	},

	effects: dispatch => ({
		fetch: async () => {
			try {
				const list = await ff.get('/saved_searches/list');
				dispatch.trends.setList(list);
			} catch {}
		},

		create: async (query, state) => {
			const u = new U();

			try {
				u.start();
				const result = await ff.post('/saved_searches/create', {query});
				dispatch.trends.setList({list: state.trends.list.concat(result)});
				dispatch.message.notify('关注话题成功！');
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		},

		destroy: async (id, state) => {
			const u = new U();

			try {
				u.start();
				const result = await ff.post('/saved_searches/destroy', {id});
				dispatch.trends.setList({list: state.trends.list.filter(l => l.query !== result.query)});
				dispatch.message.notify('已取消关注话题！');
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		}
	})
};
