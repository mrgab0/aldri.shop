import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface IChatLead extends Document {
  sessionId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  interestedProducts: string[];
  intentScore: "hot" | "warm" | "cold";
  conversation: IChatMessage[];
  ipAddress?: string;
  device?: string;
  referrer?: string;
  leadStatus: "nuevo" | "contactado" | "convertido" | "descartado";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatLeadSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    customerEmail: { type: String, default: "" },
    interestedProducts: [{ type: String }],
    intentScore: {
      type: String,
      enum: ["hot", "warm", "cold"],
      default: "cold"
    },
    conversation: [
      {
        role: { type: String, enum: ["user", "model"], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    ipAddress: { type: String, default: "" },
    device: { type: String, default: "desktop" },
    referrer: { type: String, default: "direct" },
    leadStatus: {
      type: String,
      enum: ["nuevo", "contactado", "convertido", "descartado"],
      default: "nuevo"
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

ChatLeadSchema.index({ intentScore: 1, createdAt: -1 });
ChatLeadSchema.index({ customerPhone: 1 });
ChatLeadSchema.index({ customerEmail: 1 });

export const ChatLead =
  mongoose.models.ChatLead || mongoose.model<IChatLead>("ChatLead", ChatLeadSchema);
