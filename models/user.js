import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  admin: {
    type: Boolean,
    default: false,
  },
  addresses: [
    {
      street: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      postalCode: { type: String, trim: true, required: true },
      label: { type: String, trim: true, default: "Principal" },
      isDefault: { type: Boolean, default: false },
    },
  ],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
