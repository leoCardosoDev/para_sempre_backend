import { adaptRoute } from '@/main/adapters'

import { Router } from 'express'
import { makeCreateInviteController } from '@/main/factories/controllers/invite'
import { adminAuth } from '@/main/middlewares'
import { makeLoadInviteController } from '../factories/controllers/invite/load-invite-controller-factory'

export default (router: Router): void => {
  router.post('/invites', adminAuth, adaptRoute(makeCreateInviteController()))
  router.post('/invites/result', adminAuth, adaptRoute(makeLoadInviteController()))
}
