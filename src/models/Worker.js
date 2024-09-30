import mongoose from 'mongoose';

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  trade: { type: String, required: true }, // Adăugat câmpul trade
  experience: String,
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Worker || mongoose.model('Worker', WorkerSchema);