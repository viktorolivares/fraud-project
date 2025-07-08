import { useState, useEffect } from 'react';
import { getAllBots } from '@/api/bot.api';
import type { Bot } from '@/types/bot.d';

export function useBots() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoading(true);
        setError(null);
        const botsData = await getAllBots();
        setBots(botsData);
      } catch (err) {
        console.error('Error fetching bots:', err);
        setError('Error al cargar los bots');
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  const getBotName = (botId: number): string => {
    const bot = bots.find(b => b.id === botId);
    return bot?.name || `Bot ${botId}`;
  };

  const getBotDescription = (botId: number): string => {
    const bot = bots.find(b => b.id === botId);
    return bot?.description || '';
  };

  return {
    bots,
    loading,
    error,
    getBotName,
    getBotDescription
  };
}
