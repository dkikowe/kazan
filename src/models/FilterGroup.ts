import mongoose, { Schema, Document } from 'mongoose';

export interface IFilterGroup extends Document {
  name: string;
  slug: string;
  sortOrder: number;
  isVisible: boolean;
}

const FilterGroupSchema = new Schema<IFilterGroup>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sortOrder: { type: Number, required: true, default: 0 },
  isVisible: { type: Boolean, required: true, default: true }
}, { timestamps: true });

export default mongoose.models.FilterGroup || mongoose.model<IFilterGroup>('FilterGroup', FilterGroupSchema); 