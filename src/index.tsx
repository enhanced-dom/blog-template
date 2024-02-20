import { Shell, defaultTheme } from '@enhanced-dom/slides'
import { render } from 'react-dom'

import { MainView } from './views'
import { theme as templateTheme, logo as templateLogo } from './template.theme'

const theme = defaultTheme.mergeWith(templateTheme)

export const App = () => (
  <Shell theme={theme}>
    <Shell.Contents author="Enhanced Dom" date="2021-05-10" title="Blog template">
      <MainView />
    </Shell.Contents>
    <Shell.Branding>
      <img src={templateLogo} alt="logo" />
    </Shell.Branding>
  </Shell>
)

const element = document.getElementById('root')
render(<App />, element)
