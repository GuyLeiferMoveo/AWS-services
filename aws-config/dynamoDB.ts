import { DynamoDB } from "aws-sdk";

export const dynamoDb = new DynamoDB.DocumentClient({ region: "il-central-1" });
const dynamoDBService = new DynamoDB(); // Create a DynamoDB service client

export const createTableIfNotExists = async () => {
  try {
    const existingTables = await dynamoDBService.listTables().promise();
    if (
      existingTables.TableNames?.includes(process.env.DB_TABLE_NAME || "users")
    ) {
      console.log(`Table ${process.env.DB_TABLE_NAME} already exists.`);
      return;
    }

    const params: DynamoDB.CreateTableInput = {
      TableName: process.env.DB_TABLE_NAME || "users",
      KeySchema: [
        {
          AttributeName: "userId",
          KeyType: "HASH", // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: "userId",
          AttributeType: "S",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    };

    const table = await dynamoDBService.createTable(params).promise();
    console.log(`Table ${process.env.DB_TABLE_NAME} created successfully.`);
    return table;
  } catch (error) {
    console.error("Error creating table:", error);
  }
};
