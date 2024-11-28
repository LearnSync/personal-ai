import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { cn } from "@/lib/utils";
import { marked, MarkedToken, Token } from "marked";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "../ui/button";

/**
 * Enums
 */
enum EAlign {
  left = "left",
  right = "right",
  center = "center",
}

type TLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Component for Rendering Various Markdown Elements
 */
const Render = ({ token }: { token: Token }) => {
  const t = token as MarkedToken;

  switch (t.type) {
    case "space":
      return <span>{t.raw}</span>;
    case "code":
      return <BlockCode text={t.text} lang={t.lang ?? "plaintext"} />;
    case "heading":
      return <Heading text={t.text} level={t.depth as TLevel} />;
    case "table":
      return (
        <Table header={t.header} rows={t.rows} align={t.align as EAlign[]} />
      );
    case "hr":
      return <hr />;
    case "blockquote":
      return <Blockquote text={t.text} />;
    case "list":
      return (
        <List
          items={t.items}
          ordered={t.ordered}
          start={t.start ? t.start : undefined}
        />
      );
    case "text":
      return <Text token={t} />;
    case "paragraph":
      return <Paragraph tokens={t.tokens} />;
    case "html":
      return (
        <pre>
          {"<html>"}
          {t.raw}
          {"</html>"}
        </pre>
      );
    case "escape":
      return <span>{t.raw}</span>;
    case "link":
      return (
        <Link
          href={t.href}
          title={t.title ? t.title : undefined}
          text={t.text}
        />
      );
    case "image":
      return (
        <Image
          href={t.href}
          text={t.text}
          title={t.title ? t.title : undefined}
        />
      );
    case "strong":
      return <strong>{t.text}</strong>;
    case "em":
      return renderEmphasisElement(t.raw, t.text);
    case "codespan":
      return <InlineCode text={t.text} />;
    case "br":
      return <br />;
    case "del":
      return <del>{t.text}</del>;
    default:
      return (
        <div className="overflow-hidden rounded-sm bg-orange-50">
          <span className="text-xs text-orange-500">Unknown type:</span>
          {t.raw}
        </div>
      );
  }
};

/**
 * Main Component for Rendering Markdown Tokens
 */
export const MarkdownRender = ({ content }: { content: string }) => {
  const tokens = marked.lexer(content);

  return (
    <>
      {tokens.map((token, index) => (
        <Render key={index} token={token} />
      ))}
    </>
  );
};

/**
 * Component for Code Blocks
 */
export const BlockCode = ({ text, lang }: { text: string; lang: string }) => {
  return (
    <div className="w-full my-5 border-2 border-background-3 rounded-xl">
      <div className="flex items-center justify-between w-full h-10 px-3 text-sm bg-background-3">
        <div className="capitalize">{lang}</div>
        <Button variant={"ghost"} size={"sm"} onClick={async () => {}}>
          <span>Copy</span>
        </Button>
      </div>

      <SyntaxHighlighter language={lang} style={vscDarkPlus}>
        {text}
      </SyntaxHighlighter>
    </div>
  );
};

/**
 * Component for Headings
 */
const Heading = ({ text, level }: { text: string; level: TLevel }) => {
  let styles = (() => {
    switch (level) {
      case 1:
        return "text-3xl font-[700] mb-1.5";
      case 2:
        return "text-2xl font-[700] mb-1";
      case 3:
        return "text-xl font-[600]";
      default:
        return "text-base font-[500]";
    }
  })();

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  return <HeadingTag className={cn(styles)}>{text}</HeadingTag>;
};

/**
 * Component for Tables
 */
