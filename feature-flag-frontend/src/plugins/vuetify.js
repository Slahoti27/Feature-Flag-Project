import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// REQUIRED (this is what you're missing)
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
})