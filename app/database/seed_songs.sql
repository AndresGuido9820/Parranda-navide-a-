-- Seed data for songs table
-- Run after migrations: psql -d parranda -f seed_songs.sql

INSERT INTO parranda.songs (youtube_video_id, title, artist, thumbnail_url, duration_seconds, genre, is_christmas) VALUES
-- Villancicos tradicionales
('C0YImrwIypo', 'Noche de Paz, Juana, Villancico Animado', 'Mundo Canticuentos', 'https://i.ytimg.com/vi/C0YImrwIypo/mqdefault.jpg', 213, 'villancico', true),
('hxgVn22M2GE', 'Noche de Paz - Los Niños Cantores de Navidad', 'Discos Fuentes Edimusica', 'https://i.ytimg.com/vi/hxgVn22M2GE/mqdefault.jpg', 202, 'villancico', true),
('SF47MzYs_l4', 'Noche de paz con letra', 'luis fernando gallo romero', 'https://i.ytimg.com/vi/SF47MzYs_l4/mqdefault.jpg', 190, 'villancico', true),
('01Nh53Xt1s4', 'Blanca Navidad', 'Luis Miguel', 'https://i.ytimg.com/vi/01Nh53Xt1s4/mqdefault.jpg', 213, 'pop', true),
('EpkOXf9umks', 'Daniela Romo - Blanca Navidad', 'EternaNavidadVEVO', 'https://i.ytimg.com/vi/EpkOXf9umks/mqdefault.jpg', 191, 'pop', true),
('QgioGSUUeL8', 'Andrea Bocelli – Blanca Navidad', 'Andrea Bocelli', 'https://i.ytimg.com/vi/QgioGSUUeL8/mqdefault.jpg', 238, 'internacional', true),
('28HpAyGM0Ug', 'Pandora - Blanca Navidad', 'PandoraOficialVEVO', 'https://i.ytimg.com/vi/28HpAyGM0Ug/mqdefault.jpg', 192, 'pop', true),
('6f7GJmmJPts', 'Alejandro Fernández, América, Camila, Valentina Fernández - Blanca Navidad', 'AFernandezVEVO', 'https://i.ytimg.com/vi/6f7GJmmJPts/mqdefault.jpg', 176, 'pop', true),
('JPbkeTU1kgo', 'Jingle Bells', 'Super Simple Songs', 'https://i.ytimg.com/vi/JPbkeTU1kgo/mqdefault.jpg', 151, 'infantil', true),
('5JGfvDqZEgM', 'Jingle Bells', 'Gwen Stefani', 'https://i.ytimg.com/vi/5JGfvDqZEgM/mqdefault.jpg', 178, 'pop', true),
('2fRQ8HAzcHA', 'Jingle Bells', 'Alan Jackson', 'https://i.ytimg.com/vi/2fRQ8HAzcHA/mqdefault.jpg', 171, 'tradicional', true),
('N8NcQzMQN_U', 'José Feliciano - Feliz Navidad', 'JoseFelicianoVEVO', 'https://i.ytimg.com/vi/N8NcQzMQN_U/mqdefault.jpg', 184, 'tradicional', true),
('blcAIE9POSU', 'Feliz Navidad, Juana, Villancico Clásico Animado', 'Mundo Canticuentos', 'https://i.ytimg.com/vi/blcAIE9POSU/mqdefault.jpg', 159, 'villancico', true),
('cRbLtqbPYjU', 'José Feliciano - Feliz Navidad (Lyrics)', '7clouds', 'https://i.ytimg.com/vi/cRbLtqbPYjU/mqdefault.jpg', 182, 'tradicional', true),
('k6vN9p4tLlM', 'Mi Burrito Sabanero, Juana', 'Mundo Canticuentos', 'https://i.ytimg.com/vi/k6vN9p4tLlM/mqdefault.jpg', 195, 'villancico', true),
('lJawRaON8h0', 'Mi Burrito Sabanero, Juana, Villancico Animado', 'Mundo Canticuentos', 'https://i.ytimg.com/vi/lJawRaON8h0/mqdefault.jpg', 193, 'villancico', true),
('_Wrc6Q7acME', 'Mi Burrito Sabanero', 'cuteambros15', 'https://i.ytimg.com/vi/_Wrc6Q7acME/mqdefault.jpg', 191, 'villancico', true),
('IhO3Y1unYGE', 'Campana Sobre Campana, Villancico Animado', 'Mundo Canticuentos', 'https://i.ytimg.com/vi/IhO3Y1unYGE/mqdefault.jpg', 168, 'villancico', true),
('BnLSu1Xsz5w', 'Pandora, Yuri - Campana Sobre Campana', 'YuriOficialVEVO', 'https://i.ytimg.com/vi/BnLSu1Xsz5w/mqdefault.jpg', 132, 'pop', true),
('q3hho2sLIy4', 'Campana Sobre Campana', 'Yuri', 'https://i.ytimg.com/vi/q3hho2sLIy4/mqdefault.jpg', 159, 'pop', true),
('dppTvVUxJwc', 'Campana Sobre Campana', 'RBD', 'https://i.ytimg.com/vi/dppTvVUxJwc/mqdefault.jpg', 184, 'pop', true),
('yfpBMrJZt1Q', 'Los Peces En El Río, Villancico Animado', 'Mundo Canticuentos', 'https://i.ytimg.com/vi/yfpBMrJZt1Q/mqdefault.jpg', 132, 'villancico', true),
('goZ6wIKE58Q', 'Los Peces en el Rio - Los Niños Cantores de Navidad', 'Discos Fuentes Edimusica', 'https://i.ytimg.com/vi/goZ6wIKE58Q/mqdefault.jpg', 133, 'villancico', true),
('9w8HNsAtHAY', 'Pandora - Los Peces en el Río', 'PandoraOficialVEVO', 'https://i.ytimg.com/vi/9w8HNsAtHAY/mqdefault.jpg', 163, 'pop', true),
('S8k36__ShUE', 'Angela Aguilar - Los Peces En El Río', 'Angela Aguilar Oficial', 'https://i.ytimg.com/vi/S8k36__ShUE/mqdefault.jpg', 189, 'pop', true),
('HWOhMpAw0Mk', 'Rodolfo El Reno', 'Grupo Nueva América Orquesta y Coros', 'https://i.ytimg.com/vi/HWOhMpAw0Mk/mqdefault.jpg', 161, 'villancico', true),
('uArFYpxDOoU', 'El Reno Rodolfo | Canción popular navideña', 'Peque Música', 'https://i.ytimg.com/vi/uArFYpxDOoU/mqdefault.jpg', 108, 'infantil', true),
('bl7p0PiNQuY', 'Rodolfo El Reno, Villancico Clásico Animado', 'Mundo Canticuentos', 'https://i.ytimg.com/vi/bl7p0PiNQuY/mqdefault.jpg', 193, 'villancico', true),
('OnIU8WWdVqY', 'Rodolfo el Reno', 'Tatiana', 'https://i.ytimg.com/vi/OnIU8WWdVqY/mqdefault.jpg', 183, 'infantil', true),
('aAkMkVFwAoo', 'Mariah Carey - All I Want for Christmas Is You', 'MariahCareyVEVO', 'https://i.ytimg.com/vi/aAkMkVFwAoo/mqdefault.jpg', 243, 'pop', true),
('5ipkAxRm_Pw', 'Ven A Cantar, Juana, Villancico Animado', 'Mundo Canticuentos', 'https://i.ytimg.com/vi/5ipkAxRm_Pw/mqdefault.jpg', 220, 'villancico', true),
('zHxg73ppMbs', 'Tutaina, Villancico Animado', 'Mundo Canticuentos', 'https://i.ytimg.com/vi/zHxg73ppMbs/mqdefault.jpg', 128, 'villancico', true),

