import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const ProModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleProClick = () => {
    // Replace with your own subscription logic
    onClose(false);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:!p-8 !rounded-3xl !bg-white !border-neutral-100">
        <DialogTitle className="hidden" />
        <main className="flex flex-col items-start text-left relative pt-2">
          <h2 className="text-2xl font-bold text-neutral-950">
            Upgrade to Pro
          </h2>
          <p className="text-neutral-500 text-base mt-2 max-w-sm">
            You have reached the monthly free limit.
          </p>
          <Button
            variant="black"
            size="lg"
            className="w-full !text-base !h-11 mt-8"
            onClick={handleProClick}
          >
            Upgrade
          </Button>
        </main>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
