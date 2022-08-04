import mockRequest from '@/utils/mockRequest'
export default {
    namespaced: true,
    state: {
        list: {}
    },
    mutations: {
        GETDATA(state, list) {
            state.list = list;
        }
    },
    actions: {
        // 获取首页的mock数据
        async getData({ commit }) {
            let result = await mockRequest.get('/home/list');
            if (result.code == 200) {
                commit('GETDATA', result.data)
            }
        }
    },
    getters: {
        orderFullYearAxis(state) {
            return state.list.orderFullYearAxis;
        },
        userFullYearAxis(state) {
            return state.list.userFullYearAxis;
        },
        orderFullYear(state) {
            return state.list.orderFullYear;
        },
        userFullYear(state) {
            return state.list.userFullYear;
        },
        orderRank(state) {
            return state.list.orderRank;
        },
        userRank(state) {
            return state.list.userRank;
        },
        visitTrend(state) {
            return state.list.visitTrend;
        },
        payTrend(state) {
            return state.list.payTrend;
        },
        searchWord(state) {
            return state.list.searchWord;
        },
        saleRank(state) {
            return state.list.saleRank;
        },
    }
}