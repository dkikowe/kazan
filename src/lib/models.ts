import mongoose from 'mongoose';
import FilterItem from '@/models/FilterItem';
import Tag from '@/models/Tag';
import ExcursionCard from '@/models/ExcursionCard';
import CommercialExcursion from '@/models/CommercialExcursion';

// Регистрируем все модели
const models = {
  FilterItem,
  Tag,
  ExcursionCard,
  CommercialExcursion,
};

export default models; 