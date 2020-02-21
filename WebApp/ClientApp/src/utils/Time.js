export const getTimeString = dateString => {
  var date = new Date(dateString);
  var today = new Date();
  if (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  ) {
    return numberToString(date.getHours()) + ":" + numberToString(date.getMinutes());
  } else {
    return date.getFullYear() + "-" + numberToString(date.getMonth()) + "-" + numberToString(date.getDate());
  }
};
const numberToString = num => {
  return num < 10 ? "0" + num : num.toString();
};
