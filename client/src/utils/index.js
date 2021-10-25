import { decode } from "html-entities";

export const stripTags = (string) => {
  return string.replace(/(<([^>]+)>)/gi, " ");
};

export const decodeHtml = (string) => {
  return decode(string);
};

export const timeStamping = (seconds) => {
  const d = new Date(seconds * 1000);
  let hr = d.getUTCHours().toString().padStart(2, "0") + ":";
  let min = d.getUTCMinutes().toString().padStart(2, "0") + ":";
  let sec = d.getUTCSeconds().toString().padStart(2, "0");

  const res = (hr === "00:" ? "" : hr) + min + sec;
  return res;
};

export const dtFormat = new Intl.DateTimeFormat("en-SG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
