export default function StatsSection() {
  const stats = [
    { label: "Total Rooms", value: "12" },
    { label: "Resources", value: "24" },
    { label: "Pending", value: "8" },
    { label: "Approved", value: "45" },
  ];

  return (
    <section className="bg-[#FBFAF6] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-[#F3F1EA] shadow-xl p-6">
          {/* Browser dots */}
          <div className="flex gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-[#FBFAF6] rounded-xl px-6 py-5"
              >
                <p className="text-sm text-black mb-2">
                  {item.label}
                </p>
                <p className="text-3xl font-serif font-semibold text-stone-600">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
