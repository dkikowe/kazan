import mongoose from 'mongoose';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import ExcursionCard from '@/models/ExcursionCard';
import CommercialExcursion from '@/models/CommercialExcursion';

// Регистрируем все модели
const models = {
  Category,
  Tag,
  ExcursionCard,
  CommercialExcursion,
};

export default models; 