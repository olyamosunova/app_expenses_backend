const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/user')
const router = Router()

// /api/auth/register
router.post(
  '/register',
  [
    check(
      'username',
      'Минимальная длина имени пользователя 5 символов',
    ).isLength({
      min: 5,
    }),
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        })
      }

      const { username, password } = req.body

      const candidate = await User.findOne({ username })

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Такой пользователь уже существует' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ username, password: hashedPassword })

      await user.save()

      const token = jwt.sign(
        { userId: user.id },
        process.env.REACT_APP_JWT_SECRET,
        {
          expiresIn: '30d',
        },
      )

      return res.status(201).json({
        message: 'Пользователь создан',
        data: {
          token,
          userId: user.id,
        },
      })
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попрлбуйте снова' })
    }
  },
)

// /api/auth/login
router.post(
  '/login',
  [
    check('username', 'Введите корректное имя пользователя').exists({
      min: 5,
    }),
    check('password', 'Введите пароль').exists({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему',
        })
      }

      const { username, password } = req.body

      const user = await User.findOne({ username })

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const isMatchPassword = await bcrypt.compare(password, user.password)

      if (!isMatchPassword) {
        return res
          .status(400)
          .json({ message: 'Неверный пароль, попробуйте снова' })
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.REACT_APP_JWT_SECRET,
        {
          expiresIn: '30d',
        },
      )

      res.json({ token, userId: user.id })
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  },
)

module.exports = router
