export function addDays(date: Date, days: number) {
  let newDate = new Date(date);
  newDate.setDate(date.getDay() + days);
  return newDate;
}
