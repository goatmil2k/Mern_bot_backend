import { Request, Response, NextFunction} from 'express';
import User from '../models/user';
import { configureOpenAi } from '../config/openaiconfig';
import { OpenAIApi, ChatCompletionRequestMessage } from 'openai'


export const generateChatCompletion = async (
    req: Request,
    res: Response,
    Next: NextFunction) => {
        const { message } = req.body;
       
        try {
            const localId = res.locals.jwtData.id;
            const user = await User.findById(localId);
            if(!user) {
                return res.status(401).json({message: "User not registered or token malfunctioned" });
            }

            //grab chats of user
            const chats = user.chats.map(({role, content}) => ({role, content})) as ChatCompletionRequestMessage[];
            chats.push({content: message, role: "user"});
            user.chats.push({content: message, role: "user"});

            //send all chats with new one to openAI API
            const config = configureOpenAi();
            const openai = new OpenAIApi(config);
            const chatResponse = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: chats, 
            });
            if (chatResponse.data.choices && chatResponse.data.choices.length > 0) {
                user.chats.push(chatResponse.data.choices[0].message);
                await user.save();
                return res.status(200).json({ chats: user.chats });
              } else {
                throw new Error("Unexpected response structure from OpenAI API");
              }
        } catch(err) {
            console.log(err.message);
            return res.status(500).json({ message: "Something Went Wrong" });
        }
        
        
}

export const sendChatsToUser = async (
    req: Request,
    res: Response,
    Next: NextFunction
) => {
    try {
        const localId = res.locals.jwtData.id;
        const user = await User.findById(localId);
        if (!user) {
            return res.status(401).send("User is not registered or token malfunctioned");
        }
        console.log(user._id.toString(), localId);
        if (user._id.toString() !== localId) {
            return res.status(401).send("Permission Denied");
        }
        return res.status(200).json({ message: "Ok", chats: user.chats });
    } catch(err) {
        console.log(err);
        return res.json({message: "Error", cause: err.message});
    }

}

export const deleteChats = async (
    req: Request,
    res: Response,
    Next: NextFunction
) => {
    try {
        const localId = res.locals.jwtData.id;
        const user = await User.findById(localId);
        if (!user) {
            return res.status(401).send("User is not registered or token malfunctioned");
        }
        console.log(user._id.toString(), localId);
        if (user._id.toString() !== localId) {
            return res.status(401).send("Permission Denied");
        }

        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "Ok" });
    } catch(err) {
        console.log(err);
        return res.json({message: "Error", cause: err.message});
    }

}