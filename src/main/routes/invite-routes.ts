import { adaptRoute } from '@/main/adapters'

import { Router } from 'express'
import { makeCreateInviteController } from '../factories/controllers/invite'

export default (router: Router): void => {
  router.post('/invites', adaptRoute(makeCreateInviteController()))
}
