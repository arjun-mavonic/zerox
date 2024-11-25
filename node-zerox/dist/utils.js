"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertKeysToSnakeCase = exports.convertFileToPdf = exports.convertPdfToImages = exports.getTextFromImage = exports.downloadFile = exports.isValidUrl = exports.isString = exports.formatMarkdown = exports.encodeImageToBase64 = exports.validateLLMParams = void 0;
var libreoffice_convert_1 = require("libreoffice-convert");
var pdf2pic_1 = require("pdf2pic");
var promises_1 = require("stream/promises");
var util_1 = require("util");
var Tesseract = __importStar(require("tesseract.js"));
var axios_1 = __importDefault(require("axios"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var mime_types_1 = __importDefault(require("mime-types"));
var path_1 = __importDefault(require("path"));
var sharp_1 = __importDefault(require("sharp"));
var uuid_1 = require("uuid");
var convertAsync = (0, util_1.promisify)(libreoffice_convert_1.convert);
var MIN_ROTATION_CONFIDENCE = 60;
var defaultLLMParams = {
    frequencyPenalty: 0, // OpenAI defaults to 0
    maxTokens: 2000,
    presencePenalty: 0, // OpenAI defaults to 0
    temperature: 0,
    topP: 1, // OpenAI defaults to 1
};
var validateLLMParams = function (params) {
    var validKeys = Object.keys(defaultLLMParams);
    for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (!validKeys.includes(key)) {
            throw new Error("Invalid LLM parameter: ".concat(key));
        }
        if (typeof value !== "number") {
            throw new Error("Value for '".concat(key, "' must be a number"));
        }
    }
    return __assign(__assign({}, defaultLLMParams), params);
};
exports.validateLLMParams = validateLLMParams;
var encodeImageToBase64 = function (imagePath) { return __awaiter(void 0, void 0, void 0, function () {
    var imageBuffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_extra_1.default.readFile(imagePath)];
            case 1:
                imageBuffer = _a.sent();
                return [2 /*return*/, imageBuffer.toString("base64")];
        }
    });
}); };
exports.encodeImageToBase64 = encodeImageToBase64;
// Strip out the ```markdown wrapper
var formatMarkdown = function (text) {
    var formattedMarkdown = text === null || text === void 0 ? void 0 : text.trim();
    var loopCount = 0;
    var maxLoops = 3;
    var startsWithMarkdown = formattedMarkdown.startsWith("```markdown");
    while (startsWithMarkdown && loopCount < maxLoops) {
        var endsWithClosing = formattedMarkdown.endsWith("```");
        if (startsWithMarkdown && endsWithClosing) {
            var outermostBlockRegex = /^```markdown\n([\s\S]*?)\n```$/;
            var match = outermostBlockRegex.exec(formattedMarkdown);
            if (match) {
                formattedMarkdown = match[1].trim();
                loopCount++;
            }
            else {
                break;
            }
        }
        else {
            break;
        }
    }
    return formattedMarkdown;
};
exports.formatMarkdown = formatMarkdown;
var isString = function (value) {
    return value !== null;
};
exports.isString = isString;
var isValidUrl = function (string) {
    var url;
    try {
        url = new URL(string);
    }
    catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
};
exports.isValidUrl = isValidUrl;
// Save file to local tmp directory
var downloadFile = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var fileNameExt, localPath, mimetype, writer, response, extension;
    var _c;
    var filePath = _b.filePath, tempDir = _b.tempDir;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                fileNameExt = path_1.default.extname(filePath.split("?")[0]);
                localPath = path_1.default.join(tempDir, (0, uuid_1.v4)() + fileNameExt);
                if (!(0, exports.isValidUrl)(filePath)) return [3 /*break*/, 3];
                writer = fs_extra_1.default.createWriteStream(localPath);
                return [4 /*yield*/, (0, axios_1.default)({
                        url: filePath,
                        method: "GET",
                        responseType: "stream",
                    })];
            case 1:
                response = _d.sent();
                if (response.status !== 200) {
                    throw new Error("HTTP error! Status: ".concat(response.status));
                }
                mimetype = (_c = response.headers) === null || _c === void 0 ? void 0 : _c["content-type"];
                return [4 /*yield*/, (0, promises_1.pipeline)(response.data, writer)];
            case 2:
                _d.sent();
                return [3 /*break*/, 5];
            case 3: 
            // If filePath is a local file, copy it to the temp directory
            return [4 /*yield*/, fs_extra_1.default.copyFile(filePath, localPath)];
            case 4:
                // If filePath is a local file, copy it to the temp directory
                _d.sent();
                _d.label = 5;
            case 5:
                if (!mimetype) {
                    mimetype = mime_types_1.default.lookup(localPath);
                }
                extension = mime_types_1.default.extension(mimetype) || "";
                if (!extension) {
                    if (mimetype === "binary/octet-stream") {
                        extension = ".bin";
                    }
                    else {
                        throw new Error("File extension missing");
                    }
                }
                if (!extension.startsWith(".")) {
                    extension = ".".concat(extension);
                }
                return [2 /*return*/, { extension: extension, localPath: localPath }];
        }
    });
}); };
exports.downloadFile = downloadFile;
// Extract text confidence from image buffer using Tesseract
var getTextFromImage = function (buffer) { return __awaiter(void 0, void 0, void 0, function () {
    var image, metadata, cropWidth, cropHeight, left, top_1, croppedBuffer, confidence, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                image = (0, sharp_1.default)(buffer);
                return [4 /*yield*/, image.metadata()];
            case 1:
                metadata = _a.sent();
                cropWidth = 150;
                cropHeight = metadata.height || 0;
                left = Math.max(0, Math.floor((metadata.width - cropWidth) / 2));
                top_1 = 0;
                return [4 /*yield*/, image
                        .extract({ left: left, top: top_1, width: cropWidth, height: cropHeight })
                        .toBuffer()];
            case 2:
                croppedBuffer = _a.sent();
                return [4 /*yield*/, Tesseract.recognize(croppedBuffer, "eng")];
            case 3:
                confidence = (_a.sent()).data.confidence;
                return [2 /*return*/, { confidence: confidence }];
            case 4:
                error_1 = _a.sent();
                console.error("Error during OCR:", error_1);
                return [2 /*return*/, { confidence: 0 }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getTextFromImage = getTextFromImage;
// Determine the optimal image orientation based on OCR confidence
// Run Tesseract on 4 image orientations and compare the outputs
var determineOptimalRotation = function (image) { return __awaiter(void 0, void 0, void 0, function () {
    var rotations, results, bestResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rotations = [0, 90, 180, 270];
                return [4 /*yield*/, Promise.all(rotations.map(function (rotation) { return __awaiter(void 0, void 0, void 0, function () {
                        var rotatedImageBuffer, confidence;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, image
                                        .clone()
                                        .rotate(rotation)
                                        .toBuffer()];
                                case 1:
                                    rotatedImageBuffer = _a.sent();
                                    return [4 /*yield*/, (0, exports.getTextFromImage)(rotatedImageBuffer)];
                                case 2:
                                    confidence = (_a.sent()).confidence;
                                    return [2 /*return*/, { rotation: rotation, confidence: confidence }];
                            }
                        });
                    }); }))];
            case 1:
                results = _a.sent();
                bestResult = results.reduce(function (best, current) {
                    return current.confidence > best.confidence ? current : best;
                });
                if (bestResult.confidence >= MIN_ROTATION_CONFIDENCE &&
                    bestResult.rotation !== 0) {
                    console.log("Reorienting image ".concat(bestResult.rotation, " degrees (confidence: ").concat(bestResult.confidence, "%)"));
                    return [2 /*return*/, bestResult.rotation];
                }
                return [2 /*return*/, 0];
        }
    });
}); };
// Convert each page to a png, correct orientation, and save that image to tmp
var convertPdfToImages = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var options, storeAsImage, convertResults, err_1;
    var correctOrientation = _b.correctOrientation, localPath = _b.localPath, pagesToConvertAsImages = _b.pagesToConvertAsImages, tempDir = _b.tempDir, trimEdges = _b.trimEdges;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                options = {
                    density: 300,
                    format: "png",
                    height: 2048,
                    preserveAspectRatio: true,
                    saveFilename: path_1.default.basename(localPath, path_1.default.extname(localPath)),
                    savePath: tempDir,
                };
                storeAsImage = (0, pdf2pic_1.fromPath)(localPath, options);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, storeAsImage.bulk(pagesToConvertAsImages, {
                        responseType: "buffer",
                    })];
            case 2:
                convertResults = _c.sent();
                return [4 /*yield*/, Promise.all(convertResults.map(function (result) { return __awaiter(void 0, void 0, void 0, function () {
                        var paddedPageNumber, image, optimalRotation, correctedBuffer, imagePath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!result || !result.buffer) {
                                        throw new Error("Could not convert page to image buffer");
                                    }
                                    if (!result.page)
                                        throw new Error("Could not identify page data");
                                    paddedPageNumber = result.page.toString().padStart(5, "0");
                                    image = (0, sharp_1.default)(result.buffer);
                                    if (trimEdges) {
                                        image.trim();
                                    }
                                    if (!correctOrientation) return [3 /*break*/, 2];
                                    return [4 /*yield*/, determineOptimalRotation(image)];
                                case 1:
                                    optimalRotation = _a.sent();
                                    if (optimalRotation) {
                                        image.rotate(optimalRotation);
                                    }
                                    _a.label = 2;
                                case 2: return [4 /*yield*/, image.toBuffer()];
                                case 3:
                                    correctedBuffer = _a.sent();
                                    imagePath = path_1.default.join(tempDir, "".concat(options.saveFilename, "_page_").concat(paddedPageNumber, ".png"));
                                    return [4 /*yield*/, fs_extra_1.default.writeFile(imagePath, correctedBuffer)];
                                case 4:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _c.sent();
                return [2 /*return*/, convertResults];
            case 4:
                err_1 = _c.sent();
                console.error("Error during PDF conversion:", err_1);
                throw err_1;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.convertPdfToImages = convertPdfToImages;
// Convert each page (from other formats like docx) to a png and save that image to tmp
var convertFileToPdf = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var inputBuffer, outputFilename, outputPath, pdfBuffer, err_2;
    var extension = _b.extension, localPath = _b.localPath, tempDir = _b.tempDir;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, fs_extra_1.default.readFile(localPath)];
            case 1:
                inputBuffer = _c.sent();
                outputFilename = path_1.default.basename(localPath, extension) + ".pdf";
                outputPath = path_1.default.join(tempDir, outputFilename);
                _c.label = 2;
            case 2:
                _c.trys.push([2, 5, , 6]);
                return [4 /*yield*/, convertAsync(inputBuffer, ".pdf", undefined)];
            case 3:
                pdfBuffer = _c.sent();
                return [4 /*yield*/, fs_extra_1.default.writeFile(outputPath, pdfBuffer)];
            case 4:
                _c.sent();
                return [2 /*return*/, outputPath];
            case 5:
                err_2 = _c.sent();
                console.error("Error converting ".concat(extension, " to .pdf:"), err_2);
                throw err_2;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.convertFileToPdf = convertFileToPdf;
var camelToSnakeCase = function (str) {
    return str.replace(/[A-Z]/g, function (letter) { return "_".concat(letter.toLowerCase()); });
};
var convertKeysToSnakeCase = function (obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj !== null && obj !== void 0 ? obj : {};
    }
    return Object.fromEntries(Object.entries(obj).map(function (_a) {
        var key = _a[0], value = _a[1];
        return [camelToSnakeCase(key), value];
    }));
};
exports.convertKeysToSnakeCase = convertKeysToSnakeCase;
