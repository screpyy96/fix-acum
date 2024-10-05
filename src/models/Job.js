import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tradeType: { type: String, required: true, enum: [
    "Instalator", "Fierar", "Zidar", "Constructor", "Tâmplar", "Curățenie", 
    "Drenaj", "Pavator", "Electrician", "Montator", "Grădinar", "Inginer", 
    "Meșter", "Bucătării", "Lăcătuș", "Mansardări", "Zugrav", "Dezinsecție", 
    "Tencuitor", "Mutare", "Energie", "Acoperișuri", "Securitate", 
    "Specialist", "Pietrar", "Piscine", "Faianțar", "Meșteșugar", "Arborist", 
    "Ferestre"
  ] },
  jobType: { type: String, required: true, enum: [/* your job types */] },
  startTime: { type: Date, required: true },
  projectStage: { type: String, required: true },
  isAuthorized: { type: Boolean, required: true, default: false },
  status: { type: String, enum: ["open", "in-progress", "completed", "closed"], default: "open" },
  applicants: [{
    workerId: { type: String, ref: 'Worker', required: true }, // Modificat la String
    appliedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);