import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  clientId: {
    type: String,
    required: [true, 'Please provide a client ID'],
    unique: true,
  }
});

ClientSchema.pre('save', function(next) {
  if (!this.clientId) {
    this.clientId = uuidv4().toString();
  }
  next();
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);