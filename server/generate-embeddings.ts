import 'dotenv/config';
import { generateAllEmbeddings } from './embeddings';

const CONTENT_DIR = './content'; // Adjust to your content directory

async function main() {
  const fullRegenerate = process.argv.includes('--full');

  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log(`Mode: ${fullRegenerate ? 'Full regeneration' : 'Incremental update'}`);
  console.log(`Content directory: ${CONTENT_DIR}`);

  await generateAllEmbeddings(CONTENT_DIR, fullRegenerate);
}

main().catch(console.error);
