#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// D1 데이터베이스 동기화 스크립트
class D1SyncManager {
  private localDbPath = './dev.db'
  private d1DbName = 'mdshare-local'

  // 로컬 SQLite → D1 동기화
  async syncToD1() {
    console.log('🔄 Syncing local SQLite to D1...')
    
    try {
      // 1. 로컬 데이터베이스 덤프 생성
      const dumpFile = './temp-dump.sql'
      execSync(`sqlite3 ${this.localDbPath} .dump > ${dumpFile}`)
      
      // 2. D1에 덤프 적용
      execSync(`wrangler d1 execute ${this.d1DbName} --file=${dumpFile}`)
      
      // 3. 임시 파일 정리
      fs.unlinkSync(dumpFile)
      
      console.log('✅ Sync to D1 completed!')
    } catch (error) {
      console.error('❌ Sync to D1 failed:', error)
    }
  }

  // D1 → 로컬 SQLite 동기화
  async syncFromD1() {
    console.log('🔄 Syncing D1 to local SQLite...')
    
    try {
      // 1. D1 데이터베이스 덤프 생성
      const dumpFile = './temp-d1-dump.sql'
      execSync(`wrangler d1 export ${this.d1DbName} --output=${dumpFile}`)
      
      // 2. 로컬 SQLite에 적용
      execSync(`sqlite3 ${this.localDbPath} < ${dumpFile}`)
      
      // 3. 임시 파일 정리
      fs.unlinkSync(dumpFile)
      
      console.log('✅ Sync from D1 completed!')
    } catch (error) {
      console.error('❌ Sync from D1 failed:', error)
    }
  }

  // 개발 시작 시 자동 동기화
  async startDev() {
    console.log('🚀 Starting development with D1 sync...')
    
    // 로컬 DB가 없으면 D1에서 가져오기
    if (!fs.existsSync(this.localDbPath)) {
      await this.syncFromD1()
    }
    
    // Next.js 개발 서버 시작
    execSync('next dev -p 7778', { stdio: 'inherit' })
  }

  // 배포 전 동기화
  async preDeploy() {
    console.log('🚀 Pre-deploy sync...')
    await this.syncToD1()
  }
}

// CLI 인터페이스
const syncManager = new D1SyncManager()
const command = process.argv[2]

switch (command) {
  case 'to-d1':
    syncManager.syncToD1()
    break
  case 'from-d1':
    syncManager.syncFromD1()
    break
  case 'dev':
    syncManager.startDev()
    break
  case 'pre-deploy':
    syncManager.preDeploy()
    break
  default:
    console.log(`
Usage: node scripts/sync-db.js <command>

Commands:
  to-d1       Sync local SQLite to D1
  from-d1     Sync D1 to local SQLite
  dev         Start development with auto-sync
  pre-deploy  Sync to D1 before deployment
    `)
}
