import baseConfig from './default'
import config from './testnet'


export default {
  env: 'production',
  entry: 'testnet',

  base: 'https://sdwas.swap.online/',
  publicPath: `https://sdwas.swap.online${baseConfig.publicPath}`,

  ...config,
}
