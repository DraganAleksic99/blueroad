import express, { Express, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import postRoutes from './routes/post.routes'

const app: Express = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      const allowedOrigins = ['http://localhost:5173', 'https://blue-road.netlify.app']

      if (!origin) {
        return callback(null, true)
      }

      if (origin) {
        if (allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
    }
  })
)

app.use('/', userRoutes)
app.use('/', authRoutes)
app.use('/', postRoutes)

// eslint-disable-next-line
app.use((err, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.name + ': ' + err.message })
  } else if (err) {
    res.status(400).json({ error: err.name + ': ' + err.message })
    console.log(err)
  }
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from express!')
})

export default app
