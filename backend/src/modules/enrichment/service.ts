import { JobQueue, JobRecord } from "../../core/queue";
import { geocodeProvider, metadataFetcher } from "./provider";
import {
  GeocodeRequest,
  GeocodeResult,
  MetadataRequest,
  MetadataResult
} from "./types";

const queue = new JobQueue({ concurrency: 2, maxRetention: 300 });
queue.registerRunner<GeocodeRequest, GeocodeResult>("geocode", async (payload) => {
  return geocodeProvider(payload.address);
});
queue.registerRunner<MetadataRequest, MetadataResult>("metadata", async (payload) => {
  return metadataFetcher(payload.url);
});

export const enqueueGeocode = (payload: GeocodeRequest): JobRecord<GeocodeRequest> => {
  return queue.enqueue("geocode", payload);
};

export const enqueueMetadata = (payload: MetadataRequest): JobRecord<MetadataRequest> => {
  return queue.enqueue("metadata", payload);
};

export const getJobStatus = (id: string) => queue.getJob(id);
