import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'my-speed',
  title: 'MySpeed',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9Labs/myspeed-startos/tree/update/040',
  upstreamRepo: 'https://github.com/gnmyt/myspeed',
  marketingUrl: 'https://myspeed.dev/',
  donationUrl: 'https://ko-fi.com/gnmyt',
  docsUrls: ['https://docs.myspeed.dev/'],
  description: { short, long },
  volumes: ['main'],
  images: {
    main: {
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
