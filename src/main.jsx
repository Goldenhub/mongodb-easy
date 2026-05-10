import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'
import { PostHogProvider, PostHogErrorBoundary } from '@posthog/react'

import {initAnalytics} from './lib/phuglytics.js'

initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider client={posthog}> 
      <PostHogErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PostHogErrorBoundary>
    </PostHogProvider> 
  </StrictMode>,
)
