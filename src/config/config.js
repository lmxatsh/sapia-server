const env = process.env.NODE_ENV || 'development'

const development = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000,
    secret: process.env.JWT_SECRET || 'sapia',
    retryTimeLimit: process.env.RETRY_TIME_LIMIT || '5m',
    retryNumLimit: process.env.RETRY_NUM_LIMIT || 3,
    retryAllowedAfter: process.env.RETRY_ALLOWED_AFTER || '1h',
    tokenExpiresAfter: process.env.TOKEN_EXPIRES_AFTER || '1h',
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
    secret: process.env.JWT_SECRET || 'sapia',
    retryTimeLimit: process.env.RETRY_TIME_LIMIT || '5m',
    retryNumLimit: process.env.RETRY_NUM_LIMIT || 3,
    retryAllowedAfter: process.env.RETRY_ALLOWED_AFTER || '1h',
    tokenExpiresAfter: process.env.TOKEN_EXPIRES_AFTER || '1h',
  },
  mongodb: {
    host: process.env.PROD_MONGO_HOST || 'localhost',
    port: parseInt(process.env.PROD_MONGO_PORT) || 27017,
    name: process.env.PROD_MONGO_NAME || 'sapia',
    user: process.env.PROD_MONGO_USER || 'sapia',
    passwd: process.env.PROD_MONGO_PASSWD || 'sapia',
  },
}

const test = {
  app: {
    port: parseInt(process.env.TEST_APP_PORT) || 3000,
    secret: process.env.JWT_SECRET || 'sapia',
    retryTimeLimit: process.env.RETRY_TIME_LIMIT || '5m',
    retryNumLimit: process.env.RETRY_NUM_LIMIT || 3,
    retryAllowedAfter: process.env.RETRY_ALLOWED_AFTER || '1h',
    tokenExpiresAfter: process.env.TOKEN_EXPIRES_AFTER || '1h',
  },
  mongodb: {
    host: process.env.TEST_MONGO_HOST || 'localhost',
    port: parseInt(process.env.TEST_MONGO_PORT) || 27017,
    name: process.env.TEST_MONGO_NAME || 'sapia',
    user: process.env.TEST_MONGO_USER || 'sapia',
    passwd: process.env.TEST_MONGO_PASSWD || 'sapia',
  },
}

const config = {
  development,
  production,
  test,
}

export default config[env]
