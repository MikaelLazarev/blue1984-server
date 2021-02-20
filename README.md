# Blue1984: Server
### Twitter without censorship

![1984v2 008](https://user-images.githubusercontent.com/26343374/85220247-9d21a580-b3b2-11ea-8870-ccc5a0f1d1eb.jpeg)

This anti-censorship app for twitter  
Video: https://youtu.be/O3uLL3kWXAY

## Problem

Freedom to share your own thought is a key need for all people. Today, some social nwtworks could block and delete accounts or tweets like censors. This power limits freedom and could be used by goverments / corporations against society.

![Screenshot 2020-06-01 at 00 45 22](https://user-images.githubusercontent.com/26343374/83402860-398a0500-a410-11ea-83d8-ab2566de8fc8.png)

## User Story

Blue1984 scans all accounts you are interested for. It aoutmatically copies them into decentralised Bluzelle DB. If twitter deletes or changes any tweet, it founds differences and hightlights changed / deleted tweets. There is no regitstry flow for providing additional privacy.

![Screenshot 2020-06-01 at 09 39 52](https://user-images.githubusercontent.com/26343374/83402864-3d1d8c00-a410-11ea-97ce-708ca3d69721.png)

Even if your server would be blocked by authority, you could start another one, thanks for Bluzelle all data is stored in decentralised database, so nothing would be deleted!

![Screenshot 2020-06-01 at 12 49 11](https://user-images.githubusercontent.com/26343374/83402866-3e4eb900-a410-11ea-9455-8adb760cbf86.png)

## Mobile & web version

You could connect using web or mobile devices (works both on iOS and Android):

<img src='https://user-images.githubusercontent.com/26343374/83404016-7ce57300-a412-11ea-947b-9be3bbbf07d5.png' width='21%'/>&nbsp;&nbsp;&nbsp;<img src='https://user-images.githubusercontent.com/26343374/83404020-7f47cd00-a412-11ea-9422-ec1211715b1d.png' width='21%'/>&nbsp;&nbsp;&nbsp;<img src='https://user-images.githubusercontent.com/26343374/83404018-7eaf3680-a412-11ea-94cb-321941c54c12.png' width='21%'/>&nbsp;&nbsp;&nbsp;<img src='https://user-images.githubusercontent.com/26343374/83404017-7eaf3680-a412-11ea-90cb-fd732463cc0d.png' width='21%'/>

## Project repostories

Server: https://github.com/MikaelLazarev/blue1984-server (core repository)

Mobile apps: https://github.com/MikaelLazarev/blue1984-mobile

Front-end: https://github.com/MikaelLazarev/blue1984-web


## How to install:

1. Clone this repository: ```git clone git@github.com:MikaelLazarev/blue1984-server.git```

2. Change dir: ```cd blue1984-server```

3. Install all dependencies: ```yarn or npm i```

4. Fill .env file:

```
PORT= <Server port, default: 4000>
BLUZELLE_MNEMONIC= <Mnemonic for Bluzelle account>
BLUZELLE_ENDPOINT= <Bluzelle server entry point>
MAIN_DB=<Main Bluzelle DB UUID>
SENTRY_DSN=<Sentry DSN code>
UPDATE_DELAY=<delay in seconds between update cycles>
TWITTER_BEARER_TOKEN=<Twitter API bearer token>
DB_TYPE=<Mem for memory DB, Blu for bluzelle>
```
5. Run server for local development with ```yarn dev``` or ```npm run dev```

## Disclaimer

This application is provided "as is" and "with all faults." Me as developer makes no representations or warranties of any kind concerning the safety, suitability, lack of viruses, inaccuracies, typographical errors, or other harmful components of this software. There are inherent dangers in the use of any software, and you are solely responsible for determining whether this software product is compatible with your equipment and other software installed on your equipment. You are also solely responsible for the protection of your equipment and backup of your data, and THE PROVIDER will not be liable for any damages you may suffer in connection with using, modifying, or distributing this software product.

## Technical stack

* Typescript
* Nodejs & express for server
* Bluzelle DB
* Node cache

