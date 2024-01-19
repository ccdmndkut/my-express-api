import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { AgentExecutor, createOpenAIToolsAgent, initializeAgentExecutorWithOptions } from "langchain/agents";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { Calculator } from "langchain/tools/calculator";
import { WebBrowser } from "langchain/tools/webbrowser";
import { SerpAPI } from "@langchain/community/tools/serpapi";

const run = async (input) => {
    const model = new OpenAI({ temperature: 0, modelName: "gpt-4-1106-preview" });
    const embeddings = new OpenAIEmbeddings();
    const tools = [
        new SerpAPI('91614b4742c1a8fc80f06ce996c7db0b53cc03370408e8147286e1a4303731a2', {
            location: "Dayton,Ohio,United States",
            hl: "en",
            gl: "us",
        }),
        new Calculator(),
        new TavilySearchResults(
            { apiKey: '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' }
        ),
        new WebBrowser({ model, embeddings }),
    ];
    /**
     * Represents the type of an agent in LangChain. It can be
     * "zero-shot-react-description", "chat-zero-shot-react-description", or
     * "chat-conversational-react-description".
     */
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "zero-shot-react-description",
        verbose: true
    });

    console.log("Loaded agent.");
    console.log(`Executing with input "${input}"...`);
    const result = await executor.invoke({ input });
    console.log(`Got output ${JSON.stringify(result, null, 2)}`);
    return result
};

export default run;