import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ArticleCard = ({
  id,
  title,
  subtitle,
  imageUrl,
  link,
}: {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}) => {
  return (
    <Card
      className="p-0 pb-[1.313rem] lg:pb-[1.813rem] rounded-[0.938rem] lg:rounded-[1.375rem] h-full lg:h-[613px] transition-all duration-200 hover:-translate-y-8 hover:shadow-[0_10px_40px_rgba(0,0,0,0.40)]
"
    >
      <CardHeader className="px-[0.313rem] pt-[0.313rem]">
        <div
          className="aspect-[3/2] lg:aspect-[4/3] overflow-hidden bg-cover bg-center rounded-[0.563rem] lg:rounded-t-[1.25rem] p-[0.875rem]"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </CardHeader>
      <CardContent className="p-0 px-[0.563rem] lg:px-[0.938rem]">
        <div className="flex flex-col gap-[0.938rem]">
          <h4 className="font-medium text-[1rem] leading-[121%] lg:text-[1.375rem]">
            {title}
          </h4>
          <p className="mx-auto font-light text-[0.875rem] lg:text-[1.125rem]">
            {subtitle}
          </p>
        </div>
      </CardContent>
      <CardFooter className="px-[0.563rem] w-full mt-auto">
        <Link
          href={""}
          className="text-primary font-semibold lg:ml-[0.563rem] text-[0.938rem] lg:font-bold lg:text-[1.125rem] border-b-1 border-b-primary pb-1 border-dashed"
        >
          Читать далее
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
