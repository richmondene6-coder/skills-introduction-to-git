/** "N days until Christmas" urgency bar. The home page revalidates hourly so the count stays current. */
export default function CountdownBanner() {
  const now = new Date();
  const year = now.getUTCMonth() === 11 && now.getUTCDate() > 25 ? now.getUTCFullYear() + 1 : now.getUTCFullYear();
  const days = Math.ceil((Date.UTC(year, 11, 25) - now.getTime()) / 86_400_000);
  const text =
    days <= 0
      ? "Merry Christmas! Songs are still delivered in minutes 🎄"
      : days <= 7
        ? `Only ${days} day${days === 1 ? "" : "s"} until Christmas, and your song is ready in minutes. No shipping needed.`
        : `${days} days until Christmas. Beat the rush with a gift they'll never forget.`;
  return <div className="bg-berry px-4 py-2 text-center text-sm font-semibold text-white">{text}</div>;
}
