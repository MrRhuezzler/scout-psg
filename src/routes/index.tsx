import { SearchResults } from "@/components/search-results";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

const searctTermParams = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: zodSearchValidator(searctTermParams),
  component: () => <SearchResults />,
});
