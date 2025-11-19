import { Router } from 'express'
import { tokenExtractor } from '../middleware/index.js'
import { 
  listEntries,
  createEntry,
  updateEntry,
  deleteEntry
 } from '../controllers/entries.controller.js'

const entriesRouter = Router()
entriesRouter.use(tokenExtractor)

entriesRouter.patch('/:id', updateEntry)
entriesRouter.delete('/:id', deleteEntry)

export const habytEntriesRouter = Router()
habytEntriesRouter.use(tokenExtractor)

habytEntriesRouter.get('/:habytId/entries', listEntries)
habytEntriesRouter.post('/:habytId/entries', createEntry)

export default entriesRouter