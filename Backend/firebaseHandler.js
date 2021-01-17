require('dotenv').config();
const admin = require('firebase-admin')
const AzureHandler = require('./azureHandler')

//init firebase/store

const serviceAcc = {
    "type": process.env.FS_TYPE,
    "project_id": process.env.FS_PROJECT_ID,
    "private_key_id": process.env.FS_PRIVATE_KEY_ID,
    "private_key": process.env.FS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FS_CLIENT_EMAIL,
    "client_id": process.env.FS_CLIENT_ID,
    "auth_uri": process.env.FS_AUTH_URI,
    "token_uri": process.env.FS_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FS_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FS_CLIENT_X509_CERT_URL
}
const app = admin.initializeApp({credential: admin.credential.cert(serviceAcc)})
const firestore = admin.firestore()

const collections = {
    transcripts: "transcripts",
    content: "transcriptContent",
}

class FirebaseHandler {
     //content, title, ownerID
     //name, content is the object in the content thing
    static addTranscript = async(req) => {
        const response = await this.dbInteraction(async req => {
            if(req.body.content.length <= 0){
                throw new Error("No words in transcript")
            }
            
            //reduce the content and leave out names for Azure processing
            let concat = ""
            req.body.content.forEach(capt => concat += " " + capt.content)
            const keywords = await AzureHandler.extractKeyPhrases(concat)

            await firestore.collection(collections.content).add({
                    content: req.body.content,
                    keywords: keywords
                }).then(async docRef => {
                    await firestore.collection(collections.transcripts).add({
                        title: req.body.title,
                        date: admin.firestore.Timestamp.now(),
                        contentID: docRef.id,
                        ownerID: req.body.ownerID
                })
            })

            return {}
        },req)
        return response
    }

    //transcriptID
    static removeTranscript = async(req) => {
        const response = await this.dbInteraction(async req => {
            console.log(req.body.transcriptID)

            const docRef = await firestore.collection(collections.transcripts).doc(req.body.transcriptID).get()

            console.log(docRef.data())
            
            await firestore.collection(collections.content).doc((String)(docRef.data['contentID'])).delete()
            await firestore.collection(collections.transcripts).doc(req.body.transcriptID).delete()

            return {}
        }, req)
        return response
    }

    //userID
    static getTranscriptsFromUser = async (req) => {
        const response = await this.dbInteraction(async req => {
            const collectionRef = firestore.collection(collections.transcripts)
            const collectionSnapshot = await collectionRef.where('ownerID', '==', req.body.userID).get()

            let transcripts = []

            collectionSnapshot.forEach(doc => {
                transcripts.push({transcriptID: doc.id, ...doc.data()})
            })

            return ({
                transcripts: transcripts
            })

        }, req)
        return response
    }

    //contentID
    static getTranscriptContent = async (req) => {
        const response = await this.dbInteraction(async req => {
            const transcriptContent = await firestore.collection(collections.content).doc(req.body.contentID).get()
            return transcriptContent.data()
        }, req)
        return response
    }

    //just a standard HOF for boilerplate db interactions
    static dbInteraction = async(func, req) => {
        try{
            const obj = await func(req)
            return {
                status: 200,
                resObj: {
                    message: 'success',
                    obj: obj
                }
            }
        } catch(err) {
            console.log(err)
            return {
                status:  500,
                resObj:{
                    message: err
                }
            }
        }
    }
}

module.exports = FirebaseHandler