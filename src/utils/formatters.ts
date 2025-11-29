interface CurrencyOptions {
  currency?: string;
  locale?: string;
}

interface DateOptions extends Intl.DateTimeFormatOptions {}

export const formatters = {
  currency: (
    amount: number,
    currency = 'USD',
    locale = 'en-US'
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  },

  number: (value: number | string, decimals = 2): string => {
    return Number(value).toFixed(decimals);
  },

  truncate: (text: string, maxLength = 50, suffix = '...'): string => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + suffix;
  },

  date: (
    date: Date | string | number,
    locale = 'en-US',
    options: DateOptions = {}
  ): string => {
    return new Date(date).toLocaleDateString(locale, options);
  },

  dateTime: (date: Date | string | number, locale = 'en-US'): string => {
    return new Date(date).toLocaleString(locale);
  },

  capitalize: (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },
};

