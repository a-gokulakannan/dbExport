const { MongoClient } = require('mongodb');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const uri = `mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.6`; // Replace with your MongoDB connection string
const dbName = `passkey`; // Replace with your database name
const collectionName = `bulkmail`; // Replace with your collection name

async function exportToCsv() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch all documents from the collection
        const data = await collection.find({}).toArray();

        // Define the CSV writer
        const csvWriter = createCsvWriter({
            path: 'output.csv',
            header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
        });

        // Write data to CSV
        await csvWriter.writeRecords(data);
        console.log('Data exported to output.csv');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

exportToCsv();
