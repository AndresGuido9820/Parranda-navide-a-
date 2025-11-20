# Flujo de Reproducción de YouTube - Paso a Paso

## 1. BÚSQUEDA (Buscar canciones)

**Archivo:** `youtubeSearchService.ts`

**Proceso:**
1. Usuario escribe en el buscador (ej: "villancicos")
2. Se llama a `searchYouTubeVideos(query)`
3. Se busca en la biblioteca mock de canciones (`MOCK_SONGS`)
4. Se filtran las canciones por título o artista que coincidan con la búsqueda
5. Se devuelven hasta 20 resultados en formato `Song`:
   ```typescript
   {
     id: 'VIDEO_ID',
     title: 'Título del video',
     artist: 'Canal de YouTube',
     image: 'URL de thumbnail',
     audioUrl: 'youtube:VIDEO_ID',  // ← Formato especial
     duration: 180  // segundos
   }
   ```

**Nota:**
- ✅ Ahora se usa una biblioteca mock de canciones en lugar de la API de YouTube
- ✅ No se requiere API Key de YouTube
- ✅ Las canciones se muestran automáticamente al cargar la página (primeras 20)

---

## 2. AGREGAR A COLA (Cuando el usuario hace clic)

**Archivo:** `useMusicPlayer.ts` → función `addToQueue`

**Proceso:**
1. Usuario hace clic en una canción de los resultados
2. Se llama a `addToQueue(song)`
3. Se agrega a la `queue` (array de canciones)
4. Si es la primera canción (`currentIndex === -1`), se establece `currentIndex = 0`
5. Esto automáticamente establece `currentSong` (derivado de `queue[currentIndex]`)

**Estado resultante:**
```typescript
queue = [{ song: {...}, isPlayed: false }]
currentIndex = 0
currentSong = queue[0].song
```

---

## 3. GENERAR URL PARA REPRODUCTOR

**Archivo:** `useMusicPlayer.ts` → función `getYouTubeUrl`

**Proceso:**
1. Cuando `currentSong` existe, se genera `playerUrl`:
   ```typescript
   playerUrl = getYouTubeUrl(currentSong)
   ```
2. La función convierte `audioUrl`:
   - Si es `'youtube:VIDEO_ID'` → `'https://www.youtube.com/watch?v=VIDEO_ID'`
   - Si ya es URL completa → se usa tal cual

**URL resultante:**
```
https://www.youtube.com/watch?v=1HC5i7d0SgA
```

---

## 4. RENDERIZAR REACT-PLAYER

**Archivo:** `PlayerCard.tsx`

**Componente ReactPlayer:**
```tsx
<ReactPlayer
  ref={playerRef}
  url={playerUrl}  // ← URL de YouTube
  playing={isPlaying}  // ← true/false
  volume={player.volume}
  muted={player.isMuted}
  onReady={handleReady}  // ← Se dispara cuando el player está listo
  onProgress={handleProgress}  // ← Se dispara mientras reproduce
  onEnded={handleEnded}  // ← Se dispara cuando termina
  onError={handleError}  // ← Se dispara si hay error
  width="320px"
  height="180px"
  config={{
    youtube: {
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1,  // ← CRÍTICO: Permite controlar el player desde JS
      },
    },
  }}
/>
```

**Requisitos para react-player:**
- ✅ `react-player` instalado (ya lo tenemos)
- ✅ URL válida de YouTube
- ✅ `enablejsapi: 1` en `playerVars` (ya lo tenemos)
- ✅ Tamaño mínimo del iframe (320x180px, ya lo tenemos)
- ✅ Player renderizado (aunque invisible, debe estar en el DOM)

---

## 5. ESPERAR A QUE EL PLAYER ESTÉ LISTO

**Archivo:** `useMusicPlayer.ts` → función `handleReady`

**Proceso:**
1. YouTube carga el iframe del reproductor
2. Cuando está listo, se dispara `onReady`
3. En `handleReady`:
   - Se obtiene `internalPlayer = playerRef.current.getInternalPlayer()`
   - Se obtiene `duration = playerRef.current.getDuration()`
   - Se establece `isLoading = false`

