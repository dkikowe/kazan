import mongoose, { Schema, Document } from 'mongoose';

export interface IFilterItem extends Document {
  name: string;
  slug: string;
  group: string;
  sortOrder: number;
  isActive: boolean;
}

const FilterItemSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'FilterGroup',
    required: true,
  },
  sortOrder: {
    type: Number,
    required: true,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.FilterItem || mongoose.model<IFilterItem>('FilterItem', FilterItemSchema); 