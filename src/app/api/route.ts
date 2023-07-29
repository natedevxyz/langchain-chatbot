import { NextResponse } from 'next/server';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';

const apiKey = process.env.SHALE_API_KEY;

const chat = new ChatOpenAI(
	{
		openAIApiKey: apiKey,
		modelName: 'vicuna-13b-v1.1',
	},
	{ basePath: 'https://shale.live/v1' }
);

export async function POST(req: Request, res: NextResponse) {
	const body = await req.json();
	const question = body.messages[body.messages.length - 1];
	let response = { role: 'assistant', message: '' };

	if (question.role === 'user') {
		const callResponse = await chat.call([new HumanMessage(question.message)]);
		response.message = callResponse.content;
	} else {
		response.message = 'Can you please repeat the question?';
	}

	return NextResponse.json({ output: response }, { status: 200 });
}
