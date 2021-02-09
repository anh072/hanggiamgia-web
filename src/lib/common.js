import { useLocation } from 'react-router-dom';
import moment from 'moment';

export const calculatePages = (limit, count) => {
  const remainder = count % limit;
  const pages = Math.floor(count / limit);
  if (remainder > 0) return pages + 1;
  return pages;
};

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function validImageType(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
  return validTypes.includes(file.type);
}

export function validatePostForm(values) {
  let errors = {};
  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.category) errors.category = "Category is required";
  if (!values.start) errors.start = "Start date is required";
  if (!values.end) errors.end = "Expiry date is required";
  var startDate = Date.parse(values.start);
  var endDate = Date.parse(values.end);
  if (startDate > endDate) errors.start = "Start date must be before expiry date";
  if (values.url.length > 0 && !validURL(values.url.trim())) errors.url = "Invalid link format";
  if (values.image && !validImageType(values.image)) errors.image = "Image must be jpeg, png or jpg";
  if (values.description.length < 20) errors.description = "Description must be at least 20 characters";
  return errors;
};

export function isWithinAWeek(moment_date) {
  const now = moment();
  const diff = now.diff(moment_date, 'days', true);
  return diff <= 7;
}