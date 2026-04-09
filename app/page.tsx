import { Calendar } from "@/components/calendar/Calendar"

export const metadata = {
  title: "Wall Calendar",
  description: "An interactive wall calendar with date range selection and notes",
}

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-start justify-center p-4 py-10 md:p-10 md:py-14"
      style={{
        // Warm paper-textured background
        backgroundColor: "#f0ece4",
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(214,202,186,0.6) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 70%, rgba(196,186,172,0.5) 0%, transparent 55%)
        `,
      }}
    >
      <Calendar />
    </main>
  )
}
