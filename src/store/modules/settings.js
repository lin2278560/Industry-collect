import variables from '../../assets/my-theme/index.less'
import defaultSettings from '../../settings'

const { showSettings } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,

}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
      console.log(state)
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

