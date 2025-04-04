import { loadSoundfont, startPresetNote } from 'sfumato';
import { Midi } from '@tonejs/midi';

let western_sf2;
let hidunstani_sf2;

const ctx = new AudioContext();
const MIDI_FILE_PATH = "scale.mid"; 

const SF2_WESTERN_PATH = "harmonium-western.sf2"
const SF2_HINDUSTANI_PATH = "harmonium-hindustani.sf2"

async function loadSF2(path) {
  const sf2 = await loadSoundfont(path);
  console.log('SoundFont loaded:', sf2);
  return sf2;
}

async function setup() {
  western_sf2 = await loadSF2(SF2_WESTERN_PATH);
  hidunstani_sf2 = await loadSF2(SF2_HINDUSTANI_PATH);

  document.getElementById("play-western").addEventListener("click", () => {
    play_mid_file(western_sf2);
  });

  document.getElementById("play-hindustani").addEventListener("click", () => {
    play_mid_file(hidunstani_sf2);
  });
}


async function play_mid_file(sf2) {
  if (!sf2) {
    console.error("SoundFont not loaded yet!");
    return;
  }

  try {
    const response = await fetch(MIDI_FILE_PATH);
    const arrayBuffer = await response.arrayBuffer();
    const midi = new Midi(arrayBuffer);
    console.log('Parsed MIDI:', midi);

    const now = ctx.currentTime; // Reference time

    for (const track of midi.tracks) {
      for (const note of track.notes) {
        const { midi, time, duration, velocity } = note;

        // Resume AudioContext if needed
        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        // Play note
        const stopHandle = startPresetNote(ctx, sf2.presets[0], midi, now + time);

        // Stop the note after its duration
        stopHandle(now + time + duration);
      }
    }
  } catch (error) {
    console.error("Error loading MIDI file:", error);
  }
}


setup();