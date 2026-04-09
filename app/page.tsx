import { Calendar } from "@/components/calendar/Calendar"

export const metadata = {
  title: "Wall Calendar",
  description: "An interactive wall calendar with date range selection and notes",
}

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-start justify-center p-4 py-10 md:p-10 md:py-16"
      style={{
        backgroundColor: "#f0ebe5",
        backgroundImage: [
          "radial-gradient(ellipse at 0% 0%, rgba(230,220,210,0.6) 0%, transparent 50%)",
          "radial-gradient(ellipse at 100% 100%, rgba(220,210,200,0.5) 0%, transparent 50%)",
        ].join(", "),
      }}
    >
      <Calendar />
    </main>
  )
}
