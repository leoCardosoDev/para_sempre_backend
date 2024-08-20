import { adaptRoute } from '@/main/adapters'

import { Router } from 'express'
import { makeCreateInviteController } from '../factories/controllers/invite'
import { adminAuth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/invites', adminAuth, adaptRoute(makeCreateInviteController()))
}
