import { adaptRoute } from '@/main/adapters'

import { Router } from 'express'
import { makeCreateInviteController } from '@/main/factories/controllers/invite'
import { adminAuth } from '../middlewares'

export default (router: Router): void => {
  router.post('/invites', adminAuth, adaptRoute(makeCreateInviteController()))
}