-- Música navideña en inglés
('yXQViqx6GMY', 'Mariah Carey - All I Want For Christmas Is You', 'MariahCareyVEVO', 'https://i.ytimg.com/vi/yXQViqx6GMY/mqdefault.jpg', 235, 'pop', true),
('E8gmARGvPlI', 'Wham! - Last Christmas', 'WhamVEVO', 'https://i.ytimg.com/vi/E8gmARGvPlI/mqdefault.jpg', 279, 'pop', true),
('MLrx0P8p_s8', 'Last Christmas', 'Wham!', 'https://i.ytimg.com/vi/MLrx0P8p_s8/mqdefault.jpg', 287, 'pop', true),
('fGFNmEOntFA', 'Justin Bieber, Mariah Carey - All I Want For Christmas Is You', 'JustinBieberVEVO', 'https://i.ytimg.com/vi/fGFNmEOntFA/mqdefault.jpg', 254, 'pop', true),
('-Ea_1vStswA', 'Backstreet Boys - Last Christmas', 'Backstreet Boys', 'https://i.ytimg.com/vi/-Ea_1vStswA/mqdefault.jpg', 258, 'pop', true),
('nIhs1T7OcZg', 'Bobby Helms - Jingle Bell Rock', 'Pizza Music', 'https://i.ytimg.com/vi/nIhs1T7OcZg/mqdefault.jpg', 131, 'tradicional', true),

