const { Schema, model } = require('mongoose')

const schema = new Schema({
  money: { type: String, required: true },
  category: { type: String, default: 'other', required: true },
  date: { type: Date, default: Date.now },
  comment: { type: String, required: false },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = model('TemporaryExpense', schema)
