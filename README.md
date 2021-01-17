# HTN2021-Backend
Backend for our HTN2020++ project

## API Endpoints
- <b>/transcripts/add</b> (adds transcript and transcriptContent documents to the db)
  - content = [{name, content}]
  - title = string
  - ownerID = string user auth uid
  
  <b>returns:</b> {}
  
- <b>/transcripts/delete</b> (deletes and transcript and transcriptContent document from the db)
  - transcriptID = string
  
  <b>returns:</b> {}
  
- <b>/users/transcripts</b> (returns all transcripts belonging to the specified user)
  - userID = string user auth uid
  
  <b>returns array of:</b>
  ```
  {
    ownerID: string,
    contentID: string,
    title: string,
    date: {
      _seconds: Number,
      _nanoseconds: Number
    }
  }
  ```
  
- <b>/users/transcripts/content</b> (returns content of the given transcript)
   - contentID = string id of content document
   
     <b>returns:</b>
  ```
  {
    content: array of {
      name: string
      content: string
    },
    keywords: array
  }
  ```
   
All objects passed in should be in JSON format.

Response code 200 : Success

Response code 500 : Internal Server Error
