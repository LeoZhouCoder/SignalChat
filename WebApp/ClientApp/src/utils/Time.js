export const getTimeString = dateString => {
  var date = new Date(dateString);
  var today = new Date();
  if (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  ) {
    return date.getHours() + ":" + date.getMinutes();
  } else {
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  }
};
