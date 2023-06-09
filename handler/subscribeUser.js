const AWS = require("aws-sdk");
const uuid = require("uuid");

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.subscribeUser = (event, context, callback) => {
    const data = JSON.parse(event.body);
    console.log("Event: ", data);

    const timestamp = new Date().getTime();

    if(typeof data.email !== "string") {
        console.error("validation failed");
        return;
    }
    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: uuid.v4(),
            email: data.email,
            subscriber: true,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    };

    // write the user to the database
    dynamoDb.put(params, (err, data) => {
        if(err) {
            console.error(err);
            callback(new Error(err));
            return;
        }
        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };
        callback(null, response);
    });

}