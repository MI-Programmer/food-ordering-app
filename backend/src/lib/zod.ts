import { z } from "zod";

const validateMyUserRequest = z.object({
  name: z.string().min(1, "Name is required."),
  addressLine1: z.string().min(1, "Address Line 1 is required."),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
});

export { validateMyUserRequest };
