const env = process.env.NODE_ENV || 'development'

const development = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000,
  },
  mongodb: {
    host: process.env.DEV_MONGO_HOST || 'localhost',
    port: parseInt(process.env.DEV_MONGO_PORT) || 27017,
    name: process.env.DEV_MONGO_NAME || 'sapia',
    user: process.env.DEV_MONGO_USER || 'sapia',
    passwd: process.env.DEV_MONGO_PASSWD || 'sapia',
  },
}

const production = {
  app: {
    port: parseInt(process.env.PROD_APP_PORT) || 3000,
  },
  mongodb: {
    host: process.env.PROD_MONGO_HOST || 'localhost',
    port: parseInt(process.env.PROD_MONGO_PORT) || 27017,
    name: process.env.PROD_MONGO_NAME || 'sapia',
    user: process.env.PROD_MONGO_USER || 'sapia',
    passwd: process.env.PROD_MONGO_PASSWD || 'sapia',
  },
}

const config = {
  development,
  production,
}

export default config[env]