-- Rap colombiano (decembrino)
('7eqzpjUu1_c', 'AlcolirykoZ - Baño de ruda', 'AlcolirykoZ', 'https://i.ytimg.com/vi/7eqzpjUu1_c/mqdefault.jpg', 197, 'rap', true),
('J3-hTJvqBMw', 'AlcolirykoZ - El Estrén', 'AlcolirykoZ', 'https://i.ytimg.com/vi/J3-hTJvqBMw/mqdefault.jpg', 285, 'rap', true),
('6NErjG-Ayy4', 'El Estrén (Versión álbum)', 'Crudo Means Raw', 'https://i.ytimg.com/vi/6NErjG-Ayy4/mqdefault.jpg', 165, 'rap', true),
('hwgfwi2wnX4', 'Crudo Means Raw - Hubiera', 'CRUDO MEANS RAW', 'https://i.ytimg.com/vi/hwgfwi2wnX4/mqdefault.jpg', 223, 'rap', false),
('OV4hbqYxRh0', 'No Copio', 'Crudo Means Raw', 'https://i.ytimg.com/vi/OV4hbqYxRh0/mqdefault.jpg', 206, 'rap', false),
('G795ZdgVkaY', 'María', 'Crudo Means Raw', 'https://i.ytimg.com/vi/G795ZdgVkaY/mqdefault.jpg', 156, 'rap', false),
('cgJvtgZ7rBk', 'VITAL (TÉNGASE) - LA INFUSIÓN I - CRUDO MEANS RAW', 'CRUDO MEANS RAW', 'https://i.ytimg.com/vi/cgJvtgZ7rBk/mqdefault.jpg', 153, 'rap', false),

-- Canciones colombianas de diciembre
('3IISwkIQX1w', 'El Ausente (Remastered)', 'Pastor Lopez', 'https://i.ytimg.com/vi/3IISwkIQX1w/mqdefault.jpg', 207, 'tropical', true),
('vvTOScNMQB4', 'El Hijo Ausente - Pastor López', 'Discos Fuentes Edimusica', 'https://i.ytimg.com/vi/vvTOScNMQB4/mqdefault.jpg', 174, 'tropical', true),
('70g_ARWpjBQ', 'Cariñito', 'Rodolfo Aicardi', 'https://i.ytimg.com/vi/70g_ARWpjBQ/mqdefault.jpg', 227, 'tropical', true),
('Dj_pcjR1fIM', 'Adonay', 'Rodolfo Aicardi', 'https://i.ytimg.com/vi/Dj_pcjR1fIM/mqdefault.jpg', 190, 'tropical', true),
('Uz4OOpYWs0A', 'Traicionera - Pastor López', 'Discos Fuentes Edimusica', 'https://i.ytimg.com/vi/Uz4OOpYWs0A/mqdefault.jpg', 210, 'tropical', true),
('Q_V_85VqYVc', 'Ay No Se Puede', 'Pastor Lopez', 'https://i.ytimg.com/vi/Q_V_85VqYVc/mqdefault.jpg', 341, 'tropical', true),
('Czt9wS6cIHQ', 'Bendito Diciembre, Los Betos', 'Fiesta Vallenata', 'https://i.ytimg.com/vi/Czt9wS6cIHQ/mqdefault.jpg', 246, 'vallenato', true),
('YrpXK_oMeak', 'Diomedes Díaz - Las Cuatro Fiestas', 'Diomedes Díaz Oficial', 'https://i.ytimg.com/vi/YrpXK_oMeak/mqdefault.jpg', 272, 'vallenato', true),
('GMRbOELviW4', 'El Ciclón', 'Gran Combo de Colombia', 'https://i.ytimg.com/vi/GMRbOELviW4/mqdefault.jpg', 228, 'salsa', true),
('RjbEyUdloxk', 'Tonto Amor - Hernán Hernández', 'LA TROPICALISIMA', 'https://i.ytimg.com/vi/RjbEyUdloxk/mqdefault.jpg', 208, 'tropical', true)
ON CONFLICT (youtube_video_id) DO NOTHING;

