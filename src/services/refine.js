import { loadQARefineChain, loadQAStuffChain, loadSummarizationChain, loadQAMapReduceChain } from "langchain/chains";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
// import docx loader from "langchain/document_loaders/fs/docx";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Create the models and chain
const embeddings = new OpenAIEmbeddings();
const model = new OpenAI({ temperature: 0.2, modelName: "gpt-3.5-turbo-1106" });
const chain = loadQAMapReduceChain(model);

// Load E:\cloud\OneDrive\cfiles\Combs, Denver and create the vector store
const loader = new DirectoryLoader(
    "E:\\cloud\\OneDrive\\cfiles\\Combs, Denver",
    {
        // ".pdf": (path) => new PDFLoader(path),
        ".txt": (path) => new TextLoader(path),
        // ".doc": (path) => new TextLoader(path),
        // ".docx": (path) => new DocxLoader(path),
    }
);
const docs = await loader.loadAndSplit();
const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Select the relevant documents
const question = "List Denver Combs service connected conditions.";
const relevantDocs = await store.similaritySearch(question);

// Call the chain
const res = await chain.invoke({
    input_documents: relevantDocs,
    question,
});

console.log(res);