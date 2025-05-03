export type FilterOption = {
  id: string;
  title: string;
  count: number;
  checked?: boolean;
};

export type FilterGroup = {
  id: string;
  title: string;
  options: FilterOption[];
};

export type CatalogFilters = {
  [category: string]: FilterOption[];
}; 