**Estado:**
```typescript
isLoading = false
duration = 180  // segundos
internalPlayer = { playVideo(), pauseVideo(), ... }  // API de YouTube
```

---

## 6. PRESIONAR PLAY (Reproducir)

**Archivo:** `useMusicPlayer.ts` → función `togglePlayPause` → `resume`

**Proceso:**
1. Usuario hace clic en el botón play
2. Se llama a `togglePlayPause()`
3. Si `isPlaying === false`, se llama a `resume()`
4. En `resume()`:
   ```typescript
   internalPlayer = playerRef.current.getInternalPlayer()
   internalPlayer.playVideo()  // ← Llama a la API de YouTube
   setIsPlaying(true)
   ```

**Estado resultante:**
```typescript
isPlaying = true
// El video comienza a reproducirse
```

---

## 7. ACTUALIZACIÓN DE PROGRESO

**Archivo:** `useMusicPlayer.ts` → función `handleProgress`

**Proceso:**
1. Mientras reproduce, YouTube dispara `onProgress` cada ~250ms
2. Se actualiza `currentTime = state.playedSeconds`
3. Esto actualiza la barra de progreso en la UI

---

## 8. FINALIZAR CANCIÓN

**Archivo:** `useMusicPlayer.ts` → función `handleEnded`

**Proceso:**
1. Cuando termina el video, se dispara `onEnded`
2. Se marca la canción como reproducida: `isPlayed = true`
3. Se pasa a la siguiente: `next()`
4. Se resetea: `currentTime = 0`

---

## REQUISITOS COMPLETOS - CHECKLIST

### ✅ Ya tenemos:
1. ✅ `react-player` instalado
2. ✅ API Key de YouTube configurada
3. ✅ URL de YouTube generada correctamente
4. ✅ `enablejsapi: 1` en config
5. ✅ Tamaño mínimo del iframe (320x180px)
6. ✅ Player renderizado en el DOM
7. ✅ Handlers (`onReady`, `onProgress`, `onEnded`, `onError`)
8. ✅ `ref` asignado al ReactPlayer
9. ✅ `getInternalPlayer()` para obtener la API

### ⚠️ Posibles problemas:

1. **Si se queda cargando indefinidamente:**
   - El iframe puede estar bloqueado por políticas del navegador
   - YouTube puede estar bloqueando el iframe por tamaño/ubicación
   - El `onReady` no se está disparando

2. **Si `internalPlayer` es `null`:**
   - El player no está completamente cargado
   - Falta `enablejsapi: 1`
   - El iframe está bloqueado

3. **Si `playVideo()` no funciona:**
   - El player no está listo aún
   - Hay restricciones de autoplay del navegador
   - El video está bloqueado por políticas de YouTube

---

## DEBUGGING

Para verificar que todo funciona, revisa los logs en la consola:

1. **Cuando se agrega a la cola:**
   ```
   [useMusicPlayer] addToQueue - Agregando canción
   [useMusicPlayer] addToQueue - Estableciendo currentIndex a 0
   ```

2. **Cuando se genera la URL:**
   ```
   [useMusicPlayer] getYouTubeUrl - Convertido de youtube:ID a URL: https://www.youtube.com/watch?v=...
   ```

3. **Cuando ReactPlayer renderiza:**
   ```
   [PlayerCard] Renderizando ReactPlayer con URL: https://www.youtube.com/watch?v=...
   ```

4. **Cuando el player está listo (CRÍTICO):**
   ```
   [useMusicPlayer] handleReady - Player listo
   [useMusicPlayer] handleReady - internalPlayer existe: true
   [useMusicPlayer] handleReady - playVideo disponible: true
   ```

5. **Cuando presionas play:**
   ```
   [PlayerCard] Botón play/pause clickeado
   [useMusicPlayer] togglePlayPause - Llamado
   [useMusicPlayer] resume - Llamado
   [useMusicPlayer] resume - Llamando playVideo()
   ```

**Si no ves `handleReady - Player listo`, el problema está en la carga del iframe.**

