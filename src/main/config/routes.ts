import { Express, Router } from 'express'
import { readdirSync, existsSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  const routesPath = join(__dirname, '../routes')

  if (existsSync(routesPath)) {
    const routeFiles = readdirSync(routesPath)
    for (const file of routeFiles) {
      if (!file.endsWith('.map')) {
        import(`../routes/${file}`).then(route => route.default(router))
      }
    }
  }
}
