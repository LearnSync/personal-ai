import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { SearchBox } from "@/components/general-components/search-box";
import { Loader2 } from "lucide-react";

const ImportantChat = () => {
  const { tag } = useParams();

  /**
   * Fetching the Responses from the server
   */
  const { data, isLoading } = useQuery({
    queryKey: ["important-chat", tag],
    queryFn: async () => {
      // Fetch data from the server
      // const response = await fetch(`/api/important-chat/${tag}`);
      // return await response.json();
    },
  });

  return (
    <main>
      <div className="w-[60%] mx-auto mt-3">
        <SearchBox />
      </div>

      {/* Results */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-screen">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </main>
  );
};

export default ImportantChat;
