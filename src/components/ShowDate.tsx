
type ShowDateProps = {
  date: Date
}

export default function ShowDate({ date }: ShowDateProps) {
  const options = { day: '2-digit', month: 'long' };

  return (
      <p>{date.toLocaleString('fr-FR', options as Intl.DateTimeFormatOptions)}</p>
  );
}