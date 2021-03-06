// Libraries
import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../../models/user'
import Person, { IPerson } from '../../models/person'

const deleteRouter = express.Router()

deleteRouter.post('/', async (req: any, res, next) => {

  try {
    // @ts-ignore
    if (!req.token) {
      const error = new Error('Token missing')
      error.name = 'JsonWebTokenError'
      return next(error)
    }

    const decodedToken: any = jwt.verify(req.token, process.env.SECRET as any)

    if (!decodedToken.id) {
      const error = new Error('Token invalid')
      error.name = 'JsonWebTokenError'
      return next(error)
    }

    const user: any = await User.findById(decodedToken.id).populate('persons')

    const personIds = user.persons.map((person: IPerson) => person.id)

    await Person.deleteMany({ _id: { $in: personIds } })
    await User.findByIdAndDelete(decodedToken.id)

    res.status(200).send('Delete succesful')

  } catch (error) {
    next(error)
  }
})

export default deleteRouter
