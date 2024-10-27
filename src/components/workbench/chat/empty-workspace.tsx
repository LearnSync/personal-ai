import PinnedCard from "@/components/general-components/pined-card";
import GenerateTextEffect from "../_components/generate-text-effect";
import { APPLICATION_SHORTCUTS } from "@/constants";
import { platform } from "@/core";
import Slugify from "@/core/base/common/slugify";
import { CaseConverter } from "@/core/base/common/caseConverter";

export const EmptyWorkspace = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="mt-32 text-3xl font-semibold tracking-wide capitalize">
        <GenerateTextEffect
          fullText={"Start your conversation"}
          interval={60}
          cursorClassName="text-blue-500"
        />
      </h1>

      <div className="mt-8">
        <PinnedCard>
          <div>Please setup the local LLM with Ollama</div>
        </PinnedCard>
      </div>

      {/* Short Cuts Messages */}
      <div className="flex flex-col items-center justify-center w-full mt-10 min-w-64 max-w-[85%]">
        <h3 className="mb-2 font-[500] text-lg uppercase">Short Cuts</h3>

        <ul className="grid grid-cols-2 gap-4 p-4 shadow-inner gap-x-6 w-fit bg-background-2 rounded-xl">
          {Object.entries(APPLICATION_SHORTCUTS).map(([key, value]) => {
            const shortCutObj = value.filter((value) => value.key === platform);

            return (
              <li key={key} className="text-muted-foreground">
                <span className="capitalize">
                  {CaseConverter.snakeCaseToTitleCase(key)}
                </span>
                <span className="ml-1">
                  <span>{"("}</span>
                  {shortCutObj.map((k) => (
                    <span key={k.key}>{k.modifiers.join(" + ")}</span>
                  ))}
                  <span>{")"}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default EmptyWorkspace;
