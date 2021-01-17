# HTN2021-Backend
Backend for our HTN2020++ project

## API Endpoints
- <b>/transcripts/add</b> (adds transcript and transcriptContent documents to the db)
  - content = [{name, content}]
  - title = string
  - ownerID = string user auth uid
  
- <b>/transcripts/delete</b> (deletes and transcript and transcriptContent document from the db)
  - transcriptID = string
  
- <b>/users/transcripts</b> (returns all transcripts belonging to the specified user)
  - userID = string user auth uid
  
- <b>/users/transcripts/content</b> (returns content of the given transcript)
   - contentID = string id of content document
   
All objects passed in should be in JSON format
