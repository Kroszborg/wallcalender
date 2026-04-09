import { Calendar } from "@/components/calendar/Calendar"

export const metadata = {
  title: "Wall Calendar",
  description: "An interactive wall calendar with date range selection and notes",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f4] flex items-start justify-center p-4 py-10 md:p-10 md:py-16">
      <Calendar />
    </main>
  )
}
