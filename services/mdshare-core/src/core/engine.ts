import * as fs from 'fs';
import * as path from 'path';
import { MarkdownParser } from '../parser/markdown.js';
import { MetadataManager } from '../metadata/manager.js';
import {
  ParsedDocument,
  ProjectConfig,
  DocumentStructure,
  ParseOptions,
  ParseResult
} from '../types/index.js';

export class MDShareEngine {
  private parser: MarkdownParser;
  private metadataManager: MetadataManager;
  private projectPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
    this.parser = new MarkdownParser();
    this.metadataManager = new MetadataManager(projectPath);
  }

  /**
   * Initialize a new MDShare project
   */
  async initializeProject(projectName: string, author: string): Promise<ProjectConfig> {
    console.log(`🚀 Initializing MDShare project: ${projectName}`);

    // Create basic directory structure
    await this.createProjectStructure();

    // Initialize metadata
    const config = await this.metadataManager.initializeProject(projectName, author);

    // Create initial README.md
    await this.createInitialReadme(projectName, author);

    console.log(`✅ Project initialized successfully!`);
    console.log(`📁 Project path: ${this.projectPath}`);
    console.log(`⚙️  Config file: ${path.join(this.projectPath, '.mdshare', 'config.json')}`);

    return config;
  }

  /**
   * Parse a single markdown file
   */
  async parseFile(
    filePath: string,
    options: ParseOptions = {}
  ): Promise<ParseResult> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const result = await this.parser.parse(content, {
        ...options,
        basePath: this.projectPath
      });

      if (result.success && result.document) {
        // Update project index
        const relativePath = this.metadataManager.getRelativePath(filePath);
        const documentInfo: DocumentStructure = {
          path: relativePath,
          title: result.document.frontmatter.title || path.basename(filePath, '.md'),
          type: 'markdown',
          tags: result.document.frontmatter.tags || [],
          category: result.document.frontmatter.category,
          author: result.document.frontmatter.author,
          createdAt: result.document.frontmatter.createdAt,
          updatedAt: result.document.frontmatter.updatedAt,
          wordCount: result.document.metadata.wordCount,
          readingTime: result.document.metadata.readingTime
        };

        await this.metadataManager.updateIndex(relativePath, documentInfo);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Parse all markdown files in the project
   */
  async parseAllFiles(options: ParseOptions = {}): Promise<{
    success: number;
    failed: number;
    results: ParseResult[];
  }> {
    console.log('📚 Parsing all markdown files...');

    const files = await this.metadataManager.getAllMarkdownFiles();
    const results: ParseResult[] = [];
    let success = 0;
    let failed = 0;

    for (const file of files) {
      console.log(`  📄 Processing: ${this.metadataManager.getRelativePath(file)}`);
      
      const result = await this.parseFile(file, options);
      results.push(result);

      if (result.success) {
        success++;
      } else {
        failed++;
        console.error(`  ❌ Failed to parse: ${result.error}`);
      }
    }

    console.log(`✅ Parsing completed: ${success} success, ${failed} failed`);

    return { success, failed, results };
  }

  /**
   * Get project configuration
   */
  async getConfig(): Promise<ProjectConfig | null> {
    return await this.metadataManager.loadConfig();
  }

  /**
   * Update project configuration
   */
  async updateConfig(config: ProjectConfig): Promise<void> {
    await this.metadataManager.saveConfig(config);
  }

  /**
   * Get project statistics
   */
  async getStatistics(): Promise<{
    documentCount: number;
    totalWords: number;
    categories: string[];
    tags: string[];
    authors: string[];
    lastIndexed: string;
  }> {
    return await this.metadataManager.getProjectStatistics();
  }

  /**
   * Create project directory structure
   */
  private async createProjectStructure(): Promise<void> {
    const directories = [
      '.mdshare',
      '.mdshare/ai-indexes',
      'docs',
      'docs/getting-started',
      'docs/api',
      'docs/examples',
      'data',
      'data/samples',
      'assets',
      'assets/images',
      'assets/diagrams',
      '_meta'
    ];

    for (const dir of directories) {
      const dirPath = path.join(this.projectPath, dir);
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Create initial README.md
   */
  private async createInitialReadme(projectName: string, author: string): Promise<void> {
    const readmePath = path.join(this.projectPath, 'README.md');
    
    if (fs.existsSync(readmePath)) {
      return; // Don't overwrite existing README
    }

    const readmeContent = `---
title: "${projectName}"
description: "${projectName} 프로젝트"
author: "${author}"
category: "overview"
tags: ["documentation", "getting-started"]
difficulty: "beginner"
createdAt: "${new Date().toISOString()}"
updatedAt: "${new Date().toISOString()}"
version: "1.0.0"
status: "published"
---

# ${projectName}

${projectName} 프로젝트에 오신 것을 환영합니다!

## 📋 프로젝트 개요

이 프로젝트는 MDShare를 사용하여 구축되었습니다.

## 🚀 빠른 시작

1. [설치 가이드](docs/getting-started/installation.md) - 프로젝트 설치 방법
2. [기본 사용법](docs/getting-started/basic-usage.md) - 사용 방법 학습
3. [API 문서](docs/api/overview.md) - API 사용법

## 📚 문서 구조

### Getting Started
- [설치 가이드](docs/getting-started/installation.md)
- [기본 사용법](docs/getting-started/basic-usage.md)

### API Reference
- [API 개요](docs/api/overview.md)

### Examples
- [예제 모음](docs/examples/)

## 🤖 AI 기능

이 프로젝트는 다음 AI 기능을 지원합니다:

- **자동 인덱싱**: 문서 구조 자동 분석 및 인덱스 생성
- **자동 태깅**: 문서 내용 기반 태그 자동 추출
- **관계 분석**: 문서 간 연관성 자동 파악
- **AI 챗봇**: 문서 기반 질문 답변 시스템

## 📞 지원 및 문의

- **문서**: [MDShare 문서](https://docs.mdshare.app)
- **이슈**: [GitHub Issues](https://github.com/mdshare/mdshare/issues)
- **커뮤니티**: [Discord](https://discord.gg/mdshare)

---

**참고**: 이 문서는 MDShare CLI로 자동 생성되었습니다. 필요에 따라 수정하세요.
`;

    await fs.promises.writeFile(readmePath, readmeContent, 'utf-8');
  }

  /**
   * Check if project is initialized
   */
  async isInitialized(): Promise<boolean> {
    return await this.metadataManager.isInitialized();
  }

  /**
   * Get all parsed documents
   */
  async getAllDocuments(): Promise<ParsedDocument[]> {
    const files = await this.metadataManager.getAllMarkdownFiles();
    const documents: ParsedDocument[] = [];

    for (const file of files) {
      const result = await this.parseFile(file);
      if (result.success && result.document) {
        documents.push(result.document);
      }
    }

    return documents;
  }

  /**
   * Search documents by query
   */
  async searchDocuments(query: string): Promise<ParsedDocument[]> {
    const documents = await this.getAllDocuments();
    
    // Simple text search (can be enhanced with AI later)
    const searchResults = documents.filter(doc => {
      const searchText = `${doc.frontmatter.title} ${doc.frontmatter.description} ${doc.content}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    return searchResults;
  }

  /**
   * Get documents by category
   */
  async getDocumentsByCategory(category: string): Promise<ParsedDocument[]> {
    const documents = await this.getAllDocuments();
    return documents.filter(doc => doc.frontmatter.category === category);
  }

  /**
   * Get documents by tag
   */
  async getDocumentsByTag(tag: string): Promise<ParsedDocument[]> {
    const documents = await this.getAllDocuments();
    return documents.filter(doc => 
      doc.frontmatter.tags && doc.frontmatter.tags.includes(tag)
    );
  }

  /**
   * Get documents by author
   */
  async getDocumentsByAuthor(author: string): Promise<ParsedDocument[]> {
    const documents = await this.getAllDocuments();
    return documents.filter(doc => doc.frontmatter.author === author);
  }
}
