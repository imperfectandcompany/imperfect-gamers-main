import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog"
import { Button } from "@components/ui/button";

const FeatureNotAvailable: React.FC<{ title: string; description: string }> = ({
    title,
    description,
  }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#3d3d3d] hover:bg-[#4a4a4a]">
          + LINK ACCOUNT
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );

  export default FeatureNotAvailable;