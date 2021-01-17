require('dotenv').config();
const {TextAnalyticsClient, AzureKeyCredential} = require('@azure/ai-text-analytics')

const key = process.env.AZURE_TA_KEY
const endpoint =  process.env.AZURE_TA_ENDPOINT

const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key))

class AzureHandler {
    static extractKeyPhrases = async(text) => {
        try{
            const input = [text]
            const res = await client.extractKeyPhrases(input)
            return res[0].keyPhrases
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = AzureHandler