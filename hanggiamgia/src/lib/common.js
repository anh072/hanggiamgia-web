import { useLocation } from 'react-router-dom';

export const calculatePages = (limit, count) => {
  const remainder = count % limit;
  const pages = Math.floor(count / limit);
  if (remainder > 0) return pages + 1;
  return pages;
};

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}