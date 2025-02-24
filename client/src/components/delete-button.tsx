import { Trash2Icon } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

interface DeleteButtonProps extends ButtonProps {}

export default function DeleteButton({ ...props }: DeleteButtonProps) {
  return (
    <Button className="bg-none bg-inherit" {...props}>
      <Trash2Icon size={25} />
    </Button>
  );
}
