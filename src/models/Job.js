import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tradeType: {
    type: String,
    required: true,
    enum: [
      "Instalator", "Fierar", "Zidar", "Constructor", "Tâmplar", "Curățenie", 
      "Drenaj", "Pavator", "Electrician", "Montator", "Grădinar", "Inginer", 
      "Meșter", "Bucătării", "Lăcătuș", "Mansardări", "Zugrav", "Dezinsecție", 
      "Tencuitor", "Mutare", "Energie", "Acoperișuri", "Securitate", 
      "Specialist", "Pietrar", "Piscine", "Faianțar", "Meșteșugar", "Arborist", 
      "Ferestre"
    ]
  },
  jobType: {
    type: String,
    required: true,
    enum: ["installation", "repair", "maintenance", "full-time", "part-time", "contract", "temporary"],
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "completed", "closed"],
    default: "open",
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);