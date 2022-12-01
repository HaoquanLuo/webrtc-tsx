import React from 'react'
import ReactDOM from 'react-dom/client'
import { store } from '@/redux/store'
import { Provider } from 'react-redux'
import App from './App'

import './index.css'
import 'uno.css'
import '@unocss/reset/normalize.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
