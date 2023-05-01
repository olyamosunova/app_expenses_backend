const { Schema, model } = require('mongoose')

const schema = new Schema({
  values: [
    {
      money: { type: Number, default: 0 },
      category: { type: String, default: 'other', required: true },
    },
  ],
  date: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = model('PermanentExpense', schema)
