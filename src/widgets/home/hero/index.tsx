import { Button } from "@/components/ui/button";
import BookingForm from "@/components/booking-form";

export default function Hero() {
  return (
    <section className="relative h-[600px] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="container mx-auto h-full flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-white z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Откройте для себя новые горизонты
            </h1>
            <p className="text-lg mb-8">
              Уникальные экскурсии по самым интересным местам
            </p>
          </div>
          <div className="z-10">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Оставить заявку</h2>
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
