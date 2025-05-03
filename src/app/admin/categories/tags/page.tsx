"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import TagModal from "../../../../components/admin/TagModal";

interface Tag {
  _id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tags");
      if (!response.ok) {
        throw new Error("Ошибка при загрузке тегов");
      }
      const data = await response.json();
      setTags(data);
      setError(null);
    } catch (error) {
      console.error("Ошибка при загрузке тегов:", error);
      setError("Не удалось загрузить теги");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = async (data: Omit<Tag, "_id">) => {
    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось создать тег");
      }

      await fetchTags();
      setIsModalOpen(false);
      setError(null);
    } catch (error: any) {
      console.error("Ошибка при создании тега:", error);
      throw new Error(error.message || "Не удалось создать тег");
    }
  };

  const handleUpdateTag = async (data: Omit<Tag, "_id">) => {
    if (!selectedTag) return;
    try {
      const response = await fetch(`/api/tags/${selectedTag._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось обновить тег");
      }

      await fetchTags();
      setIsModalOpen(false);
      setSelectedTag(null);
      setError(null);
    } catch (error: any) {
      console.error("Ошибка при обновлении тега:", error);
      throw new Error(error.message || "Не удалось обновить тег");
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот тег?")) return;

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось удалить тег");
      }

      await fetchTags();
      setError(null);
    } catch (error: any) {
      console.error("Ошибка при удалении тега:", error);
      setError(error.message || "Не удалось удалить тег");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Теги</h2>
        <button
          type="button"
          onClick={() => {
            setSelectedTag(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Добавить тег
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <div
            key={tag._id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {tag.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTag(tag);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTag(tag._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Сортировка: {tag.sortOrder}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Активность: {tag.isActive ? "Да" : "Нет"}
              </p>
              {tag.metaTitle && (
                <p className="mt-1 text-sm text-gray-500">
                  Мета-заголовок: {tag.metaTitle}
                </p>
              )}
              {tag.metaDescription && (
                <p className="mt-1 text-sm text-gray-500">
                  Мета-описание: {tag.metaDescription}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <TagModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTag(null);
        }}
        onSubmit={selectedTag ? handleUpdateTag : handleCreateTag}
        tag={selectedTag}
      />
    </div>
  );
}
