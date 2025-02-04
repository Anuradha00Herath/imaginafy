import Header from "@/components/shared/Header";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/shared/TransformationForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";

interface TransformationType {
  type: string;
  title: string;
  subTitle: string;
  config: Record<string, boolean>;
  icon: string;
}

type TransformationTypes = {
  restore: TransformationType;
  removeBackground: TransformationType;
  fill: TransformationType;
  remove: TransformationType;
  recolor: TransformationType;
};

interface SearchParamProps {
  params: Promise<{ type: keyof TransformationTypes }>;
}

const AddTransformationTypePage = async ({params}: SearchParamProps) => {
   const { type } = await params;
  const { userId } = await auth();
  const transformation = transformationTypes[type];
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
