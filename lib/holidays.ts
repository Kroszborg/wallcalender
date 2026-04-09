import { format } from "date-fns"

export interface Holiday {
  date: string // "MM-dd" format
  name: string
  type: "federal" | "observance" | "cultural"
}

export const HOLIDAYS: Holiday[] = [
  { date: "01-01", name: "New Year's Day", type: "federal" },
  { date: "01-15", name: "MLK Jr. Day", type: "federal" },
  { date: "02-14", name: "Valentine's Day", type: "observance" },
  { date: "02-17", name: "Presidents' Day", type: "federal" },
  { date: "03-17", name: "St. Patrick's Day", type: "observance" },
  { date: "04-01", name: "April Fools' Day", type: "cultural" },
  { date: "04-20", name: "Easter", type: "observance" },
  { date: "05-11", name: "Mother's Day", type: "observance" },
  { date: "05-26", name: "Memorial Day", type: "federal" },
  { date: "06-15", name: "Father's Day", type: "observance" },
  { date: "06-19", name: "Juneteenth", type: "federal" },
  { date: "07-04", name: "Independence Day", type: "federal" },
  { date: "09-01", name: "Labor Day", type: "federal" },
  { date: "10-13", name: "Columbus Day", type: "federal" },
  { date: "10-31", name: "Halloween", type: "cultural" },
  { date: "11-11", name: "Veterans Day", type: "federal" },
  { date: "11-27", name: "Thanksgiving", type: "federal" },
  { date: "12-24", name: "Christmas Eve", type: "cultural" },
  { date: "12-25", name: "Christmas Day", type: "federal" },
  { date: "12-31", name: "New Year's Eve", type: "cultural" },
]

const HOLIDAY_MAP = new Map<string, Holiday>(
  HOLIDAYS.map((h) => [h.date, h])
)

export function getHoliday(date: Date): Holiday | undefined {
  return HOLIDAY_MAP.get(format(date, "MM-dd"))
}
