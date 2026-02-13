import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'my-speed',
  title: 'MySpeed',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/myspeed-startos',
  upstreamRepo: 'https://github.com/gnmyt/myspeed',
  supportSite: 'https://github.com/gnmyt/myspeed/issues',
  marketingSite: 'https://myspeed.dev/',
  donationUrl: 'https://ko-fi.com/gnmyt',
  docsUrl: 'https://docs.myspeed.dev/',
  description: { short, long },
  volumes: ['main'],
  images: {
    main: {
      source: { dockerBuild: { dockerfile: 'Dockerfile', workdir: '.' } },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
