require("dotenv").config();
import _ from "lodash";
import { colors, print } from "./Helpers";
import express from 'express';
import cors from 'cors';


const { NlpManager } = require("node-nlp");

const manager = new NlpManager({ languages: ["en"], forceNER: true });

//import the model
manager.load("./model.nlp");

const app = express();
app.use(express.json());
app.use(cors())

// const token = process.env.bot_token ?? "";

const getResponse = async (msg:string) => {
  const response: RootObject = await manager.process("en", msg);
  return (response?.answer ?? "I don't understand");
}

app.post('/', async (req, res:any) => {
  console.log(req.body);
  const msg:string = String(req.body.msg);
  const response:string = await getResponse(msg);
  return res.send({
    Status:200,
    Message:'Success',
    Payload:response 
  });
});

app.listen(5000, () =>
  console.log(`Example app listening on port ${5000}!`),
);

//just some interface
interface RootObject {
  locale: string;
  utterance: string;
  settings: undefined;
  languageGuessed: boolean;
  localeIso2: string;
  language: string;
  nluAnswer: NluAnswer;
  classifications: Classification[];
  intent: string;
  score: number;
  domain: string;
  sourceEntities: any[];
  entities: any[];
  answers: any[];
  answer: undefined;
  actions: any[];
  sentiment: Sentiment;
}

interface Sentiment {
  score: number;
  numWords: number;
  numHits: number;
  average: number;
  type: string;
  locale: string;
  vote: string;
}

interface Classification {
  intent: string;
  score: number;
}

interface NluAnswer {
  classifications: Classification[];
  entities: undefined;
  explanation: undefined;
}
