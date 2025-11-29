type KeySelector<T> = keyof T | ((item: T) => any);

export const helpers = {
  getInitials: (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  },

  calculateTotal: <T>(
    items: T[],
    getPrice?: ((item: T) => number) | string,
    getQuantity?: ((item: T) => number) | string
  ): number => {
    return items.reduce((total, item) => {
      const price =
        typeof getPrice === 'function'
          ? getPrice(item)
          : typeof getPrice === 'string'
          ? (item as any)[getPrice]
          : (item as any).price || 0;
      const quantity =
        typeof getQuantity === 'function'
          ? getQuantity(item)
          : typeof getQuantity === 'string'
          ? (item as any)[getQuantity]
          : (item as any).quantity || 0;
      return total + price * quantity;
    }, 0);
  },

  filterBySearch: <T>(
    items: T[],
    searchTerm: string,
    fields: (keyof T | ((item: T) => any))[] = []
  ): T[] => {
    if (!searchTerm || searchTerm.trim() === '') return items;

    const term = searchTerm.toLowerCase();
    return items.filter((item) => {
      if (fields.length === 0) {
        return Object.values(item as any).some((value) =>
          String(value).toLowerCase().includes(term)
        );
      }
      return fields.some((field) => {
        const value =
          typeof field === 'function' ? field(item) : (item as any)[field];
        return String(value || '').toLowerCase().includes(term);
      });
    });
  },

  sortBy: <T>(
    items: T[],
    key: KeySelector<T>,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] => {
    const sorted = [...items].sort((a, b) => {
      const aVal = typeof key === 'function' ? key(a) : (a as any)[key];
      const bVal = typeof key === 'function' ? key(b) : (b as any)[key];

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  },

  groupBy: <T, K extends string | number>(
    items: T[],
    key: KeySelector<T>
  ): Record<K, T[]> => {
    return items.reduce(
      (groups, item) => {
        const groupKey =
          (typeof key === 'function' ? key(item) : (item as any)[key]) as K;
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
      },
      {} as Record<K, T[]>
    );
  },

  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        if (timeout) clearTimeout(timeout);
        func(...args);
      };
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

