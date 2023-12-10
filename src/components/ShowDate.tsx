import { Dayjs } from "dayjs";

type ShowDateProps = {
  date: Dayjs
}

export default function ShowDate({ date }: ShowDateProps) {
  const options = { day: '2-digit', month: 'long' };

  return (
      <p>
        {date.toDate().toLocaleString(
          'fr-FR', 
          options as Intl.DateTimeFormatOptions
        )}
      </p>
  );
}