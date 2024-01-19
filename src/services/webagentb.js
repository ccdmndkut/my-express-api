import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { Calculator } from "langchain/tools/calculator";
import { WebBrowser } from "langchain/tools/webbrowser";
import { SerpAPI } from "@langchain/community/tools/serpapi";



const llm = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    temperature: 0,
    cache: false,
});
const model = new OpenAI({ temperature: 0, modelName: "gpt-4-1106-preview" });

const embeddings = new OpenAIEmbeddings();

const tools = [
    new SerpAPI('91614b4742c1a8fc80f06ce996c7db0b53cc03370408e8147286e1a4303731a2', {
        location: "Dayton,Ohio,United States",
        hl: "en",
        gl: "us",
    }),
    new Calculator(),
    new WebBrowser({ model, embeddings }),
];

const prompt = await pull("hwchase17/openai-tools-agent")

const agent = await createOpenAIToolsAgent({
    llm,
    tools,
    prompt,
});
const agentExecutor = new AgentExecutor({
    agent,
    tools,
    returnIntermediateSteps: false,
});


const result = await agentExecutor.invoke({
    input: "get Latest NFL scores?",
});

console.log(result);