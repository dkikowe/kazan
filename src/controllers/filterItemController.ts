import { Request, Response } from 'express';
import FilterItem, { IFilterItem } from '../models/FilterItem';

export const createFilterItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = new FilterItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при создании элемента фильтра' });
  }
};

export const getFilterItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await FilterItem.find().sort({ sortOrder: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении элементов фильтра' });
  }
};

export const getFilterItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await FilterItem.findById(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Элемент фильтра не найден' });
      return;
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении элемента фильтра' });
  }
};

export const updateFilterItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await FilterItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ error: 'Элемент фильтра не найден' });
      return;
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при обновлении элемента фильтра' });
  }
};

export const deleteFilterItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await FilterItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Элемент фильтра не найден' });
      return;
    }
    res.json({ message: 'Элемент фильтра успешно удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении элемента фильтра' });
  }
}; 