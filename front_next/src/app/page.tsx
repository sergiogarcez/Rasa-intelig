import { DialogContent } from "@radix-ui/react-dialog";
import {Dialog} from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import {TextField} from "@radix-ui/themes"
import Chat from "./components/chatbot";

export default function Home() {
  return (
    <main>
      <Chat></Chat>
    </main>
  );
}