const { Router } = require('express')
const Expense = require('../models/expense')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/create', auth, async (req, res) => {
  try {
    const { date, money, category, comment } = req.body

    const expense = new Expense({
      date,
      money,
      category,
      comment,
      owner: req.user.userId,
    })

    await expense.save()

    res.status(201).json({ expense })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попрлбуйте снова' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)

    const expenses = await Expense.find({
      owner: req.user.userId,
      date: { $gte: startDate, $lt: endDate },
    })

    res.json(expenses)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
