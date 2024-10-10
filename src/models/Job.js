import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Opțional: adaugă un rating
}, { timestamps: true });

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
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now }
  }],
  
  reviews: { type: [ReviewSchema], default: [] }, // Asigură-te că este inițializat ca un array gol
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);