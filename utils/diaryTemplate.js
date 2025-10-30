import AsyncStorage from "@react-native-async-storage/async-storage";

// Template padrão para entradas do diário
export const createDiaryEntryTemplate = (customData = {}) => {
  return {
    id: customData.id || `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: customData.date || new Date().toISOString(),
    title: customData.title || "",
    content: customData.content || "",
    emotion: customData.emotion || "",
    ...customData
  };
};

// Função para salvar nova entrada no AsyncStorage
export const saveDiaryEntry = async (userEmail, entryData) => {
  try {
    const newEntry = createDiaryEntryTemplate(entryData);
    const savedEntries = await AsyncStorage.getItem(`diary_entries_${userEmail}`);
    let entries = savedEntries ? JSON.parse(savedEntries) : [];
    
    // Adiciona a nova entrada no início (mais recente primeiro)
    entries.unshift(newEntry);
    
    await AsyncStorage.setItem(`diary_entries_${userEmail}`, JSON.stringify(entries));
    
    return { success: true, entry: newEntry };
  } catch (error) {
    console.error('Erro ao salvar entrada do diário:', error);
    return { success: false, error };
  }
};

// Função para carregar entradas do diário
export const loadDiaryEntries = async (userEmail) => {
  try {
    const savedEntries = await AsyncStorage.getItem(`diary_entries_${userEmail}`);
    
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      // Ordena por data mais recente primeiro
      return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao carregar entradas do diário:', error);
    return [];
  }
};

// Função para deletar uma entrada
export const deleteDiaryEntry = async (userEmail, entryId) => {
  try {
    const savedEntries = await AsyncStorage.getItem(`diary_entries_${userEmail}`);
    
    if (savedEntries) {
      let entries = JSON.parse(savedEntries);
      entries = entries.filter(entry => entry.id !== entryId);
      
      await AsyncStorage.setItem(`diary_entries_${userEmail}`, JSON.stringify(entries));
      return { success: true };
    }
    
    return { success: false, error: 'Nenhuma entrada encontrada' };
  } catch (error) {
    console.error('Erro ao deletar entrada do diário:', error);
    return { success: false, error };
  }
};

// Lista de emoções disponíveis
export const availableEmotions = [
  'feliz',
  'triste', 
  'ansioso',
  'calmo',
  'irritado',
  'esperançoso',
  'nostálgico',
  'energético',
  'reflexivo',
  'grato',
  'preocupado',
  'animado'
];