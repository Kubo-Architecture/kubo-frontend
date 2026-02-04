import React, { useState, useEffect, useMemo } from 'react';
import { formatBrazilianArea, parseBrazilianArea, sanitizeAreaInput } from '../../utils/areaFormat';

interface GeneralSectionProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleUsageTypeToggle: (type: string) => void;
  mainImagePreview: string | null;
  galleryPreviews: string[];
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeMainImage: () => void;
  removeGalleryImage: (index: number) => void;
  handleMaterialChange: (index: number, value: string) => void;
  addMaterialField: () => void;
  removeMaterialField: (index: number) => void;
  showCustomUsageType: boolean;
  usageTypeOptions: string[];
  locationSuggestions: string[];
  showLocationSuggestions: boolean;
  setShowLocationSuggestions: (show: boolean) => void;
  handleLocationSelect: (suggestion: string) => void;
}

// Base de dados completa de cidades brasileiras
const BRAZILIAN_LOCATIONS = [
  // Capitais
  { name: 'São Paulo', state: 'SP', aliases: ['sp', 'sampa'], population: 12000000, isCapital: true },
  { name: 'Rio de Janeiro', state: 'RJ', aliases: ['rio', 'rj'], population: 6700000, isCapital: true },
  { name: 'Brasília', state: 'DF', aliases: ['bsb', 'df'], population: 3000000, isCapital: true },
  { name: 'Salvador', state: 'BA', aliases: ['ssa', 'bahia'], population: 2900000, isCapital: true },
  { name: 'Fortaleza', state: 'CE', aliases: ['for', 'ce'], population: 2700000, isCapital: true },
  { name: 'Belo Horizonte', state: 'MG', aliases: ['bh', 'mg'], population: 2500000, isCapital: true },
  { name: 'Manaus', state: 'AM', aliases: ['mao', 'am'], population: 2200000, isCapital: true },
  { name: 'Curitiba', state: 'PR', aliases: ['cwb', 'pr'], population: 1900000, isCapital: true },
  { name: 'Recife', state: 'PE', aliases: ['rec', 'pe'], population: 1650000, isCapital: true },
  { name: 'Goiânia', state: 'GO', aliases: ['gyn', 'go'], population: 1500000, isCapital: true },
  { name: 'Porto Alegre', state: 'RS', aliases: ['poa', 'rs'], population: 1480000, isCapital: true },
  { name: 'Belém', state: 'PA', aliases: ['bel', 'pa'], population: 1500000, isCapital: true },
  { name: 'Manaus', state: 'AM', aliases: ['mao'], population: 2200000, isCapital: true },
  { name: 'São Luís', state: 'MA', aliases: ['slz', 'ma'], population: 1100000, isCapital: true },
  { name: 'Maceió', state: 'AL', aliases: ['mcz', 'al'], population: 1000000, isCapital: true },
  { name: 'Campo Grande', state: 'MS', aliases: ['cgr', 'ms'], population: 900000, isCapital: true },
  { name: 'Teresina', state: 'PI', aliases: ['the', 'pi'], population: 850000, isCapital: true },
  { name: 'João Pessoa', state: 'PB', aliases: ['jpa', 'pb'], population: 800000, isCapital: true },
  { name: 'Natal', state: 'RN', aliases: ['nat', 'rn'], population: 880000, isCapital: true },
  { name: 'Aracaju', state: 'SE', aliases: ['aju', 'se'], population: 650000, isCapital: true },
  { name: 'Cuiabá', state: 'MT', aliases: ['cg', 'mt'], population: 600000, isCapital: true },
  { name: 'Florianópolis', state: 'SC', aliases: ['fln', 'floripa', 'sc'], population: 500000, isCapital: true },
  { name: 'Vitória', state: 'ES', aliases: ['vix', 'es'], population: 360000, isCapital: true },
  { name: 'Porto Velho', state: 'RO', aliases: ['pvh', 'ro'], population: 530000, isCapital: true },
  { name: 'Macapá', state: 'AP', aliases: ['mcp', 'ap'], population: 500000, isCapital: true },
  { name: 'Rio Branco', state: 'AC', aliases: ['rbr', 'ac'], population: 410000, isCapital: true },
  { name: 'Boa Vista', state: 'RR', aliases: ['bvb', 'rr'], population: 420000, isCapital: true },
  { name: 'Palmas', state: 'TO', aliases: ['pms', 'to'], population: 310000, isCapital: true },
  
  // Grandes cidades SP
  { name: 'Guarulhos', state: 'SP', aliases: ['gru'], population: 1400000, isCapital: false },
  { name: 'Campinas', state: 'SP', aliases: ['vcp'], population: 1200000, isCapital: false },
  { name: 'São Bernardo do Campo', state: 'SP', aliases: ['sbc'], population: 840000, isCapital: false },
  { name: 'Santo André', state: 'SP', aliases: [], population: 720000, isCapital: false },
  { name: 'Osasco', state: 'SP', aliases: [], population: 700000, isCapital: false },
  { name: 'São José dos Campos', state: 'SP', aliases: ['sjc', 'sjcampos'], population: 730000, isCapital: false },
  { name: 'Ribeirão Preto', state: 'SP', aliases: ['rp'], population: 700000, isCapital: false },
  { name: 'Sorocaba', state: 'SP', aliases: [], population: 680000, isCapital: false },
  { name: 'Santos', state: 'SP', aliases: [], population: 430000, isCapital: false },
  { name: 'Mauá', state: 'SP', aliases: [], population: 470000, isCapital: false },
  { name: 'São José do Rio Preto', state: 'SP', aliases: ['sjrp'], population: 460000, isCapital: false },
  { name: 'Diadema', state: 'SP', aliases: [], population: 420000, isCapital: false },
  { name: 'Carapicuíba', state: 'SP', aliases: [], population: 400000, isCapital: false },
  { name: 'Piracicaba', state: 'SP', aliases: [], population: 400000, isCapital: false },
  { name: 'Bauru', state: 'SP', aliases: [], population: 380000, isCapital: false },
  { name: 'Itaquaquecetuba', state: 'SP', aliases: [], population: 360000, isCapital: false },
  { name: 'São Vicente', state: 'SP', aliases: [], population: 360000, isCapital: false },
  { name: 'Franca', state: 'SP', aliases: [], population: 350000, isCapital: false },
  { name: 'Guarujá', state: 'SP', aliases: [], population: 320000, isCapital: false },
  { name: 'Taubaté', state: 'SP', aliases: [], population: 310000, isCapital: false },
  { name: 'Limeira', state: 'SP', aliases: [], population: 300000, isCapital: false },
  { name: 'Suzano', state: 'SP', aliases: [], population: 290000, isCapital: false },
  { name: 'Taboão da Serra', state: 'SP', aliases: [], population: 280000, isCapital: false },
  { name: 'Sumaré', state: 'SP', aliases: [], population: 280000, isCapital: false },
  { name: 'Jundiaí', state: 'SP', aliases: [], population: 420000, isCapital: false },
  { name: 'Embu das Artes', state: 'SP', aliases: ['embu'], population: 270000, isCapital: false },
  { name: 'Presidente Prudente', state: 'SP', aliases: ['pp'], population: 230000, isCapital: false },
  { name: 'Araraquara', state: 'SP', aliases: [], population: 240000, isCapital: false },
  { name: 'Americana', state: 'SP', aliases: [], population: 240000, isCapital: false },
  { name: 'Indaiatuba', state: 'SP', aliases: [], population: 250000, isCapital: false },
  
  // Grandes cidades RJ
  { name: 'São Gonçalo', state: 'RJ', aliases: ['sg'], population: 1080000, isCapital: false },
  { name: 'Duque de Caxias', state: 'RJ', aliases: ['dc'], population: 920000, isCapital: false },
  { name: 'Nova Iguaçu', state: 'RJ', aliases: ['ni'], population: 820000, isCapital: false },
  { name: 'Niterói', state: 'RJ', aliases: [], population: 510000, isCapital: false },
  { name: 'Belford Roxo', state: 'RJ', aliases: [], population: 510000, isCapital: false },
  { name: 'Campos dos Goytacazes', state: 'RJ', aliases: ['campos'], population: 510000, isCapital: false },
  { name: 'São João de Meriti', state: 'RJ', aliases: ['sjm'], population: 460000, isCapital: false },
  { name: 'Petrópolis', state: 'RJ', aliases: [], population: 310000, isCapital: false },
  { name: 'Volta Redonda', state: 'RJ', aliases: ['vr'], population: 270000, isCapital: false },
  { name: 'Magé', state: 'RJ', aliases: [], population: 240000, isCapital: false },
  { name: 'Macaé', state: 'RJ', aliases: [], population: 260000, isCapital: false },
  { name: 'Cabo Frio', state: 'RJ', aliases: [], population: 220000, isCapital: false },
  
  // Grandes cidades MG
  { name: 'Uberlândia', state: 'MG', aliases: ['udi'], population: 700000, isCapital: false },
  { name: 'Contagem', state: 'MG', aliases: [], population: 660000, isCapital: false },
  { name: 'Juiz de Fora', state: 'MG', aliases: ['jf'], population: 570000, isCapital: false },
  { name: 'Betim', state: 'MG', aliases: [], population: 440000, isCapital: false },
  { name: 'Montes Claros', state: 'MG', aliases: ['moc'], population: 410000, isCapital: false },
  { name: 'Ribeirão das Neves', state: 'MG', aliases: [], population: 330000, isCapital: false },
  { name: 'Uberaba', state: 'MG', aliases: [], population: 330000, isCapital: false },
  { name: 'Governador Valadares', state: 'MG', aliases: ['gv'], population: 280000, isCapital: false },
  { name: 'Ipatinga', state: 'MG', aliases: [], population: 260000, isCapital: false },
  { name: 'Sete Lagoas', state: 'MG', aliases: [], population: 240000, isCapital: false },
  
  // Grandes cidades BA
  { name: 'Feira de Santana', state: 'BA', aliases: ['fsa'], population: 620000, isCapital: false },
  { name: 'Vitória da Conquista', state: 'BA', aliases: ['vc'], population: 340000, isCapital: false },
  { name: 'Camaçari', state: 'BA', aliases: [], population: 300000, isCapital: false },
  { name: 'Itabuna', state: 'BA', aliases: [], population: 220000, isCapital: false },
  { name: 'Juazeiro', state: 'BA', aliases: [], population: 220000, isCapital: false },
  { name: 'Lauro de Freitas', state: 'BA', aliases: [], population: 200000, isCapital: false },
  
  // Grandes cidades PE
  { name: 'Jaboatão dos Guararapes', state: 'PE', aliases: ['jaboatao'], population: 700000, isCapital: false },
  { name: 'Olinda', state: 'PE', aliases: [], population: 390000, isCapital: false },
  { name: 'Paulista', state: 'PE', aliases: [], population: 330000, isCapital: false },
  { name: 'Caruaru', state: 'PE', aliases: [], population: 360000, isCapital: false },
  { name: 'Petrolina', state: 'PE', aliases: [], population: 350000, isCapital: false },
  
  // Grandes cidades CE
  { name: 'Caucaia', state: 'CE', aliases: [], population: 360000, isCapital: false },
  { name: 'Juazeiro do Norte', state: 'CE', aliases: ['juazeiro'], population: 280000, isCapital: false },
  { name: 'Maracanaú', state: 'CE', aliases: [], population: 230000, isCapital: false },
  { name: 'Sobral', state: 'CE', aliases: [], population: 210000, isCapital: false },
  
  // Grandes cidades PA
  { name: 'Ananindeua', state: 'PA', aliases: [], population: 530000, isCapital: false },
  { name: 'Santarém', state: 'PA', aliases: [], population: 310000, isCapital: false },
  { name: 'Marabá', state: 'PA', aliases: [], population: 280000, isCapital: false },
  { name: 'Castanhal', state: 'PA', aliases: [], population: 200000, isCapital: false },
  
  // Grandes cidades MA
  { name: 'Imperatriz', state: 'MA', aliases: [], population: 260000, isCapital: false },
  { name: 'São José de Ribamar', state: 'MA', aliases: ['sjr'], population: 180000, isCapital: false },
  { name: 'Caxias', state: 'MA', aliases: [], population: 170000, isCapital: false },
  
  // Grandes cidades PR
  { name: 'Londrina', state: 'PR', aliases: [], population: 580000, isCapital: false },
  { name: 'Maringá', state: 'PR', aliases: [], population: 430000, isCapital: false },
  { name: 'Ponta Grossa', state: 'PR', aliases: ['pg'], population: 350000, isCapital: false },
  { name: 'Cascavel', state: 'PR', aliases: [], population: 330000, isCapital: false },
  { name: 'São José dos Pinhais', state: 'PR', aliases: ['sjp'], population: 320000, isCapital: false },
  { name: 'Foz do Iguaçu', state: 'PR', aliases: ['foz'], population: 260000, isCapital: false },
  { name: 'Colombo', state: 'PR', aliases: [], population: 240000, isCapital: false },
  { name: 'Guarapuava', state: 'PR', aliases: [], population: 180000, isCapital: false },
  
  // Grandes cidades SC
  { name: 'Joinville', state: 'SC', aliases: [], population: 590000, isCapital: false },
  { name: 'Blumenau', state: 'SC', aliases: [], population: 360000, isCapital: false },
  { name: 'São José', state: 'SC', aliases: ['sj'], population: 250000, isCapital: false },
  { name: 'Criciúma', state: 'SC', aliases: [], population: 220000, isCapital: false },
  { name: 'Chapecó', state: 'SC', aliases: [], population: 220000, isCapital: false },
  { name: 'Itajaí', state: 'SC', aliases: [], population: 220000, isCapital: false },
  { name: 'Jaraguá do Sul', state: 'SC', aliases: [], population: 180000, isCapital: false },
  
  // Grandes cidades RS
  { name: 'Caxias do Sul', state: 'RS', aliases: ['caxias'], population: 520000, isCapital: false },
  { name: 'Pelotas', state: 'RS', aliases: [], population: 340000, isCapital: false },
  { name: 'Canoas', state: 'RS', aliases: [], population: 340000, isCapital: false },
  { name: 'Santa Maria', state: 'RS', aliases: ['sm'], population: 280000, isCapital: false },
  { name: 'Gravataí', state: 'RS', aliases: [], population: 280000, isCapital: false },
  { name: 'Viamão', state: 'RS', aliases: [], population: 250000, isCapital: false },
  { name: 'Novo Hamburgo', state: 'RS', aliases: ['nh'], population: 250000, isCapital: false },
  { name: 'São Leopoldo', state: 'RS', aliases: [], population: 240000, isCapital: false },
  { name: 'Alvorada', state: 'RS', aliases: [], population: 210000, isCapital: false },
  { name: 'Passo Fundo', state: 'RS', aliases: ['pf'], population: 200000, isCapital: false },
  
  // Grandes cidades GO
  { name: 'Aparecida de Goiânia', state: 'GO', aliases: ['aparecida'], population: 580000, isCapital: false },
  { name: 'Anápolis', state: 'GO', aliases: [], population: 390000, isCapital: false },
  { name: 'Rio Verde', state: 'GO', aliases: ['rv'], population: 230000, isCapital: false },
  { name: 'Luziânia', state: 'GO', aliases: [], population: 210000, isCapital: false },
  
  // Grandes cidades ES
  { name: 'Vila Velha', state: 'ES', aliases: ['vv'], population: 500000, isCapital: false },
  { name: 'Serra', state: 'ES', aliases: [], population: 520000, isCapital: false },
  { name: 'Cariacica', state: 'ES', aliases: [], population: 380000, isCapital: false },
  { name: 'Cachoeiro de Itapemirim', state: 'ES', aliases: ['cachoeiro'], population: 210000, isCapital: false },
  { name: 'Linhares', state: 'ES', aliases: [], population: 170000, isCapital: false },
  
  // Grandes cidades AM
  { name: 'Parintins', state: 'AM', aliases: [], population: 110000, isCapital: false },
  { name: 'Itacoatiara', state: 'AM', aliases: [], population: 100000, isCapital: false },
  
  // Grandes cidades MT
  { name: 'Várzea Grande', state: 'MT', aliases: ['vg'], population: 290000, isCapital: false },
  { name: 'Rondonópolis', state: 'MT', aliases: [], population: 230000, isCapital: false },
  { name: 'Sinop', state: 'MT', aliases: [], population: 140000, isCapital: false },
  
  // Grandes cidades MS
  { name: 'Dourados', state: 'MS', aliases: [], population: 220000, isCapital: false },
  { name: 'Três Lagoas', state: 'MS', aliases: ['3lagoas'], population: 130000, isCapital: false },
  { name: 'Corumbá', state: 'MS', aliases: [], population: 110000, isCapital: false },
];

