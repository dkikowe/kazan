import { Request, Response, NextFunction } from 'express';
import FilterGroup from '../models/FilterGroup';

export const createFilterGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterGroup = await FilterGroup.create(req.body);
    res.status(201).json(filterGroup);
  } catch (error) {
    next(error);
  }
};

export const getFilterGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterGroups = await FilterGroup.find().sort({ sortOrder: 1 });
    res.json(filterGroups);
  } catch (error) {
    next(error);
  }
};

export const getFilterGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterGroup = await FilterGroup.findById(req.params.id);
    if (!filterGroup) {
      return res.status(404).json({ message: 'Группа фильтров не найдена' });
    }
    res.json(filterGroup);
  } catch (error) {
    next(error);
  }
};

export const updateFilterGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterGroup = await FilterGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!filterGroup) {
      return res.status(404).json({ message: 'Группа фильтров не найдена' });
    }
    res.json(filterGroup);
  } catch (error) {
    next(error);
  }
};

export const deleteFilterGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterGroup = await FilterGroup.findByIdAndDelete(req.params.id);
    if (!filterGroup) {
      return res.status(404).json({ message: 'Группа фильтров не найдена' });
    }
    res.json({ message: 'Группа фильтров успешно удалена' });
  } catch (error) {
    next(error);
  }
}; 