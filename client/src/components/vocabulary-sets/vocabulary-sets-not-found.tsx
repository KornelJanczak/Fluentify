import Link from "next/link";
import { Button } from "../ui/button";

export default function VocabularySetsNotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-[55vh] text-center text-lg">
      <p>You don't have any vocabulary sets yet.</p>
      <p>Create one to get started!</p>
      <Link href="/dashboard/vocabulary/create-new">
        <Button className="mt-4">Create</Button>
      </Link>
    </div>
  );
}
