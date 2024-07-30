// @ts-nocheck
import * as THREE from "three";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { suspend } from "suspend-react";

export default function Visualizer({ url }: { url: string }) {
  console.log(url);
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.45, 1.3], fov: 25 }}>
      <spotLight
        position={[-4, 4, -4]}
        angle={0.06}
        penumbra={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Suspense fallback={null}>
        <Track position-z={0} url={url} />
        <Track position-z={0.2} url={url} />
        <Zoom url={url} />
      </Suspense>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.025, 0]}
      >
        <planeGeometry />
        <shadowMaterial transparent opacity={0.15} color="white" />
      </mesh>
    </Canvas>
  );
}

interface TrackProps {
  url: string;
  y?: number;
  space?: number;
  width?: number;
  height?: number;
  obj?: THREE.Object3D;
}

function Track({
  url,
  y = 2500,
  space = 1.8,
  width = 0.01,
  height = 0.05,
  obj = new THREE.Object3D(),
  ...props
}: TrackProps) {
  const ref = useRef();
  // suspend-react is the library that r3f uses internally for useLoader. It caches promises and
  // integrates them with React suspense. You can use it as-is with or without r3f.
  const { gain, context, update, data } = suspend(
    () => createAudio(url),
    [url]
  );
  useEffect(() => {
    // Connect the gain node, which plays the audio
    gain.connect(context.destination);
    // Disconnect it on unmount
    return () => gain.disconnect();
  }, [gain, context]);

  useFrame((state) => {
    let avg = update();
    // Distribute the instanced planes according to the frequency daza
    for (let i = 0; i < data.length; i++) {
      obj.position.set(
        i * width * space - (data.length * width * space) / 2,
        data[i] / y,
        0
      );
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
    }
    // Set the hue according to the frequency average
    ref.current.material.color.setHSL(avg / 100, 0, 0.9);
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      castShadow
      ref={ref}
      args={[null, null, data.length]}
      {...props}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function Zoom({ url }: { url: string }) {
  // This will *not* re-create a new audio source, suspense is always cached,
  // so this will just access (or create and then cache) the source according to the url
  const { data } = suspend(() => createAudio(url), [url]);
  return useFrame((state) => {
    // Set the cameras field of view according to the frequency average
    state.camera.fov = 30 - data.avg / 15;
    state.camera.updateProjectionMatrix();
  });
}

async function createAudio(url: string) {
  // Fetch audio data and create a buffer source
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const source = context.createBufferSource();
  source.buffer = await new Promise((res) =>
    context.decodeAudioData(buffer, res)
  );
  source.loop = true;
  // This is why it doesn't run in Safari 🍏🐛. Start has to be called in an onClick event
  // which makes it too awkward for a little demo since you need to load the async data first
  source.start(0);
  // Create gain node and an analyser
  const gain = context.createGain();
  const analyser = context.createAnalyser();
  analyser.fftSize = 64;
  source.connect(analyser);
  analyser.connect(gain);
  // The data array receive the audio frequencies
  const data = new Uint8Array(analyser.frequencyBinCount);
  return {
    context,
    source,
    gain,
    data,
    // This function gets called every frame per audio source
    update: () => {
      analyser.getByteFrequencyData(data);
      // Calculate a frequency average
      return (data.avg = data.reduce(
        (prev, cur) => prev + cur / data.length,
        0
      ));
    },
  };
}