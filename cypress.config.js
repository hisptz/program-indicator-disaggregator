const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: true,
  projectId: '',
  env: {
    dhis2DataTestPrefix: 'dhis2-pid',
    networkMode: 'live',
    dhis2ApiVersion: '38',
  },
  experimentalInteractiveRunEvents: true,
})
