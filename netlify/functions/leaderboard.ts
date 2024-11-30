import { Handler } from "@netlify/functions";
import { createClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from "../../src/types/game";

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers,
        body: ''
      };
    }

    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters;
      const difficulty = params?.difficulty;
      const limit = parseInt(params?.limit || '10');

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit)
        .modify(query => {
          if (difficulty && difficulty !== 'all') {
            query.eq('difficulty', difficulty);
          }
        });

      if (error) {
        console.error('Supabase GET error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database query failed' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    if (event.httpMethod === 'POST') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing request body' })
        };
      }

      const entry: Omit<LeaderboardEntry, 'id'> = JSON.parse(event.body);

      // Validate required fields
      if (!entry.playerName?.trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Player name is required' })
        };
      }

      if (typeof entry.score !== 'number' || entry.score < 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Valid score is required' })
        };
      }

      if (!['easy', 'medium', 'hard'].includes(entry.difficulty)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Valid difficulty is required' })
        };
      }

      // Insert into database
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([{
          player_name: entry.playerName,
          score: entry.score,
          difficulty: entry.difficulty,
          words: entry.words || [],
          language: entry.language || 'fr',
          date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase POST error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to save score' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};