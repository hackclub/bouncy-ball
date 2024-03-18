import { Midi } from 'https://cdn.jsdelivr.net/npm/@tonejs/midi@2.0.28/+esm'
import { Soundfont } from 'https://cdn.jsdelivr.net/npm/smplr@0.12.2/+esm'

export default class Song {
  constructor(midiUrl) {
    this.midiUrl = midiUrl
    this.instrument = 'fx_4_atmosphere'

    this.ac = undefined
    this.instruments = undefined
    this.notesByTime = undefined
    this.noteKeysInOrder = undefined
    this.currentNoteIndex = 0
  }

  async setup() {
    const midiData = await Midi.fromUrl(this.midiUrl)
    this.ac = new AudioContext()

    // array of instruments for each track
    // let player = new Soundfont(this.ac, { instrument: this.instrument })
    let player = new Soundfont(this.ac, { instrument: this.instrument })

    this.instruments = midiData.tracks.map(track => player)

    // { 0.25: [ null, note, null, null], 2.25: []... and so on }
    this.notesByTime = {}

    midiData.tracks.forEach((track, i) => {
      track.notes.forEach(note => {
        // round note time to nearest 0.1
        const time = Math.round(note.time * 10) / 10

        if (!this.notesByTime[time]) {
          // this makes an array with an entry for each track, presetting all values to null
          this.notesByTime[time] = new Array(midiData.tracks.length).fill(null)
        }

        // set the note in the array for the track
        this.notesByTime[time][i] = note
      })
    })

    this.noteKeysInOrder = Object.keys(this.notesByTime).sort((a, b) => a - b)
  }

  playNote() {
    let note = this.notesByTime[this.noteKeysInOrder[this.currentNoteIndex]]

    note.forEach((note, i) => {
      if (note) {
        this.instruments[i].start({ note: note.midi, velocity: note.velocity * 127, time: this.ac.currentTime, duration: note.duration })
      }
    })

    this.currentNoteIndex++

    if (this.currentNoteIndex >= this.noteKeysInOrder.length) {
      this.currentNoteIndex = 0
    }
  }
}