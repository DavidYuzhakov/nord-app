export const loadLiveModePage = () => import('@/pages/LiveModePage')

export const loadSongsPage = () => import('@/pages/SongsPage')

export const preloadMainRoutes = () =>
  Promise.allSettled([loadLiveModePage(), loadSongsPage()])
