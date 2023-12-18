import dotenv from 'dotenv'

dotenv.config()

const { env } = process

const config = {
  env: env.NODE_ENV || '',
  port: env.PORT || '',
  jwtSecret: env.JWT_SECRET || '',
  mongoUri: env.MONGODB_URI || ''
}

export default config
