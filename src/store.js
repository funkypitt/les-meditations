import { reactive } from 'vue'

const state = reactive({
    header: {
        title: 'Méditations guidées',
        note: 'd\'enpleineconscience.ch'
    }
})

export function useState () {
    return state;
}

export function useHeader (header) {
    state.header = header;
}