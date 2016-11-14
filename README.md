# Fake Stacks #

A web application for sports gambling with fake money. Written with [SailsJS](sailsjs.org)

1. Create a league with friends who will compete by betting on the weekly lines.
2. You start out with a set amount of imaginary money in your account. Whoever has the most imaginary money in their account at the end of the season wins.
3. You can make up to a set number of bets per week on the point spread and over/under.
4. Lines move accordingly with Vegas lines

### Running the application locally ###

1. Install [PostgreSQL](https://www.postgresql.org/)
2. Install [NodeJS](https://nodejs.org/)
3. Modify the ```migrate``` command to ```migrate: 'safe'```
4. Start the app: ```npm start``` or ```node app.js```
