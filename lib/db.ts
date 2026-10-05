import dns from 'dns';
import mongoose from 'mongoose';

// En Windows / Node.js, las consultas SRV pueden fallar con ECONNREFUSED si el DNS local no las reenvía.
// Usamos servidores DNS públicos confiables (Google / Cloudflare) para garantizar resolución continua.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignorar en entornos restringidos (Edge / Browser)
}

const DEFAULT_FALLBACK_URI = "mongodb+srv://gabo:1@cluster0.3s43fmf.mongodb.net/aldri_shop?retryWrites=true&w=majority&appName=Cluster0";
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_FALLBACK_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections from growing exponentially during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_FALLBACK_URI;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
