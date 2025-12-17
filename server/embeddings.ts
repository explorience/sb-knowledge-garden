import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import type { ContentChunk, VectorRecord } from './types';
import { createTableWithData, addRecords, getAllChunks, deleteChunksByIds } from './vector-store';

// Generate a short hash of content for change detection
function contentHash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex').slice(0, 8);
}

const EMBEDDING_MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 100;
const MAX_TOKENS_PER_BATCH = 8000;

// Patterns to ignore (matches Quartz config ignorePatterns)
const IGNORE_PATTERNS = ['private', 'templates', '.obsidian', '.github'];

// Lazy initialization of OpenAI client (only when API calls are needed)
let openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// Parse YAML frontmatter from markdown content
function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const frontmatter: Record<string, unknown> = {};

  // Simple YAML parsing for key: value pairs
  const lines = yaml.split('\n');
  for (const line of lines) {
    const keyValue = line.match(/^(\w+):\s*(.*)$/);
    if (keyValue) {
      const [, key, value] = keyValue;
      // Parse booleans
      if (value === 'true') frontmatter[key] = true;
      else if (value === 'false') frontmatter[key] = false;
      // Parse quoted strings
      else if (value.match(/^["'].*["']$/)) frontmatter[key] = value.slice(1, -1);
      else frontmatter[key] = value;
    }
  }

  return frontmatter;
}

// Check if a file should be indexed (respects Quartz publish filters)
function shouldIndex(content: string, relativePath: string): boolean {
  // Check ignore patterns
  const pathParts = relativePath.split('/');
  for (const part of pathParts) {
    if (IGNORE_PATTERNS.includes(part)) {
      return false;
    }
  }

  const frontmatter = parseFrontmatter(content);

  // Skip drafts (RemoveDrafts filter)
  if (frontmatter.draft === true) {
    return false;
  }

  // Require explicit publish (ExplicitPublish filter)
  // This is the critical security filter - only index content marked for publication
  // Handle both boolean true and string "true" (YAML parsing varies)
  if (frontmatter.publish !== true && frontmatter.publish !== 'true') {
    return false;
  }

  return true;
}

// Estimate tokens (conservative)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.5);
}

// Generate embeddings for a batch of texts
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await getOpenAI().embeddings.create({
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

        // SECURITY: Only index published content (respects Quartz ExplicitPublish filter)
        if (!shouldIndex(content, relativePath)) {
          continue;
        }

        // Extract title from frontmatter or filename
        const titleMatch = content.match(/^---\s*\n(?:.*\n)*?title:\s*["']?([^"'\n]+)["']?\s*\n/);
        const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');

        // Extract description from frontmatter for additional context
        const descMatch = content.match(/^---\s*\n(?:.*\n)*?description:\s*["']?([^"'\n]+)["']?\s*\n/);
        const description = descMatch ? descMatch[1] : '';

        // Extract parent folder name for context (e.g., "reimagining-power")
        const parentFolder = path.dirname(relativePath).split('/').pop() || '';

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
            // Create context-enriched text for better semantic search
            // This helps queries like "RPP partners" find content about specific case studies
            let contextPrefix = `Document: ${title}`;
            if (description) {
              contextPrefix += `\nDescription: ${description}`;
            }
            if (parentFolder && parentFolder !== 'content' && parentFolder !== 'artifacts') {
              contextPrefix += `\nProject: ${parentFolder.replace(/-/g, ' ')}`;
            }
            contextPrefix += `\nSection: ${sectionTitle}\n\n`;

            const textWithContext = contextPrefix + cleanText;

            // Include content hash in ID for change detection
            // Format: {filePath}-section-{index}-{hash}
            const hash = contentHash(textWithContext);

            chunks.push({
              id: `${relativePath}-section-${index}-${hash}`,
              text: textWithContext.slice(0, 8000), // Limit chunk size
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

// Extract base ID (without hash) from chunk ID for comparison
// Chunk ID format: {filePath}-section-{index}-{hash}
function getBaseId(chunkId: string): string {
  // Remove the last segment (the hash)
  const parts = chunkId.split('-');
  return parts.slice(0, -1).join('-');
}

// Main embedding generation function with proper sync support
export async function generateAllEmbeddings(
  contentDir: string,
  fullRegenerate: boolean = false
): Promise<void> {
  console.log('Parsing content files...');
  const currentChunks = parseContentFiles(contentDir);
  console.log(`Found ${currentChunks.length} chunks in content`);

  // Full regeneration: drop everything and rebuild
  if (fullRegenerate) {
    console.log('[FullRegen] Dropping existing database and rebuilding...');
    await processChunksInBatches(currentChunks, true);
    console.log('Full regeneration complete!');
    return;
  }

  // Incremental sync: detect additions, updates, and deletions
  console.log('[Sync] Performing incremental sync...');

  // Get existing chunks from database
  const existingChunks = await getAllChunks();
  console.log(`Found ${existingChunks.length} existing chunks in database`);

  // Build maps for comparison
  // Current content: baseId -> full chunk ID (with hash)
  const currentByBaseId = new Map<string, string>();
  const currentIdSet = new Set<string>();
  for (const chunk of currentChunks) {
    const baseId = getBaseId(chunk.id);
    currentByBaseId.set(baseId, chunk.id);
    currentIdSet.add(chunk.id);
  }

  // Existing DB: baseId -> full chunk ID, and file_path tracking
  const existingByBaseId = new Map<string, string>();
  const existingFilePaths = new Set<string>();
  for (const chunk of existingChunks) {
    const baseId = getBaseId(chunk.id);
    existingByBaseId.set(baseId, chunk.id);
    existingFilePaths.add(chunk.file_path);
  }

  // Find chunks to delete:
  // 1. Chunks whose base ID no longer exists (document deleted or unpublished)
  // 2. Chunks whose base ID exists but hash changed (content updated - old version)
  const chunksToDelete: string[] = [];

  for (const existingChunk of existingChunks) {
    const baseId = getBaseId(existingChunk.id);
    const currentId = currentByBaseId.get(baseId);

    if (!currentId) {
      // Base ID no longer exists - document deleted or unpublished
      chunksToDelete.push(existingChunk.id);
    } else if (currentId !== existingChunk.id) {
      // Base ID exists but hash changed - content was updated
      chunksToDelete.push(existingChunk.id);
    }
  }

  // Find chunks to add:
  // Chunks whose full ID (including hash) doesn't exist in DB
  const chunksToAdd = currentChunks.filter(chunk => {
    const baseId = getBaseId(chunk.id);
    const existingId = existingByBaseId.get(baseId);

    // Add if: no existing chunk with this base ID, OR existing chunk has different hash
    return !existingId || existingId !== chunk.id;
  });

  console.log(`[Sync] Changes detected:`);
  console.log(`  - Chunks to delete: ${chunksToDelete.length} (deleted/unpublished/updated)`);
  console.log(`  - Chunks to add: ${chunksToAdd.length} (new/updated)`);

  // Delete stale chunks
  if (chunksToDelete.length > 0) {
    console.log(`[Sync] Deleting ${chunksToDelete.length} stale chunks...`);
    await deleteChunksByIds(chunksToDelete);
  }

  // Add new/updated chunks
  if (chunksToAdd.length > 0) {
    console.log(`[Sync] Processing ${chunksToAdd.length} new/updated chunks...`);
    await processChunksInBatches(chunksToAdd, false);
  }

  if (chunksToDelete.length === 0 && chunksToAdd.length === 0) {
    console.log('[Sync] Database is already up to date!');
  }

  console.log('Incremental sync complete!');
}

// Helper function to process chunks in batches
async function processChunksInBatches(
  chunks: ContentChunk[],
  createNewTable: boolean
): Promise<void> {
  if (chunks.length === 0) return;

  const records: VectorRecord[] = [];
  let batch: ContentChunk[] = [];
  let batchTokens = 0;
  let tableCreated = false;

  for (const chunk of chunks) {
    const tokens = estimateTokens(chunk.text);

    if (batch.length >= BATCH_SIZE || batchTokens + tokens > MAX_TOKENS_PER_BATCH) {
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
          if (createNewTable && !tableCreated) {
            await createTableWithData(records);
            tableCreated = true;
            console.log(`[Save] Created table with ${records.length} initial records`);
          } else {
            await addRecords(records);
            console.log(`[Save] Added ${records.length} records to database`);
          }
          records.length = 0;
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
    if (createNewTable && !tableCreated) {
      await createTableWithData(records);
      console.log(`[Save] Created table with ${records.length} records`);
    } else {
      await addRecords(records);
      console.log(`[Save] Added final ${records.length} records to database`);
    }
  }
}
