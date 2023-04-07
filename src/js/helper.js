import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

// place to store many common function
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(`${url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(`${url}`);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} status: ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
export const sendJSON = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(`${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} status: ${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(`${url}`), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} status: ${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};
// timeOut function de tranh khi ma fecth thong tin qua lau ma khong co phan hoir thi se throw error va dung chuong trinh lai
// return lai promise de dung cho ham Promise.all([fetch(url),timeout(s)]) =>neu fecth thong tin lau hon thoi gian timeout thi se throw loi con khong thi chayj binh thuong
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
