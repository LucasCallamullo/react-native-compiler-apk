import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import apiClient from '../../../shared/api/client';

const CountrySelector = () => {
  const [query, setQuery] = useState('argentina');
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // GET https://api.restcountries.com/countries/v5/names.common?q=...&response_fields=...
      const response = await apiClient.get('/names.common', {
        params: {
          q: query.trim(),
          response_fields: 'names.common,population,flag.url_png,area.kilometers',
        },
      });

      const objects = response.data?.data?.objects || [];
      const item = objects[0];

      if (item) {
        setCountry({
          name: item.names?.common || 'Desconocido',
          population: item.population ? item.population.toLocaleString() : 'N/A',
          area: item.area?.kilometers ? item.area.kilometers.toLocaleString() : 'N/A',
          flagUrl: item.flag?.url_png || null,
        });
      } else {
        setError('No se encontraron resultados');
        setCountry(null);
      }
    } catch (err) {
      setError('Error al consultar la API');
      setCountry(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
      <Text className="text-white font-bold text-base mb-3">
        🔍 Consultar País
      </Text>

      {/* Input de Búsqueda */}
      <View className="flex-row gap-2 mb-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Ej. argentina, germany..."
          placeholderTextColor="#71717a"
          className="flex-1 bg-zinc-950 text-white px-3 py-2.5 rounded-lg border border-zinc-800 text-sm"
          autoCapitalize="none"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-blue-600 active:bg-blue-700 px-4 py-2.5 rounded-lg justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text className="text-white font-bold text-sm">Buscar</Text>
          )}
        </TouchableOpacity>
      </View>

      {error && <Text className="text-red-400 text-xs my-1">{error}</Text>}

      {/* Tarjeta de Resultado */}
      {country && (
        <View className="mt-2 p-4 bg-zinc-950 rounded-lg border border-zinc-800/60">
          <View className="flex-row items-center gap-3 mb-2">
            {country.flagUrl && (
              <Image
                source={{ uri: country.flagUrl }}
                className="w-8 h-6 rounded"
                resizeMode="cover"
              />
            )}
            <Text className="text-white text-lg font-bold">
              {country.name}
            </Text>
          </View>

          <Text className="text-zinc-400 text-xs mt-1">
            Población: <Text className="text-zinc-200 font-medium">{country.population}</Text>
          </Text>
          <Text className="text-zinc-400 text-xs mt-0.5">
            Superficie: <Text className="text-zinc-200 font-medium">{country.area} km²</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

export default CountrySelector;