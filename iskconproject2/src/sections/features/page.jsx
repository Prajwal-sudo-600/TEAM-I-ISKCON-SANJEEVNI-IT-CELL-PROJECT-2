import {
  CalendarCheck,
  Boxes,
  ShieldCheck,
  Clock,
  Sparkles,
  Building,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Building,
      title: "Room Management",
      desc: "Effortlessly manage and organize all temple rooms and spaces for various activities.",
    },
    {
      icon: Boxes,
      title: "Resource Allocation",
      desc: "Track and allocate equipment like projectors, sound systems, and more.",
    },
    {
      icon: CalendarCheck,
      title: "Smart Scheduling",
      desc: "Visual calendar views to prevent conflicts and optimize room utilization.",
    },
    {
      icon: ShieldCheck,
      title: "Admin Approval",
      desc: "Streamlined approval workflow ensuring proper authorization for all bookings.",
    },
    {
      icon: Clock,
      title: "Time Slot Management",
      desc: "Flexible time slots with availability checking and conflict detection.",
    },
    {
      icon: Sparkles,
      title: "AI Suggestions",
      desc: "Intelligent alternate slot recommendations when preferred times are unavailable.",
    },
  ];

  return (
    <section className="bg-[#FBFAF6] py-24 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-serif font-semibold text-[#1f1f1f]">
          Powerful Features
        </h2>
        <p className="mt-4 text-[#6B6B6B] max-w-2xl mx-auto">
          Everything you need to manage temple spaces efficiently and serve
          the devotee community with excellence.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-8 border border-[#E9E6DF]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFF4E0] flex items-center justify-center mb-6">
              <f.icon className="text-[#F4A300]" />
            </div>

            <h3 className="text-xl font-serif font-semibold mb-2 text-stone-600">
              {f.title}
            </h3>

            <p className="text-stone-700 text-sm leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
