import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function CountryCard({ country }) {
  return (
    <Link
      to={`/countries/${country._id}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-[#0d8274]/40 hover:shadow-md"
    >
      <div className="relative h-44 sm:h-52 overflow-hidden">
        {country.image_url ? (
          <Image
            src={country.image_url}
            alt={country.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#0d8274] to-[#092c27]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">{country.flag}</span>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-white">{country.name}</h3>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-6 text-white/80">{country.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 text-xs font-medium text-slate-500 bg-white">
        <span>استكشف الجامعات والمعاهد</span>
        <ArrowLeft className="h-3.5 w-3.5 text-[#0d8274] transition group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}