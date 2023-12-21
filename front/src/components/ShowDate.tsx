import { Dayjs } from "dayjs";

type ShowDateProps = {
  dateDayjs?: Dayjs
  date?: Date 
  showYear?: boolean
}

export default function ShowDate({ dateDayjs, date, showYear = false }: ShowDateProps) {
  let options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  if (showYear) {
    options = {
      ...options,
      year: 'numeric'
    }
  }
  const d = dateDayjs ? dateDayjs.toDate() : date

  return (
      <p>
        {d?.toLocaleString(
          'fr-FR', 
          options
        )}
      </p>
  );
}