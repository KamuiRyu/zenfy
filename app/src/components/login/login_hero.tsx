import { useI18n } from "@/i18n/useI18n";

export default function LoginHero() {
  const { t } = useI18n();

  return (
    <div className="relative h-full bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white flex flex-col justify-center p-16 overflow-hidden">
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/6 rounded-full blur-3xl opacity-30" />
      <div className="relative max-w-2xl ml-auto pr-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            {t("login.heroTitle")}
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-8">
            {t("login.heroSubtitle")}
        </p>

        <div className="hidden md:block mt-8">
          <svg
            viewBox="0 0 600 400"
            className="w-full h-auto drop-shadow-2xl"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <rect
              x="20"
              y="80"
              width="420"
              height="240"
              rx="16"
              fill="#fff"
              fillOpacity="0.06"
            />
            <circle cx="480" cy="260" r="80" fill="#fff" fillOpacity="0.08" />
            <g transform="translate(60,140)" fill="#fff" fillOpacity="0.9">
              <rect width="300" height="20" rx="8" />
              <rect y="40" width="220" height="20" rx="8" />
              <rect y="80" width="160" height="20" rx="8" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
