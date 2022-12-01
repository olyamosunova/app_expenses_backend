const { Schema, model } = require('mongoose')

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Expense',
    },
  ],
})

module.exports = model('User', schema)
