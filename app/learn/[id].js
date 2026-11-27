import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Press from '../../src/components/Press';
import Cover from '../../src/components/Cover';
import ChordDiagram from '../../src/components/ChordDiagram';
import PremiumGate from '../../src/components/PremiumGate';
import { useTheme } from '../../src/theme';
import { bandById, songById } from '../../src/data';
import { LESSONS } from '../../src/learn';
import { getLyrics } from '../../src/lib/lyrics';
import { useApp, useStatus } from '../../src/store';

// Aprende a tocar (Premium): acordes, tempo, metrónomo y letra con el acorde de cada línea, siguiendo la canción.
export default function Learn() {
  const { colors, type } = useTheme(); const s = useMemo(() => makeS(colors, type), [colors]);
  const { id } = useLocalSearchParams();
  const { premium, current, play, toggle, seek } = useApp();
  const status = useStatus();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const song = songById(id);
  const band = song ? bandById(song.bandId) : null;
  const lesson = LESSONS[id];
  const [lines, setLines] = useState([]);
  const [metro, setMetro] = useState(false);
  const [beat, setBeat] = useState(0);
  const playingThis = current?.id === id;

  useEffect(() => { let on = true; if (song && lesson) getLyrics(song, band).then((d) => { if (on && d) setLines(d.lines); }); return () => { on = false; }; }, [id]); // eslint-disable-line
  useEffect(() => {
    if (!metro || !lesson) { setBeat(0); return undefined; }
    let n = 0;
    const tick = () => { setBeat(n % 4); Haptics.impactAsync(n % 4 === 0 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light).catch(() => {}); n += 1; };
    tick();
    const h = setInterval(tick, 60000 / lesson.bpm);
    return () => clearInterval(h);
  }, [metro, id]); // eslint-disable-line

  const back = (
    <Press onPress={() => router.back()} hitSlop={12} style={s.back} accessibilityLabel="Volver"><Ionicons name="chevron-back" size={26} color={colors.accent} /><Text style={s.backTxt}>Atrás</Text></Press>
  );
  if (!song) return <View style={[s.root, { paddingTop: insets.top + 6 }]}>{back}</View>;
  const elapsed = playingThis ? status.currentTime || 0 : -1;
  let active = -1;
  lines.forEach((l, i) => { if (l.t <= elapsed + 0.25) active = i; });
  const chordAt = (i) => (lesson ? lesson.prog[i % lesson.prog.length] : '');

  return (
    <View style={[s.root, { paddingTop: insets.top + 6 }]}>
      <View style={{ paddingHorizontal: 10 }}>{back}</View>
      {!premium ? <PremiumGate feature="Aprende a tocar" /> : !lesson ? (
        <View style={s.empty}>
          <Ionicons name="musical-notes-outline" size={40} color={colors.muted} />
          <Text style={[type.h2, { textAlign: 'center' }]}>Lección no disponible</Text>
          <Text style={[type.body, { textAlign: 'center' }]}>Por derechos de autor, las lecciones de "Aprende a tocar" se crean solo para canciones de bandas de GrooveSpace.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
          <View style={s.head}>
            <Cover band={band} size={72} radius={10} seed={song.id} elevated cover={song.cover} />
            <View style={{ flex: 1 }}>
              <Text style={type.label}>APRENDE A TOCAR</Text>
              <Text style={type.h1} numberOfLines={2}>{song.title}</Text>
              <Text style={type.small}>{band.name}</Text>
            </View>
          </View>

          <View style={s.chips}>
            {[['Tonalidad', lesson.key], ['Tempo', `${lesson.bpm} BPM`], ['Nivel', lesson.level], ['Ritmo', lesson.strum]].map(([k, v]) => (
              <View key={k} style={s.chip}><Text style={s.chipK}>{k}</Text><Text style={s.chipV}>{v}</Text></View>
            ))}
          </View>
          <View style={s.tip}><Ionicons name="bulb-outline" size={18} color={colors.amber} /><Text style={[type.body, { flex: 1, fontSize: 14 }]}>{lesson.tip}</Text></View>

          <Text style={s.cap}>ACORDES DE LA CANCIÓN</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingVertical: 6 }}>
            {[...new Set(lesson.prog)].map((c) => <View key={c} style={s.chordBox}><ChordDiagram name={c} active={active >= 0 && chordAt(active) === c} /></View>)}
          </ScrollView>

          <View style={s.tools}>
            <Press onPress={() => (playingThis ? toggle() : play(song.id, [song.id], 'Aprende a tocar'))} style={s.primary}>
              <Ionicons name={playingThis && status.playing ? 'pause' : 'play'} size={20} color="#fff" />
              <Text style={s.primaryTxt}>{playingThis && status.playing ? 'Pausar' : 'Tocar con la canción'}</Text>
            </Press>
            <Press onPress={() => setMetro((m) => !m)} style={[s.secondary, metro && { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {[0, 1, 2, 3].map((b) => <View key={b} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: metro && beat === b ? colors.accent : colors.line }} />)}
              </View>
              <Text style={[s.secTxt, metro && { color: colors.accent }]}>{metro ? 'Detener' : 'Metrónomo'}</Text>
            </Press>
          </View>

          <Text style={s.cap}>LETRA CON ACORDES</Text>
          {lines.map((l, i) => (
            <Press key={i} onPress={() => (playingThis ? seek(l.t) : undefined)} scale={0.99} style={[s.line, i === active && { backgroundColor: colors.accentSoft }]}>
              <Text style={[s.lineChord, i === active && { color: colors.accent }]}>{chordAt(i)}</Text>
              <Text style={[s.lineTxt, i !== active && active >= 0 && { opacity: 0.55 }]}>{l.text}</Text>
            </Press>
          ))}
          <Text style={[type.small, { marginTop: 16, textAlign: 'center' }]}>Acordes y letra originales de GrooveSpace · digitaciones de guitarra (cuerdas 6 → 1).</Text>
        </ScrollView>
      )}
    </View>
  );
}
const makeS = (colors, type) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  back: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6 },
  backTxt: { color: colors.accent, fontSize: 17 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  chip: { backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  chipK: { fontSize: 11, color: colors.muted, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  chipV: { fontSize: 15, color: colors.text, fontWeight: '700', marginTop: 1 },
  tip: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginTop: 12 },
  cap: { ...type.label, marginTop: 24, marginBottom: 8 },
  chordBox: { backgroundColor: colors.surface, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 8 },
  tools: { flexDirection: 'row', gap: 10, marginTop: 16 },
  primary: { flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 14 },
  primaryTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondary: { flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16, paddingVertical: 14 },
  secTxt: { color: colors.text, fontWeight: '600', fontSize: 14 },
  line: { flexDirection: 'row', alignItems: 'baseline', gap: 14, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  lineChord: { width: 54, color: colors.violet, fontWeight: '800', fontSize: 16 },
  lineTxt: { flex: 1, color: colors.text, fontSize: 17, lineHeight: 24 },
});
