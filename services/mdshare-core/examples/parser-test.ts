import { MarkdownParser } from '../dist/index.js';

async function parserTestExample() {
  console.log('🧪 Markdown Parser Test Example\n');

  const parser = new MarkdownParser();

  // Test markdown content with frontmatter
  const testMarkdown = `---
title: "Test Document"
description: "This is a test document"
author: "Test Author"
category: "testing"
tags: ["test", "example", "markdown"]
difficulty: "beginner"
createdAt: "2024-01-15T10:30:00Z"
updatedAt: "2024-01-15T10:30:00Z"
version: "1.0.0"
status: "published"
---

# Test Document

This is a **test document** with various markdown features.

## Features Tested

### Code Blocks
\`\`\`typescript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists
- Item 1
- Item 2
- Item 3

### Links
- [External Link](https://example.com)
- [Internal Link](./other-document.md)

### Images
![Test Image](https://via.placeholder.com/300x200)

### Tables
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data 1   | Data 2   |
| Row 2    | Data 3   | Data 4   |

### CSV Rendering
@csv[data/sample.csv]

### JSON Rendering
@json[data/config.json]

### Mermaid Diagram
\`\`\`mermaid
@mermaid[
graph TD
    A[Start] --> B[Process]
    B --> C[End]
]\`\`\`

## Conclusion

This document tests various markdown features.
`;

  try {
    console.log('📄 Parsing test markdown...');
    const result = await parser.parse(testMarkdown, {
      includeHtml: true,
      extractMetadata: true,
      processDiagrams: true,
      resolveLinks: true,
      basePath: '/test-project'
    });

    if (result.success && result.document) {
      console.log('✅ Parsing successful!\n');

      // Display frontmatter
      console.log('📋 Frontmatter:');
      console.log(JSON.stringify(result.document.frontmatter, null, 2));

      // Display metadata
      console.log('\n📊 Metadata:');
      console.log(`   Word count: ${result.document.metadata.wordCount}`);
      console.log(`   Reading time: ${result.document.metadata.readingTime} minutes`);
      console.log(`   Headings: ${result.document.metadata.headings.length}`);
      console.log(`   Links: ${result.document.metadata.links.length}`);
      console.log(`   Images: ${result.document.metadata.images.length}`);
      console.log(`   Code blocks: ${result.document.metadata.codeBlocks.length}`);
      console.log(`   Tables: ${result.document.metadata.tables.length}`);
      console.log(`   Diagrams: ${result.document.metadata.diagrams.length}`);

      // Display headings
      console.log('\n📑 Headings:');
      result.document.metadata.headings.forEach(heading => {
        console.log(`   ${'#'.repeat(heading.level)} ${heading.text} (${heading.id})`);
      });

      // Display links
      console.log('\n🔗 Links:');
      result.document.metadata.links.forEach(link => {
        console.log(`   [${link.text}](${link.url}) - ${link.type}`);
      });

      // Display images
      console.log('\n🖼️ Images:');
      result.document.metadata.images.forEach(image => {
        console.log(`   ![${image.alt}](${image.src})`);
      });

      // Display code blocks
      console.log('\n💻 Code blocks:');
      result.document.metadata.codeBlocks.forEach(block => {
        console.log(`   Language: ${block.language || 'plain'}, Lines: ${block.code.split('\n').length}`);
      });

      // Display tables
      console.log('\n📊 Tables:');
      result.document.metadata.tables.forEach(table => {
        console.log(`   Headers: ${table.headers.join(', ')}, Rows: ${table.rows.length}`);
      });

      // Display diagrams
      console.log('\n📈 Diagrams:');
      result.document.metadata.diagrams.forEach(diagram => {
        console.log(`   Type: ${diagram.type}, Content length: ${diagram.content.length}`);
      });

      // Display HTML (first 500 characters)
      console.log('\n🌐 HTML Preview (first 500 chars):');
      console.log(result.document.html.substring(0, 500) + '...');

    } else {
      console.error('❌ Parsing failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
if (require.main === module) {
  parserTestExample().catch(console.error);
}

export { parserTestExample };
