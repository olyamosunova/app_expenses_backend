const { Router } = require('express')
const TemporaryExpense = require('../models/temporary-expense')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/create', auth, async (req, res) => {
  try {
    const { date, money, category, comment } = req.body

    const expense = new TemporaryExpense({
      date,
      money,
      category,
      comment,
      owner: req.user.userId,
    })

    await expense.save()

    res.status(201).json({ expense })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)

    const expenses = await TemporaryExpense.find({
      owner: req.user.userId,
      date: { $gte: startDate, $lt: endDate },
    })

    res.json({
      expenses: expenses.map(item => ({
        id: item.id,
        money: item.money,
        category: item.category,
        date: item.date,
        comment: item.comment,
      })),
    })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/category', auth, async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)
    const category = req.query.category

    const expenses = await TemporaryExpense.find({
      owner: req.user.userId,
      date: { $gte: startDate, $lt: endDate },
      category,
    })

    const mappedExpenses = (expenses ?? []).map(item => ({
      date: item.date,
      money: item.money,
      comment: item.comment,
    }))

    res.json({
      expenses: mappedExpenses,
    })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
