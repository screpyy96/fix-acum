import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: String,
  createdAt: { type: Date, default: Date.now },
  clientId: { type: String, required: true, unique: true }, // Asigurați-vă că este unic
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);