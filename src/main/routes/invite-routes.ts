import { adaptRoute } from '@/main/adapters'

import { Router } from 'express'
import { makeCreateInviteController, makeLoadInvitebyCodeController } from '../factories/controllers/invite'
import { adminAuth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/invites', adminAuth, adaptRoute(makeCreateInviteController()))
  router.get('/invites/:inviteCode/results', adminAuth, adaptRoute(makeLoadInvitebyCodeController()))
}
