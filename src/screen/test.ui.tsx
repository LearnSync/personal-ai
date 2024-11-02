import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const code = `
// Define an interface
interface Person {
  name: string;
  age: number;
}

// Define a type alias (type)
type Human = {
  // properties of human
};

// Create an interface variable
const person: Person = {
  name: 'John Doe',
  age: 30,
};

// Attempt to create a type alias variable with incorrect property types will cause compile-time error
try {
  const human: Human = { name: 123, age: 31 };
} catch (error) {
  console.error(error); // error message because age should be number but is 31 which is not exactly equal to 30.
}

// Define a type with enum values
enum Color {
  Red,
  Green,
  Blue,
}

type ColorType = 'Red' | 'Green' | 'Blue';

const color: ColorType = 'Red';

// Now we can do some operations

// Using if/else statement to check which color is the colorType variable. We need type guard function that tells TypeScript what type of value to expect.
function getColor(color: Color): ColorType {
  return color === Color.Red ? 'Red' : color === Color.Green ? 'Green' : 'Blue';
}

const myColor = getColor(Color.Green);
console.log(myColor); // Outputs "Green"

// Now we can do some operations
`;

// const markdownContent = code;

export const TestingPage = () => {
  return (
    <div>
      <h1>TestingPage</h1>
      {/* <MarkdownRender content={markdownContent} /> */}
      <SyntaxHighlighter language={"typescript"} style={vscDarkPlus}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default TestingPage;