export default function GeneralSection({
  formData,
  handleChange,
  handleUsageTypeToggle,
  mainImagePreview,
  galleryPreviews,
  handlePhotoChange,
  handleGalleryChange,
  removeMainImage,
  removeGalleryImage,
  handleMaterialChange,
  addMaterialField,
  removeMaterialField,
  showCustomUsageType,
  usageTypeOptions,
  locationSuggestions,
  showLocationSuggestions,
  setShowLocationSuggestions,
  handleLocationSelect,
}: GeneralSectionProps) {
  const nameCharCount = formData.name.length;
  const descCharCount = formData.description.length;
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);

  // Função para normalizar strings (remove acentos e converte para minúsculas)
  const normalizeString = (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  // Calcula a similaridade entre duas strings usando Levenshtein Distance
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  // Sistema de pontuação avançado
  const calculateMatchScore = (location: typeof BRAZILIAN_LOCATIONS[0], searchTerm: string) => {
    const normalizedSearch = normalizeString(searchTerm);
    const normalizedName = normalizeString(location.name);
    const normalizedState = normalizeString(location.state);
    const fullText = `${normalizedName} ${normalizedState}`;
    
    let score = 0;
    const searchWords = normalizedSearch.split(/\s+/);
    const nameWords = normalizedName.split(/\s+/);

    // 1. Correspondência exata com cidade (100 pontos)
    if (normalizedName === normalizedSearch) {
      score = 100;
    }
    // 2. Correspondência exata com alias (95 pontos)
    else if (location.aliases.some(alias => normalizeString(alias) === normalizedSearch)) {
      score = 95;
    }
    // 3. Nome começa com o termo (90 pontos)
    else if (normalizedName.startsWith(normalizedSearch)) {
      score = 90;
    }
    // 4. Alias começa com o termo (85 pontos)
    else if (location.aliases.some(alias => normalizeString(alias).startsWith(normalizedSearch))) {
      score = 85;
    }
    // 5. Qualquer palavra do nome começa com o termo (80 pontos)
    else if (nameWords.some(word => word.startsWith(normalizedSearch))) {
      score = 80;
    }
    // 6. Correspondência com estado (75 pontos)
    else if (normalizedState === normalizedSearch) {
      score = 75;
    }
    // 7. Busca por múltiplas palavras (70 pontos)
    else if (searchWords.length > 1 && searchWords.every(word => fullText.includes(word))) {
      score = 70;
    }
    // 8. Contém o termo no nome (65 pontos)
    else if (normalizedName.includes(normalizedSearch)) {
      score = 65;
    }
    // 9. Contém o termo em alias (60 pontos)
    else if (location.aliases.some(alias => normalizeString(alias).includes(normalizedSearch))) {
      score = 60;
    }
    // 10. Busca fuzzy com Levenshtein (50-55 pontos baseado na distância)
    else {
      const distance = levenshteinDistance(normalizedSearch, normalizedName);
      const maxLength = Math.max(normalizedSearch.length, normalizedName.length);
      const similarity = 1 - (distance / maxLength);
      
      if (similarity > 0.6) {
        score = Math.floor(50 + (similarity * 10));
      }
      // Verifica fuzzy em aliases também
      else {
        for (const alias of location.aliases) {
          const aliasDistance = levenshteinDistance(normalizedSearch, normalizeString(alias));
          const aliasMaxLength = Math.max(normalizedSearch.length, alias.length);
          const aliasSimilarity = 1 - (aliasDistance / aliasMaxLength);
          
          if (aliasSimilarity > 0.6) {
            score = Math.max(score, Math.floor(48 + (aliasSimilarity * 10)));
          }
        }
      }
    }

    // Bônus: Capital (+5 pontos)
    if (location.isCapital && score > 0) {
      score += 5;
    }

    // Bônus: População grande (+3 pontos para cidades com > 1M habitantes)
    if (location.population > 1000000 && score > 0) {
      score += 3;
    }

    // Penalidade: Se busca tem 3+ caracteres e match é muito curto
    if (searchTerm.length >= 3 && normalizedName.length <= 3 && score < 70) {
      score = Math.floor(score * 0.8);
    }

    return score;
  };

  // Sistema de pesquisa inteligente com cache
  const getFilteredLocationSuggestions = useMemo(() => {
    return () => {
      const searchTerm = formData.location.trim();
      
      // Se não há termo de busca, não mostra sugestões
      if (!searchTerm) {
        return [];
      }

      // Usa locationSuggestions se disponível, senão usa BRAZILIAN_LOCATIONS
      let results: Array<{ location: string; score: number; population: number; isCapital: boolean }> = [];

      if (locationSuggestions.length > 0) {
        // Usa sugestões externas mas com pontuação
        results = locationSuggestions.map(suggestion => ({
          location: suggestion,
          score: (() => {
            const normalized = normalizeString(suggestion);
            const normalizedSearch = normalizeString(searchTerm);
            
            if (normalized === normalizedSearch) return 100;
            if (normalized.startsWith(normalizedSearch)) return 90;
            if (normalized.includes(normalizedSearch)) return 70;
            
            const distance = levenshteinDistance(normalizedSearch, normalized);
            const similarity = 1 - (distance / Math.max(normalizedSearch.length, normalized.length));
            return similarity > 0.6 ? Math.floor(50 + similarity * 20) : 0;
          })(),
          population: 0,
          isCapital: false,
        }));
      } else {
        // Usa base de dados local
        results = BRAZILIAN_LOCATIONS
          .map(location => ({
            location: `${location.name}, ${location.state}`,
            score: calculateMatchScore(location, searchTerm),
            population: location.population,
            isCapital: location.isCapital,
          }));
      }

      return results
        .filter(item => item.score > 0)
        .sort((a, b) => {
          // Primeiro ordena por pontuação
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          // Se pontuação igual, capitais primeiro
          if (a.isCapital !== b.isCapital) {
            return a.isCapital ? -1 : 1;
          }
          // Se ambas capitais ou não, ordena por população
          if (b.population !== a.population) {
            return b.population - a.population;
          }
          // Por último, ordem alfabética
          return a.location.localeCompare(b.location, 'pt-BR');
        })
        .slice(0, 8)
        .map(item => item.location);
    };
  }, [formData.location, locationSuggestions]);

  const filteredLocationSuggestions = getFilteredLocationSuggestions();

  // Destaca o termo pesquisado na sugestão com lógica melhorada
  const highlightMatch = (suggestion: string, searchTerm: string): JSX.Element => {
    if (!searchTerm.trim()) {
      return <>{suggestion}</>;
    }

    const normalizedSuggestion = normalizeString(suggestion);
    const normalizedSearch = normalizeString(searchTerm);
    
    // Tenta encontrar match direto
    let matchIndex = normalizedSuggestion.indexOf(normalizedSearch);
    
    if (matchIndex !== -1) {
      const beforeMatch = suggestion.substring(0, matchIndex);
      const match = suggestion.substring(matchIndex, matchIndex + searchTerm.length);
      const afterMatch = suggestion.substring(matchIndex + searchTerm.length);

      return (
        <>
          {beforeMatch}
          <span className="font-semibold text-zinc-900 dark:text-white bg-yellow-200 dark:bg-yellow-500/30 px-0.5 rounded">
            {match}
          </span>
          {afterMatch}
        </>
      );
    }

    // Se não encontrou match direto, tenta por palavras
    const words = suggestion.split(/(\s+|,\s*)/);
    let highlighted = false;
    
    return (
      <>
        {words.map((word, i) => {
          const normalizedWord = normalizeString(word);
          if (!highlighted && normalizedWord && normalizedWord.startsWith(normalizedSearch)) {
            highlighted = true;
            return (
              <span key={i}>
                <span className="font-semibold text-zinc-900 dark:text-white bg-yellow-200 dark:bg-yellow-500/30 px-0.5 rounded">
                  {word.substring(0, searchTerm.length)}
                </span>
                {word.substring(searchTerm.length)}
              </span>
            );
          }
          return <span key={i}>{word}</span>;
        })}
      </>
    );
  };

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showLocationSuggestions || filteredLocationSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredLocationSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredLocationSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleLocationSelect(filteredLocationSuggestions[selectedSuggestionIndex]);
          setSelectedSuggestionIndex(-1);
        }
        break;
      case 'Escape':
        setShowLocationSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Reset do índice quando as sugestões mudam
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [filteredLocationSuggestions.length]);

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">Novo Projeto</h1>
          <p className="text-sm text-zinc-500 dark:text-neutral-400 mb-4">Configure seu projeto</p>
          
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 mt-6">
            Informações Básicas
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Dados principais do projeto</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Nome do Projeto - máximo 70 caracteres */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Nome do projeto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Casa Moderna em São Paulo"
                value={formData.name}
                onChange={handleChange}
                maxLength={70}
                required
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
              />
              <div className="mt-1 text-xs text-right">
                <span className={`${nameCharCount > 70 ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-neutral-400'}`}>
                  {nameCharCount}/70
                </span>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="location" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Localização
                <span className="ml-2 text-xs text-zinc-400 dark:text-neutral-500">
                  (Use ↑↓ para navegar, Enter para selecionar)
                </span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <i className="fa-solid fa-location-dot text-zinc-400 dark:text-neutral-500 text-sm"></i>
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Digite cidade ou estado..."
                  value={formData.location}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowLocationSuggestions(false);
                      setSelectedSuggestionIndex(-1);
                    }, 200);
                  }}
                  autoComplete="off"
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
                />
                {formData.location && (
                  <button
                    type="button"
                    onClick={() => {
                      handleChange({
                        target: { name: 'location', value: '' }
                      } as any);
                      setSelectedSuggestionIndex(-1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    <i className="fa-solid fa-times text-sm"></i>
                  </button>
                )}
              </div>
              
              {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#151B23] border border-zinc-300 dark:border-[#3d444d] rounded-xl shadow-xl max-h-72 overflow-y-auto">
                  <div className="py-1">
                    {filteredLocationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          handleLocationSelect(suggestion);
                          setSelectedSuggestionIndex(-1);
                        }}
                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-3 group ${
                          selectedSuggestionIndex === index
                            ? 'bg-zinc-100 dark:bg-[#202830]'
                            : 'hover:bg-zinc-50 dark:hover:bg-[#202830]/50'
                        }`}
                      >
                        <i className={`fa-solid fa-location-dot flex-shrink-0 transition-colors ${
                          selectedSuggestionIndex === index
                            ? 'text-zinc-600 dark:text-neutral-300'
                            : 'text-zinc-400 dark:text-neutral-500'
                        }`}></i>
                        <span className={`flex-1 ${
                          selectedSuggestionIndex === index
                            ? 'text-zinc-900 dark:text-white'
                            : 'text-zinc-700 dark:text-neutral-300'
                        }`}>
                          {highlightMatch(suggestion, formData.location)}
                        </span>
                        {selectedSuggestionIndex === index && (
                          <i className="fa-solid fa-arrow-turn-down-left text-xs text-zinc-400 dark:text-neutral-500 rotate-90"></i>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {showLocationSuggestions && formData.location && filteredLocationSuggestions.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#151B23] border border-zinc-300 dark:border-[#3d444d] rounded-xl shadow-lg px-4 py-3">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-neutral-400 text-sm">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Nenhuma localização encontrada para "{formData.location}"</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Descrição - obrigatória, máximo 1000 caracteres */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Descrição *
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Descreva os conceitos, inspirações e características principais..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              required
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm resize-none text-zinc-900 dark:text-white"
            />
            <div className="mt-1 text-xs text-right">
              <span className={`${descCharCount > 1000 ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-neutral-400'}`}>
                {descCharCount}/1000
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Autor da obra (Realização)
            </label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="Nome do arquiteto ou escritório"
              value={formData.author}
              onChange={handleChange}
              disabled={formData.isAuthor}
              className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm disabled:bg-zinc-50 dark:disabled:bg-[#151B23] disabled:text-zinc-500 dark:disabled:text-neutral-500 text-zinc-900 dark:text-white"
            />
            <label htmlFor="isAuthor" className="flex items-center mt-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isAuthor"
                  name="isAuthor"
                  checked={formData.isAuthor}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                  formData.isAuthor
                    ? 'bg-black dark:bg-white border-black dark:border-white'
                    : 'bg-white dark:bg-[#202830] border-zinc-300 dark:border-[#3d444d] group-hover:border-black dark:group-hover:border-white'
                }`}>
                  {formData.isAuthor && (
                    <i className="fas fa-check text-white dark:text-black text-xs"></i>
                  )}
                </div>
              </div>
              <span className="ml-2 text-sm text-zinc-600 dark:text-neutral-400">Eu sou o autor</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Data de início
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Data de término
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.isOngoing}
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm disabled:bg-zinc-50 dark:disabled:bg-[#151B23] disabled:text-zinc-500 dark:disabled:text-neutral-500 text-zinc-900 dark:text-white"
              />
              <label htmlFor="isOngoing" className="flex items-center mt-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="isOngoing"
                    name="isOngoing"
                    checked={formData.isOngoing}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                    formData.isOngoing
                      ? 'bg-black dark:bg-white border-black dark:border-white'
                      : 'bg-white dark:bg-[#202830] border-zinc-300 dark:border-[#3d444d] group-hover:border-black dark:group-hover:border-white'
                  }`}>
                    {formData.isOngoing && (
                      <i className="fas fa-check text-white dark:text-black text-xs"></i>
                    )}
                  </div>
                </div>
                <span className="ml-2 text-sm text-zinc-600 dark:text-neutral-400">Projeto ainda em andamento</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Fotos */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Fotos e Mídia
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Imagens do projeto</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Foto Principal */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Foto Principal *
            </label>
            <input
              type="file"
              id="mainPhotoGeral"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              required
            />
            <label
              htmlFor="mainPhotoGeral"
              className="relative block h-48 w-full cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-[#3d444d] bg-zinc-50 dark:bg-[#202830] hover:bg-zinc-100 dark:hover:bg-[#151B23] transition overflow-hidden"
            >
              {mainImagePreview ? (
                <div className="relative w-full h-full group">
                  <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeMainImage();
                      }}
                      className="bg-white text-zinc-900 px-3 py-2 rounded-lg font-medium text-xs hover:bg-zinc-100 cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fa-solid fa-camera text-3xl text-zinc-400 dark:text-neutral-500 mb-2"></i>
                  <span className="text-xs text-zinc-600 dark:text-neutral-400">Clique para adicionar</span>
                </div>
              )}
            </label>
          </div>

          {/* Galeria */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
              Galeria
            </label>
            <input
              type="file"
              id="galleryGeral"
              multiple
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGalleryChange}
            />
            <label
              htmlFor="galleryGeral"
              className="relative block h-48 w-full cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 dark:border-[#3d444d] bg-zinc-50 dark:bg-[#202830] hover:bg-zinc-100 dark:hover:bg-[#151B23] transition"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <i className="fa-solid fa-images text-3xl text-zinc-400 dark:text-neutral-500 mb-2"></i>
                <span className="text-xs text-zinc-600 dark:text-neutral-400">
                  {galleryPreviews.length > 0 ? `${galleryPreviews.length} imagens` : 'Adicionar imagens'}
                </span>
              </div>
            </label>
          </div>
        </div>

        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-6 gap-2">
            {galleryPreviews.map((img, i) => (
              <div key={i} className="relative group aspect-square">
                <img src={img} alt={`${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 flex items-center justify-center cursor-pointer"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Especificações Técnicas */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Especificações Técnicas
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Detalhes técnicos</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-3">
              Tipo de uso * <span className="text-xs text-zinc-500 dark:text-neutral-400">(Até 3)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {usageTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleUsageTypeToggle(type)}
                  disabled={!formData.usage_types.includes(type) && formData.usage_types.length >= 3}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-2 cursor-pointer ${
                    formData.usage_types.includes(type)
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                      : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400 dark:bg-[#202830] dark:text-neutral-300 dark:border-[#3d444d]'
                  } ${
                    !formData.usage_types.includes(type) && formData.usage_types.length >= 3
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {showCustomUsageType && (
            <div>
              <label htmlFor="custom_usage_type_geral" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Especifique "Outro" *
              </label>
              <input
                type="text"
                id="custom_usage_type_geral"
                name="custom_usage_type"
                placeholder="Digite o tipo personalizado"
                value={formData.custom_usage_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              >
                <option value="">Selecione</option>
                <option value="Em planejamento">Em planejamento</option>
                <option value="Em construção">Em construção</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>

            <div>
              <label htmlFor="build_area" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Área construída (m²)
              </label>
              <input
                type="text"
                inputMode="decimal"
                id="build_area"
                name="build_area"
                value={formData.build_area}
                onChange={(e) => {
                  const v = sanitizeAreaInput(e.target.value);
                  handleChange({ ...e, target: { ...e.target, value: v } });
                }}
                onBlur={(e) => {
                  const n = parseBrazilianArea(e.target.value);
                  if (!isNaN(n) && n >= 0) {
                    handleChange({ ...e, target: { ...e.target, value: formatBrazilianArea(n) } });
                  }
                }}
                placeholder="Ex.: 28.800"
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="terrain_area" className="block text-sm font-medium text-zinc-700 dark:text-neutral-300 mb-2">
                Área do terreno (m²)
              </label>
              <input
                type="text"
                inputMode="decimal"
                id="terrain_area"
                name="terrain_area"
                value={formData.terrain_area}
                onChange={(e) => {
                  const v = sanitizeAreaInput(e.target.value);
                  handleChange({ ...e, target: { ...e.target, value: v } });
                }}
                onBlur={(e) => {
                  const n = parseBrazilianArea(e.target.value);
                  if (!isNaN(n) && n >= 0) {
                    handleChange({ ...e, target: { ...e.target, value: formatBrazilianArea(n) } });
                  }
                }}
                placeholder="Ex.: 28.800"
                className="w-full px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Materiais */}
      <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Materiais Utilizados
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-400">Lista de materiais</p>
        </div>

        <div className="space-y-3">
          {formData.materials.map((material: string, index: number) => (
            <div key={index} className="flex gap-3 items-center group">
              <input
                type="text"
                value={material}
                onChange={(e) => handleMaterialChange(index, e.target.value)}
                placeholder={`Material ${index + 1}`}
                className="flex-1 px-4 py-3 bg-white dark:bg-[#202830] border border-zinc-300 dark:border-[#3d444d] rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm text-zinc-900 dark:text-white"
              />
              {formData.materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMaterialField(index)}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addMaterialField}
            className="text-sm text-zinc-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-medium flex items-center cursor-pointer"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Adicionar material
          </button>
        </div>
      </div>
    </div>
  );
}