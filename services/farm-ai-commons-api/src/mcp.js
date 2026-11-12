// Stateless MCP over streamable HTTP: one JSON-RPC request per POST, JSON response, no sessions.

import { BadInput, findFarm, makeRainCard, rainNormal, rainSinceJuly, readLatLon } from './ops.js';
import { UpstreamError } from './sources.js';

export const SERVER_INFO = { name: 'farm-ai-commons', title: 'Farm AI Commons course data', version: '1.0.0' };
const PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05'];

const LATLON = {
  lat: { type: 'number', description: 'Latitude in decimal degrees, negative in New Zealand, e.g. -44.728' },
  lon: { type: 'number', description: 'Longitude in decimal degrees, e.g. 170.467' },
};

export const TOOLS = [
  {
    name: 'find_farm',
    title: 'Find a farm by address',
    description: 'Look up a New Zealand street or rural address in LINZ. Returns up to 5 matching addresses with their location and the land parcel at each point. An address finds one parcel, often the house lot, so a farm may cover more parcels.',
    inputSchema: { type: 'object', properties: { address: { type: 'string', description: 'Number, road and town, e.g. "101 Bledisloe Street, Kurow"' } }, required: ['address'] },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  {
    name: 'rain_since_july',
    title: 'Gauge rain since 1 July',
    description: 'Rain recorded since 1 July at the nearest open Environment Canterbury rain gauge within 35 km of a point. Returns the gauge, its distance and the total. Returns no gauge when none is close enough (much of Otago).',
    inputSchema: { type: 'object', properties: LATLON, required: ['lat', 'lon'] },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  {
    name: 'rain_normal',
    title: 'Rain since 1 July against normal (ERA5)',
    description: 'Rain since 1 July for the nearest ~25 km ERA5 climate grid cell, and the same cell\'s 1991-2020 normal for the same dates, as mm and percent of normal. ERA5 runs about 6 days behind.',
    inputSchema: { type: 'object', properties: LATLON, required: ['lat', 'lon'] },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  {
    name: 'make_rain_card',
    title: 'Make a rain card',
    description: 'Make a plain-text rain card for a farm: parcel, nearest gauge rain since 1 July, and the ERA5 grid cell against its normal, with sources and dates. Give an address, or lat and lon.',
    inputSchema: {
      type: 'object',
      properties: { address: { type: 'string', description: 'Number, road and town' }, ...LATLON },
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
];

async function callTool(ctx, name, args = {}) {
  switch (name) {
    case 'find_farm':
      return findFarm(ctx, args.address);
    case 'rain_since_july':
      return rainSinceJuly(ctx, ...readLatLon(args.lat, args.lon));
    case 'rain_normal':
      return rainNormal(ctx, ...readLatLon(args.lat, args.lon));
    case 'make_rain_card':
      return makeRainCard(ctx, args);
    default:
      return undefined;
  }
}

function result(id, value) {
  return { jsonrpc: '2.0', id, result: value };
}
function error(id, code, message) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

export async function handleRpc(ctx, msg) {
  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') return error(msg?.id, -32600, 'Invalid request');
  const isNotification = msg.id === undefined || msg.id === null;
  if (isNotification) return null;
  const { id, method, params = {} } = msg;
  switch (method) {
    case 'initialize': {
      const asked = params.protocolVersion;
      return result(id, {
        protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: 'Read-only New Zealand farm data for the Farm AI Commons course: address and parcel (LINZ), rain since 1 July at the nearest Environment Canterbury gauge, and ERA5 rain against normal. Quote the sources and dates each tool returns.',
      });
    }
    case 'ping':
      return result(id, {});
    case 'tools/list':
      return result(id, { tools: TOOLS });
    case 'tools/call': {
      if (!TOOLS.some((t) => t.name === params.name)) return error(id, -32602, `Unknown tool: ${params.name}`);
      try {
        const out = await callTool(ctx, params.name, params.arguments || {});
        const text = params.name === 'make_rain_card' ? out.card : JSON.stringify(out, null, 2);
        return result(id, { content: [{ type: 'text', text }], structuredContent: out, isError: false });
      } catch (e) {
        if (e instanceof BadInput || e instanceof UpstreamError) {
          return result(id, { content: [{ type: 'text', text: e.message }], isError: true });
        }
        return result(id, { content: [{ type: 'text', text: 'Something went wrong on the course data server.' }], isError: true });
      }
    }
    default:
      return error(id, -32601, `Method not found: ${method}`);
  }
}
