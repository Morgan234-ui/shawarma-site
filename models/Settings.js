import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    storeOpen: { type: Boolean, default: true },
    businessName: { type: String, default: 'MimiRichies Bite', trim: true },
    phone: { type: String, default: '', trim: true },
    whatsapp: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    adminPassword: { type: String, default: '' },
    notificationEmail: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
