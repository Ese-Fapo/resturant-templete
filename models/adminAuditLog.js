import mongoose from "mongoose";

const adminAuditLogSchema = new mongoose.Schema(
  {
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    actorName: {
      type: String,
      trim: true,
      default: "",
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    targetName: {
      type: String,
      trim: true,
      default: "",
    },
    action: {
      type: String,
      enum: ["promote", "demote"],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AdminAuditLog || mongoose.model("AdminAuditLog", adminAuditLogSchema);
