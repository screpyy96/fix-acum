import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  status: { type: String, enum: ['open', 'in_progress', 'completed'], default: 'open' },
  budget: Number,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);