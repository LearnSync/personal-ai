import React from "react";
import GenerateTextEffect from "../_components/generate-text-effect";
import PinnedCard from "@/components/general-components/pined-card";
import { Conversation, IMessage } from "../_components/conversation";
import { AutoResizingInput } from "../_components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { generateUUID } from "@/core";
import {
  chatGptIcon,
  claudeAIIcon,
  geminiIcon,
  ollamaIcon,
} from "@/components/sidebar/sidebar-icon";
import { usePlatformContext } from "@/context/platform.context";
import EmptyWorkspace from "./empty-workspace";

// Dummy message data for the conversation
const messages = [
  { type: "user", text: "Hello, how are you?" },
  { type: "llm", text: "I am doing well, how can I help you today?" },
  { type: "user", text: "Can you tell me a joke?" },
  {
    type: "llm",
    text: "Sure, here's a joke: Why did the chicken cross the road? To get to the other side!",
  },
  { type: "user", text: "That's a classic! Do you have any other jokes?" },
  {
    type: "llm",
    text: "Of course! How about this one: What do you call a fish with no eyes? A fsh!",
  },
  { type: "user", text: "That's a good one! I like puns." },
  {
    type: "llm",
    text: "Me too! I have another one: What do you call a lazy kangaroo? A pouch potato!",
  },
  { type: "user", text: "That's a funny one. Can you tell me a riddle?" },
  {
    type: "llm",
    text: "Sure, here's a riddle: I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
  },
  { type: "user", text: "A map!" },
  { type: "llm", text: "That's correct! Do you have another riddle for me?" },
  {
    type: "user",
    text: "I have a voice, but cannot speak. I have a bed, but cannot sleep. I have a life, but cannot live. What am I?",
  },
  { type: "llm", text: "A book!" },
  { type: "user", text: "That's right! Can you tell me a story?" },
  {
    type: "llm",
    text: "Sure, once upon a time, there was a little fox who loved to eat grapes. One day, he saw a bunch of grapes hanging high up on a vine. He tried and tried to reach them, but they were just out of his reach. Finally, he gave up and said, 'Those grapes are probably sour anyway.'",
  },
  { type: "user", text: "That's a nice story. Do you have any other stories?" },
  {
    type: "llm",
    text: "Yes, I do. Once upon a time, there was a little mouse who lived in a big house. He was very scared of cats, so he always hid in the walls. One day, he heard a noise coming from the kitchen. He peeked out and saw a big, fat cat sitting on the table. The cat was eating a bowl of milk. The mouse was so scared that he ran back into the wall. But then he had an idea. He climbed up the wall and dropped down onto the cat's back. The cat was so surprised that he jumped up and knocked over the bowl of milk. The mouse laughed and ran away.",
  },
  {
    type: "user",
    text: "That's a funny story. Do you have any other stories?",
  },
  {
    type: "llm",
    text: "Yes, I do. Once upon a time, there was a little rabbit who lived in a forest. He was very scared of wolves, so he always hid in his burrow. One day, he heard a noise coming from the forest. He peeked out and saw a big, bad wolf standing there. The wolf was looking for food. The rabbit was so scared that he ran back into his burrow. But then he had an idea. He climbed up a tree and hid in the branches. The wolf looked up at the tree and said, 'I know you're up there, little rabbit! Come down and I'll eat you.' The rabbit just laughed and said, 'You can't catch me!' The wolf tried and tried to climb the tree, but he couldn't reach the rabbit. Finally, he gave up and went away.",
  },
  { type: "user", text: "That's a good story. Do you have any other stories?" },
  {
    type: "llm",
    text: "Yes, I do. Once upon a time, there was a little turtle who lived in a pond. He was very slow, so he was always the last one to get anywhere. One day, the other animals were having a race. The turtle was sad because he knew he couldn't win. But then he had an idea. He challenged the other animals to a race to the finish line, but with a twist. He said that the first animal to cross the finish line would have to carry him on their back to the pond. The other animals laughed at the turtle, but they agreed to the race. When the race started, the turtle was way behind. But he didn't give up. He just kept swimming slowly and steadily. The other animals were racing as fast as they could, but they were getting tired. Finally, the turtle crossed the finish line. The other animals were shocked. They had to carry the turtle on their back to the pond. The turtle laughed and said, 'See, slow and steady wins the race.'",
  },
  {
    type: "user",
    text: "That's a great story. Do you have any other stories?",
  },
  {
    type: "llm",
    text: "Yes, I do. Once upon a time, there was a little bird who lived in a tree. He was very happy, but he was also very lonely. He wanted to have a friend. One day, he saw a little mouse running around on the ground. He called out to the mouse, 'Hello! Would you like to be my friend?' The mouse looked up at the bird and said, 'Sure, I'd love to be your friend.' The bird and the mouse became best friends. They played together all day long. They would fly up into the trees and the mouse would climb up after them. They would sit on the branches and talk about their day. The bird and the mouse were very happy together.",
  },
  { type: "user", text: "That's a nice story. Do you have any other stories?" },
  {
    type: "llm",
    text: "Yes, I do. Once upon a time, there was a little pig who lived on a farm. He was very lazy, so he never did any work. One day, the farmer said to the pig, 'You're not doing your job. You need to help out around the farm.' The pig just grunted and went back to sleep. The farmer got angry and said, 'If you don't start working, I'm going to eat you.' The pig was scared, so he got up and started to work. He helped the farmer with the chores and the pig was very happy. He learned that it was important to work hard.",
  },
  { type: "user", text: "That's a good story. Do you have any other stories?" },
  {
    type: "llm",
    text: "Yes, I do. Once upon a time, there was a little duck who lived in a pond. He was very afraid of water, so he never went into the pond. One day, the other ducks were swimming in the pond. The little duck was sad because he wanted to join them. But he was too scared. Then he had an idea. He saw a big rock in the middle of the pond. He thought that if he could swim to the rock, he would be safe. So he took a deep breath and jumped into the water. He swam as fast as he could to the rock. When he reached the rock, he was so happy that he started to quack. The other ducks were surprised to see him in the water. They swam over to him and welcomed him. The little duck was so happy to be with his friends.",
  },
  {
    type: "user",
    text: "That's a great story. Do you have any other stories?",
  },
  {
    type: "llm",
    text: "Yes, I do. Once upon a time, there was a little squirrel who lived in a tree. He was very greedy, so he always wanted to hoard nuts. One day, he found a big pile of nuts. He started to gather them up and put them in his nest. But the pile of nuts was so big that he couldn't carry them all. He was so sad that he started to cry. Then he had an idea. He called his friends and asked them to help him carry the nuts. His friends were happy to help. Together, they carried the nuts to the squirrel's nest. The squirrel was so happy that he thanked his friends. He learned that it was important to share.",
  },
  { type: "user", text: "That's a nice story. Do you have any other stories?" },
  {
    type: "llm",
    text: "Yes, I do. Once upon a time, there was a little mouse who lived in a house. He was very afraid of cats, so he always hid in the walls. One day, he heard a noise coming from the kitchen. He peeked out and saw a big, fat cat sitting on the table. The cat was eating a bowl of milk. The mouse",
  },
];

