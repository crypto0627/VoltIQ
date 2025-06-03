import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import * as fs from 'node:fs';
import * as path from 'node:path';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const usage = await db.collection('electricity_usage').find({}).toArray();
    return NextResponse.json(usage);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch electricity usage' },
      { status: 500 }
    );
  }
}

// This is used to import the data from the csv files into the database
export async function POST(req: Request) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const nonSummerDir = path.join(dataDir, 'non-summer');
    const summerDir = path.join(dataDir, 'summer');

    const nonSummerFiles = fs.readdirSync(nonSummerDir).filter(file => file.endsWith('.csv'));
    const summerFiles = fs.readdirSync(summerDir).filter(file => file.endsWith('.csv'));

    const allCsvFiles = [
      ...nonSummerFiles.map(file => path.join(nonSummerDir, file)),
      ...summerFiles.map(file => path.join(summerDir, file)),
    ];

    const dailyUsageData: { [key: string]: { time: string, usage: number }[] } = {};

    for (const filePath of allCsvFiles) {
      const csvData = fs.readFileSync(filePath, 'utf-8');
      const lines = csvData.trim().split('\n');

      // Dates are in the second row, starting from the second column
      const dates = lines[1].split(',').slice(1);

      // Data starts from the third row, first column is time
      for (let i = 2; i < lines.length; i++) {
        const values = lines[i].split(',');
        const time = values[0];

        for (let j = 0; j < dates.length; j++) {
          const date = dates[j];
          const usage = parseFloat(values[j + 1]);

          if (!isNaN(usage)) {
            if (!dailyUsageData[date]) {
              dailyUsageData[date] = [];
            }
            dailyUsageData[date].push({
              time: time,
              usage: usage,
            });
          }
        }
      }
    }

    // Convert the grouped data into an array of documents for insertion
    const documentsToInsert = Object.keys(dailyUsageData).map(date => ({
      date: date,
      usageData: dailyUsageData[date].sort((a, b) => a.time.localeCompare(b.time)), // Optional: Sort by time
    }));

    const { db } = await connectToDatabase();
    const collection = db.collection('electricity_usage');

    // Optional: Clear existing data before inserting all new data
    await collection.deleteMany({});

    const result = await collection.insertMany(documentsToInsert);

    return NextResponse.json({ message: 'Data imported successfully', insertedCount: result.insertedCount });
  } catch (error: any) {
    console.error('Failed to import data:', error);
    return NextResponse.json(
      { error: 'Failed to import electricity usage data', details: error.message },
      { status: 500 }
    );
  }
}
