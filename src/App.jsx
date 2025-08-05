import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Tone from 'tone';
import './styles.css';

const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const modes = {
  ionian: [2, 2, 1, 2, 2, 2, 1],
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  aeolian: [2, 1, 2, 2, 1, 2, 2],
  locrian: [1, 2, 2, 1, 2, 2, 2],
};

const modeDegrees = {
  ionian: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  dorian: ['i', 'ii', 'III', 'IV', 'v', 'vi°', 'VII'],
  phrygian: ['i', 'II', 'III', 'iv', 'v°', 'VI', 'vii'],
  lydian: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
  mixolydian: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'VII'],
  aeolian: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
  locrian: ['i°', 'II', 'iii', 'iv', 'V', 'VI', 'vii'],
};

function getScale(root, mode) {
  const intervals = modes[mode];
  let index = allNotes.indexOf(root);
  const scale = [allNotes[index]];
  intervals.forEach((step) => {
    index = (index + step) % 12;
    scale.push(allNotes[index]);
  });
  return scale;
}

function playNote(note) {
  const synth = new Tone.Synth().toDestination();
  const midiOctave = '4'; // Octava por defecto
  synth.triggerAttackRelease(`${note}${midiOctave}`, '8n');
}

function GuitarDiagram({ scale, tuning, root }) {
  return (
    <div className='fretboard'>
      {[...tuning].reverse().map((openNote, stringIndex) => {
        const stringNotes = [];
        let index = allNotes.indexOf(openNote);
        for (let fret = 0; fret < 12; fret++) {
          const note = allNotes[(index + fret) % 12];
          const isRoot = note === root;
          const isThird = scale[2] === note;
          const isFifth = scale[4] === note;
          const isInScale = scale.includes(note);
          stringNotes.push(
            <div
              key={fret}
              className={`fret ${isInScale ? 'in-scale' : ''} ${isRoot ? 'root-note' : ''} ${isThird ? 'triad-3rd' : ''} ${
                isFifth ? 'triad-5th' : ''
              }`}
              onClick={() => isInScale && playNote(note)}
            >
              <div className='note-box'>
                <span>{note}</span>
              </div>
            </div>
          );
        }
        return (
          <div key={stringIndex} className='string'>
            {stringNotes}
          </div>
        );
      })}
    </div>
  );
}