export const Chat = () => {
  const [conversationStarted, setConversationStarted] = React.useState(false);
  const { sessionManager, activeExtensionTab } = usePlatformContext();

  /**
   * Memoised the Response
   */

  const activeChatSessionOnCurrentTab = React.useMemo(() => {
    const activeTab = sessionManager.getActiveTab();
    if (!activeTab) return null;
    return sessionManager.getChatSession(activeTab.id);
  }, [activeExtensionTab]);

  const startNewChatWithAvailableModels = React.useMemo(() => {
    // Except Default Options
    return [
      {
        id: generateUUID(),
        icon: ollamaIcon({ className: "w-4 h-4" }),
        label: "Llama",
        model: "llama",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#2f96dc] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: chatGptIcon({ className: "w-5 h-5 fill-white" }),
        label: "OpenAI",
        model: "openai",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#10a37f] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: geminiIcon({ className: "w-5 h-5 fill-white" }),
        label: "Gemini",
        model: "gemini",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#8b6ac2] to-[#2f96dc] text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: claudeAIIcon({ className: "w-5 h-5" }),
        label: "Claude AI",
        model: "anthropic",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-white to-[#cc9b7a] text-transparent bg-clip-text",
      },
    ];
  }, []);

  return (
    <section className="relative h-full">
      {conversationStarted && (
        <div className="sticky top-0 left-0 p-1">
          <Select>
            <SelectTrigger className="h-8 w-[150px] focus:ring-0 bg-background-2 shadow-inner shadow-background-1/40">
              <SelectValue
                className=""
                placeholder={
                  activeChatSessionOnCurrentTab?.aiProvider ?? <div>None</div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {startNewChatWithAvailableModels?.map((opt) => (
                <SelectItem value={opt.label}>
                  <div
                    className={cn("flex items-center space-x-2", opt.className)}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="container h-full mx-auto max-w-7xl">
        <div className="lg:w-[85%] mx-auto ">
          {!conversationStarted ? (
            <EmptyWorkspace />
          ) : (
            <div className="flex flex-col w-full h-full pb-4">
              <Conversation messages={messages as IMessage[]} />
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 z-50 w-full lg:w-[85%] mx-auto bg-background-1">
        <div className="pb-5">
          <AutoResizingInput />
        </div>
      </div>
    </section>
  );
};

export default Chat;
