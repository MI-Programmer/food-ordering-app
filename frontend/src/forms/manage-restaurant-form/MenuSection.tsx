import { useFieldArray, useFormContext } from "react-hook-form";

import MenuItemInput from "./MenuItemInput";
import { FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

function MenuSection() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  const handleAppend = () => append({ name: "", price: "" });

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Menu</h2>
        <FormDescription>
          Create your menu and give each item a name and a price
        </FormDescription>
      </div>

      <FormField
        control={control}
        name="menuItems"
        render={() => (
          <FormItem>
            {fields.map((field, index) => (
              <MenuItemInput
                key={field.id}
                index={index}
                removeMenuItem={() => remove(index)}
              />
            ))}
          </FormItem>
        )}
      />

      <Button type="button" onClick={handleAppend}>
        Add Menu Item
      </Button>
    </div>
  );
}

export default MenuSection;