"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import FilterGroupModal from "../../../../components/admin/FilterGroupModal";
import FilterItemModal from "../../../../components/admin/FilterItemModal";
import api from "@/config/axios";

interface FilterGroup {
  _id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isVisible: boolean;
}

interface FilterItem {
  _id: string;
  name: string;
  slug: string;
  group: string;
  sortOrder: number;
  isActive: boolean;
}

export default function FiltersPage() {
  const [groups, setGroups] = useState<FilterGroup[]>([]);
  const [items, setItems] = useState<FilterItem[]>([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<FilterGroup | null>(null);
  const [selectedItem, setSelectedItem] = useState<FilterItem | null>(null);

  useEffect(() => {
    fetchGroups();
    fetchItems();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await api.get("/filter-groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке групп фильтров:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.get("/filter-items");
      setItems(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке элементов фильтров:", error);
    }
  };

  const handleCreateGroup = async (data: Omit<FilterGroup, "_id">) => {
    try {
      await api.post("/filter-groups", data);
      fetchGroups();
      setIsGroupModalOpen(false);
    } catch (error) {
      console.error("Ошибка при создании группы фильтров:", error);
    }
  };

  const handleUpdateGroup = async (data: Omit<FilterGroup, "_id">) => {
    if (!selectedGroup) return;
    try {
      await api.put(`/filter-groups/${selectedGroup._id}`, data);
      fetchGroups();
      setIsGroupModalOpen(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error("Ошибка при обновлении группы фильтров:", error);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      await api.delete(`/filter-groups/${id}`);
      fetchGroups();
    } catch (error) {
      console.error("Ошибка при удалении группы фильтров:", error);
    }
  };

  const handleCreateItem = async (data: Omit<FilterItem, "_id">) => {
    try {
      await api.post("/filter-items", data);
      fetchItems();
      setIsItemModalOpen(false);
    } catch (error) {
      console.error("Ошибка при создании элемента фильтра:", error);
    }
  };

  const handleUpdateItem = async (data: Omit<FilterItem, "_id">) => {
    if (!selectedItem) return;
    try {
      await api.put(`/filter-items/${selectedItem._id}`, data);
      fetchItems();
      setIsItemModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Ошибка при обновлении элемента фильтра:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.delete(`/filter-items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Ошибка при удалении элемента фильтра:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Группы фильтров</h2>
          <button
            type="button"
            onClick={() => {
              setSelectedGroup(null);
              setIsGroupModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Добавить группу
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group._id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {group.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGroup(group);
                        setIsGroupModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteGroup(group._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Сортировка: {group.sortOrder}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Видимость: {group.isVisible ? "Да" : "Нет"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Элементы фильтров
          </h2>
          <button
            type="button"
            onClick={() => {
              setSelectedItem(null);
              setIsItemModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Добавить элемент
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsItemModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Группа: {groups.find((g) => g._id === item.group)?.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Сортировка: {item.sortOrder}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Видимость: {item.isActive ? "Да" : "Нет"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FilterGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setSelectedGroup(null);
        }}
        onSubmit={selectedGroup ? handleUpdateGroup : handleCreateGroup}
        group={selectedGroup}
      />

      <FilterItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={selectedItem ? handleUpdateItem : handleCreateItem}
        item={selectedItem}
        groups={groups}
      />
    </div>
  );
}
