import { ZeroxArgs, ZeroxOutput } from "./types";
export declare const zerox: ({ cleanup, concurrency, correctOrientation, filePath, llmParams, maintainFormat, model, onPostProcess, onPreProcess, openaiAPIKey, outputDir, pagesToConvertAsImages, tempDir, trimEdges, }: ZeroxArgs) => Promise<ZeroxOutput>;
