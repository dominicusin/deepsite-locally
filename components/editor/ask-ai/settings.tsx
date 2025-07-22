import { PiGearSixFill } from "react-icons/pi";
import { useState, useEffect } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PROVIDERS, MODELS } from "@/lib/providers";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useUpdateEffect } from "react-use";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Settings({
  open,
  onClose,
  provider,
  model,
  error,
  onChange,
}: {
  open: boolean;
  provider: string;
  model: string;
  error?: string;
  isFollowUp?: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [customModel, setCustomModel] = useState("");

  useEffect(() => {
    setApiKey(localStorage.getItem("openai_api_key") || "");
    setBaseUrl(localStorage.getItem("openai_base_url") || "");
    setCustomModel(localStorage.getItem("openai_model") || "");
  }, [open]);

  const modelAvailableProviders = useMemo(() => {
    const availableProviders = MODELS.find(
      (m: { value: string }) => m.value === model
    )?.providers;
    if (!availableProviders) return Object.keys(PROVIDERS);
    return Object.keys(PROVIDERS).filter((id) =>
      availableProviders.includes(id)
    );
  }, [model]);

  useUpdateEffect(() => {
    if (provider !== "auto" && !modelAvailableProviders.includes(provider)) {
      onChange("auto");
    }
  }, [model, provider]);

  const handleSaveSettings = () => {
    localStorage.setItem("openai_api_key", apiKey);
    localStorage.setItem("openai_base_url", baseUrl);
    localStorage.setItem("openai_model", customModel);
    toast.success("Settings saved!");
    onClose(false);
  };

  return (
    <div className="">
      <Popover open={open} onOpenChange={onClose}>
        <PopoverTrigger asChild>
          <Button variant="black" size="sm">
            <PiGearSixFill className="size-4" />
            Settings
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="!rounded-2xl p-0 !w-96 overflow-hidden !bg-neutral-900"
          align="center"
        >
          <header className="flex items-center justify-center text-sm px-4 py-3 border-b gap-2 bg-neutral-950 border-neutral-800 font-semibold text-neutral-200">
            Customize Settings
          </header>
          <main className="px-4 pt-5 pb-6 space-y-5">
            {error !== "" && (
              <p className="text-red-500 text-sm font-medium mb-2 flex items-center justify-between bg-red-500/10 p-2 rounded-md">
                {error}
              </p>
            )}
            <label className="block">
              <p className="text-neutral-300 text-sm mb-2.5">
                API Key
              </p>
              <Input
                type="password"
                placeholder="Enter your api key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="!bg-neutral-800 !border-neutral-700 !text-neutral-200"
              />
            </label>
            <label className="block">
              <p className="text-neutral-300 text-sm mb-2.5">
                Base URL
              </p>
              <Input
                type="text"
                placeholder="e.g., http://127.0.0.1:11434/v1"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="!bg-neutral-800 !border-neutral-700 !text-neutral-200"
              />
            </label>
            <label className="block">
              <p className="text-neutral-300 text-sm mb-2.5">
                Custom Model
              </p>
              <Input
                type="text"
                placeholder="e.g., gemma3:1b"
                value={customModel || "gemma3:1b"}
                onChange={(e) => setCustomModel(e.target.value)}
                className="!bg-neutral-800 !border-neutral-700 !text-neutral-200"
              />
            </label>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveSettings}
              className="mt-2 w-full"
            >
              Save Settings
            </Button>
            <div className="bg-amber-500/10 border-amber-500/10 p-3 text-xs text-amber-500 border rounded-lg">
              Accepts any OpenAI-compatible provider. Enter the corresponding API key and base URL (e.g., OpenRouter, DeepSeek, etc.).
            </div>

          </main>
        </PopoverContent>
      </Popover>
    </div>
  );
}
