import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { H3 } from "../_components";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export const AccountSettingScreen = () => {
  return (
    <section className="mr-8">
      <H3>Account</H3>
      <div className="flex items-center justify-center mb-3">
        <Button>
          <div>Login with Google</div>
        </Button>
      </div>

      <div className="flex py-4 space-x-5">
        <Avatar className="w-16 h-16">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center mb-3 space-x-3">
            <Input
              placeholder="Your Name Here"
              className="border-muted-foreground max-w-52"
            />
            <Button variant={"outline"} size={"icon"} className="">
              <Edit className="w-6 h-6 text-muted-foreground" />
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Textarea
              value={``}
              placeholder="bio"
              className="h-24 border w-96 border-muted-foreground"
            />

            <Button variant={"outline"} size={"icon"} className="">
              <Edit className="w-6 h-6 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-3 bg-muted-foreground" />

      <div></div>
    </section>
  );
};

export default AccountSettingScreen;
