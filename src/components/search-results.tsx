/* eslint-disable @typescript-eslint/no-explicit-any */
import { MoveRight, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { Route } from "@/routes";

export function SearchResults() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [searchTerm, setSearchTerm] = useState(q);

  const { data, error, isLoading } = useQuery({
    queryFn: async ({ queryKey }) => {
      const [, q] = queryKey;
      if (q) {
        const response = await axios.get(
          "https://search-production-0ccb.up.railway.app/api/search",
          {
            params: {
              q,
            },
          }
        );
        return response.data;
      } else {
        return [];
      }
    },
    queryKey: ["search", q],
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scout PSG</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="how to add bucket region in minio console"
            className="w-full bg-neutral-800 border-neutral-700 pl-10 pr-10"
            value={searchTerm}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate({
                  to: "/",
                  search: {
                    q: searchTerm,
                  },
                });
              }
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button
              title="search"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate({
                  to: "/",
                  search: {
                    q: searchTerm,
                  },
                });
              }}
            >
              <MoveRight className="h-5 w-5 text-blue-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {error && <div>Something went wrong when querying for you &lt;3</div>}
        {isLoading ? (
          <div className="space-y-4">
            {new Array(5).fill(null).map(() => (
              <div className="max-w-2xl space-y-2">
                <Skeleton className="h-[10px] w-[400px]" />
                <Skeleton className="h-[25px] w-[400px]" />
                <Skeleton className="h-[10px] w-[500px]" />
                <Skeleton className="h-[10px] w-[400px]" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {data.length > 0 ? (
              <>
                {data.map((result: any, index: any) => (
                  <div key={index} className="max-w-2xl">
                    <div className="text-sm text-gray-400">
                      {result.url} ({Math.round(result.crawlDuration)}ms)
                    </div>
                    <a
                      href={result.url}
                      target="_blank"
                      className="text-xl font-medium text-blue-400 mb-1"
                    >
                      {result.pageTitle}
                    </a>
                    {result.pageDescription && (
                      <p className="text-sm">{result.pageDescription}</p>
                    )}
                    {result.heading && (
                      <p className="text-xs text-neutral-400">
                        Headings: {result.heading}
                      </p>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div>
                There is nothing to show, kindly tweak your search term if you
                are looking for some results.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
