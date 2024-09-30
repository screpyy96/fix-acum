import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tradeType: { type: String, required: true },
  jobType: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'open' }
});

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job;