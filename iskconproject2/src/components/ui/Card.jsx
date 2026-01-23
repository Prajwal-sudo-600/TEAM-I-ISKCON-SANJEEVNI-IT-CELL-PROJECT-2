export default function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      {children}
    </div>
  );
}
