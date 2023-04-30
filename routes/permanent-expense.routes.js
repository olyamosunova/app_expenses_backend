const { Router } = require('express')

const PermanentExpense = require('../models/permanent-expense')
const auth = require('../middleware/auth.middleware')

const router = Router()

router.put('/create', auth, async (req, res) => {
  try {
    const { values } = req.body

    const query = { owner: req.user.userId }

    let expense = await PermanentExpense.findOne(query)

    if (expense) {
      expense.values = values.values
    } else {
      expense = new PermanentExpense({
        values: values.values,
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
    const expenses = await PermanentExpense.find({
      owner: req.user.userId,
    })

    res.json({ id: expenses?.[0]?._id, expenses: expenses?.[0]?.values ?? [] })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