function PianoDiagram({ scale, root }) {
  const fullRange = Array.from({ length: 36 }, (_, i) => allNotes[i % 12]);
  return (
    <div className='piano'>
      {fullRange.map((note, i) => {
        const isRoot = note === root;
        const isThird = scale[2] === note;
        const isFifth = scale[4] === note;
        const isInScale = scale.includes(note);
        return (
          <div
            key={i}
            className={`key ${note.includes('#') ? 'black' : 'white'} ${isInScale ? 'in-scale' : ''} ${isRoot ? 'root-note' : ''} ${
              isThird ? 'triad-3rd' : ''
            } ${isFifth ? 'triad-5th' : ''}`}
            onClick={() => isInScale && playNote(note)}
          >
            <span>{note}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [root, setRoot] = useState('C');
  const [mode, setMode] = useState('ionian');

  const scale = getScale(root, mode);
  const intervals = modes[mode];
  const degrees = modeDegrees[mode];

  return (
    <div className='container'>
      <h1 className='title'>Visualizador de Escalas</h1>
      <div className='controls'>
        <select value={root} onChange={(e) => setRoot(e.target.value)}>
          {allNotes.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>

        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          {Object.keys(modes).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className='scale-visual'>
        {scale.map((note, i) => (
          <React.Fragment key={i}>
            <div
              className={`note-label ${scale[2] === note ? 'triad-3rd' : ''} ${scale[4] === note ? 'triad-5th' : ''} grado-${i + 1}`}
              onClick={() => playNote(note)}
            >
              <div className='degree'>{degrees[i]}</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`note-box ${note === root ? 'root-note' : ''}`}
              >
                {note}
              </motion.div>
            </div>
            {i < intervals.length && (
              <div className={`interval-line ${intervals[i] === 1 ? 'half' : 'whole'}`}>{intervals[i] === 1 ? '1/2' : '1'}</div>
            )}
          </React.Fragment>
        ))}
      </div>

      <h2>
        Diagrama de Guitarra <span className='tuning'>Standard</span>
      </h2>
      <GuitarDiagram scale={scale} tuning={['E', 'A', 'D', 'G', 'B', 'E']} root={root} />

      <h2>
        Diagrama de Guitarra <span className='tuning'>Drop D</span>
      </h2>
      <GuitarDiagram scale={scale} tuning={['D', 'A', 'D', 'G', 'B', 'E']} root={root} />

      <h2>Teclado</h2>
      <PianoDiagram scale={scale} root={root} />
    </div>
  );
}

// function getScale(root, mode) {
//   const intervals = modes[mode];
//   let index = allNotes.indexOf(root);
//   const scale = [allNotes[index]];
//   intervals.forEach((step) => {
//     index = (index + step) % 12;
//     scale.push(allNotes[index]);
//   });
//   return scale;
// }

// export default function App() {
//   const [root, setRoot] = useState('C');
//   const [mode, setMode] = useState('ionian');

//   const scale = getScale(root, mode);
//   const intervals = modes[mode];

//   return (
//     <div className='container'>
//       <h1 className='title'>Visualizador de Escalas</h1>
//       <div className='controls'>
//         <select value={root} onChange={(e) => setRoot(e.target.value)}>
//           {allNotes.map((n) => (
//             <option key={n}>{n}</option>
//           ))}
//         </select>

//         <select value={mode} onChange={(e) => setMode(e.target.value)}>
//           {Object.keys(modes).map((m) => (
//             <option key={m} value={m}>
//               {m}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className='scale-visual'>
//         {scale.map((note, i) => (
//           <React.Fragment key={i}>
//             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className='note-box'>
//               {note}
//             </motion.div>
//             {i < intervals.length && <div className='interval-line'>{intervals[i] === 1 ? '1/2' : '1'}</div>}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// }

/*CON SONIDOS SAMPLER*/
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import * as Tone from "tone";
// import Soundfont from "soundfont-player";
// import "./styles.css";

// const allNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// const modes = {
//   ionian: [2, 2, 1, 2, 2, 2, 1],
//   dorian: [2, 1, 2, 2, 2, 1, 2],
//   phrygian: [1, 2, 2, 2, 1, 2, 2],
//   lydian: [2, 2, 2, 1, 2, 2, 1],
//   mixolydian: [2, 2, 1, 2, 2, 1, 2],
//   aeolian: [2, 1, 2, 2, 1, 2, 2],
//   locrian: [1, 2, 2, 1, 2, 2, 2]
// };

// const modeDegrees = {
//   ionian: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
//   dorian: ["i", "ii", "III", "IV", "v", "vi°", "VII"],
//   phrygian: ["i", "II", "III", "iv", "v°", "VI", "vii"],
//   lydian: ["I", "II", "iii", "#iv°", "V", "vi", "vii"],
//   mixolydian: ["I", "ii", "iii°", "IV", "v", "vi", "VII"],
//   aeolian: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
//   locrian: ["i°", "II", "iii", "iv", "V", "VI", "vii"]
// };

// function getScale(root, mode) {
//   const intervals = modes[mode];
//   let index = allNotes.indexOf(root);
//   const scale = [allNotes[index]];
//   intervals.forEach((step) => {
//     index = (index + step) % 12;
//     scale.push(allNotes[index]);
//   });
//   return scale;
// }

// function noteToMidi(note, octave = 4) {
//   const index = allNotes.indexOf(note);
//   return 12 * (octave + 1) + index;
// }

// function GuitarDiagram({ scale, tuning, root, playNote }) {
//   return (
//     <div className="fretboard">
//       {[...tuning].reverse().map((openNote, stringIndex) => {
//         const stringNotes = [];
//         let index = allNotes.indexOf(openNote);
//         for (let fret = 0; fret < 12; fret++) {
//           const note = allNotes[(index + fret) % 12];
//           const isRoot = note === root;
//           stringNotes.push(
//             <div
//               key={fret}
//               className={`fret ${scale.includes(note) ? "in-scale" : ""} ${isRoot ? "root-note" : ""}`}
//               onClick={() => playNote(note, 3 + Math.floor(fret / 12))}
//             >
//               {note}
//             </div>
//           );
//         }
//         return (
//           <div key={stringIndex} className="string">
//             {stringNotes}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function PianoDiagram({ scale, root, playNote }) {
//   const fullRange = Array.from({ length: 36 }, (_, i) => allNotes[i % 12]);
//   return (
//     <div className="piano">
//       {fullRange.map((note, i) => (
//         <div
//           key={i}
//           className={`key ${note.includes("#") ? "black" : "white"} ${scale.includes(note) ? "in-scale" : ""} ${note === root ? "root-note" : ""}`}
//           onClick={() => playNote(note, 4 + Math.floor(i / 12))}
//         >
//           {note}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function App() {
//   const [root, setRoot] = useState("C");
//   const [mode, setMode] = useState("ionian");
//   const [piano, setPiano] = useState(null);
//   const [guitar, setGuitar] = useState(null);

//   const scale = getScale(root, mode);
//   const intervals = modes[mode];
//   const degrees = modeDegrees[mode];

//   React.useEffect(() => {
//     Soundfont.instrument(new AudioContext(), "acoustic_grand_piano").then(setPiano);
//     Soundfont.instrument(new AudioContext(), "acoustic_guitar_nylon").then(setGuitar);
//   }, []);

//   const playNote = async (note, octave = 4) => {
//     const midiNote = noteToMidi(note, octave);
//     if (piano) piano.play(midiNote);
//     if (guitar) guitar.play(midiNote);
//   };

//   return (
//     <div className="container">
//       <h1 className="title">Visualizador de Escalas</h1>
//       <div className="controls">
//         <select value={root} onChange={(e) => setRoot(e.target.value)}>
//           {allNotes.map((n) => (
//             <option key={n}>{n}</option>
//           ))}
//         </select>

//         <select value={mode} onChange={(e) => setMode(e.target.value)}>
//           {Object.keys(modes).map((m) => (
//             <option key={m} value={m}>{m}</option>
//           ))}
//         </select>
//       </div>

//       <div className="scale-visual">
//         {scale.map((note, i) => (
//           <React.Fragment key={i}>
//             <div className="note-label">
//               <div className="degree">{degrees[i]}</div>
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.3 }}
//                 className={`note-box ${note === root ? "root-note" : ""}`}
//                 onClick={() => playNote(note)}
//               >
//                 {note}
//               </motion.div>
//             </div>
//             {i < intervals.length && (
//               <div className={`interval-line ${intervals[i] === 1 ? "half" : "whole"}`}>
//                 {intervals[i] === 1 ? "1/2" : "1"}
//               </div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       <h2>Diagrama de Guitarra (Standard)</h2>
//       <GuitarDiagram scale={scale} tuning={["E", "A", "D", "G", "B", "E"]} root={root} playNote={playNote} />

//       <h2>Diagrama de Guitarra (Drop D)</h2>
//       <GuitarDiagram scale={scale} tuning={["D", "A", "D", "G", "B", "E"]} root={root} playNote={playNote} />

//       <h2>Teclado</h2>
//       <PianoDiagram scale={scale} root={root} playNote={playNote} />
//     </div>
//   );
// }
