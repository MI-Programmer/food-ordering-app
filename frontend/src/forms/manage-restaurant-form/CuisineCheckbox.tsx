import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  cuisine: string;
  field: ControllerRenderProps<FieldValues, "cuisines">;
}

function CuisineCheckbox({ cuisine, field }: Props) {
  return (
    <FormItem className="mt-2 flex items-center gap-1 space-y-0">
      <FormControl>
        <Checkbox
          className="bg-white"
          checked={field.value.includes(cuisine)}
          onCheckedChange={(checked) => {
            if (checked) {
              field.onChange([...field.value, cuisine]);
            } else {
              field.onChange(
                field.value.filter((value: string) => value !== cuisine)
              );
            }
          }}
        />
      </FormControl>
      <FormLabel className="text-sm font-normal">{cuisine}</FormLabel>
    </FormItem>
  );
}

export default CuisineCheckbox;
