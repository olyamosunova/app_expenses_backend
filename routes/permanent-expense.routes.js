const { Router } = require('express')

const PermanentExpense = require('../models/permanent-expense')
const auth = require('../middleware/auth.middleware')

const router = Router()

router.put('/create', auth, async (req, res) => {
  try {
    const { date, data } = req.body

    const dateObj = new Date(date)

    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()

    const query = {
      owner: req.user.userId,
      $expr: {
        $and: [
          { $eq: [{ $month: '$date' }, month] },
          { $eq: [{ $year: '$date' }, year] },
        ],
      },
    }

    let expense = await PermanentExpense.findOne(query)

    if (expense) {
      expense.values = data
    } else {
      expense = new PermanentExpense({
        values: data,
        date,
        owner: req.user.userId,
      })
    }

    await expense.save()

    res.status(201).json({ expense })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const date = new Date(req.query.date)

    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const expenses = await PermanentExpense.find({
      owner: req.user.userId,
      $expr: {
        $and: [
          { $eq: [{ $month: '$date' }, month] },
          { $eq: [{ $year: '$date' }, year] },
        ],
      },
    })

    res.json({ id: expenses?.[0]?._id, expenses: expenses?.[0]?.values ?? [] })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
