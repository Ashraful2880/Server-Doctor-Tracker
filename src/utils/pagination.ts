export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
}

export const buildPagination = (
  query: Record<string, unknown>,
  allowedSortFields: string[] = ['createdAt']
): PaginationOptions => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const sortByRaw = typeof query.sortBy === 'string' ? query.sortBy : 'createdAt';
  const sortBy = allowedSortFields.includes(sortByRaw) ? sortByRaw : 'createdAt';
  const sortOrder: 1 | -1 = query.sortOrder === 'asc' ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sort: { [sortBy]: sortOrder },
  };
};

export const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildDateRangeFilter = (startDate?: unknown, endDate?: unknown): Record<string, Date> | undefined => {
  const range: Record<string, Date> = {};

  if (typeof startDate === 'string' && startDate.trim()) {
    const start = new Date(startDate);
    if (!Number.isNaN(start.getTime())) {
      start.setHours(0, 0, 0, 0);
      range.$gte = start;
    }
  }

  if (typeof endDate === 'string' && endDate.trim()) {
    const end = new Date(endDate);
    if (!Number.isNaN(end.getTime())) {
      end.setHours(23, 59, 59, 999);
      range.$lte = end;
    }
  }

  return Object.keys(range).length > 0 ? range : undefined;
};

