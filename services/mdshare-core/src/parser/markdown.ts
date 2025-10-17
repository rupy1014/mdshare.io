import { marked, MarkedOptions } from 'marked';
import matter from 'gray-matter';
import {
  ParsedDocument,
  Frontmatter,
  DocumentMetadata,
  Heading,
  Link,
  Image,
  CodeBlock,
  Table,
  Diagram,
  ParseOptions,
  ParseResult
} from '../types/index.js';

export class MarkdownParser {
  private markedOptions: MarkedOptions;

  constructor() {
    this.markedOptions = {
      gfm: true,
      breaks: true
    };

    // Configure marked
    marked.setOptions(this.markedOptions);
  }

  /**
   * Parse a markdown document with frontmatter
   */
  async parse(
    content: string,
    options: ParseOptions = {}
  ): Promise<ParseResult> {
    try {
      const warnings: string[] = [];

      // Parse frontmatter
      const { data: frontmatter, content: markdownContent } = matter(content);

      // Parse markdown to HTML
      let html = '';
      if (options.includeHtml !== false) {
        html = await this.parseMarkdownToHtml(markdownContent, options);
      }

      // Extract metadata
      let metadata: DocumentMetadata | undefined;
      if (options.extractMetadata !== false) {
        metadata = this.extractMetadata(markdownContent, html);
      }

      const document: ParsedDocument = {
        frontmatter: this.normalizeFrontmatter(frontmatter),
        content: markdownContent,
        html,
        metadata: metadata!,
        raw: content
      };

      return {
        success: true,
        document,
        warnings
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Parse markdown content to HTML with extended syntax support
   */
  private async parseMarkdownToHtml(
    content: string,
    options: ParseOptions
  ): Promise<string> {
    let processedContent = content;

    // Process extended syntax
    if (options.processDiagrams !== false) {
      processedContent = this.processDiagrams(processedContent);
    }

    // Process CSV rendering
    processedContent = this.processCsvRendering(processedContent, options.basePath);

    // Process JSON rendering
    processedContent = this.processJsonRendering(processedContent, options.basePath);

    // Process internal links
    if (options.resolveLinks !== false && options.basePath) {
      processedContent = this.processInternalLinks(processedContent, options.basePath);
    }

    // Parse with marked
    const html = await marked.parse(processedContent);

    return html;
  }

  /**
   * Process diagram syntax (@mermaid, @plantuml, @sequence)
   */
  private processDiagrams(content: string): string {
    // Process @mermaid blocks
    content = content.replace(
      /```mermaid\s*@mermaid\[([^\]]+)\]\s*```/g,
      (match, diagramContent) => {
        return `<div class="mermaid-diagram" data-type="mermaid">\n${diagramContent}\n</div>`;
      }
    );

    // Process @plantuml blocks
    content = content.replace(
      /```plantuml\s*@plantuml\[([^\]]+)\]\s*```/g,
      (match, diagramContent) => {
        return `<div class="plantuml-diagram" data-type="plantuml">\n${diagramContent}\n</div>`;
      }
    );

    // Process @sequence blocks
    content = content.replace(
      /```sequence\s*@sequence\[([^\]]+)\]\s*```/g,
      (match, diagramContent) => {
        return `<div class="sequence-diagram" data-type="sequence">\n${diagramContent}\n</div>`;
      }
    );

    return content;
  }

  /**
   * Process CSV rendering syntax (@csv[path])
   */
  private processCsvRendering(content: string, basePath?: string): string {
    return content.replace(/@csv\[([^\]]+)\]/g, (match, csvPath) => {
      const fullPath = basePath ? `${basePath}/${csvPath}` : csvPath;
      return `<div class="csv-renderer" data-path="${fullPath}">Loading CSV: ${csvPath}</div>`;
    });
  }

  /**
   * Process JSON rendering syntax (@json[path])
   */
  private processJsonRendering(content: string, basePath?: string): string {
    return content.replace(/@json\[([^\]]+)\]/g, (match, jsonPath) => {
      const fullPath = basePath ? `${basePath}/${jsonPath}` : jsonPath;
      return `<div class="json-renderer" data-path="${fullPath}">Loading JSON: ${jsonPath}</div>`;
    });
  }

  /**
   * Process internal links (convert relative paths)
   */
  private processInternalLinks(content: string, basePath: string): string {
    return content.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, text, url) => {
        // Skip external links
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
          return match;
        }

        // Convert relative links
        if (url.startsWith('./') || url.startsWith('../') || !url.startsWith('/')) {
          const resolvedPath = this.resolvePath(basePath, url);
          return `[${text}](${resolvedPath})`;
        }

        return match;
      }
    );
  }

  /**
   * Resolve relative path
   */
  private resolvePath(basePath: string, relativePath: string): string {
    const baseParts = basePath.split('/').filter(part => part !== '');
    const relativeParts = relativePath.split('/').filter(part => part !== '');

    for (const part of relativeParts) {
      if (part === '..') {
        baseParts.pop();
      } else if (part !== '.') {
        baseParts.push(part);
      }
    }

    return '/' + baseParts.join('/');
  }

  /**
   * Extract metadata from markdown content
   */
  private extractMetadata(content: string, html: string): DocumentMetadata {
    const headings = this.extractHeadings(content);
    const links = this.extractLinks(content);
    const images = this.extractImages(content);
    const codeBlocks = this.extractCodeBlocks(content);
    const tables = this.extractTables(content);
    const diagrams = this.extractDiagrams(content);

    const wordCount = this.countWords(content);
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    return {
      wordCount,
      readingTime,
      headings,
      links,
      images,
      codeBlocks,
      tables,
      diagrams
    };
  }

  /**
   * Extract headings from markdown content
   */
  private extractHeadings(content: string): Heading[] {
    const headings: Heading[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = this.generateHeadingId(text);

        headings.push({
          level,
          text,
          id,
          line: index + 1
        });
      }
    });

    return headings;
  }

  /**
   * Extract links from markdown content
   */
  private extractLinks(content: string): Link[] {
    const links: Link[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        const text = match[1];
        const url = match[2];
        const type = this.getLinkType(url);

        links.push({
          text,
          url,
          type,
          line: index + 1
        });
      }
    });

    return links;
  }

  /**
   * Extract images from markdown content
   */
  private extractImages(content: string): Image[] {
    const images: Image[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)(?:\s*"([^"]*)")?/g;
      let match;

      while ((match = imageRegex.exec(line)) !== null) {
        const alt = match[1] || '';
        const src = match[2];
        const title = match[3];

        images.push({
          alt,
          src,
          title,
          line: index + 1
        });
      }
    });

    return images;
  }

  /**
   * Extract code blocks from markdown content
   */
  private extractCodeBlocks(content: string): CodeBlock[] {
    const codeBlocks: CodeBlock[] = [];
    const lines = content.split('\n');
    let inCodeBlock = false;
    let currentLanguage = '';
    let currentCode: string[] = [];
    let startLine = 0;

    lines.forEach((line, index) => {
      const codeBlockMatch = line.match(/^```(\w+)?$/);
      
      if (codeBlockMatch) {
        if (inCodeBlock) {
          // End of code block
          codeBlocks.push({
            language: currentLanguage || undefined,
            code: currentCode.join('\n'),
            line: startLine + 1
          });
          inCodeBlock = false;
          currentLanguage = '';
          currentCode = [];
        } else {
          // Start of code block
          inCodeBlock = true;
          currentLanguage = codeBlockMatch[1] || '';
          startLine = index;
        }
      } else if (inCodeBlock) {
        currentCode.push(line);
      }
    });

    return codeBlocks;
  }

  /**
   * Extract tables from markdown content
   */
  private extractTables(content: string): Table[] {
    const tables: Table[] = [];
    const lines = content.split('\n');
    let currentTable: string[] = [];
    let startLine = 0;

    lines.forEach((line, index) => {
      if (line.includes('|')) {
        if (currentTable.length === 0) {
          startLine = index;
        }
        currentTable.push(line);
      } else if (currentTable.length > 0) {
        // End of table
        const table = this.parseTable(currentTable);
        if (table) {
          tables.push({
            ...table,
            line: startLine + 1
          });
        }
        currentTable = [];
      }
    });

    // Handle table at end of content
    if (currentTable.length > 0) {
      const table = this.parseTable(currentTable);
      if (table) {
        tables.push({
          ...table,
          line: startLine + 1
        });
      }
    }

    return tables;
  }

  /**
   * Parse table from markdown lines
   */
  private parseTable(lines: string[]): { headers: string[]; rows: string[][] } | null {
    if (lines.length < 2) return null;

    const headers = lines[0]
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '');

    // Skip separator line
    const dataLines = lines.slice(2);

    const rows = dataLines.map(line =>
      line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '')
    );

    return { headers, rows };
  }

  /**
   * Extract diagrams from markdown content
   */
  private extractDiagrams(content: string): Diagram[] {
    const diagrams: Diagram[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Mermaid diagrams
      const mermaidMatch = line.match(/```mermaid\s*@mermaid\[([^\]]+)\]\s*```/);
      if (mermaidMatch) {
        diagrams.push({
          type: 'mermaid',
          content: mermaidMatch[1],
          line: index + 1
        });
      }

      // PlantUML diagrams
      const plantumlMatch = line.match(/```plantuml\s*@plantuml\[([^\]]+)\]\s*```/);
      if (plantumlMatch) {
        diagrams.push({
          type: 'plantuml',
          content: plantumlMatch[1],
          line: index + 1
        });
      }

      // Sequence diagrams
      const sequenceMatch = line.match(/```sequence\s*@sequence\[([^\]]+)\]\s*```/);
      if (sequenceMatch) {
        diagrams.push({
          type: 'sequence',
          content: sequenceMatch[1],
          line: index + 1
        });
      }
    });

    return diagrams;
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    return content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]+`/g, '') // Remove inline code
      .replace(/#{1,6}\s+/g, '') // Remove heading markers
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .split(' ')
      .filter(word => word.length > 0).length;
  }

  /**
   * Generate heading ID
   */
  private generateHeadingId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Get link type (internal or external)
   */
  private getLinkType(url: string): 'internal' | 'external' {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
      return 'external';
    }
    return 'internal';
  }

  /**
   * Normalize frontmatter data
   */
  private normalizeFrontmatter(data: any): Frontmatter {
    return {
      title: data.title || '',
      description: data.description || '',
      author: data.author || '',
      category: data.category || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      difficulty: data.difficulty || 'beginner',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      version: data.version || '1.0.0',
      status: data.status || 'published',
      criticality: data.criticality || 'medium',
      dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
      usedBy: Array.isArray(data.usedBy) ? data.usedBy : [],
      ...data
    };
  }
}
