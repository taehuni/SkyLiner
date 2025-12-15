// DeepL 번역 서비스
const deepl = require('deepl-node');
require('dotenv').config();

class Translator {
  constructor() {
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
      console.warn('⚠️  DEEPL_API_KEY가 설정되지 않았습니다. 번역 기능이 비활성화됩니다.');
      this.translator = null;
      return;
    }

    // DeepL 무료 API는 :fx로 끝남
    const isFreeAccount = apiKey.endsWith(':fx');
    this.translator = new deepl.Translator(apiKey);

    console.log(`✅ DeepL 번역기 초기화 완료 (${isFreeAccount ? '무료' : '유료'} 계정)`);

    // 번역 캐시 (같은 텍스트 반복 번역 방지)
    this.cache = new Map();
  }

  /**
   * 텍스트를 한국어로 번역
   * @param {string} text - 번역할 텍스트
   * @param {string} sourceLang - 원본 언어 ('JA' 또는 'EN')
   * @returns {Promise<string>} 번역된 텍스트
   */
  async toKorean(text, sourceLang = 'JA') {
    // 번역기가 없으면 원본 반환
    if (!this.translator) {
      return text;
    }

    // 빈 텍스트는 그대로 반환
    if (!text || text.trim() === '') {
      return text;
    }

    // 캐시 확인
    const cacheKey = `${sourceLang}:${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // DeepL API 호출
      const result = await this.translator.translateText(
        text,
        sourceLang.toLowerCase(),
        'ko'
      );

      const translated = result.text;

      // 캐시 저장 (메모리 관리를 위해 최대 1000개만 유지)
      if (this.cache.size >= 1000) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(cacheKey, translated);

      return translated;

    } catch (error) {
      console.error(`번역 실패 (${sourceLang} → KO): ${text}`);
      console.error(`  에러: ${error.message}`);

      // 에러 발생 시 원본 반환
      return text;
    }
  }

  /**
   * 일본어를 한국어로 번역
   */
  async japaneseToKorean(text) {
    return this.toKorean(text, 'JA');
  }

  /**
   * 영어를 한국어로 번역
   */
  async englishToKorean(text) {
    return this.toKorean(text, 'EN');
  }

  /**
   * 일본어 또는 영어를 자동 감지하여 한국어로 번역
   */
  async autoTranslate(text) {
    if (!text || text.trim() === '') {
      return text;
    }

    // 한글이 포함되어 있으면 번역 안 함
    if (/[가-힣]/.test(text)) {
      return text;
    }

    // 일본어 문자(히라가나, 가타카나, 한자) 포함 여부 확인
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);

    if (hasJapanese) {
      return this.japaneseToKorean(text);
    } else {
      // 영어로 간주
      return this.englishToKorean(text);
    }
  }

  /**
   * 여러 텍스트를 한번에 번역 (배치 처리)
   * @param {string[]} texts - 번역할 텍스트 배열
   * @param {string} sourceLang - 원본 언어
   * @returns {Promise<string[]>} 번역된 텍스트 배열
   */
  async translateBatch(texts, sourceLang = 'JA') {
    if (!this.translator || !texts || texts.length === 0) {
      return texts;
    }

    try {
      // 비어있지 않은 텍스트만 필터링
      const validTexts = texts.filter(t => t && t.trim() !== '');

      if (validTexts.length === 0) {
        return texts;
      }

      // DeepL은 배치 번역 지원
      const results = await this.translator.translateText(
        validTexts,
        sourceLang.toLowerCase(),
        'ko'
      );

      // 결과 매핑
      const translations = Array.isArray(results)
        ? results.map(r => r.text)
        : [results.text];

      // 원본 배열 순서 유지하며 번역 결과 반환
      let translationIndex = 0;
      return texts.map(text => {
        if (!text || text.trim() === '') {
          return text;
        }
        return translations[translationIndex++];
      });

    } catch (error) {
      console.error('배치 번역 실패:', error.message);
      return texts; // 실패 시 원본 반환
    }
  }

  /**
   * API 사용량 확인
   */
  async getUsage() {
    if (!this.translator) {
      return null;
    }

    try {
      const usage = await this.translator.getUsage();

      if (usage.character) {
        const used = usage.character.count;
        const limit = usage.character.limit;
        const percentage = ((used / limit) * 100).toFixed(2);

        return {
          used,
          limit,
          percentage,
          remaining: limit - used
        };
      }

      return null;
    } catch (error) {
      console.error('사용량 확인 실패:', error.message);
      return null;
    }
  }

  /**
   * 캐시 초기화
   */
  clearCache() {
    this.cache.clear();
    console.log('✅ 번역 캐시 초기화 완료');
  }
}

// 싱글톤 인스턴스
const translator = new Translator();

module.exports = translator;
