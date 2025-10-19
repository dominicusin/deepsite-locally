/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import {
  DIVIDER,
  FOLLOW_UP_SYSTEM_PROMPT,
  INITIAL_SYSTEM_PROMPT,
  REPLACE_END,
  SEARCH_START,
} from "@/lib/prompts";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prompt, model, redesignMarkdown, html, apiKey, baseUrl } = body;

  const openai = new OpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY || "",
    baseURL: baseUrl || process.env.OPENAI_BASE_URL,
  });

  if (!model || (!prompt && !redesignMarkdown)) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const response = new NextResponse(stream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

    (async () => {
      let completeResponse = "";
      try {
        const chatCompletion = await openai.chat.completions.create({
          model,
          stream: true,
          messages: [
            { role: "system", content: INITIAL_SYSTEM_PROMPT },
            {
              role: "user",
              content: redesignMarkdown
                ? `Here is my current design as a markdown:\n\n${redesignMarkdown}\n\nNow, please create a new design based on this markdown.`
                : html
                ? `Here is my current HTML code:\n\n\`\`\`html\n${html}\n\`\`\`\n\nNow, please create a new design based on this HTML.`
                : prompt,
            },
          ],
        });

        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (!content) continue;
          completeResponse += content;
          await writer.write(encoder.encode(content));
        }

        if (!completeResponse.trim()) {
          await writer.write(
            encoder.encode("\n[ERROR] Model returned empty response.\n")
          );
        }
      } catch (error: any) {
        await writer.write(
          encoder.encode(
            JSON.stringify({
              ok: false,
              message:
                error.message ||
                "An error occurred while processing your request.",
            })
          )
        );
      } finally {
        await writer.close();
      }
    })();

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error?.message || "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const {
    prompt,
    html,
    previousPrompt,
    selectedElementHtml,
    apiKey,
    model,
    baseUrl,
  } = body;

  const openai = new OpenAI({
    apiKey: apiKey || process.env.OPENAI_API_KEY || "",
    baseURL: baseUrl || process.env.OPENAI_BASE_URL,
  });

  if (!prompt || !html) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: FOLLOW_UP_SYSTEM_PROMPT },
        {
          role: "user",
          content:
            previousPrompt ||
            "You are modifying the HTML file based on the user's request.",
        },
        {
          role: "assistant",
          content: `The current code is: \n\`\`\`html\n${html}\n\`\`\` ${
            selectedElementHtml
              ? `\n\nYou have to update ONLY the following element, NOTHING ELSE: \n\n\`\`\`html\n${selectedElementHtml}\n\`\`\``
              : ""
          }`,
        },
        { role: "user", content: prompt },
      ],
    });

    const chunk = response.choices[0]?.message?.content || "";
    if (!chunk.trim()) {
      return NextResponse.json(
        { ok: false, message: "Model returned empty response" },
        { status: 400 }
      );
    }

    // aplica os blocos de modificação SEARCH_START...DIVIDER...REPLACE_END
    let newHtml = html;
    const updatedLines: number[][] = [];
    let position = 0;
    let moreBlocks = true;

    while (moreBlocks) {
      const searchStartIndex = chunk.indexOf(SEARCH_START, position);
      if (searchStartIndex === -1) {
        moreBlocks = false;
        continue;
      }

      const dividerIndex = chunk.indexOf(DIVIDER, searchStartIndex);
      if (dividerIndex === -1) {
        moreBlocks = false;
        continue;
      }

      const replaceEndIndex = chunk.indexOf(REPLACE_END, dividerIndex);
      if (replaceEndIndex === -1) {
        moreBlocks = false;
        continue;
      }

      const searchBlock = chunk.substring(
        searchStartIndex + SEARCH_START.length,
        dividerIndex
      );
      const replaceBlock = chunk.substring(
        dividerIndex + DIVIDER.length,
        replaceEndIndex
      );

      if (searchBlock.trim() === "") {
        newHtml = `${replaceBlock}\n${newHtml}`;
        updatedLines.push([1, replaceBlock.split("\n").length]);
      } else {
        const blockPosition = newHtml.indexOf(searchBlock);
        if (blockPosition !== -1) {
          const beforeText = newHtml.substring(0, blockPosition);
          const startLineNumber = beforeText.split("\n").length;
          const replaceLines = replaceBlock.split("\n").length;
          const endLineNumber = startLineNumber + replaceLines - 1;

          updatedLines.push([startLineNumber, endLineNumber]);
          newHtml = newHtml.replace(searchBlock, replaceBlock);
        }
      }

      position = replaceEndIndex + REPLACE_END.length;
    }

    return NextResponse.json({
      ok: true,
      html: newHtml,
      updatedLines,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error.message || "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
