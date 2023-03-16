// subscriptions

import fileStore from "./fileStore";
import settingsStore, {ISettingsStore} from "./settingsStore";
import {proxy} from "valtio";

export type IStore = {
    init: () => Promise<any> | any
    persist: () => Promise<any> | any
}

function RootStore(stores: { settingsStore: ISettingsStore, fileStore: typeof fileStore }) {
    const state = proxy({
        ...stores,
        // TODO add global methods here
    })
    return state
}

export const state = RootStore({settingsStore, fileStore})

// type State = typeof state

// @ts-ignore
window.state = state