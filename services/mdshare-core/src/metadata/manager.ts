import * as fs from 'fs';
import * as path from 'path';
import {
  ProjectConfig,
  ProjectIndex,
  DocumentStructure,
  AIIndex,
  TopicEntry,
  Relationship,
  Suggestion
} from '../types/index.js';

export class MetadataManager {
  private projectPath: string;
  private configPath: string;
  private indexPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
    this.configPath = path.join(projectPath, '.mdshare', 'config.json');
    this.indexPath = path.join(projectPath, '.mdshare', 'index.json');
  }

  /**
   * Load project configuration
   */
  async loadConfig(): Promise<ProjectConfig | null> {
    try {
      if (!fs.existsSync(this.configPath)) {
        return null;
      }

      const configContent = await fs.promises.readFile(this.configPath, 'utf-8');
      return JSON.parse(configContent);
    } catch (error) {
      console.error('Failed to load project config:', error);
      return null;
    }
  }

  /**
   * Save project configuration
   */
  async saveConfig(config: ProjectConfig): Promise<void> {
    try {
      // Ensure .mdshare directory exists
      const mdshareDir = path.dirname(this.configPath);
      await fs.promises.mkdir(mdshareDir, { recursive: true });

      const configContent = JSON.stringify(config, null, 2);
      await fs.promises.writeFile(this.configPath, configContent, 'utf-8');
    } catch (error) {
      console.error('Failed to save project config:', error);
      throw error;
    }
  }

  /**
   * Load project index
   */
  async loadIndex(): Promise<ProjectIndex | null> {
    try {
      if (!fs.existsSync(this.indexPath)) {
        return null;
      }

      const indexContent = await fs.promises.readFile(this.indexPath, 'utf-8');
      return JSON.parse(indexContent);
    } catch (error) {
      console.error('Failed to load project index:', error);
      return null;
    }
  }

  /**
   * Save project index
   */
  async saveIndex(index: ProjectIndex): Promise<void> {
    try {
      // Ensure .mdshare directory exists
      const mdshareDir = path.dirname(this.indexPath);
      await fs.promises.mkdir(mdshareDir, { recursive: true });

      const indexContent = JSON.stringify(index, null, 2);
      await fs.promises.writeFile(this.indexPath, indexContent, 'utf-8');
    } catch (error) {
      console.error('Failed to save project index:', error);
      throw error;
    }
  }

  /**
   * Create default project configuration
   */
  createDefaultConfig(projectName: string, author: string): ProjectConfig {
    const now = new Date().toISOString();
    
    return {
      project: {
        name: projectName,
        version: '1.0.0',
        description: `${projectName} 프로젝트`,
        author,
        license: 'MIT',
        language: 'ko',
        createdAt: now,
        updatedAt: now,
        type: 'documentation',
        criticality: 'medium'
      },
      settings: {
        theme: 'default',
        navigation: 'sidebar',
        searchEnabled: true,
        aiFeaturesEnabled: true,
        autoIndexingEnabled: true,
        chatbotEnabled: true,
        allowDownload: true,
        allowComments: false
      },
      ai: {
        autoTagging: true,
        autoCategorization: true,
        relationshipAnalysis: true,
        contentSuggestions: true,
        embeddingModel: 'text-embedding-3-small',
        chatModel: 'gpt-4o-mini'
      },
      access: {
        visibility: 'private',
        inviteCode: undefined,
        allowedDomains: [],
        passwordProtected: false
      },
      deployment: {
        method: 'manual',
        customDomain: undefined,
        autoDeploy: false
      }
    };
  }

  /**
   * Initialize project metadata
   */
  async initializeProject(projectName: string, author: string): Promise<ProjectConfig> {
    const config = this.createDefaultConfig(projectName, author);
    await this.saveConfig(config);

    // Create initial index
    const index: ProjectIndex = {
      projectId: this.generateProjectId(projectName),
      lastIndexed: new Date().toISOString(),
      documentCount: 0,
      totalWords: 0,
      structure: [],
      statistics: {
        wordCount: {},
        categoryCount: {},
        tagCount: {},
        authorCount: {}
      }
    };

    await this.saveIndex(index);

    return config;
  }

  /**
   * Update project index with document information
   */
  async updateIndex(documentPath: string, documentInfo: DocumentStructure): Promise<void> {
    const index = await this.loadIndex();
    if (!index) {
      throw new Error('Project index not found. Please initialize the project first.');
    }

    // Remove existing entry if it exists
    index.structure = index.structure.filter(doc => doc.path !== documentPath);

    // Add new entry
    index.structure.push(documentInfo);

    // Update statistics
    index.documentCount = index.structure.length;
    index.totalWords = index.structure.reduce((total, doc) => total + doc.wordCount, 0);
    index.lastIndexed = new Date().toISOString();

    // Update category and tag counts
    this.updateStatistics(index, documentInfo);

    await this.saveIndex(index);
  }

  /**
   * Update statistics in project index
   */
  private updateStatistics(index: ProjectIndex, documentInfo: DocumentStructure): void {
    // Update category count
    if (documentInfo.category) {
      index.statistics.categoryCount[documentInfo.category] = 
        (index.statistics.categoryCount[documentInfo.category] || 0) + 1;
    }

    // Update tag counts
    documentInfo.tags.forEach(tag => {
      index.statistics.tagCount[tag] = (index.statistics.tagCount[tag] || 0) + 1;
    });

    // Update author count
    if (documentInfo.author) {
      index.statistics.authorCount[documentInfo.author] = 
        (index.statistics.authorCount[documentInfo.author] || 0) + 1;
    }

    // Update word count
    index.statistics.wordCount[documentInfo.path] = documentInfo.wordCount;
  }

  /**
   * Load AI index
   */
  async loadAIIndex(indexType: 'by-topic' | 'by-date' | 'by-relationship'): Promise<AIIndex | null> {
    try {
      const aiIndexPath = path.join(this.projectPath, '.mdshare', 'ai-indexes', `${indexType}.json`);
      
      if (!fs.existsSync(aiIndexPath)) {
        return null;
      }

      const indexContent = await fs.promises.readFile(aiIndexPath, 'utf-8');
      return JSON.parse(indexContent);
    } catch (error) {
      console.error(`Failed to load AI index (${indexType}):`, error);
      return null;
    }
  }

  /**
   * Save AI index
   */
  async saveAIIndex(indexType: 'by-topic' | 'by-date' | 'by-relationship', index: AIIndex): Promise<void> {
    try {
      const aiIndexDir = path.join(this.projectPath, '.mdshare', 'ai-indexes');
      await fs.promises.mkdir(aiIndexDir, { recursive: true });

      const aiIndexPath = path.join(aiIndexDir, `${indexType}.json`);
      const indexContent = JSON.stringify(index, null, 2);
      await fs.promises.writeFile(aiIndexPath, indexContent, 'utf-8');
    } catch (error) {
      console.error(`Failed to save AI index (${indexType}):`, error);
      throw error;
    }
  }

  /**
   * Create AI index from document analysis
   */
  createAIIndex(
    topics: Record<string, TopicEntry[]>,
    relationships: Relationship[],
    suggestions: Suggestion[]
  ): AIIndex {
    return {
      topics,
      relationships,
      suggestions,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Generate project ID from project name
   */
  private generateProjectId(projectName: string): string {
    return projectName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Get all markdown files in project
   */
  async getAllMarkdownFiles(): Promise<string[]> {
    const files: string[] = [];

    const scanDirectory = async (dir: string): Promise<void> => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Skip hidden directories and node_modules
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await scanDirectory(fullPath);
          }
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    };

    await scanDirectory(this.projectPath);
    return files;
  }

  /**
   * Get relative path from project root
   */
  getRelativePath(filePath: string): string {
    return path.relative(this.projectPath, filePath);
  }

  /**
   * Check if project is initialized
   */
  async isInitialized(): Promise<boolean> {
    return fs.existsSync(this.configPath) && fs.existsSync(this.indexPath);
  }

  /**
   * Get project statistics
   */
  async getProjectStatistics(): Promise<{
    documentCount: number;
    totalWords: number;
    categories: string[];
    tags: string[];
    authors: string[];
    lastIndexed: string;
  }> {
    const index = await this.loadIndex();
    if (!index) {
      return {
        documentCount: 0,
        totalWords: 0,
        categories: [],
        tags: [],
        authors: [],
        lastIndexed: ''
      };
    }

    return {
      documentCount: index.documentCount,
      totalWords: index.totalWords,
      categories: Object.keys(index.statistics.categoryCount),
      tags: Object.keys(index.statistics.tagCount),
      authors: Object.keys(index.statistics.authorCount),
      lastIndexed: index.lastIndexed
    };
  }
}
