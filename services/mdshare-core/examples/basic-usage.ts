import { MDShareEngine } from '../dist/index.js';
import * as path from 'path';

async function basicUsageExample() {
  console.log('🚀 MDShare Core Basic Usage Example\n');

  // 1. Create a new project
  const projectPath = path.join(process.cwd(), 'test-project');
  const engine = new MDShareEngine(projectPath);

  try {
    // 2. Initialize project
    console.log('📁 Initializing project...');
    const config = await engine.initializeProject('Test Project', 'Test Author');
    console.log('✅ Project initialized with config:', config.project.name);

    // 3. Parse all files
    console.log('\n📚 Parsing all files...');
    const parseResults = await engine.parseAllFiles();
    console.log(`✅ Parsed ${parseResults.success} files successfully`);

    // 4. Get project statistics
    console.log('\n📊 Project statistics:');
    const stats = await engine.getStatistics();
    console.log(`   Documents: ${stats.documentCount}`);
    console.log(`   Total words: ${stats.totalWords}`);
    console.log(`   Categories: ${stats.categories.join(', ')}`);
    console.log(`   Tags: ${stats.tags.join(', ')}`);
    console.log(`   Authors: ${stats.authors.join(', ')}`);

    // 5. Search documents
    console.log('\n🔍 Searching documents...');
    const searchResults = await engine.searchDocuments('프로젝트');
    console.log(`Found ${searchResults.length} documents matching "프로젝트"`);

    // 6. Get documents by category
    console.log('\n📂 Getting documents by category...');
    const categoryDocs = await engine.getDocumentsByCategory('overview');
    console.log(`Found ${categoryDocs.length} documents in "overview" category`);

    console.log('\n🎉 Example completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the example
if (require.main === module) {
  basicUsageExample().catch(console.error);
}

export { basicUsageExample };
