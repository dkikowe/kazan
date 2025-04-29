import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleCarousel from "@/features/home/article/ui/carousel";

const Article = () => {
  return (
    <section className="flex flex-col gap-[0rem]">
      <Header />
      <ArticleCarousel />
    </section>
  );
};

export default Article;

const Header = () => {
  return (
    <div className=" px-4 flex justify-between items-end">
      <div className="flex flex-col gap-[0.625rem] lg:gap-[1rem]">
        <div>
          <h2 className="font-semibold leading-[106%] mt-[40px] tracking-[-4%] text-[1.75rem] lg:text-[3.375rem] max-w-[31rem]">
            Статьи, которые будут{" "}
            <span className="text-primary">вам полезны:</span>
          </h2>
        </div>
        <div>
          <p className="text-[#535353] leading-[124%] text-[0.875rem] lg:text-[1.063rem]">
            Темы, новости о путешествиях в городах России
          </p>
        </div>
      </div>
      <div className="hidden lg:block">
        <Button variant={"section"} size={"section"} className="rounded-full">
          <span>Все статьи</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
