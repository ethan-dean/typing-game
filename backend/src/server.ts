import { ObjectId } from "mongodb";

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const path = require('path');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Wesley:uhsPa6lUo63zxGqW@cluster0.6xjnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(url);
client.connect();

const port = 5060;
const app = express();
app.set('trust proxy', 1);
app.use(cors({
    origin: ['https://typecode.app', 'http://localhost:5173'], //if your frontend is running on a different port, add it here
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
app.use(bodyParser.json());

app.post('/api/signup', async (req: any, res: any, next: any) =>
{
    // Incoming: First name, Last name, Login, Password
    // Outgoing: id, error

    const score = 0;
	const highScore = 0;
	const wordsPerMinute = 0;
	const totalWordsTyped = 0;
	const accuracy = 0;
	const levelsCompleted = 0;

    const { firstName, lastName, email, login, password } = req.body;
    const newUser =	{ 
		FirstName: firstName,
		LastName: lastName,
		Email: email,
		Login: login,
		Pasword: password,
		PlayerData: {
		  Score: score,
		  HighScore: highScore,
		  WordsPerMinute: wordsPerMinute,
		  TotalWordsTyped: totalWordsTyped,
		  Accuracy: accuracy,
		  LevelsCompleted: levelsCompleted
		}
	};
    
    const db = client.db("LargeProject");
    const existingUser = await db.collection('TestUsers').findOne({ Login: login });
    
    if (existingUser) {
        return res.status(300).json({ error: 'User with this login already exists' });
    }
    
    const result = await db.collection('TestUsers').insertOne(newUser);
    
    // Send the newly created user's ID
    res.status(200).json(
        {
            id: result.insertedId
        }
    );
});

app.post('/api/login', async (req: any, res: any, next: any) => 
{
	const { login, password } = req.body;

	const db = client.db("LargeProject");
	const user = await db.collection("TestUsers").findOne({Login: login, Password: password});

	if(!user) {
        return res.status(400).json({ error: 'Invalid login or password' });
    }

	res.status(200).json(
		{
			id: user._id
		}
	)
});

app.post('/api/getUser', async (req: any, res: any, next: any) => 
{
	const { id } = req.body;

	var objectId = ObjectId.createFromHexString(id)

	const db = client.db("LargeProject");
    const user = await db.collection('TestUsers').findOne({ _id: objectId });

	if (!user) {
        return res.status(400).json({ error: 'User with the given id does not exist' });
    }

	res.status(200).json({ 
        name: `${user.FirstName} ${user.LastName}`, 
		login: user.Login,
        email: user.Email
    });
})

app.post('/api/getPlayerData', async (req: any, res: any, next: any) => {
	const { id } = req.body;

	var objectId = ObjectId.createFromHexString(id)

	const db = client.db("LargeProject");
    const user = await db.collection('TestUsers').findOne({ _id: objectId });
	
	if (!user) {
        return res.status(400).json({ error: 'User with the given id does not exist' });
    }

	res.status(200).json({
		login: user.Login,
		name: `${user.FirstName} ${user.LastName}`,
		score: user.PlayerData.Score,
		wordsPerMinute: user.PlayerData.WordsPerMinute,
		highscore: user.PlayerData.HighScore,
		totalWordsTyped: user.PlayerData.TotalWordsTyped,
		accuracy: user.PlayerData.Accuracy,
		levelsCompleted: user.PlayerData.LevelsCompleted
	});
})

// TENTATIVE LEADERBOARD ENDPOINT
app.post('/api/getLeaderboard', async (req: any, res: any, next: any) => {
	// Incoming: 
	// sortBy - string specifying what score value to rank by
	// limit - amount of users to send back
	// Outgoing: list of entries from the 'TestUsers' collection sorted by 'sortby'
	const { sortBy, limit } = req.body;

	// Valid sorting fields
	const validSortingFields = [
		'HighScore',
		'WordsPerMinute',
		'TotalWordsTyped',
		'Accuracy', 
		'LevelsCompleted'
	];

	if(!validSortingFields.includes(sortBy)){
		return res.status(400).json({
			error: `'${sortBy}' is an an invalid sortBy field. Valid sorting fields are: ${validSortingFields.toString()}`
		});
	}

	// Set the sorting options
	const sortingOptions: { [key: string]: number } = {}
	sortingOptions[`PlayerData.${sortBy}`] = -1 // -1 indicates sort by descending order in MongoDB

	const db = client.db("LargeProject");

	const users = await db.collection('TestUsers').find(
		{}, // Return all entries
		{ 
			Login: 1,
			FirstName: 1,
			LastName: 1,
			PlayerData: 1
		}
	) // Return these specific values
	.sort(sortingOptions) // Sort by
	.limit(limit) // Limit the output to this # of entries 
	.toArray();

	// create the leaderboard
	const leaderboard = users.map((user: { 
		_id: any; 
		FirstName: any; 
		LastName: any; 
		Login: any; 
		PlayerData: { toObject: () => any; }; }
	) => ({
		id: user._id,
		name: `${user.FirstName} ${user.LastName}`,
		login: user.Login,
		playerData: user.PlayerData
	}));

	// Return the leaederboard
	res.status(200).json({ leaderboard });
})

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'client/dist')));
// Catch all to allow client-side routing
app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to call as middleware in endpoints for JWT authentication
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) // No token at all
  {
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  if (!token) // Doesn't have correct format
  {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err)  // Invalid token
    {
      return res.sendStatus(403);
    }
    // Any endpoints using this middleware have access to user information 
    // req.user, for example req.user._id or req.user.name
    req.user = user;
    next();
  });

}

export{};
