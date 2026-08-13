import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.9:10',
  releaseNotes: {
    en_US:
      'Bundle speed-test CLIs so startup does not depend on install.speedtest.net',
    es_ES:
      'Incluye los CLI de pruebas de velocidad para que el inicio no dependa de install.speedtest.net',
    de_DE:
      'Speedtest-CLIs werden gebündelt, damit der Start nicht von install.speedtest.net abhängt',
    pl_PL:
      'Dołączono CLI testów prędkości, aby start nie zależał od install.speedtest.net',
    fr_FR:
      'Les CLI de test de débit sont inclus afin que le démarrage ne dépende pas de install.speedtest.net',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
