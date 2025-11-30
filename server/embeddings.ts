import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import type { ContentChunk, VectorRecord } from './types';
import { createTableWithData, addRecords, getAllChunkIds } from './vector-store';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 100;
const MAX_TOKENS_PER_BATCH = 8000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Estimate tokens (conservative)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

// Generate embeddings for a batch of texts
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return response.data.map(d => d.embedding);
}

// Parse your content files and create chunks
// CUSTOMIZE THIS FUNCTION FOR YOUR CONTENT STRUCTURE
export function parseContentFiles(contentDir: string): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  function walkDir(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(contentDir, filePath);

        // Extract title from frontmatter or filename
        const titleMatch = content.match(/^---\s*\n(?:.*\n)*?title:\s*["']?([^"'\n]+)["']?\s*\n/);
        const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');

        // Convert file path to URL (adjust for your routing)
        const url = '/' + relativePath.replace(/\.md$/, '').replace(/\/index$/, '');

        // Split content into sections by headers
        const sections = content.split(/(?=^##?\s)/m);

        sections.forEach((section, index) => {
          const sectionTitle = section.match(/^##?\s+(.+)$/m)?.[1] || 'Introduction';
          const cleanText = section
            .replace(/^---[\s\S]*?---\n/, '') // Remove frontmatter
            .replace(/^##?\s+.+$/m, '')       // Remove header
            .trim();

          if (cleanText.length > 50) { // Skip very short sections
            chunks.push({
              id: `${relativePath}-section-${index}`,
              text: cleanText.slice(0, 8000), // Limit chunk size
              metadata: {
                title,
                url,
                section: sectionTitle,
                file_path: relativePath
              }
            });
          }
        });
      }
    }
  }

  walkDir(contentDir);
  return chunks;
}

// Main embedding generation function
export async function generateAllEmbeddings(
  contentDir: string,
  fullRegenerate: boolean = false
): Promise<void> {
  console.log('Parsing content files...');
  const chunks = parseContentFiles(contentDir);
  console.log(`Found ${chunks.length} chunks`);

  // Check which chunks already exist
  let existingIds = new Set<string>();
  if (!fullRegenerate) {
    existingIds = await getAllChunkIds();
    console.log(`Found ${existingIds.size} existing chunks in database`);
  }

  // Filter to new chunks only
  const newChunks = chunks.filter(c => !existingIds.has(c.id));
  console.log(`Processing ${newChunks.length} new chunks`);

  if (newChunks.length === 0) {
    console.log('No new chunks to process');
    return;
  }

  // Process in batches
  const records: VectorRecord[] = [];
  let batch: ContentChunk[] = [];
  let batchTokens = 0;

  for (const chunk of newChunks) {
    const tokens = estimateTokens(chunk.text);

    if (batch.length >= BATCH_SIZE || batchTokens + tokens > MAX_TOKENS_PER_BATCH) {
      // Process current batch
      if (batch.length > 0) {
        console.log(`Processing batch of ${batch.length} chunks...`);
        const embeddings = await generateEmbeddings(batch.map(c => c.text));

        for (let i = 0; i < batch.length; i++) {
          records.push({
            id: batch[i].id,
            text: batch[i].text,
            vector: embeddings[i],
            title: batch[i].metadata.title,
            url: batch[i].metadata.url,
            section: batch[i].metadata.section || '',
            file_path: batch[i].metadata.file_path
          });
        }

        // Save incrementally every 10 chunks
        if (records.length >= 10) {
          if (fullRegenerate && records.length === batch.length) {
            await createTableWithData(records);
          } else {
            await addRecords(records);
          }
          records.length = 0; // Clear after saving
        }
      }

      batch = [];
      batchTokens = 0;
    }

    batch.push(chunk);
    batchTokens += tokens;
  }

  // Process remaining batch
  if (batch.length > 0) {
    console.log(`Processing final batch of ${batch.length} chunks...`);
    const embeddings = await generateEmbeddings(batch.map(c => c.text));

    for (let i = 0; i < batch.length; i++) {
      records.push({
        id: batch[i].id,
        text: batch[i].text,
        vector: embeddings[i],
        title: batch[i].metadata.title,
        url: batch[i].metadata.url,
        section: batch[i].metadata.section || '',
        file_path: batch[i].metadata.file_path
      });
    }
  }

  // Save any remaining records
  if (records.length > 0) {
    if (fullRegenerate && existingIds.size === 0) {
      await createTableWithData(records);
    } else {
      await addRecords(records);
    }
  }

  console.log('Embedding generation complete!');
}
