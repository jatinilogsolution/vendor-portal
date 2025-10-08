export interface UserListProps {
  searchParams?: {
    role: any;
    page?: string;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    filterField?: string;
    filterValue?: string;
    filterOperator?: string;
  };
}