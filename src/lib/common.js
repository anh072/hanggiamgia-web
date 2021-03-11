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

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const _URL = window.URL || window.webkitURL;
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = _URL.createObjectURL(file);
  });
}

async function isImageSmall(file) {
  const image = await loadImage(file);
  console.log(image.width);
  return image.width <= 200 && image.height <= 200;
}

export function validatePostForm(values) {
  let errors = {};
  if (!values.title.trim()) errors.title = "Phải có tiêu đề";
  if (!values.category) errors.category = "Phải có hạng mục";
  if (!values.start) errors.start = "Phải có ngày bắt đầu";
  if (!values.end) errors.end = "Phải có ngày kết thúc";
  var startDate = Date.parse(values.start);
  var endDate = Date.parse(values.end);
  if (startDate > endDate) errors.start = "Ngày bắt đầu phải trước ngày kết thúc";
  if (values.url.length > 0 && !validURL(values.url.trim())) errors.url = "Link không hợp lệ";
  if (values.image) {
    if (!validImageType(values.image)) errors.image = "Ảnh phải thuộc loại jpeg, png, hoặc jpg";
    else if (isImageSmall(values.image)) errors.image = 'Ảnh phải lớn hơn 200x200';
  }
  if (values.description.length < 30) errors.description = "Mô tả phải ít nhất 30 kí tự";
  return errors;
};

export function isWithinAWeek(moment_date) {
  const now = moment();
  const diff = now.diff(moment_date, 'days', true);
  return diff <= 7;
}