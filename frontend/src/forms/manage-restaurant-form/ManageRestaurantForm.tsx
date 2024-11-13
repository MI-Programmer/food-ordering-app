import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DetailsSection from "./DetailsSection";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { Restaurant } from "@/types";

const formSchema = z
  .object({
    name: z.string({ required_error: "Restaurant name is required." }),
    city: z.string({ required_error: "City is required." }),
    country: z.string({ required_error: "Country is required." }),
    deliveryPrice: z.coerce.number({
      required_error: "Delivery price is required.",
      invalid_type_error: "Must be a valid number.",
    }),
    estimatedDeliveryTime: z.coerce.number({
      required_error: "Estimated delivery time is required.",
      invalid_type_error: "Must be a valid number.",
    }),
    cuisines: z.string().array().nonempty("Please select at least one item."),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "Name is required."),
        price: z.coerce.number().min(1, "Price is required."),
      })
    ),
    imageUrl: z.string().optional(),
    image: z.instanceof(File, { message: "Image is required." }).optional(),
  })
  .refine((data) => data.imageUrl || data.image, {
    message: "Either image URL or image file must be provided",
    path: ["image"],
  });

type RestaurantFormData = z.infer<typeof formSchema>;

interface Props {
  restaurant?: Restaurant | null;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
}

function ManageRestaurantForm({ restaurant, onSave, isLoading }: Props) {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: restaurant || {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  const onSubmit = (data: RestaurantFormData) => {
    const { cuisines, menuItems, image, ...restData } = data;
    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    }
    Object.entries(restData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    menuItems.forEach(({ name, price }, index) => {
      formData.append(`menuItems[${index}][name]`, name);
      formData.append(`menuItems[${index}][price]`, String(price));
    });

    onSave(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 rounded-lg bg-gray-50 px-3 py-2 md:p-10"
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />

        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}

export default ManageRestaurantForm;
