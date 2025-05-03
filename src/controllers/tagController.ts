import { Request, Response } from 'express';
// @ts-ignore
import Tag, { ITag } from '../models/Tag';
import api from '../config/axios';

export const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await api.post('/tags', req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при создании тега' });
  }
};

export const getTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await api.get('/tags');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении тегов' });
  }
};

export const getTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await api.get(`/tags/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Тег не найден' });
  }
};

export const updateTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await api.put(`/tags/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при обновлении тега' });
  }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    await api.delete(`/tags/${req.params.id}`);
    res.json({ message: 'Тег успешно удален' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении тега' });
  }
}; 