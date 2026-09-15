import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.9:11',
  releaseNotes: {
    en_US:
      'The Gotify notification channel accepts Gotify v3 application tokens',
    es_ES:
      'El canal de notificaciones de Gotify acepta tokens de aplicación de Gotify v3',
    de_DE:
      'Der Gotify-Benachrichtigungskanal akzeptiert Gotify-v3-Anwendungstokens',
    pl_PL:
      'Kanał powiadomień Gotify akceptuje tokeny aplikacji Gotify w wersji 3',
    fr_FR:
      "Le canal de notification Gotify accepte les jetons d'application Gotify v3",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