const Table = ({
  header,
  rows,
  align,
}: {
  header: any[];
  rows: any[][];
  align: EAlign[];
}) => (
  <table>
    <thead>
      <tr>
        {header.map((cell, index) => (
          <th key={index} style={{ textAlign: align[index] || "left" }}>
            {cell.raw}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td
              key={cellIndex}
              style={{ textAlign: align[cellIndex] || "left" }}
            >
              {cell.raw}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

/**
 * Component for Blockquotes
 */
const Blockquote = ({ text }: { text: string }) => {
  const lines = text.split(`\n`);

  return (
    <blockquote
      className={cn(
        "my-2 italic border-l-2 border-white shadow-inner bg-background-2 mx-3 p-2"
      )}
    >
      {lines.map((line) => {
        return <div className="ml-2">{line}</div>;
      })}
    </blockquote>
  );
};

/**
 * Component for Lists
 */
const List = ({
  items,
  ordered,
  start,
}: {
  items: any[];
  ordered: boolean;
  start?: number;
}) => {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <ListTag
      start={start !== undefined ? start : undefined}
      className={cn("mt-3 list-inside", ordered ? "list-decimal" : "list-disc")}
    >
      {items.map((item, index) => (
        <li key={index} className="my-1">
          {item.task && (
            <input type="checkbox" checked={item.checked} readOnly />
          )}
          {item.tokens && item.tokens.length > 0
            ? item.tokens.map((subToken: Token, i: number) => {
                return <Render key={i} token={subToken} />;
              })
            : item.text}
        </li>
      ))}
    </ListTag>
  );
};

/**
 * Function to render emphasis elements in Markdown.
 *
 * @param raw - The raw text of the emphasis element.
 * @param text - The text content of the emphasis element.
 *
 * @returns A React element representing the emphasis element.
 *
 * The function checks for combinations of `_` and `*` in any order to determine if the emphasis is strong.
 * It removes any leading or trailing `_` or `*` from the raw text before rendering the element.
 * If the emphasis is strong, it returns a `<strong>` element with the appropriate styles and content.
 * If the emphasis is italic, it returns an `<em>` element with the content.
 * Otherwise, it returns a `<span>` element with the content.
 */
function renderEmphasisElement(raw: string, text: string) {
  // ----- Check for a combination of both _ and * in any order
  const hasStrongEmphasis = /(_.*\*|\*.*_)/.test(raw);

  // ----- Remove any leading/trailing _ or * from raw for clean text
  const cleanText = raw.replace(/^[_*]+|[_*]+$/g, "");

  if (hasStrongEmphasis) {
    return <strong className="font-[700] italic">{cleanText}</strong>;
  } else if (raw.startsWith("*")) {
    return <strong className="font-[700]">{text}</strong>;
  } else if (raw.startsWith("_")) {
    return <em>{text}</em>;
  }
  return <span>{cleanText}</span>;
}

/**
 * Component for Paragraphs
 */
const Paragraph = ({ tokens }: { tokens: Token[] }) => (
  <p>
    {tokens.map((token, index) => (
      <Render key={index} token={token} />
    ))}
  </p>
);

const Text = ({
  token,
}: {
  token: {
    type: string;
    text: string;
    raw: string;
    tokens?: Token[];
  };
}) => {
  if (token.tokens && token.tokens.length > 0) {
    return (
      <>
        {token.tokens.map((subToken, index) => (
          <Render key={index} token={subToken} />
        ))}
      </>
    );
  }

  return <span>{token.raw}</span>;
};

/**
 * Component for Links
 */
const Link = ({
  href,
  title,
  text,
}: {
  href: string;
  title?: string;
  text: string;
}) => (
  <a
    href={href}
    title={title}
    className={cn("underline text-blue-600 hover:text-white")}
  >
    {text}
  </a>
);

/**
 * Component for Images
 */
const Image = ({
  href,
  text,
  title,
}: {
  href: string;
  text: string;
  title?: string;
}) => <img src={href} alt={text} title={title} />;

/**
 * Component for Inline Code
 */
const InlineCode = ({ text }: { text: string }) => (
  <code
    className={cn(
      "p-[2px] text-center align-baseline bg-[#2f2f2f] font-mono rounded-sm text-red-500 px-2"
    )}
  >
    {text}
  </code>
);

export default MarkdownRender;
