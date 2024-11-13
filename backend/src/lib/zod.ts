import { z } from "zod";

const validateUserRequest = z.object({
  name: z.string().min(1, "Name is required."),
  addressLine1: z.string().min(1, "Address Line 1 is required."),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
});

const validateRestaurantRequest = z.object({
  name: z.string().min(1, "Name is required."),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
  deliveryPrice: z.coerce
    .number()
    .gte(0, "Delivery price must be a possitive number."),
  estimatedDeliveryTime: z.coerce
    .number()
    .int()
    .gte(0, "Estimated Delivery time must be a possitive number."),
  cuisines: z.string().array().nonempty("Cuisines array cannot be empty."),
  menuItems: z.array(
    z.object({
      name: z.string().min(1, "Name is required."),
      price: z.coerce
        .number()
        .gte(0, "Menu item price is required and must be a possitive number."),
    })
  ),
});

export { validateUserRequest, validateRestaurantRequest };
